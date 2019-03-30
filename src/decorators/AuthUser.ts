import { createParamDecorator } from '@nestjs/common';

import { UserEntity } from '../users/UserEntity'

export const AuthUser = createParamDecorator((data, req): UserEntity => {
  let response = null
  if (req.user instanceof UserEntity) {
    response = req.user
  };
  return response
});
