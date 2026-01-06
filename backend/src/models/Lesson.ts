import mongoose, { Document, Schema } from 'mongoose';

export type LessonType = 'theory' | 'quiz' | 'practice' | 'flashcard';

export interface IQuizOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuizQuestion {
  question: string;
  options: IQuizOption[];
  explanation?: string;
}

export interface ILesson extends Document {
  moduleId: mongoose.Types.ObjectId;
  title: string;
  type: LessonType;
  order: number;
  xpReward: number;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  quizQuestions?: IQuizQuestion[];
  practiceSteps?: string[];
  flashcards?: Array<{ front: string; back: string }>;
  estimatedMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['theory', 'quiz', 'practice', 'flashcard'],
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    xpReward: {
      type: Number,
      default: 10,
    },
    content: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    quizQuestions: [
      {
        question: { type: String, required: true },
        options: [
          {
            text: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
          },
        ],
        explanation: { type: String },
      },
    ],
    practiceSteps: [{ type: String }],
    flashcards: [
      {
        front: { type: String, required: true },
        back: { type: String, required: true },
      },
    ],
    estimatedMinutes: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ moduleId: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
