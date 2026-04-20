import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchHistory } from './users/entities/search-history.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from './logger/logger.module';
@Module({
   imports: [
     ThrottlerModule.forRoot([
     {
       ttl: 60,
      limit: 3,
    },
  ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'github_tracker',
      entities: [User, SearchHistory],
      synchronize: true,
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
