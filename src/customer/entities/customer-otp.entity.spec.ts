import { CustomerOtp } from './customer-otp.entity';

describe('CustomerOtp', () => {
  it('Should create a new customerOtp record', async () => {
    const customerOtp = new CustomerOtp();

    expect(customerOtp).toBeInstanceOf(CustomerOtp);
  });
});
