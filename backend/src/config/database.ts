import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bro-learn';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB подключена успешно');
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB отключена');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Ошибка MongoDB:', error);
});
