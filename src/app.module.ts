import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchHistory } from './users/entities/search-history.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule , ConfigService } from '@nestjs/config';
import { envValidationSchema } from 'env.validation';

@Module({
  
   imports: [
    
     ThrottlerModule.forRoot([
     {
       ttl: 60,
      limit: 3,
    },
  ]),
   ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: envValidationSchema,
  }),
   
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [User, SearchHistory],
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
  }),
}),
   
    UsersModule,
    LoggerModule,
   
  ],
  

  providers: [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
]

  
  
})
export class AppModule {}
