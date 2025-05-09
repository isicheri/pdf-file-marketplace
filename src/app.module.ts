import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [AuthModule, UserModule, ProductModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(),"public","files"),
      serveRoot: "/files"
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
