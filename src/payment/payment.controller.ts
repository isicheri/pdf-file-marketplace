import { Controller, Post, Headers, Body, Res, UseGuards, Req, Param, Query, Get } from '@nestjs/common';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { Response,Request } from 'express';
import * as crypto from 'crypto';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { PaymentBody, VerifyPaymentBody } from './dto/payment.dto';
import { PaymentStatus } from 'generated/prisma';
import { PaymentStatusValidatonPipe } from './pipes/payment-status-validation.pipes';

@Controller('payment')
export class PaymentController {
    constructor(private prismaService:PrismaService,private paymentService:PaymentService) {}



@Post("/initiate/:productId")
@UseGuards(AuthGuard)
async initiate(
@Req() req:Request,
@Body() {buyerEmail}: PaymentBody,
@Param("productId") productId: string
) {
const userId = req.user?.id!;
return await this.paymentService.initiatePayment({userId,productId,buyerEmail});

}


@Post('/verify')
@UseGuards(AuthGuard)
async verifyPayment(@Body() {reference}: VerifyPaymentBody,@Req() request: Request) {
  const userId = request.user?.id!;
  return this.paymentService.verifyPayment(reference,userId);
}


@Get("/get-user-payment")
@UseGuards(AuthGuard)
async getUserPayment(
  @Req() request:Request,
  @Query("status",new PaymentStatusValidatonPipe()) status: PaymentStatus
) {
const userId = request.user?.id!;
return this.paymentService.getUserPaymentByStatus(userId,status)
}
    
  // @Post('/webhook')
  // async handleWebhook(
  //   @Headers('x-paystack-signature') signature: string,
  //   @Body() payload: any,
  //   @Res() res: Response
  // ) {
  //   const hash = crypto
  //     .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
  //     .update(JSON.stringify(payload))
  //     .digest('hex');

  //   if (hash !== signature) {
  //     return res.status(400).send('Invalid signature');
  //   }

  //   const event = payload.event;
  //   const reference = payload.data.reference;

  //   if (event === 'charge.success') {
  //     await this.prismaService.payment.update({
  //       where: { reference },
  //       data: { status: 'SUCCESS' },
  //     });
  //   } else {
  //     await this.prismaService.payment.update({
  //       where: { reference },
  //       data: { status: 'FAILED' },
  //     });
  //   }
  //   return res.sendStatus(200);
  // }

}


