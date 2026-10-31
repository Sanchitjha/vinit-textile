import { ShippingService } from './src/modules/shipping/shipping.service';

(async () => {
  const s = new ShippingService();
  console.log('395012 ->', JSON.stringify(await s.checkPincode('395012')));
  console.log('110001 ->', JSON.stringify(await s.checkPincode('110001')));
  console.log('799290 ->', JSON.stringify(await s.checkPincode('799290')));
  console.log('999999 ->', JSON.stringify(await s.checkPincode('999999')));
  console.log('track  ->', JSON.stringify(await s.track('1234567890123')));
  process.exit(0);
})();
