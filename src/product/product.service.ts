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


async getProductById(productId: string) {
    try {
        const product = await this.prismaService.product.findFirst({where: {id: productId},include: {owner: true}})
         return product;
    } catch (error) {
        throw new BadRequestException({error})
    }
}

async deleteProduct(productId:string,ownerId:string) {
    try {
        const findProduct = await this.prismaService.product.findFirst({where: {id: productId}});
    if(!findProduct || findProduct.ownerId !== ownerId ) {
        throw new BadRequestException("can perform the operation");
    }
    await this.prismaService.product.delete({where: {id: findProduct.id,ownerId: findProduct.ownerId}});
    } catch (error) {
        throw new BadRequestException({error})
    }
}

async getAllProduct() {
try {
    console.log("OK")
    const products = await this.prismaService.product.findMany({select: {owner: true,name:true, description: true,price: true}});
if(!products) {
    throw new Error("no product found")
}
console.log(products)
return products;
} catch (error) {
   throw new BadRequestException({error}); 
}
}

}