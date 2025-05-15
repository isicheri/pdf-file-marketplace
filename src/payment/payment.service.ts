import { BadRequestException, Injectable } from '@nestjs/common';
import axios from "axios";
import { v4 as uuidV4 } from 'uuid';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { PaymentDto } from './dto/payment.dto';

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
    console.log({
  email: buyerEmail ,
  amount,
  subaccount,
});
    const response = await axios.post('https://api.paystack.co/transaction/initialize',{
         email:buyerEmail, // Replace or fetch from user
         amount,
         subaccount
    },{
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    })

    return response.data
} catch (error) {
   throw new BadRequestException({error}) 
}    
}




async verifyPayment(reference: string) {
try {
    const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );
   const data = response.data;
    if (data.status && data.data.status === 'success') {
        return {
          success: true,
          data: data.data,
        };
      } else {
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
}

