import React from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocalSearchParams } from 'expo-router';
import SubmitButton from '@/components/custom/SubmitButton';
import Input from '@/components/custom/Input';
import { transactionSchema } from '@/services/yup';
import { Transaction } from '@/services/api/transaction/service';
import { useUpdateTransaction } from '@/services/api/transaction/hooks';

export default function TransactionForm() {
  const params = useLocalSearchParams() as
    | (Partial<Transaction> & { _id?: string })
    | undefined
    | null;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: params?.name || '',
      address: params?.address || '',
      amount: params?.amount ? Number(params.amount) : 0,
      date: params?.date || '',
      count: params?.count ? Number(params.count) : 1,
      description: params?.description || '',
    },
    resolver: yupResolver(transactionSchema),
  });

  const { mutateAsync: updateTransaction, isPending } = useUpdateTransaction();

  const handleFormSubmit = async (data: Partial<Transaction>) => {
    try {
      console.log({
        id: params?._id!,
        transaction: data,
      });

      const transaction = await updateTransaction({
        id: params?._id!,
        transaction: data,
      });
      console.log('transaction', transaction);

      Alert.alert('Success', 'save transaction!');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to save transaction!');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
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
              multiline
            />
          )}
        />

        <SubmitButton
          isLoading={false}
          disabled={false}
          onPress={handleSubmit(handleFormSubmit)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
