import {
  array,
  boolean,
  discriminatedUnion,
  int,
  literal,
  minLength,
  number,
  object,
  optional,
  refine,
  string,
} from 'zod/v4-mini';

import { scores } from '@/services/polls/constants';

const nonEmptyString = string().check(minLength(1));
const title = nonEmptyString;

const options = array(object({ title }));
const score = number().check(refine((value) => scores.includes(value)));

export const question = discriminatedUnion('type', [
  object({ type: literal('text'), title }),
  object({ type: literal('radio'), title, options }),
  object({ type: literal('multicheckbox'), title, options }),
  object({ type: literal('checkbox'), title, requiredTrue: boolean() }),
  object({ type: literal('score'), title, items: array(score) }),
]);

const index = number().check(int());

export const answer = object({
  text: optional(nonEmptyString),
  status: optional(boolean()),
  selectedIndex: optional(index),
  selectedIndices: optional(array(index)),
  selected: optional(score),
});

export const poll = object({
  title: nonEmptyString,
  questions: array(question).check(minLength(1)),
});

export const addPollPayload = poll;

export const submitPollPayload = object({
  answers: array(answer),
});
