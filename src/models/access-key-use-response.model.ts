import { AccessKey } from "./access-key.model";

export interface AccessKeyUseResponse {
  accessKeyData: AccessKey;
  rateLimitData: number | null;
  rateLimitRefreshInSeconds: number;
  limitExceeded: boolean;
}