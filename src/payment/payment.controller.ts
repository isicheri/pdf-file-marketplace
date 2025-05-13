import { Controller, Post, Headers, Body, Res, UseGuards, Req, Param, Query, Get } from '@nestjs/common';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { Response,Request } from 'express';
import * as crypto from 'crypto';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@Controller('payment')
export class PaymentController {
    constructor(private prismaService:PrismaService,private paymentService:PaymentService) {}



@Post("/initiate/:productId")
@UseGuards(AuthGuard)
async initiate(
@Req() req:Request,
@Body() buyerEmail: string,
@Param("productId") productId: string
) {
const userId = req.user?.id!;
return await this.paymentService.initiatePayment(userId,productId,buyerEmail);
}


@Get('verify')
async verifyPayment(@Body() reference: string) {
  return this.paymentService.verifyPayment(reference);
}


    
  @Post('/webhook')
  async handleWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Body() payload: any,
    @Res() res: Response
  ) {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      return res.status(400).send('Invalid signature');
    }

    const event = payload.event;
    const reference = payload.data.reference;

    if (event === 'charge.success') {
      await this.prismaService.payment.update({
        where: { reference },
        data: { status: 'SUCCESS' },
      });
    } else {
      await this.prismaService.payment.update({
        where: { reference },
        data: { status: 'FAILED' },
      });
    }
    return res.sendStatus(200);
  }

}


