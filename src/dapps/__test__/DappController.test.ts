import { Test, TestingModule } from '@nestjs/testing';
import { DappController } from '../DappController';
import { DappService } from '../DappService';

describe('DappController', () => {
  let dappController: DappController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DappController],
      providers: [DappService],
    }).compile();

    dappController = app.get<DappController>(DappController);
  });

  describe('create', () => {
    it('should return', () => {
      expect(dappController.create(new Response(), 'Hoboken', 'joe@hoboken.com')).toBe(
        { status: 'success' }
      );
    });
  });
});
