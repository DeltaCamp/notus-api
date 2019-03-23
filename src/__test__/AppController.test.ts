import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../AppController';
import { AppService } from '../AppService';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      // imports: [
      //   TypeOrmModule.forFeature([DappEntity])
      // ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the msg', () => {
      expect(appController.getHello()).toBe(
        'Please refer to the docs for how to use the notus api'
      );
    });
  });
});
