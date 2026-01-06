import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  totalLessons: number;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '🎓',
    },
    color: {
      type: String,
      default: '#4CAF50',
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    estimatedHours: {
      type: Number,
      default: 1,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ order: 1 });
courseSchema.index({ isActive: 1 });

export const Course = mongoose.model<ICourse>('Course', courseSchema);
