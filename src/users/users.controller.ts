import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() queries: { limit: number; page: number }) {
    return this.usersService.findAll(queries);
  }

  @Get('me')
  getMe(@Req() req: any) {
    console.log(req.user);
    return req.user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('new-author/:id')
  newAuthor(@Param('id') id: string) {
    return this.usersService.newAuthor(+id);
  }

  @Patch('un-ban/:id')
  unBan(@Param('id') id: string) {
    return this.usersService.unBan(+id);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    return this.usersService.update(updateUserDto, req);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Delete('ban/:id')
  ban(@Param('id') id: string) {
    return this.usersService.ban(+id);
  }
}
