import { PollQuestion, PollRespondentAnswer } from '@data/types/poll';

function isValidIndexInOptions(index: number, length: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < length;
}

export function isValidAnswer(
  question: PollQuestion,
  answer: PollRespondentAnswer
): boolean {
  switch (question.type) {
    case 'text': {
      return answer.text !== undefined;
    }
    case 'checkbox': {
      if (answer.status === undefined) {
        return false;
      }

      if (question.requiredTrue) {
        return answer.status;
      }

      return true;
    }
    case 'multicheckbox': {
      if (answer.selectedIndices === undefined) {
        return false;
      }

      if (answer.selectedIndices.length !== question.options.length) {
        return false;
      }

      return answer.selectedIndices.every((index) =>
        isValidIndexInOptions(index, question.options.length)
      );
    }
    case 'radio': {
      if (answer.selectedIndex === undefined) {
        return false;
      }

      return isValidIndexInOptions(
        answer.selectedIndex,
        question.options.length
      );
    }
  }
}

export function isValidAnswers(
  questions: PollQuestion[],
  answers: PollRespondentAnswer[]
): boolean {
  if (questions.length !== answers.length) {
    return false;
  }

  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const answer = answers[i];

    if (!isValidAnswer(question, answer)) {
      return false;
    }
  }

  return true;
}
