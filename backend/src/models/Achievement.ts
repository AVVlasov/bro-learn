import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'lessons' | 'courses' | 'xp' | 'special';
  requirement: number;
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: mongoose.Types.ObjectId;
  unlockedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
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
      default: '🏆',
    },
    type: {
      type: String,
      enum: ['streak', 'lessons', 'courses', 'xp', 'special'],
      required: true,
    },
    requirement: {
      type: Number,
      required: true,
    },
    xpReward: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

const userAchievementSchema = new Schema<IUserAchievement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    achievementId: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', userAchievementSchema);
