import { NestFactory } from '@nestjs/core';
import { ClientModule } from './client.module';
import '../../../config/aws.config';

async function bootstrap() {
  const PORT = process.env.CLIENT_PORT;
  const app = await NestFactory.create(ClientModule);
  await app.listen(PORT, () => console.log(`Client API is running on port: ${PORT}/dev/clients`));
}

bootstrap();
