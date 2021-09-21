import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import '../../../config/aws.config';

const PORT = process.env.PAYMENTS_PORT;

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);

  await app.listen(PORT, () =>
    console.log(`Payments API is running on port: ${PORT}/dev/payments`),
  );
}

bootstrap();
