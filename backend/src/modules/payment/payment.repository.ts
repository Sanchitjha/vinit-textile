import { PaymentModel } from './payment.model';
import { IPayment, IPaymentDocument } from './payment.types';

export class PaymentRepository {
  create(data: Partial<IPayment>): Promise<IPaymentDocument> {
    return PaymentModel.create(data);
  }

  findById(id: string): Promise<IPaymentDocument | null> {
    return PaymentModel.findById(id).exec();
  }

  findLatestByOrder(orderId: string): Promise<IPaymentDocument | null> {
    return PaymentModel.findOne({ order: orderId }).sort({ createdAt: -1 }).exec();
  }

  findByProviderOrderId(providerOrderId: string): Promise<IPaymentDocument | null> {
    return PaymentModel.findOne({ providerOrderId }).exec();
  }

  updateById(id: string, data: Partial<IPayment>): Promise<IPaymentDocument | null> {
    return PaymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
