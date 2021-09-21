import { NestFactory } from '@nestjs/core';
import { PartnerModule } from './partner.module';
import '../../../config/aws.config';

const PORT = process.env.PARTNER_PORT;

async function bootstrap() {
  const app = await NestFactory.create(PartnerModule);

  await app.listen(PORT, () => console.log(`Partner API is running on port: ${PORT}/dev/partners`));

}
bootstrap();
