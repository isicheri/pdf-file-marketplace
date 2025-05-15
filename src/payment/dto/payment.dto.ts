import { IsEmail, IsNotEmpty, IsString } from "class-validator"


export class PaymentDto {
    @IsString()
    @IsNotEmpty()
    userId:string

    @IsString()
    @IsNotEmpty()
    productId: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    buyerEmail: string
}


export class PaymentBody{
     @IsEmail()
    @IsString()
    @IsNotEmpty()
    buyerEmail: string
}