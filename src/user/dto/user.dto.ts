import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "./types/user.types";


export class UpdateUserStatus {

@IsString()
@IsNotEmpty()
role:Role;

@IsString()
@IsNotEmpty()
userId: string;

}