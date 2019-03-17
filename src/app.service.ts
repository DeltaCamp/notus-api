import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Please refer to the docs for how to use the notus api';
  }
}
