import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { JwtService } from 'src/token/token.jwt';

@Module({
  controllers: [UserController],
  providers: [UserService,PrismaService,JwtService]
})
export class UserModule {}
