import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from './apis/board/board.module';
import { UserModule } from './apis/user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './apis/auth/auth.module';
import { RedisClientOptions } from 'redis';
import { FileModule } from './apis/file/file.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BoardModule,
    FileModule, //
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my-database', // localhost
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'pilot',
      entities: [__dirname + '/apis/**/*.entity.*'], //각 경로 설정
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379', // localhost
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
