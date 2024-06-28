
export interface AccessKey {
  key: string; // Unique identifier for the access key
  rateLimitPerMin: number; // Number of requests allowed per minute
  expireAt: Date; // When the key expires
  ttl?: number; // Time to live in seconds
}
