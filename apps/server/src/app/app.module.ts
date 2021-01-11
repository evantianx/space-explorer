import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LIB_PATH } from '@space-explorer/graphql';
import { join } from 'path';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './database.config';

const lib = join(process.cwd(), LIB_PATH);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment],
    }),
    GraphQLModule.forRoot({
      typePaths: [join(lib, 'schemas/**/*.graphql')],
      definitions: {
        path: join(lib, 'lib/graphql.ts'),
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
