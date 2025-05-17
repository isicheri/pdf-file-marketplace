import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class PaymentStatusValidatonPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
           let validRole = this.validateRole(value);
           if(!validRole) {
            throw new BadRequestException("status does not exist")
           } 
          return value;
        }

    private validateRole(value: any):boolean {
        let parsedVal = `${value}`
        let statusArr = ["PENDING","SUCCESS","FAILED"];
        if(!statusArr.includes(parsedVal))
        {
            return false;
        }
        return true;
    }
}