import { compose } from 'redux';
import { isDefined, isNumber } from '@utils/utils';
import { ComposedReturn, createError } from '@utils/validation/shared';
import { getAcceptedOptions, optionalOrRequired } from '@utils/validation/shared';
import { beautifyNumber } from '@utils/styling';

interface NumberValidation {
  isRequired: boolean;
  maxDigits: number | null;
  maxPrecision: number | null;
}

const getLargestNumber = (digits: number, decimals: number | null) => (
  isDefined(decimals) && decimals > 0
   ? beautifyNumber(Number(`${'9'.repeat(digits)}.${'9'.repeat(decimals)}`), decimals)
   : beautifyNumber(Number(`${'9'.repeat(digits)}`), 0)
);

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
  if (prevState.options.maxPrecision === 0 && prevState.value.includes('.')) {
    return createError('Field must be an integer', prevState);
  } else if (isDefined(decimals) && decimals.length > prevState.options.maxPrecision!) {
    return createError(`Max precision: ${prevState.options.maxPrecision}`, prevState);
  }
  return prevState;
};

const validateMaxDigits = (prevState: ComposedReturn<NumberValidation>) => {
  if (prevState.error.hasError) {
    return prevState;
  }
  let [digits] = prevState.value.split('.');
  if (isDefined(digits) && digits.length > prevState.options.maxDigits!) {
    return createError(
      `Max: ${getLargestNumber(prevState.options.maxDigits!, prevState.options.maxPrecision)}`,
      prevState
    );
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
  let validationFuncs = optionalOrRequired([...partialValidationFuncs, validateNumber], finalOptions.isRequired);
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
