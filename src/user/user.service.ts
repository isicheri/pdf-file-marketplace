import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { UpdateUserStatus } from './dto/user.dto';
import axios from "axios";
import { Response } from 'express';

@Injectable()
export class UserService {

constructor(
    private prismaService:PrismaService
) {}


async updateUserRole({role,userId,accountNumber,bankCode,businessName}:UpdateUserStatus,response: Response) {
    try { 


      return this.prismaService.$transaction(async(tx) => {
        const userAccount = await tx.sellerAccount.create({data: {
            businessName,
            accountNumber,
            bankCode,
            user: {
                connect: {
                    id: userId
                }
            }
        }});

    const findUserAccount = tx.user.findFirst({where: {id: userId},include: {
        userAccount: true
    }});

    //put some if else statemen


        const res = axios.post("https://api.paystack.co/subaccount",{
            business_name: "",
            bank_code: "",
            account_number: "",
            percentage_charge: parseInt(userAccount.percentage as string)
        },{
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        })





      })

    //    const updatedUser = await this.prismaService.user.update({
    //     where: {
    //         id: userId
    //     },
    //     data: {
    //         role: role
    //     }
    //    })
    //    let user: Pick<typeof updatedUser, "id" | "role" | "username"> = {id: updatedUser.id, role: updatedUser.role, username: updatedUser.username}
    //    return {success: true,data: {user}}
        } catch (error) {
        console.log(error);
        throw new BadRequestException({error})
    }
}


async deleteUserAccount() {}

async getUserProducts() {}


}