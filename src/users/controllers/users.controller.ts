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
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly githubService: GitHubService, private searchHistoryService: SearchHistoryService,) {}

 @Post('search')
 async searchUser(@Body() dto: CreateUserDto) {
  const data = await this.githubService.fetchUser(dto.username);
  const user = await this.usersService.saveUser(data); 
  await this.searchHistoryService.logSearch(
    data.login,
    data.id,
  );

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
