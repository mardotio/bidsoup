import { isEmpty, isDefined } from '@utils/utils';

export interface ErrorObject {
  hasError: boolean;
  message: string;
}

export interface ComposedReturn<T> {
  value: string;
  error: ErrorObject;
  options: T;
}

export const createError = <T>(message: string, prevState: ComposedReturn<T>) => ({
  ...prevState,
  error: {
    hasError: true,
    message
  }
});

export const clearErrors = <T>(prevState: ComposedReturn<T>) => ({
  ...prevState,
  error: {
    hasError: false,
    message: ''
  }
});

// If option is a required function, this function should run first
export const validateRequired = <T>(prevState: ComposedReturn<T>) => {
  if (isEmpty(prevState.value)) {
    return createError('Field cannot be empty', prevState);
  }
  return prevState;
};

// If field is optional, this function should run last. It will clean up any
// errors that result from the field being empty.
export const validateOptional = <T>(prevState: ComposedReturn<T>) => {
  if (isEmpty(prevState.value)) {
    return clearErrors(prevState);
  }
  return prevState;
};

export const getAcceptedOptions = (options: Object) => (
  Object.keys(options).filter((opt: string) => isDefined(options[opt]) && options[opt] !== false)
);

export const optionalOrRequired = <T>(funcs: ((o: ComposedReturn<T>) => ComposedReturn<T>)[], isRequired: boolean) => (
  isRequired
    ? [...funcs, validateRequired]
    : [validateOptional, ...funcs]
);
