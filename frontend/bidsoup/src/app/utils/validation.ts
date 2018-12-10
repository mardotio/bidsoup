import { isNumber, isEmpty, isDefined } from '@utils/utils';
import { compose } from 'redux';
import { DropDownItem } from '@app/components/InputField';

export interface ErrorObject {
  hasError: boolean;
  message: string;
}

interface RequiredValidation {
  value: string;
  options: {
    isRequired: boolean;
  };
  prevError: ErrorObject;
}

interface NumberValidationOptions {
  isRequired: boolean;
  maxDecimals: number;
  maxDigits: number;
}

interface NumberValidation {
  value: string;
  options: NumberValidationOptions;
  prevError: ErrorObject;
}

interface TextValidationOptions {
  isRequired: boolean;
  maxLength: number;
}

interface TextValidation {
  value: string;
  options: TextValidationOptions;
  prevError: ErrorObject;
}

interface DropDownValidationOptions {
  isRequired: boolean;
  allowPartial: boolean;
  matchKey: boolean;
  list: DropDownItem[];
}

interface DropDownValidation {
  value: string;
  options: DropDownValidationOptions;
  prevError: ErrorObject;
}

const defaultNumberOptions: NumberValidationOptions = {
  isRequired: true,
  maxDecimals: 2,
  maxDigits: 8
};

const defaultTextOptions: TextValidationOptions = {
  isRequired: true,
  maxLength: 255
};

const defaultDropDownOptions: DropDownValidationOptions = {
  list: [],
  isRequired: true,
  allowPartial: false,
  matchKey: false
};

const defaultError = {
  hasError: false,
  message: ''
};

const createError = (message: string) => (
  {hasError: true, message}
);

const validateRequiredField = <T extends RequiredValidation>({value, options, prevError}: T) => {
  if (!isEmpty(value)) {
    return {value, options, prevError};
  } else if (options.isRequired) {
    return {value, options, prevError: createError('Field cannot be empty')};
  }
  return {value, options, prevError: defaultError};
};

const validateNumberType = ({value, options, prevError}: NumberValidation) => {
  if (prevError.hasError || isNumber(value)) {
    return {value, options, prevError};
  }
  return {value, options, prevError: createError('Field must be a number')};
};

const validateNumberDecimals = ({value, options, prevError}: NumberValidation) => {
  if (prevError.hasError) {
    return {value, options, prevError};
  }
  let decimals = value.split('.')[1];
  if (isDefined(decimals) && decimals.length > options.maxDecimals) {
    return {
      value,
      options,
      prevError: options.maxDecimals === 0
        ? createError('Number should be integer')
        : createError('Maximum precision')
    };
  }
  return {value, options, prevError};
};

const validateNumberLength = ({value, options, prevError}: NumberValidation) => {
  if (prevError.hasError) {
    return {value, options, prevError};
  }
  let maxLength = options.maxDigits - options.maxDecimals;
  let [whole] = value.split('.');
  if (whole.length > maxLength) {
    return {value, options, prevError: createError('Number cannot exceed length')};
  }
  return {value, options, prevError};
};

export const validateNumber = (value: string, options: Partial<NumberValidationOptions> = {}) => {
  let completeOptions = {...defaultNumberOptions, ...options};
  return compose(
    validateRequiredField,
    validateNumberLength,
    validateNumberDecimals,
    validateNumberType
  )({value, options: completeOptions, prevError: defaultError}).prevError;
};

const validateTextLength = ({value, options, prevError}: TextValidation) => {
  if (prevError.hasError || value.length <= options.maxLength) {
    return {value, options, prevError};
  }
  return {value, options, prevError: createError(`Length cannot exceed ${options.maxLength}`)};
};

export const validateText = (value: string, options: Partial<TextValidationOptions> = {}) => {
  let completeOptions = {...defaultTextOptions, ...options};
  return compose(
    validateRequiredField,
    validateTextLength
  )({value, options: completeOptions, prevError: defaultError}).prevError;
};

const validatePartialOption = ({value, options, prevError}: DropDownValidation) => {
  if (prevError.hasError || !options.allowPartial) {
    return {value, options, prevError};
  }
  let match = options.list.reduce(
    (result, opt) => (
      result || opt.name.toLowerCase().includes(value.toLowerCase())
    ),
    false
  );
  if (match) {
    return {value, options, prevError};
  }
  return {value, options, prevError: createError('Please select a valid option')};
};

const validateFullOption = ({value, options, prevError}: DropDownValidation) => {
  if (prevError.hasError || options.allowPartial) {
    return {value, options, prevError};
  }
  let match = options.list.reduce(
    (result, opt) => (
      result || opt.name.toLowerCase() === value.toLowerCase()
    ),
    false
  );
  if (match) {
    return {value, options, prevError};
  }
  return {value, options, prevError: createError('Please select a valid option')};
};

export const validateOption =
  (value: string, options: Partial<DropDownValidationOptions> = {}) => {
    let completeOptions = {...defaultDropDownOptions, ...options};
    return compose(
      validateRequiredField,
      validateFullOption,
      validatePartialOption
    )({value, options: completeOptions, prevError: defaultError}).prevError;
};
