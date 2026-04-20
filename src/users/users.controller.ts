import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Get, Query } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { Param } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';
import { Delete } from '@nestjs/common';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Post('search')
  searchUser(@Body() dto: CreateUserDto) {
    return this.usersService.fetchGitHubUser(dto.username);
  }
  
  @Get()
   getUsers(@Query() query: GetUsersDto) {
     return this.usersService.getUsers(
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
