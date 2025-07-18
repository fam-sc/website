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
  string,
} from 'zod/v4-mini';

const title = string().check(minLength(1));

const options = array(object({ title }));

export const question = discriminatedUnion('type', [
  object({ type: literal('text'), title }),
  object({ type: literal('radio'), title, options }),
  object({ type: literal('multicheckbox'), title, options }),
  object({ type: literal('checkbox'), title, requiredTrue: boolean() }),
]);

const index = number().check(int());

export const answer = object({
  text: optional(string().check(minLength(1))),
  status: optional(boolean()),
  selectedIndex: optional(index),
  selectedIndices: optional(array(index)),
});

export const poll = object({
  title: string().check(minLength(1)),
  questions: array(question).check(minLength(1)),
});

export const addPollPayload = poll;

export const submitPollPayload = object({
  answers: array(answer),
});
