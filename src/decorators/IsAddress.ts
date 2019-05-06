import {registerDecorator, ValidationOptions, ValidationArguments} from "class-validator";
import { getAddress } from 'ethers/utils'

export function IsAddress(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isAddress",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                  let isAddress = true
                  try {
                    getAddress(value)
                  } catch (error) {
                    isAddress = false
                  }
                  return isAddress
                }
            }
        });
   };
}