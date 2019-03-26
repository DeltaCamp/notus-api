import { Test, TestingModule } from '@nestjs/testing';
import { DappController } from '../DappController';
import { DappService } from '../DappService';
import { UserService } from '../../users/UserService'
import { DappEntity } from '../../dapps/DappEntity'
import { UserEntity } from '../../users/UserEntity'

describe('DappController', () => {
  let dappController: DappController;

  let dappService, userService

  let user, dapp

  beforeEach(async () => {
    user = new UserEntity()
    dapp = new DappEntity()

    dappService = { findOrCreate: jest.fn(async () => dapp) }
    userService = { findOrCreate: jest.fn(async () => user) }

    const app: TestingModule = await Test.createTestingModule({
      controllers: [DappController],
      providers: [
        {
          provide: DappService,
          useValue: dappService
        },
        {
          provide: UserService,
          useValue: userService
        }
      ],
    }).compile();

    dappController = app.get<DappController>(DappController);
  });

  describe('create', () => {
    it('should return', async () => {
      expect(await dappController.create('Hoboken', 'joe@hoboken.com')).toEqual(dapp)
    });
  });
});
