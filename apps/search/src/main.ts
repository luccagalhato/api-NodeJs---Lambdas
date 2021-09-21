import { NestFactory } from "@nestjs/core";
import { SearchModule } from "./search.module";
import "../../../config/aws.config";

const PORT = process.env.SEARCH_PORT;

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  await app.listen(PORT, () =>
    console.log(`Search API is running on port: ${PORT}/dev/search`)
  );
}
bootstrap();
