import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  requiredXP: number;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    requiredXP: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

moduleSchema.index({ courseId: 1, order: 1 });

export const Module = mongoose.model<IModule>('Module', moduleSchema);
