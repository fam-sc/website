const INVALID_TAG = Symbol();

type Invalid = {
  [INVALID_TAG]?: boolean;
  message?: string;
};

export type Validator<
  R = unknown,
  Input = unknown,
  Optional extends boolean = false,
> = {
  isOptional?: Optional;
  (input: Input): R | Invalid;
};

export function invalid(message?: string): Invalid {
  return { [INVALID_TAG]: true, message };
}

export function int(message?: string): Validator<number> {
  return (input) => {
    if (typeof input === 'string') {
      const result = Number.parseInt(input);

      if (!Number.isNaN(result)) {
        return result;
      }
    }

    return invalid(message);
  };
}

export function string(message?: string): Validator<string> {
  return (input) => {
    return typeof input === 'string' ? input : invalid(message);
  };
}

export function enumValidator<const T extends unknown[]>(
  values: T,
  message?: string
): Validator<T[number]> {
  return (input) => {
    return values.includes(input) ? input : invalid(message);
  };
}

export function isInvalid(value: unknown): value is Invalid {
  return Boolean((value as Invalid)[INVALID_TAG]);
}

export function optional<T, Input>(
  validator: Validator<T, Input>
): Validator<T, Input, true> {
  const copy: Validator<T, Input, true> = (input: Input) => validator(input);
  copy.isOptional = true;

  return copy;
}

export function validator<T, Input>(
  func: Validator<T, Input>
): Validator<T, Input> {
  return func;
}
