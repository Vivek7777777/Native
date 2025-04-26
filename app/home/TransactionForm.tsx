import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Transaction } from '@/services/api/transaction/service';
import SubmitButton from '@/components/custom/SubmitButton';
import Input from '@/components/custom/Input';
import { transactionSchema } from '@/services/yup';

interface TransactionFormProps {
  initialValues?: Partial<Transaction>;
  onSubmit: (data: Transaction) => void;
}

export default function TransactionForm({
  initialValues = {},
  onSubmit,
}: TransactionFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialValues.name || '',
      address: initialValues.address || '',
      amount: initialValues.amount || 0,
      date: initialValues.date || '',
      count: initialValues.count || 1,
      description: initialValues.description || '',
    },
    resolver: yupResolver(transactionSchema),
  });

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    Alert.alert('Success', 'Transaction saved successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Form</Text>

      {/* Name Field */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Name"
            placeholder="Enter name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />

      {/* Address Field */}
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Address"
            placeholder="Enter address"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.address?.message}
          />
        )}
      />

      {/* Amount Field */}
      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Amount"
            placeholder="Enter amount"
            value={value.toString()}
            onBlur={onBlur}
            onChangeText={(text) => onChange(Number(text))}
            keyboardType="numeric"
            error={errors.amount?.message}
          />
        )}
      />

      {/* Date Field */}
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Date"
            placeholder="Enter date (YYYY-MM-DD)"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.date?.message}
          />
        )}
      />

      {/* Count Field */}
      <Controller
        control={control}
        name="count"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Count"
            placeholder="Enter count"
            value={value.toString()}
            onBlur={onBlur}
            onChangeText={(text) => onChange(Number(text))}
            keyboardType="numeric"
            error={errors.count?.message}
          />
        )}
      />

      {/* Description Field */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Description"
            placeholder="Enter description (optional)"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />

      <SubmitButton
        isLoading={false}
        disabled={false}
        onPress={handleSubmit(handleFormSubmit)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
