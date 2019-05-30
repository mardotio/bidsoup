import { compose } from 'redux';
import { ComposedReturn, createError } from '@utils/validation/shared';
import { isDefined } from '@utils/utils';
import { getAcceptedOptions, optionalOrRequired } from '@utils/validation/shared';

interface TextValidation {
  isRequired: boolean;
  maxLength: number | null;
}

const validateMaxLength = (prevState: ComposedReturn<TextValidation>) => {
  if (prevState.error.hasError || prevState.value.length <= prevState.options.maxLength!) {
    return prevState;
  }
  return createError(`Max length: ${prevState.options.maxLength}`, prevState);
};

const textValidation = (options?: Partial<TextValidation>) => {
  const defaults: TextValidation = {
    isRequired: true,
    maxLength: 255,
  };
  const mapping = {
    maxLength: validateMaxLength
  };
  let finalOptions = isDefined(options)
    ? {...defaults, ...options}
    : defaults;
  let accepted = getAcceptedOptions(finalOptions);
  let partialValidationFuncs: ((o: ComposedReturn<TextValidation>) => (ComposedReturn<TextValidation>))[] =
    accepted.filter(opt => opt !== 'isRequired')
    .map(opt => mapping[opt]);
  let validationFuncs = optionalOrRequired(partialValidationFuncs, finalOptions.isRequired);
  return (value: string) => {
    let state =
    compose(...validationFuncs)({
      value,
      options: finalOptions,
      error: {hasError: false, message: ''}
    }) as ComposedReturn<TextValidation>;
    return state.error;
  };
};

export const isEmail = (s: string): boolean => {
  const emailRegex = new RegExp(''
    + /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source
    + /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source
  );

  return s.match(emailRegex) !== null;
};

export default textValidation;
