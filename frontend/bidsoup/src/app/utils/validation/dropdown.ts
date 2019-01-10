import { compose } from 'redux';
import { ComposedReturn, createError } from '@utils/validation/shared';
import { isDefined } from '@utils/utils';
import { optionalOrRequired } from '@utils/validation/shared';

interface DropDownItem {
  name: string;
  id: string;
}

interface DropdownValidation {
  isRequired: boolean;
  list: DropDownItem[];
}

const validatePartialOption = (prevState: ComposedReturn<DropdownValidation>) => {
  if (prevState.error.hasError) {
    return prevState;
  }
  let match = prevState.options.list.reduce(
    (result, opt) => (
      result || opt.name.toLowerCase().includes(prevState.value.toLowerCase())
    ),
    false
  );
  if (match) {
    return prevState;
  }
  return createError('Please select a valid option', prevState);
};

const validateFullOption = (prevState: ComposedReturn<DropdownValidation>) => {
  if (prevState.error.hasError) {
    return prevState;
  }
  let match = prevState.options.list.reduce(
    (result, opt) => (
      result || opt.name.toLowerCase() === prevState.value.toLowerCase()
    ),
    false
  );
  if (match) {
    return prevState;
  }
  return createError('Please select a valid option', prevState);
};

const dropdownValidation = (dropdownOptions: DropDownItem[], options?: Partial<DropdownValidation>) => {
  const defaults: DropdownValidation = {
    isRequired: true,
    list: [],
  };
  let finalOptions = isDefined(options)
    ? {...defaults, ...options, list: dropdownOptions}
    : {...defaults, list: dropdownOptions};
  return (value: string, matchPartial = false) => {
    let funcs = matchPartial
      ? optionalOrRequired([validatePartialOption], finalOptions.isRequired)
      : optionalOrRequired([validateFullOption], finalOptions.isRequired);
    let state = compose(...funcs)({
      value,
      options: finalOptions,
      error: {hasError: false, message: ''}
    }) as ComposedReturn<DropdownValidation>;
    return state.error;
  };
};

export default dropdownValidation;
