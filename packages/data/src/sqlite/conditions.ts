import {
  getMaybeModifierValue,
  isModifier,
  isNoBinding,
  Modifier,
} from './modifier';

type ImplicitConditions<T> = {
  [K in keyof T]?: T[K] | Modifier;
};

type ExplicitConditions = [string, unknown[]];

export type Conditions<T> = ImplicitConditions<T> | ExplicitConditions;

function maybeModifierToKeyValue(key: string, value: unknown): string {
  return isModifier(value) ? `"${key}"${value.expression}` : `"${key}"=?`;
}

function implicitConditionsToExpression<T>(
  conditions: ImplicitConditions<T>
): string {
  return Object.entries(conditions)
    .map(([key, value]) => maybeModifierToKeyValue(key, value))
    .join(' AND ');
}

export function conditionsToExpression<T>(
  conditions: Conditions<T> | undefined
): string {
  return conditions === undefined
    ? ''
    : Array.isArray(conditions)
      ? conditions[0]
      : implicitConditionsToExpression(conditions);
}

export function getConditionsBinding(
  conditions: Conditions<unknown>
): unknown[] {
  if (Array.isArray(conditions)) {
    return conditions[1] as unknown[];
  }

  return Object.values(conditions)
    .flatMap((value) => getMaybeModifierValue(value))
    .filter((value) => !isNoBinding(value));
}

function logical<T>(separator: string, parts: Conditions<T>[]): Conditions<T> {
  return [
    parts.map((part) => `(${conditionsToExpression(part)})`).join(separator),
    parts.flatMap((part) => getConditionsBinding(part)),
  ];
}

export function and<T>(...parts: Conditions<T>[]): Conditions<T> {
  return logical(' AND ', parts);
}

export function or<T>(...parts: Conditions<T>[]): Conditions<T> {
  return logical(' OR ', parts);
}
