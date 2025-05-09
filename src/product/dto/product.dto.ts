import {  IsInt, IsNotEmpty, IsString } from "class-validator"



export class CreateProductDto {

 @IsString({message: "name feild must be a string"})
 @IsNotEmpty({message: "name feild cannot be empty"})
 name:string

  @IsString({message: "description feild must be a string"})
  @IsNotEmpty({message: "description feild cannot be empty"})
  description: string

  @IsString({message: "price feild must be a string"})
  @IsNotEmpty({message: "price feild cannot be empty"})
  price:string
}