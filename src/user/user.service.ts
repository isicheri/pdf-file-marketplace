import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { UpdateUserStatus } from './dto/user.dto';

@Injectable()
export class UserService {

constructor(
    private prismaService:PrismaService
) {}


async updateUserRole({role,userId}:UpdateUserStatus) {
    try { 
       const updatedUser = await this.prismaService.user.update({
        where: {
            id: userId
        },
        data: {
            role: role
        }
       })
       let user: Pick<typeof updatedUser, "id" | "role" | "username"> = {id: updatedUser.id, role: updatedUser.role, username: updatedUser.username}
       return {success: true,data: {user}}
        } catch (error) {
        console.log(error);
        throw new BadRequestException({error})
    }
}


}