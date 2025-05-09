import { Injectable } from "@nestjs/common";
import {sign,verify} from "jsonwebtoken";
import { UserJwtType } from "src/auth/dto/auth.dto";


@Injectable()
export class JwtService {
constructor() {}

signToken(payload:UserJwtType,expires: string):string {
    let token = sign(payload,"mysecretpassword",{expiresIn: "1hr"});
    return token
}

verifyToken(token: string) {
    const verifiedToken = verify(token,"mysecretpassword");
    return verifiedToken as UserJwtType
}

}