import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { SearchHistory } from './entities/search-history.entity';
import { GitHubService } from './github.service';
import { SearchHistoryService } from './search-history.service';
@Module({
  imports: [TypeOrmModule.forFeature([User, SearchHistory]),],
  controllers: [UsersController],
  providers: [UsersService,GitHubService,SearchHistoryService],
})
export class UsersModule {}