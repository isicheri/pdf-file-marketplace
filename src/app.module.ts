import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(),"public","files"),
      serveRoot: "/files"
    }),
    PaymentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
