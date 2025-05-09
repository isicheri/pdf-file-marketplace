import { BadRequestException, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prismaServices/prisma.service';
import { JwtService } from 'src/token/token.jwt';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';



@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
        fileFilter: (req, file, callback) => {
          if (file.mimetype !== 'application/pdf') {
            return callback(new BadRequestException('Only PDF files are allowed!'), false);
          }
          callback(null, true);
        }
      })
    })
  ],
  controllers: [ProductController],
  providers: [ProductService,PrismaService,JwtService]
})
export class ProductModule {}



// import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// @Module({
//   imports: [
//     MulterModule.register({
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, callback) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const ext = extname(file.originalname);
//           const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
//           callback(null, filename);
//         },
//       }),
//     }),
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}