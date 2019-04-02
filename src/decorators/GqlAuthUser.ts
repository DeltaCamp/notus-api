import { createParamDecorator } from '@nestjs/common';

import { UserEntity } from '../users/UserEntity'

export const GqlAuthUser = createParamDecorator((data, [_1, _2, { req }]): UserEntity => {
  let response = null
  if (req.user instanceof UserEntity) {
    response = req.user
  };
  return response
});
