import { createParamDecorator } from '@nestjs/common';

export const DappUser = createParamDecorator((data, req): any => {
  return req.user;
});
