import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { JwtService } from 'src/token/token.jwt';

@Module({
  providers: [PaymentService,PrismaService,JwtService],
  controllers: [PaymentController]
})
export class PaymentModule {}
