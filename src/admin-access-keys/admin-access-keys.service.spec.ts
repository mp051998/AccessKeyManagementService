import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyMongoService } from 'src/shared/models/mongo/access-key/access-key.service';
import { AdminAccessKeysService } from './admin-access-keys.service';
import mockAccessKeyMongoService from 'src/tests/mocks/mongo/access-key-mongo-service.mock';

describe('AdminAccessKeysService', () => {
  let service: AdminAccessKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAccessKeysService,
        // Provide the mock instead of the actual service
        { provide: AccessKeyMongoService, useValue: mockAccessKeyMongoService }
      ],
    }).compile();

    service = module.get<AdminAccessKeysService>(AdminAccessKeysService);

  });

  afterEach(async () => {
    mockAccessKeyMongoService.cleanupCache();
  });

  afterAll(async () => {
    jest.clearAllMocks(); // Clear mocks to avoid state leakage
    jest.clearAllTimers(); // Clear all timers
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a new key', async () => {
    const expireAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    const key = await service.generateKey(60, expireAt);
    expect(key).toBeInstanceOf(Object);
    expect(key.key).toBeDefined();
    expect(key.rateLimitPerMin).toBe(60);
    expect(key.expireAt).toEqual(expireAt);
  });

  it('should generate a key and then get it', async () => {
    const expireAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    const key = await service.generateKey(60, expireAt);
    const fetchedKey = await service.getKey(key.key);
    expect(fetchedKey).toBeInstanceOf(Object);
    expect(fetchedKey.key).toBe(key.key);
    expect(fetchedKey.rateLimitPerMin).toBe(60);
    expect(fetchedKey.expireAt).toEqual(expireAt);
  });

  it('should generate a key, get it, and then update it', async () => {
    const key = await service.generateKey(60, new Date('2023-01-01T00:00:00Z'));
    const fetchedKey = await service.getKey(key.key);
    expect(fetchedKey).toBeInstanceOf(Object);
    expect(fetchedKey.key).toBe(key.key);
    expect(fetchedKey.rateLimitPerMin).toBe(60);
    expect(fetchedKey.expireAt).toEqual(new Date('2023-01-01T00:00:00Z'));
    const updatedKey = await service.updateKey(key.key, 30, new Date('2023-01-02T00:00:00Z'));
    expect(updatedKey).toBeInstanceOf(Object);
    expect(updatedKey.key).toBe(key.key);
    expect(updatedKey.rateLimitPerMin).toBe(30);
    expect(updatedKey.expireAt).toEqual(new Date('2023-01-02T00:00:00Z'));
  });

  it('should get all the keys', async () => {
    // Insert atleast one key
    const expireAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    await service.generateKey(60, expireAt);
    const keys = await service.getActiveKeys();
    expect(keys).toBeInstanceOf(Array);
    expect(keys.length).toBeGreaterThan(0);
  });
});
