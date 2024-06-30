import { Test, TestingModule } from '@nestjs/testing';
import { UserAccessKeysController } from './user-access-keys.controller';

describe('UserAccessKeysController', () => {
  let controller: UserAccessKeysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAccessKeysController],
    }).compile();

    controller = module.get<UserAccessKeysController>(UserAccessKeysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
