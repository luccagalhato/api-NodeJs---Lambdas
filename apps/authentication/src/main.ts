import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AuthenticationModule } from './authentication.module';

declare const module: any;

const PORT = process.env.AUTHENTICATION_PORT;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AuthenticationModule,
    new FastifyAdapter()
  );

  await app.listen(PORT, () => console.log(`Authentication API is running on port: ${PORT}/dev/auth`));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
