import { createParamDecorator } from '@nestjs/common';

import { DappUserEntity } from '../entities'

export const AuthDappUser = createParamDecorator((data, req): DappUserEntity => {
  let response: DappUserEntity = null
  if (req.user instanceof DappUserEntity) {
    response = req.user
  };
  return response
});
