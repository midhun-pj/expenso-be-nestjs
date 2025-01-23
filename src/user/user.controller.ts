import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService, private auth: AuthService) {}

  @Post('signup')
  createUser(@Body() user: CreateUserDto) {
    this.auth.signup(user.email, user.password);
  }

  @Post('signin')
  signin(@Body() user: CreateUserDto) {
    this.auth.signin(user.email, user.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get('')
  async findAllUsers(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email query parameter is required');
    }

    const user = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number) {
    this.userService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() user: UpdateUserDto) {
    this.userService.update(+id, user);
  }
}
