import { ValidatorConstraintInterface, ValidatorConstraint } from "class-validator";
var Isemail = require('isemail');

@ValidatorConstraint()
export class IsEmailWithPlusOk implements ValidatorConstraintInterface {

  validate(email: string) {
    return Isemail.validate(email, { errorLevel: false });
  }

}