import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Get, Query } from '@nestjs/common';
import { GetUsersDto } from '../dto/get-users.dto';
import { Param } from '@nestjs/common';
import { GetUserDto } from '../dto/get-user.dto';
import { Delete } from '@nestjs/common';
import { GitHubService } from '../services/github.service';
import { SearchHistoryService } from '../services/search-history.service';
import { Throttle } from '@nestjs/throttler';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Controller('users')
export class UsersController {
   constructor(
  private readonly usersService: UsersService,
  private readonly githubService: GitHubService,
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly logger: Logger,
  private readonly searchHistoryService: SearchHistoryService,
) {}
 @Post('search')
 @Throttle({default: { limit: 3,  ttl: 60, }, })
 async searchUser(@Body() dto: CreateUserDto) {
    this.logger.info(`Searching GitHub user: ${dto.username}`);
    const data = await this.githubService.fetchUser(dto.username);
     this.logger.info(`GitHub user found: ${data.login}`);
    const user = await this.usersService.saveUser(data); 
     this.logger.info(`User saved to DB: ${user.username}`);
  await this.searchHistoryService.logSearch(
    data.login,
    data.id,
  );
  this.logger.info(`Search logged for: ${data.login}`);

  return user;
}
  
  @Get()
   getUsers(@Query() query: GetUsersDto) {
     return this.usersService.getUsers(
       query.limit ?? 10,
       query.offset ?? 0,  
    );
  }

  @Get('history')
getHistory(@Query() query: { limit?: number; offset?: number }) {
  return this.searchHistoryService.getHistory(
    query.limit ?? 10,
    query.offset ?? 0,
  );
}


 @Get(':id')
getUserById(@Param() params: GetUserDto) {
  return this.usersService.getUserById(params.id);
}

@Delete(':id')
deleteUser(@Param() params: GetUserDto) {
  return this.usersService.deleteUser(params.id);
}




}
