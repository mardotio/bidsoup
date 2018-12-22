import { compose } from 'redux';
import { isDefined, isNumber } from '@utils/utils';
import { ComposedReturn, createError } from '@utils/validation/shared';
import { getAcceptedOptions, optionalOrRequired } from '@utils/validation/shared';

interface NumberValidation {
  isRequired: boolean;
  maxDigits: number | null;
  maxPrecision: number | null;
}

const validateNumber = (prevState: ComposedReturn<NumberValidation>) => {
  if (prevState.error.hasError || isNumber(prevState.value)) {
    return prevState;
  }
  return createError('Field must be a number', prevState);
};

const validateMaxPrecision = (prevState: ComposedReturn<NumberValidation>) => {
  if (prevState.error.hasError) {
    return prevState;
  }
  let decimals = prevState.value.split('.')[1];
  if (isDefined(decimals) && decimals.length > prevState.options.maxPrecision!) {
    return createError('Exceeded max precsion', prevState);
  }
  return prevState;
};

const validateMaxDigits = (prevState: ComposedReturn<NumberValidation>) => {
  if (prevState.error.hasError) {
    return prevState;
  }
  let [digits] = prevState.value.split('.');
  if (isDefined(digits) && digits.length > prevState.options.maxDigits!) {
    return createError('Exceeded max digits', prevState);
  }
  return prevState;
};

const numberValidation = (options?: Partial<NumberValidation>) => {
  const defaults: NumberValidation = {
    isRequired: true,
    maxDigits: 6,
    maxPrecision: 2
  };
  const mapping = {
    maxDigits: validateMaxDigits,
    maxPrecision: validateMaxPrecision
  };
  let finalOptions = isDefined(options)
    ? {...defaults, ...options}
    : defaults;
  let accepted = getAcceptedOptions(finalOptions);
  let partialValidationFuncs: ((o: ComposedReturn<NumberValidation>) => (ComposedReturn<NumberValidation>))[] =
    accepted.filter(opt => opt !== 'isRequired')
    .map(opt => mapping[opt]);
  let validationFuncs = optionalOrRequired([validateNumber, ...partialValidationFuncs], finalOptions.isRequired);
  return (value: string) => {
    let state =
    compose(...validationFuncs)({
      value,
      options: finalOptions,
      error: {hasError: false, message: ''}
    }) as ComposedReturn<NumberValidation>;
    return state.error;
  };
};

export default numberValidation;
