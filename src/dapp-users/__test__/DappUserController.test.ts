import { Test, TestingModule } from '@nestjs/testing';
import { DappUserController } from '../DappUserController';
import { DappUserService } from '../DappUserService';

describe('DappUserController', () => {
  let dappUserController: DappUserController;

  let dappUserService

  beforeEach(async () => {
    dappUserService = { create: jest.fn() }

    const app: TestingModule = await Test.createTestingModule({
      controllers: [DappUserController],
      providers: [{
        provide: DappUserService,
        useValue: dappUserService
      }],
    }).compile();

    dappUserController = app.get<DappUserController>(DappUserController);
  });

  describe('create()', () => {
    it('should create a new DappUser', () => {
      dappUserController.create('1234', null, 'asdf@asdf.com')

      expect(dappUserService.create).toHaveBeenCalledWith('1234', null, 'asdf@asdf.com')
    });
  });
});
