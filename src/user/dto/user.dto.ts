import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Role } from "./types/user.types";


export class UpdateUserStatus {

@IsString()
@IsNotEmpty()
role:Role;

@IsString()
@IsNotEmpty()
userId: string;

@IsString()
@IsNotEmpty()
businessName: string;

@IsString()
bankCode: string;

@IsNumber()
@IsNotEmpty()
accountNumber: number


}