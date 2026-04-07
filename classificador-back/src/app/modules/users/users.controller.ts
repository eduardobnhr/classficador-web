import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/commons/decorators/is-public-decorator';
import { Documentation } from 'src/commons/configs/swagger/documentation';
import { User } from 'src/models/entities/user.entity';
import { CreateUserDto } from '../../../models/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../../models/dtos/users/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Documentation.create(CreateUserDto, User)
  @HttpCode(HttpStatus.CREATED)
  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Documentation.list(User)
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Documentation.findOne(User)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOne(id);
  }

  @Documentation.update(UpdateUserDto, User)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Documentation.delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.remove(id);
  }
}

