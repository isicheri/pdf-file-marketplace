import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import {hash,genSalt,compare} from "bcrypt";
import {sign} from "jsonwebtoken";
import { PrismaService } from 'src/prismaServices/prisma.service';
import { AuthUserDto, UserJwtType } from './dto/auth.dto';
import { JwtService } from 'src/token/token.jwt';

@Injectable()
export class AuthService {
    constructor(
        private prismaService:PrismaService,
        private jwtService: JwtService
    ) {}

    async registerUser({username,password}:AuthUserDto) {
    try {
        let hashedPassword = await this.hashPassword(password);
        const findUser = await this.prismaService.user.findFirst({where: {username: username}})
        if(findUser) {
          throw new BadRequestException({success: false,message: "username already exist"});
        }
          const User = await this.prismaService.user.create({data: {
            username,
            password: hashedPassword
        }})
        return {
          success: true,
          data: User
        }
        
    } catch (error) {
        throw new BadRequestException(error,"someting went wrong");
    }  
    }

    async loginUser({username,password}:AuthUserDto) {
      try {
          const findUser = await this.prismaService.user.findFirstOrThrow({where: {username:username}});
          if(!findUser) {
            throw new BadRequestException({success: false,message: "user not found"});
          }
          const validatePassword = await this.checkPassword(password)(findUser.password);
          if(!validatePassword) {
            throw new BadRequestException({success: false, message: "password incorrect"})
          }
            const userJwtPayload:UserJwtType = {id: findUser.id,username: findUser.username,role: findUser.role};
            const accessToken = this.jwtService.signToken(userJwtPayload,"1hr");
            return {data: {user: {id: findUser.id,username: findUser.username,role: findUser.role}},accessToken: accessToken};
      } catch (error) {
        throw new BadRequestException(error,"something went wrong");
      }
    }

   private async hashPassword(password:string): Promise<string> {
     const saltRounds = 10;
     const salt = await genSalt(saltRounds);
     const hashedPassword = await hash(password,salt);
     return hashedPassword;
   }

   private checkPassword(password:string) {
    return async(hashedPasswod:string):Promise<boolean> => {
         let decryptedPasswod = await compare(password,hashedPasswod)
         return decryptedPasswod
            }
        }

}
