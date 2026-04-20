import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { SearchHistory } from './entities/search-history.entity';
import { GitHubService } from './services/github.service';
import { SearchHistoryService } from './services/search-history.service';
@Module({
  imports: [TypeOrmModule.forFeature([User, SearchHistory]),],
  controllers: [UsersController],
  providers: [UsersService,GitHubService,SearchHistoryService],
})
export class UsersModule {}