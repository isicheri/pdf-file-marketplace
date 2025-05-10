import { BadRequestException, Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { writeFileSync} from "fs"
import { join } from 'path';
import {v4 as uuidV4} from "uuid";
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { CreateProductDto } from './dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService
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
       return await this.productService.createProduct(body,fileUrl,req.user?.id)
       
    }



}
