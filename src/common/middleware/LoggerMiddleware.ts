import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

// interface Assignment {
//   name?: string;
// }

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];

    // res.write = (...restArgs) => {
      // chunks.push(Buffer.from(restArgs[0]));
      // oldWrite.apply(res, restArgs);
    // };

    // res.end = (...restArgs) => {
    //   if (restArgs[0]) {
    //     chunks.push(Buffer.from(restArgs[0]));
    //   }
    //   const body = Buffer.concat(chunks).toString('utf8');

    //   console.log({
    //     time: new Date().toUTCString(),
    //     fromIP: req.headers['x-forwarded-for'] ||
    //       req.connection.remoteAddress,
    //     method: req.method,
    //     originalUri: req.originalUrl,
    //     uri: req.url,
    //     requestData: req.body,
    //     responseData: body,
    //     referer: req.headers.referer || '',
    //     ua: req.headers['user-agent']
    //   });

    //   // console.log(body);
    //   oldEnd.apply(res, restArgs);
    // };


    next();
  }
}
