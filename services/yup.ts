import * as yup from 'yup';

export const transactionSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: yup.string().required('Date is required'),
  count: yup
    .number()
    .typeError('Count must be a number')
    .positive('Count must be positive')
    .integer('Count must be an integer')
    .required('Count is required'),
  description: yup.string().optional(),
});
