import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchHistory } from './users/entities/search-history.entity';

@Module({
   imports: [
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
  ],
  
})
export class AppModule {}
