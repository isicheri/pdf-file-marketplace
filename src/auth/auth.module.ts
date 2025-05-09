import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { JwtService } from 'src/token/token.jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService,PrismaService,JwtService]
})
export class AuthModule {}
