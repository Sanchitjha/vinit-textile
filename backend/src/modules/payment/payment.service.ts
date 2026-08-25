import { BadRequestError, NotFoundError } from '../../shared/errors';
import { OrderStatus } from '../../shared/constants/orderStatus.constant';
import { PaymentMethod, PaymentStatus } from '../../shared/constants/paymentStatus.constant';
import { OrderRepository } from '../order/order.repository';
import { getPaymentProvider } from './providers/payment.provider.factory';
import { CreatePaymentResult, IPaymentService, WebhookEvent } from './providers/payment-provider.interface';
import { PaymentRepository } from './payment.repository';
import { VerifyPaymentDtoType } from './payment.dto';
import { IPaymentDocument } from './payment.types';

export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository = new PaymentRepository(),
    private readonly orderRepository: OrderRepository = new OrderRepository(),
    private readonly paymentProvider: IPaymentService = getPaymentProvider(),
  ) {}

  async initiate(userId: string, orderId: string): Promise<CreatePaymentResult> {
    const order = await this.orderRepository.findByIdForUser(orderId, userId);
    if (!order) throw new NotFoundError('Order not found', 'ORDER_NOT_FOUND');
    if (order.paymentMethod !== PaymentMethod.RAZORPAY) {
      throw new BadRequestError('This order does not use online payment', 'INVALID_PAYMENT_METHOD');
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestError('Order is already paid', 'ORDER_ALREADY_PAID');
    }

    const result = await this.paymentProvider.createPayment({
      orderId: order.id,
      amount: order.total,
      currency: 'INR',
      receipt: order.orderNumber,
    });

    await this.paymentRepository.create({
      order: order._id,
      user: order.user,
      provider: 'RAZORPAY',
      providerOrderId: result.providerOrderId,
      amount: order.total,
      currency: result.currency,
      status: 'CREATED',
    });

    return result;
  }

  async verify(userId: string, dto: VerifyPaymentDtoType): Promise<IPaymentDocument> {
    const payment = await this.paymentRepository.findByProviderOrderId(dto.providerOrderId);
    if (!payment || payment.user.toString() !== userId) {
      throw new NotFoundError('Payment not found', 'PAYMENT_NOT_FOUND');
    }

    const isValid = await this.paymentProvider.verifyPayment({
      providerOrderId: dto.providerOrderId,
      providerPaymentId: dto.providerPaymentId,
      signature: dto.signature,
    });

    if (!isValid) {
      await this.paymentRepository.updateById(payment.id, { status: 'FAILED' });
      throw new BadRequestError('Payment verification failed', 'PAYMENT_VERIFICATION_FAILED');
    }

    const updated = await this.paymentRepository.updateById(payment.id, {
      status: 'SUCCESS',
      providerPaymentId: dto.providerPaymentId,
      signature: dto.signature,
    });

    await this.orderRepository.updatePaymentStatus(payment.order.toString(), PaymentStatus.PAID);
    await this.orderRepository.updateStatus(payment.order.toString(), OrderStatus.CONFIRMED);

    return updated as IPaymentDocument;
  }

  async handleWebhook(rawBody: Buffer, signatureHeader: string): Promise<void> {
    const event: WebhookEvent = await this.paymentProvider.handleWebhook(rawBody, signatureHeader);
    if (!event.providerOrderId) return;

    const payment = await this.paymentRepository.findByProviderOrderId(event.providerOrderId);
    if (!payment) return;

    // Idempotent: repeated webhook deliveries for an already-settled payment are no-ops.
    if (payment.status === 'SUCCESS' || payment.status === 'REFUNDED') return;

    const nextStatus = event.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED';
    await this.paymentRepository.updateById(payment.id, {
      status: nextStatus,
      providerPaymentId: event.providerPaymentId ?? payment.providerPaymentId,
      rawResponse: event.raw,
    });

    if (nextStatus === 'SUCCESS') {
      await this.orderRepository.updatePaymentStatus(payment.order.toString(), PaymentStatus.PAID);
      await this.orderRepository.updateStatus(payment.order.toString(), OrderStatus.CONFIRMED);
    } else {
      await this.orderRepository.updatePaymentStatus(payment.order.toString(), PaymentStatus.FAILED);
    }
  }

  async refund(orderId: string): Promise<IPaymentDocument> {
    const payment = await this.paymentRepository.findLatestByOrder(orderId);
    if (!payment || payment.status !== 'SUCCESS') {
      throw new BadRequestError('No successful payment found for this order', 'NO_SUCCESSFUL_PAYMENT');
    }
    if (!payment.providerPaymentId) {
      throw new BadRequestError('Payment has no provider reference to refund', 'MISSING_PROVIDER_PAYMENT_ID');
    }

    await this.paymentProvider.refundPayment({ providerPaymentId: payment.providerPaymentId });

    const updated = await this.paymentRepository.updateById(payment.id, { status: 'REFUNDED' });
    await this.orderRepository.updatePaymentStatus(orderId, PaymentStatus.REFUNDED);

    return updated as IPaymentDocument;
  }
}
