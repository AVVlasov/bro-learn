import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text, ProgressBar, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { Module, Lesson } from '@/services/courseService';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ModuleListProps {
  modules: Module[];
}

export const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'theory':
        return 'book-open-variant';
      case 'quiz':
        return 'help-circle';
      case 'practice':
        return 'code-braces';
      case 'flashcard':
        return 'cards';
      default:
        return 'file-document';
    }
  };

  const getLessonTypeText = (type: string) => {
    switch (type) {
      case 'theory':
        return 'Теория';
      case 'quiz':
        return 'Квиз';
      case 'practice':
        return 'Практика';
      case 'flashcard':
        return 'Карточки';
      default:
        return type;
    }
  };

  return (
    <View>
      {modules.map((module, index) => (
        <List.Accordion
          key={module.id}
          title={module.title}
          description={`${module.completedLessons} из ${module.totalLessons} уроков`}
          left={(props) => <List.Icon {...props} icon="folder" />}
          style={styles.accordion}>
          <View style={styles.moduleContent}>
            <Text variant="bodyMedium" style={[styles.description, { color: colors.textSecondary }]}>
              {module.description}
            </Text>

            <ProgressBar
              progress={module.progressPercentage / 100}
              color={colors.primary}
              style={styles.progressBar}
            />

            {module.isLocked && (
              <Chip icon="lock" style={styles.lockedChip}>
                Требуется {module.requiredXP} XP
              </Chip>
            )}

            {module.lessons.map((lesson) => (
              <List.Item
                key={lesson.id}
                title={lesson.title}
                description={`${getLessonTypeText(lesson.type)} • ${lesson.xpReward} XP • ~${lesson.estimatedMinutes} мин`}
                left={(props) => <List.Icon {...props} icon={getLessonIcon(lesson.type)} />}
                right={(props) =>
                  lesson.isCompleted ? (
                    <List.Icon {...props} icon="check-circle" color={colors.success} />
                  ) : null
                }
                onPress={() => router.push(`/lesson/${lesson.id}`)}
                disabled={module.isLocked}
                style={[
                  styles.lessonItem,
                  lesson.isCompleted && { backgroundColor: colors.surface },
                ]}
              />
            ))}
          </View>
        </List.Accordion>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  accordion: {
    marginBottom: 8,
  },
  moduleContent: {
    padding: 16,
  },
  description: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
  },
  lockedChip: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  lessonItem: {
    paddingLeft: 0,
  },
});
