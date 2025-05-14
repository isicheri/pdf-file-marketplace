import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class UserRoleValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
           let validRole = this.validateRole(value);
           if(!validRole) {
            throw new BadRequestException("role does not exist")
           } 
          return value;
        }

    private validateRole(value: any):boolean {
        let parsedVal = `${value}`
        let roleArr = ["SELLER"];
        if(!roleArr.includes(parsedVal))
        {
            return false;
        }
        return true;
    }
}