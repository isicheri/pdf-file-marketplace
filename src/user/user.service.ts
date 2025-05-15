import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { CreateUserAccountDto } from './dto/user.dto';
import axios from "axios";
import { Response } from 'express';
import { Role } from 'generated/prisma';

@Injectable()
export class UserService {

constructor(
    private prismaService:PrismaService
) {}

async createSellerAccount({bankCode,businessName,accountNumber} :CreateUserAccountDto,userId:string,role:Role) {
    try {
const [userAccount,user] = await this.prismaService.$transaction([
this.prismaService.sellerAccount.create({ data: {businessName,bankCode,accountNumber,user: {connect: {id: userId}}}}),
this.prismaService.user.update({where: {id: userId},data: {role: role}})
]) 
 const res = await axios.post("https://api.paystack.co/subaccount",{
            business_name: userAccount.businessName + "no_good",
            bank_code: userAccount.bankCode,
            account_number: userAccount.accountNumber,
            percentage_charge: parseInt(userAccount.percentage as string)
        },{
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        }) 
        let subaccount = res.data.data.subaccount_code;
    let account = await this.prismaService.sellerAccount.update({where: {id: userAccount.id},data: {sub_account: subaccount}})

        return {
            status: true,
            message: res.data,
            account: account
        }
    } catch (error) {
        throw new BadRequestException({error})
    }
}


async deleteUserAccount() {}

async getUserProducts() {}


}