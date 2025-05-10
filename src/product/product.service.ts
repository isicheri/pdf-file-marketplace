import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
constructor(
    private prismaService:PrismaService
) {}



async createProduct({name,price,description}:CreateProductDto,fileurl: string,ownerId: string) {
    try {
        const findUser = await this.prismaService.user.findFirst({where: {id:ownerId}})
        if(findUser?.role === "BUYER" || !findUser) {
        throw new BadRequestException({success: false,message: "you cannot perform this operation"});
         }
         const product = await this.prismaService.product.create({
            data: {
                name: name,
                price: price,
                description: description,
                fileUrl: fileurl,
                ownerId: findUser?.id
            }
         })
         return {success: true,data: product}
    } catch (error) {
        throw new BadRequestException({error})
    }
}

async searchProduct() {}

async getProductById(productId: number) {
    try {
        
    } catch (error) {
        
    }
}


async deleteProduct() {}

}
