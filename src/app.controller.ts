import RegisterDto from './register.dto';
import ChangeUserDto from './changeuser.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, Param, Patch, Post, Render } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import User from './user.entity';
import * as bcrypt from 'bcrypt'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
  ) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Get('/register')
  @Render('register')
  registerPage() {
    return { message: 'Welcome to the register page' };
  }

  @Post('/register')
  @HttpCode(200)
  async register(@Body() RegisterDto: RegisterDto){
    if(!RegisterDto.email || !RegisterDto.password || !RegisterDto.passwordAgain){
      throw new BadRequestException('All inputfield must be filled');
    }
    if(!RegisterDto.email.includes('@')){
      throw new BadRequestException('Email must contain a @ character');
    }
    if(RegisterDto.password != RegisterDto.passwordAgain){
      throw new BadRequestException('Passwords must match');
    }
    if(RegisterDto.password.length < 8){
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    const userRepo = this.dataSource.getRepository(User);
    const user = new User();
    user.password = await bcrypt.hash(RegisterDto.password, 15);
    user.email = RegisterDto.email;
    await userRepo.save(user);
    return user;
  }

  @Get('/changeuser')
  @Render('changeuser')
  changeuserPage() {
    return { message: 'Welcome to the user change page' };
  }

  @Patch('/changeuser/:id')
  async updateUser(@Param('id') id: number, @Body() ChangeUserDto: ChangeUserDto) {
    if(!ChangeUserDto.newEmail || !ChangeUserDto.oldEmail){
      throw new BadRequestException('Email fields must be filled');
    }
    if(!ChangeUserDto.newEmail.includes('@')){
      throw new BadRequestException('Email must contain a @ character');
    }
    if(ChangeUserDto.pictureUrl){
    if(!ChangeUserDto.pictureUrl.startsWith('http://')){
      if(!ChangeUserDto.pictureUrl.startsWith('https://')){
        throw new BadRequestException('Picture URL must start with http:// or https://');
      }
    }
  }
    const userRepo = this.dataSource.getRepository(User);
    const user = new User();
    user.email = ChangeUserDto.newEmail;
    user.proiflePictureUrl = ChangeUserDto.pictureUrl;
    await userRepo.update(id, user);
    return user;
  }
}