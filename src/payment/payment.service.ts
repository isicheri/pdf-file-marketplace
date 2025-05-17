import { BadRequestException, Injectable } from '@nestjs/common';
import axios from "axios";
import { v4 as uuidV4 } from 'uuid';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { PaymentDto } from './dto/payment.dto';
import {sign} from "jsonwebtoken"
import { PaymentStatus } from 'generated/prisma';

@Injectable()
export class PaymentService {
constructor(
   private prismaService:PrismaService
) {}

async initiatePayment({userId,productId,buyerEmail}:PaymentDto) {
try {
    const product = await this.prismaService.product.findUnique({where: {id: productId}});
    if(!product) throw new BadRequestException("product not found");
    const reference =`txn_${uuidV4()}`;
    const amount = parseFloat(product.price) * 10;

    const owner = await this.prismaService.user.findFirst({where: {id:product.ownerId},include: {userAccount: true}})
 const subaccount = owner?.userAccount?.sub_account;   
    await this.prismaService.payment.create({
        data: {
            reference,
            userId,
            productId
        }
    })
    console.log({email: buyerEmail,amount,subaccount});
    const response = await axios.post('https://api.paystack.co/transaction/initialize',{
         email:buyerEmail,
         amount,
         subaccount
    },{
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    })
    return {
       data: response.data,
    }
} catch (error) {
   throw new BadRequestException({error}) 
}    
}

async verifyPayment(reference: string,buyerId: string) {
try {
    const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );
   const findUser = await this.prismaService.user.findFirst({where: {id: buyerId},include: {
    payments: true
   }});  
   
   if(!findUser) throw new BadRequestException("user not found");
   
   const data = response.data;
    if (data.status && data.data.status === 'success') {
      const token = sign({paymentId: findUser.payments[0].id,userId: findUser.id,productId: findUser.payments[0].productId},"secret",{expiresIn: "1hr"})
       const payment = await this.prismaService.payment.update({where: {id: findUser.payments[0].id,userId: findUser.id},data: {status: "SUCCESS"}})
        return {
          success: true,
          data: data.data,
          download_link: `localhost:3000/product/${payment.id}/${token}/download`,
        };
      } else {
       await this.prismaService.payment.update({where: {id: findUser.payments[0].id,userId: findUser.id},data: {status: "FAILED"}})
        return {
          success: false,
          message: 'Transaction not successful',
          data: data.data,
        };
      }
} catch (error) {
    throw new BadRequestException({error})
}
}

async getUserPaymentByStatus(userId: string,status:PaymentStatus) {
  const payments = await this.prismaService.payment.findFirst({where: {
    userId: userId,
    status: status
  }})  
  return {
    status: true,
    data: payments
  }
}

}