import { NestFactory } from "@nestjs/core";
import { CollaboratorModule } from "./collaborator.module";

const PORT = process.env.COLLABORATOR_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(CollaboratorModule);

  await app.listen(PORT, () =>
    console.log(
      `Collaborator API is running on port: ${PORT}/dev/collaborators`
    )
  );
}
bootstrap();
