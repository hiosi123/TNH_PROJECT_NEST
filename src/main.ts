import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  await app.listen(3001, () => {
    console.log('server listening on 3001');
  });
}
bootstrap();
