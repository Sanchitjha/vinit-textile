/**
 * Razorpay Checkout SDK loader and orchestrator
 */

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  order,
  paymentData,
  user,
  address,
  onSuccess,
  onError,
  onDismiss,
}) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onError?.(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
    return;
  }

  const { providerOrderId, amount, currency, keyId } = paymentData;

  const options = {
    key: keyId || '',
    amount: Math.round(amount * 100), // amount in paise
    currency: currency || 'INR',
    name: 'Vinit Textiles',
    description: `Order #${order.orderNumber || order.id || ''}`,
    image: '/favicon.ico',
    order_id: providerOrderId,
    prefill: {
      name: address?.name || user?.name || '',
      email: user?.email || '',
      contact: address?.phone || user?.phone || '',
    },
    notes: {
      orderId: order._id || order.id,
      orderNumber: order.orderNumber || '',
    },
    theme: {
      color: '#6B1D2F', // Regal Royal Maroon
      backdrop_color: 'rgba(51, 36, 33, 0.6)',
    },
    modal: {
      ondismiss: () => {
        onDismiss?.();
      },
    },
    handler: async (response) => {
      // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      try {
        await onSuccess?.({
          providerOrderId: response.razorpay_order_id || providerOrderId,
          providerPaymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
      } catch (err) {
        onError?.(err);
      }
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      onError?.(new Error(response?.error?.description || 'Payment failed. Please try again.'));
    });
    rzp.open();
  } catch (err) {
    onError?.(err);
  }
}
