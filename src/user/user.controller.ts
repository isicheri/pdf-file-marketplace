import { Controller, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { Request } from 'express';
import { UserRoleValidationPipe } from './pipes/user-role.validation.pipe';
import { Role } from './dto/types/user.types';

@Controller('user')
export class UserController {
    constructor(
    private userService:UserService
    ){}

@Put("/update-role/")
@UseGuards(AuthGuard)
async updateRole(
@Req() request:Request,
@Query("role",new UserRoleValidationPipe()) role: Role
) {
 const userId = request.user?.id!;
// return await this.userService.updateUserRole({role,userId})
}


}
