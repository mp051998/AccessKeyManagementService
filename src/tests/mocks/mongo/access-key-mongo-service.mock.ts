import { AccessKey } from "src/shared/schemas/mongo/access-key.schema";

const accessKeyCache = {};

const mockAccessKeyMongoService = {
  createAccessKey: jest.fn().mockImplementation((key: string, rateLimitPerMin: number, expireAt: Date) => {
    const dynamicAccessKeyDocument = {
      key: key,
      rateLimitPerMin: rateLimitPerMin,
      expireAt: expireAt
    };
    // Store in cache
    accessKeyCache[key] = dynamicAccessKeyDocument;
    return Promise.resolve(dynamicAccessKeyDocument);
  }),

  updateAccessKey: jest.fn().mockImplementation((key: string, rateLimitPerMin: number, expireAt: Date) => {
    if (!accessKeyCache[key]) {
      return Promise.reject(new Error("Key does not exist"));
    }
    const dynamicAccessKeyDocument = {
      key: key,
      rateLimitPerMin: rateLimitPerMin,
      expireAt: expireAt
    };
    // Update in cache
    accessKeyCache[key] = dynamicAccessKeyDocument;
    return Promise.resolve(dynamicAccessKeyDocument);
  }),

  getAccessKey: jest.fn().mockImplementation((key: string) => {
    // Check cache
    if (accessKeyCache[key]) {
      return Promise.resolve(accessKeyCache[key]);
    }
    return Promise.reject(new Error("Key not found"));
  }),

  getAllAccessKeys: jest.fn().mockImplementation(() => {
    // Return all values from the cache
    return Promise.resolve(Object.values(accessKeyCache));
  }),

  getAllActiveAccessKeys: jest.fn().mockImplementation(() => {
    // Return all values from the cache that have not expired
    const now = new Date();
    const activeKeys = Object.values(accessKeyCache).filter((accessKey: AccessKey) => accessKey.expireAt > now);
    return Promise.resolve(activeKeys);
  }),

  deleteAccessKey: jest.fn().mockImplementation((key: string) => {
    if (!accessKeyCache[key]) {
      return Promise.reject(new Error("Key does not exist"));
    }
    // Do soft delete
    accessKeyCache[key].expireAt = new Date();
    const deletedDocument = accessKeyCache[key];
    return Promise.resolve(deletedDocument);
  }),

  // Method to clean up the cache
  cleanupCache: () => {
    Object.keys(accessKeyCache).forEach(key => delete accessKeyCache[key]);
  }
};

export default mockAccessKeyMongoService;