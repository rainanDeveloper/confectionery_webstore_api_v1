import { CustomerOtpEntity } from './customer-otp.entity';

describe('CustomerOtpEntity', () => {
  it('Should create a new customerOtp record', async () => {
    const customerOtp = new CustomerOtpEntity();

    expect(customerOtp).toBeInstanceOf(CustomerOtpEntity);
  });
});
