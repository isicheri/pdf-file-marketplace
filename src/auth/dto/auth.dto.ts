import { IsNotEmpty, IsString, maxLength } from "class-validator";
import { User } from "generated/prisma";


export class AuthUserDto  implements IUser{
    @IsNotEmpty()
    @IsString({message: "username must be a string"})
    username:string;

    @IsNotEmpty()
    @IsString({message: "username must be a string"})
    password: string;
}


type AuthUserType = Pick<User,"username" | "password">;
export type UserJwtType = Pick<User,"id" | "username" | "role">;
interface IUser extends AuthUserType{
    username: string;
    password: string;
}