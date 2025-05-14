import { BadRequestException, Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { Request, Response } from 'express';
import { UserRoleValidationPipe } from './pipes/user-role.validation.pipe';
import { Role } from './dto/types/user.types';
import axios from 'axios';
import { CreateUserAccountDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(
    private userService:UserService
    ){}

@Post("/seller-create-account")
@UseGuards(AuthGuard)
async createAccount(
    @Req() req:Request,
    @Body() {bankCode,businessName,accountNumber}:CreateUserAccountDto,
@Query("role",new UserRoleValidationPipe()) role: Role,
) {
    const userId = req.user?.id!;
    return this.userService.createSellerAccount({bankCode,businessName,accountNumber},userId,role)
}

@Get("/list-bank")
@UseGuards(AuthGuard)
async getListOfBank(
    @Query("country") country: string,
    @Res() response: Response
) {
    try {
       const res = await axios.get("https://api.paystack.co/bank" + `?country=${country}`,{
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
       })
       //opay --> 999992
       response.json(res.data)
    } catch (error) {
        throw new BadRequestException({error})
    }
}


}
