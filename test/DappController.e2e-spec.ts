import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/apps/AppModule';

describe('AppController (e2e)', () => {
  let app;

  // beforeEach(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();
  //   await app.init();
  // });

  // it('/create (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/')
  //     .expect(200)
  //     .expect('');
  // });

  it('/ (GET)', () => {
    return;
  });
});
