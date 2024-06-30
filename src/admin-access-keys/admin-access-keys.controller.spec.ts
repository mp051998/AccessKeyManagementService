import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyMongoService } from 'src/shared/models/mongo/access-key/access-key.service';
import { AdminAccessKeysController } from './admin-access-keys.controller';
import { AdminAccessKeysService } from './admin-access-keys.service';
import { INestApplication } from '@nestjs/common';
import mockAccessKeyMongoService from 'src/tests/mocks/mongo/access-key-mongo-service.mock';

describe('AdminAccessKeysController', () => {
  let controller: AdminAccessKeysController;
  let app: INestApplication;

  // Util functions that can be reused across tests
  async function createKeyAndVerify(rateLimitPerMin = 10, expireAfterMins = 60) {
    const response = await request(app.getHttpServer())
      .post('/admin/access-keys')
      .send({ rateLimitPerMin, expireAfterMins })
      .expect(201);

    const accessKeyData = response.body;
    expect(response.body).toBeInstanceOf(Object);
    expect(accessKeyData.key).toBeDefined();
    expect(accessKeyData.rateLimitPerMin).toBe(rateLimitPerMin);
    const differenceInSeconds = Math.abs(new Date(accessKeyData.expireAt).getTime() - new Date().setMinutes(new Date().getMinutes() + expireAfterMins)) / 1000;
    expect(differenceInSeconds).toBeLessThanOrEqual(10);

    return accessKeyData;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAccessKeysController],
      providers: [
        AdminAccessKeysService,
        // Provide the mock instead of the actual service
        { provide: AccessKeyMongoService, useValue: mockAccessKeyMongoService },
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init();
    controller = module.get<AdminAccessKeysController>(AdminAccessKeysController);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate a new key via API call', async () => {
    const expireAfterMins = 30;
    const rateLimitPerMin = 60;
    await createKeyAndVerify(rateLimitPerMin, expireAfterMins);
  });

  it('should generate a new key and get it via API call', async () => {
    const expireAfterMins = 30;
    const rateLimitPerMin = 60;
    const expireAt = new Date(new Date().setMinutes(new Date().getMinutes() + expireAfterMins));
    const accessKeyData = await createKeyAndVerify(rateLimitPerMin, expireAfterMins);
    const fetchedKeyResponse = await request(app.getHttpServer())
      .get(`/admin/access-keys/${accessKeyData.key}`) // Replace '/your-endpoint' with the actual endpoint
      .expect(200); // Assuming 200 is the success status code for this operation

    const fetchedKey = fetchedKeyResponse.body;
    expect(fetchedKey).toBeInstanceOf(Object);
    expect(fetchedKey.key).toBe(accessKeyData.key);
    expect(fetchedKey.rateLimitPerMin).toBe(60);
    // Calculate the difference in seconds
    const differenceInSeconds = Math.abs(new Date(accessKeyData.expireAt).getTime() - expireAt.getTime()) / 1000;
    // Assert that the difference is within 10 seconds
    expect(differenceInSeconds).toBeLessThanOrEqual(10);
  });

  it('should generate a new key, get it, and then update it via API call', async () => {
    const rateLimitPerMin = 60;
    const expireAfterMins = 30;
    const expireAt = new Date(new Date().setMinutes(new Date().getMinutes() + expireAfterMins));
    const accessKeyData = await createKeyAndVerify(rateLimitPerMin, expireAfterMins);

    const fetchedKeyResponse = await request(app.getHttpServer())
      .get(`/admin/access-keys/${accessKeyData.key}`) // Replace '/your-endpoint' with the actual endpoint
      .expect(200); // Assuming 200 is the success status code for this operation

    const fetchedKey = fetchedKeyResponse.body;
    expect(fetchedKey).toBeInstanceOf(Object);
    expect(fetchedKey.key).toBe(accessKeyData.key);
    expect(fetchedKey.rateLimitPerMin).toBe(60);

    // Calculate the difference in seconds
    const differenceInSeconds = Math.abs(new Date(accessKeyData.expireAt).getTime() - expireAt.getTime()) / 1000;
    // Assert that the difference is within 10 seconds
    expect(differenceInSeconds).toBeLessThanOrEqual(10);

    const updatedExpireAfterMins = 60;
    const updatedKeyResponse = await request(app.getHttpServer())
      .patch(`/admin/access-keys`) // Replace '/your-endpoint' with the actual endpoint
      .send({ key: accessKeyData.key, rateLimitPerMin: 30, expireAfterMins: updatedExpireAfterMins })
      .expect(200); // Assuming 200 is the success status code for this operation

    const updatedKey = updatedKeyResponse.body;
    expect(updatedKey).toBeInstanceOf(Object);
    expect(updatedKey.key).toBe(accessKeyData.key);
    expect(updatedKey.rateLimitPerMin).toBe(30);
    // Calculate the difference in seconds
    const differenceInSecondsUpdated = Math.abs(new Date(updatedKey.expireAt).getTime() - new Date(accessKeyData.expireAt).getTime()) / 1000;
    // Assert that the difference is within 10 seconds
    expect(differenceInSecondsUpdated).toBeLessThanOrEqual(10);
  });

  it('it should create a key and then delete it', async () => {
    const expireAfterMins = 30;
    const rateLimitPerMin = 60;
    const accessKeyData = await createKeyAndVerify(rateLimitPerMin, expireAfterMins);

    // Now delete the key
    const response = await request(app.getHttpServer())
      .delete(`/admin/access-keys/${accessKeyData.key}`) // Replace '/your-endpoint' with the actual endpoint
      .expect(200); // Assuming 200 is the success status code for this operation

    const deletedKey = response.body;
    expect(deletedKey).toBeInstanceOf(Object);
    expect(deletedKey.key).toBe(accessKeyData.key);

    const updatedResponse = await request(app.getHttpServer())
      .get(`/admin/access-keys/${accessKeyData.key}`) // Replace '/your-endpoint' with the actual endpoint
      .expect(200);
    const updatedAccessKeyData = updatedResponse.body;
    expect(updatedAccessKeyData).toBeInstanceOf(Object);

    // Check if the key has expired
    const now = new Date();
    expect(new Date(updatedAccessKeyData.expireAt) <= now).toBe(true);
  });

});
