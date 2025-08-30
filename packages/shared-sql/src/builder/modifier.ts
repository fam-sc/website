import { qMarks } from './expression';

const ModifierType = Symbol();
const NONE = {};

export type Modifier = {
  [ModifierType]: boolean;

  binding: unknown;
  expression: string;
};

function createModifier(binding: unknown, expression: string): Modifier {
  return { [ModifierType]: false, expression, binding };
}

function modifier(expression: string): (value: unknown) => Modifier {
  return (value) => createModifier(value, expression);
}

export function isModifier(value: unknown): value is Modifier {
  return typeof value === 'object' && value !== null && ModifierType in value;
}

export function isNoBinding(value: unknown): boolean {
  return value === NONE;
}

export function getMaybeModifierValue(value: unknown): unknown {
  return isModifier(value) ? value.binding : value;
}

export const equals = modifier('=?');
export const notEquals = modifier('!=?');
export const lessThanOrEquals = modifier('<=?');
export const greaterOrEquals = modifier('>=?');

export function valueIn(array: unknown[]): Modifier {
  return createModifier(array, `IN (${qMarks(array.length)})`);
}

export function valueNotIn(array: unknown[]): Modifier {
  return createModifier(array, `NOT IN (${qMarks(array.length)})`);
}

export function notNull(): Modifier {
  return createModifier(NONE, 'IS NOT NULL');
}

export function isNull(): Modifier {
  return createModifier(NONE, 'IS NULL');
}
