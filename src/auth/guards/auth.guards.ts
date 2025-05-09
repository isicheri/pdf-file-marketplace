import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "src/token/token.jwt";
import { UserJwtType } from "../dto/auth.dto";



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request:Request = ctx.getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException()
        }
        try {
            const userPayload:UserJwtType = this.jwtService.verifyToken(token);
            request["user"] = userPayload;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true
    }


    private extractTokenFromHeader(request:Request) {
        const [type,token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" || "Basic" ? token : undefined;
    }
    
}