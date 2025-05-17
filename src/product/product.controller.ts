import { BadRequestException, Body, Controller, Delete, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { access, writeFileSync} from "fs"
import { join } from 'path';
import {v4 as uuidV4} from "uuid";
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { CreateProductDto } from './dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prismaServices/prisma.service';
import {verify} from "jsonwebtoken";


@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService,
        private prismaService:PrismaService
    ) {}


    @Post("/create")
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    async create(
        @Body() body: CreateProductDto,
        @Req() req: Request,
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({maxSize: 1024 * 1024 * 5,message: "file size must be 4mb or less"}),
                new FileTypeValidator({fileType: /^application\/pdf$/})
            ]
        })) file : Express.Multer.File
    ) {
        if(!req.user?.id) {
            throw new  BadRequestException("user not found");
        }
        if(req.user.role !== "SELLER") {
            throw new  BadRequestException("User is not a seller");
        }
        const filename = `${uuidV4()}-${file.originalname}`;
        const filePath = join(process.cwd(),"public","files",filename);
        writeFileSync(filePath,file.buffer)
        const protocol = req.protocol;
        const host = req.get("host")
        const fileUrl = `${protocol}://${host}/files/${filename}`; //storing in the database
       return await this.productService.createProduct(body,fileUrl,req.user?.id,filePath)
       
    }
    
    @Get("/:productId")
    @UseGuards(AuthGuard)
    async getProductById(
        @Param("productId") productId: string
    ) {
   return await this.productService.getProductById(productId);
    }

   @Delete("/:productId")
   @UseGuards(AuthGuard)
   async deleteProduct(
    @Param("productId") productId: string,
    @Req() req: Request,
   ) {
      const userId = req.user?.id!

      return this.productService.deleteProduct(productId,userId);
   }

   @Get("/get-all")
   @UseGuards(AuthGuard)
   async getAllProducts() {
    console.log("Ok-controller")
    return await this.productService.getAllProduct();
   }

   @Get("/:paymentId/:accessToken/download")
   @UseGuards(AuthGuard)
   async downloadProduct(
    @Param("paymentId") paymentId: string,
    @Param("accessToken") accessToken: string,
    @Req() req: Request,
    @Res() res: Response,
   ) {
    const userId = req.user?.id!;
    const payment = await this.prismaService.payment.findFirst({
        where: {
            id: paymentId,
            userId,
            status: "SUCCESS"
        }
    })
    if(!payment) {
        throw new ForbiddenException("Access denied: no payment record");
    }
    try {
     verify(accessToken,"secret");    
    } catch (error) {
        res.send("<h1>Access Denied</h1>")
        throw new BadRequestException("access to this route as been restricted")
    }

    const findProduct = await this.prismaService.product.findFirst({where: {id: payment.productId}})

    if(!findProduct) {
        throw new NotFoundException("product not found")
    }
   
   }


}

// https://paystack.com/docs/?_gl=1*1ydofqp*_ga*MTQxODE0Mzg4MC4xNzQ3MDEwMDk1*_ga_JSPB6GMD3M*czE3NDcwOTEzMzUkbzMkZzEkdDE3NDcwOTI0MDAkajAkbDAkaDA.
// https://dashboard.paystack.com/#/settings/developers