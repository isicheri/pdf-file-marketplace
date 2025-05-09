import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

    constructor(
        private authSevice: AuthService
    ) {}

@Post('/register')
async registerUser(
    @Body() body: AuthUserDto
) {
return await this.authSevice.registerUser(body);
}

@Post("/login")
async loginUser(
    @Body() body: AuthUserDto
) {
   return await this.authSevice.loginUser(body)
}

@Get("/profile")
@UseGuards(AuthGuard)
getUserProfile(
    @Req() req:Request
) {
let user = req.user;
return user;
}

}
