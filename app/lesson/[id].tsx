import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Button, Card, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { courseService, LessonDetail } from '@/services/courseService';
import { useProgressStore } from '@/stores/progressStore';
import { TheoryContent } from '@/components/lesson/TheoryContent';
import { QuizQuestion } from '@/components/lesson/QuizQuestion';
import { PracticeTask } from '@/components/lesson/PracticeTask';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LessonScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams<{ id: string }>();

  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const { completeLesson } = useProgressStore();

  useEffect(() => {
    const loadLesson = async () => {
      try {
        if (id) {
          const data = await courseService.getLessonById(id);
          setLessonDetail(data);
          setIsCompleted(data.progress.isCompleted);
        }
      } catch (error) {
        console.error('Ошибка загрузки урока:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [id]);

  const handleCompleteTheory = async () => {
    if (!id) return;
    try {
      const result = await completeLesson(id);
      setXpEarned(result.xpEarned);
      setIsCompleted(true);
      setShowSuccess(true);
    } catch (error) {
      console.error('Ошибка завершения урока:', error);
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!lessonDetail?.lesson.quizQuestions) return;

    if (currentQuestionIndex < lessonDetail.lesson.quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = async () => {
    if (!id || !lessonDetail?.lesson.quizQuestions) return;

    const totalQuestions = lessonDetail.lesson.quizQuestions.length;
    const score = Math.round((quizScore / totalQuestions) * 100);

    try {
      const result = await completeLesson(id, score);
      setXpEarned(result.xpEarned);
      setIsCompleted(true);
      setShowSuccess(true);
    } catch (error) {
      console.error('Ошибка завершения квиза:', error);
    }
  };

  const handleCompletePractice = async () => {
    if (!id) return;
    try {
      const result = await completeLesson(id);
      setXpEarned(result.xpEarned);
      setIsCompleted(true);
      setShowSuccess(true);
    } catch (error) {
      console.error('Ошибка завершения практики:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!lessonDetail) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text variant="bodyLarge" style={{ color: colors.textSecondary }}>
          Урок не найден
        </Text>
      </View>
    );
  }

  const renderLessonContent = () => {
    const { lesson } = lessonDetail;

    switch (lesson.type) {
      case 'theory':
        return (
          <>
            <TheoryContent
              content={lesson.content || ''}
              imageUrl={lesson.imageUrl}
              videoUrl={lesson.videoUrl}
            />
            {!isCompleted && (
              <View style={styles.actionContainer}>
                <Button mode="contained" onPress={handleCompleteTheory} icon="check">
                  Завершить урок
                </Button>
              </View>
            )}
          </>
        );

      case 'quiz':
        if (!lesson.quizQuestions || lesson.quizQuestions.length === 0) {
          return <Text>Нет вопросов для квиза</Text>;
        }

        const currentQuestion = lesson.quizQuestions[currentQuestionIndex];
        return (
          <>
            <Card style={styles.progressCard}>
              <Card.Content>
                <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                  Вопрос {currentQuestionIndex + 1} из {lesson.quizQuestions.length}
                </Text>
              </Card.Content>
            </Card>
            <QuizQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              explanation={currentQuestion.explanation}
              onAnswer={handleQuizAnswer}
            />
          </>
        );

      case 'practice':
        return (
          <PracticeTask
            steps={lesson.practiceSteps || []}
            onComplete={handleCompletePractice}
          />
        );

      case 'flashcard':
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">Карточки для запоминания</Text>
              <Text>Функционал в разработке</Text>
            </Card.Content>
          </Card>
        );

      default:
        return <Text>Неизвестный тип урока</Text>;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={[styles.title, { color: colors.text }]}>
              {lessonDetail.lesson.title}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
              {lessonDetail.lesson.xpReward} XP • ~{lessonDetail.lesson.estimatedMinutes} мин
            </Text>
            {isCompleted && (
              <Text variant="bodyMedium" style={[styles.completedBadge, { color: colors.success }]}>
                ✅ Урок завершен
              </Text>
            )}
          </Card.Content>
        </Card>

        {renderLessonContent()}
      </ScrollView>

      <Snackbar
        visible={showSuccess}
        onDismiss={() => {
          setShowSuccess(false);
          router.back();
        }}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => {
            setShowSuccess(false);
            router.back();
          },
        }}>
        <Text>🎉 Урок завершен! +{xpEarned} XP</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 16,
  },
  title: {
    marginBottom: 8,
  },
  completedBadge: {
    marginTop: 8,
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  card: {
    margin: 16,
  },
  actionContainer: {
    padding: 16,
  },
});
