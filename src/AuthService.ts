import { Injectable } from '@nestjs/common';
import { DappUserService } from './dapp_users/DappUserService';

@Injectable()
export class AuthService {
  constructor(private readonly dappUserService: DappUserService) {}

  async validateDappUser(accessKey: string): Promise<any> {
    return await this.dappUserService.findOneByAccessKey(accessKey);
  }
}
