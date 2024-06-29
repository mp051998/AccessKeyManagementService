import { Test, TestingModule } from '@nestjs/testing';

import { AdminAccessKeysController } from './admin-access-keys.controller';

// TODO: Add tests
describe('AccessKeyManagementController', () => {
  let controller: AdminAccessKeysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAccessKeysController],
    }).compile();

    controller = module.get<AdminAccessKeysController>(AdminAccessKeysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
