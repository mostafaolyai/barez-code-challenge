import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../../enums/user-role.enum';
import { Roles } from '../../decorator/roles.decorator';
import { User } from '../../entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {CurrentUser } from '../../decorator/current-user.decorator';

@ApiTags("User")
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@CurrentUser() currentUser:User, @Param('id') id: number): Promise<User> {
    return this.userService.findOne(currentUser, id);
  }

  @Put(':id')
  async update(@CurrentUser() currentUser:User, @Param('id') id: number, @Body() user: User): Promise<User> {
    return  this.userService.update(currentUser, id, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
