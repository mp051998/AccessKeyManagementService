import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyManagementController } from './access-key-management.controller';

// TODO: Add tests
describe('AccessKeyManagementController', () => {
  let controller: AccessKeyManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessKeyManagementController],
    }).compile();

    controller = module.get<AccessKeyManagementController>(AccessKeyManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
