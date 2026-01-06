import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, RadioButton, Button } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface QuizQuestionProps {
  question: string;
  options: Array<{ text: string; isCorrect: boolean }>;
  explanation?: string;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  explanation,
  onAnswer,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const correct = options[selectedOption].isCorrect;
    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswer(correct);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={[styles.question, { color: colors.text }]}>
          {question}
        </Text>

        <RadioButton.Group
          onValueChange={(value) => setSelectedOption(parseInt(value))}
          value={selectedOption?.toString() || ''}>
          {options.map((option, index) => (
            <View
              key={index}
              style={[
                styles.optionContainer,
                isSubmitted && option.isCorrect && { backgroundColor: colors.success + '20' },
                isSubmitted && !option.isCorrect && selectedOption === index && { backgroundColor: colors.error + '20' },
              ]}>
              <RadioButton.Item
                label={option.text}
                value={index.toString()}
                disabled={isSubmitted}
                style={styles.radioItem}
              />
            </View>
          ))}
        </RadioButton.Group>

        {isSubmitted && (
          <View style={styles.feedbackContainer}>
            <Text
              variant="titleMedium"
              style={[
                styles.feedback,
                { color: isCorrect ? colors.success : colors.error },
              ]}>
              {isCorrect ? '✅ Правильно!' : '❌ Неправильно'}
            </Text>
            {explanation && (
              <Text variant="bodyMedium" style={[styles.explanation, { color: colors.textSecondary }]}>
                {explanation}
              </Text>
            )}
          </View>
        )}

        {!isSubmitted ? (
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={selectedOption === null}
            style={styles.button}>
            Проверить
          </Button>
        ) : (
          <Button mode="contained" onPress={handleNext} style={styles.button}>
            Следующий вопрос
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  question: {
    marginBottom: 16,
  },
  optionContainer: {
    borderRadius: 8,
    marginBottom: 8,
  },
  radioItem: {
    paddingVertical: 4,
  },
  feedbackContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  feedback: {
    marginBottom: 8,
  },
  explanation: {
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
});
