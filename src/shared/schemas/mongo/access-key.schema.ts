import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type AccessKeyDocument = AccessKey & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true }, // Ensure virtuals are included when document is converted to JSON
  toObject: { virtuals: true } // Ensure virtuals are included when document is converted to a plain object
})
export class AccessKey {
  @Prop({ required: true, unique: true })
  key: string; // Unique identifier for the access key

  @Prop({ required: true })
  rateLimitPerMin: number; // Number of requests allowed per minute

  @Prop({ required: true })
  expireAt: Date; // When the key expires

  @Prop({ default: true })
  active?: boolean; // User uses this to activate/deactivate the key
}

const AccessKeySchema = SchemaFactory.createForClass(AccessKey);

// Define a virtual for `ttl` that computes the time to live based on `expireAt`
AccessKeySchema.virtual('ttl').get(function () {
  const now = new Date();
  return Math.max((this.expireAt.getTime() - now.getTime()) / 1000, 0); // Convert milliseconds to seconds
});

export { AccessKeySchema };
