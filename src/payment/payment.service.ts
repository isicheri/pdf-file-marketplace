import { BadRequestException, Injectable } from '@nestjs/common';
import axios from "axios";
import { v4 as uuidV4 } from 'uuid';
import { PrismaService } from 'src/prismaServices/prisma.service';

@Injectable()
export class PaymentService {
constructor(
   private prismaService:PrismaService
) {}

async initiatePayment(userId:string,productId: string,buyerEmail: string) {
try {
    const product = await this.prismaService.product.findUnique({where: {id: productId}});
    if(!product) throw new BadRequestException("product not found");
    const reference =`txn_${uuidV4()}`;
    const amount = parseFloat(product.price) * 100;
    
    await this.prismaService.payment.create({
        data: {
            reference,
            userId,
            productId
        }
    })

    const response = await axios.post('https://api.paystack.co/transaction/initialize',{
         email: buyerEmail, // Replace or fetch from user
         amount,
         reference,
         callback_url: 'http://localhost:3000/payments/verify',
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

