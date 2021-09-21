import { NestFactory } from '@nestjs/core';
import { GeolocationModule } from './geolocation.module';

import '../../../config/aws.config';
const PORT = process.env.GEOLOCATION_PORT;

async function bootstrap() {
  const app = await NestFactory.create(GeolocationModule);
  await app.listen(PORT, () => console.log(`Geolocation API is running on port: ${PORT}/dev/geolocations`));
}
bootstrap();
