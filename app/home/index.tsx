import React, { useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  useGetTransactions,
  useUploadTransaction,
} from '@/services/api/transaction/hooks';
import * as DocumentPicker from 'expo-document-picker';
import { Transaction } from '@/services/api/transaction/service';
import { apiClient } from '@/services/api';
import Table from '@/components/custom/Table';
import Entypo from '@expo/vector-icons/Entypo';
import { AntDesign } from '@expo/vector-icons';
import { useConfirmationAlert } from '@/hooks/useConfirmationAlert';
import AddButton from '@/components/custom/AddButton';
import { useRouter } from 'expo-router';

// const sampleTransactions: Transaction[] = [
//   {
//     name: 'Delta Airlines',
//     address: '1030 Delta Blvd, Atlanta, GA',
//     amount: 350.0,
//     date: '2023-05-06',
//     count: 1,
//     description: 'Flight to Miami lorem ipsum dolor sit amet lorem ipsum dolor',
//     amount2: 350.0,
//   },
//   {
//     name: 'Delta Airlines',
//     address: '1030 Delta Blvd, Atlanta, GA',
//     amount: 350.0,
//     date: '2023-05-06',
//     count: 1,
//     description: 'Flight to Miami lorem ipsum dolor sit amet lorem ipsum dolor',
//     amount2: 350.0,
//   },
// ];

export default function HomeScreen() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [page, setPage] = React.useState(1);
  const limit = 50;
  const [refreshing, setRefreshing] = React.useState(false);

  const router = useRouter();
  const { confirmationAlert } = useConfirmationAlert();

  const {
    data: transaction,
    isLoading,
    isFetching,
    error,
    refetch: refetchTransaction,
  } = useGetTransactions(page, limit);
  const { mutate: uploadTransaction } = useUploadTransaction();

  const upload = async () => {
    try {
      // Open the file picker
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: true,
      });

      console.log('Selected file:', result);

      if (result.assets?.[0]) {
        // const res = await uploadTransaction({ file: result.assets[0] });

        const file = result.assets[0];

        if (!file.uri) throw new Error('No file selected');

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name || 'import.csv',
          type: file.mimeType || 'text/csv',
        } as any);

        const res = await apiClient.post('/transaction/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload result:', res);
      }
      Alert.alert('Success', 'File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading transaction:', error);
      Alert.alert('Error', 'Failed to upload the file.');
    }
  };

  const handleEdit = (item: Transaction) => {
    router.push({
      pathname: '/home/TransactionForm',
      params: {
        name: item.name,
        address: item.address,
        amount: item.amount,
        date: item.date,
        count: item.count,
        description: item.description,
      },
    });
  };

  const handleDelete = (name: string) => {
    confirmationAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this transaction?',
      confirmText: 'Delete',
      onConfirm: () => {
        console.log('Deleting transaction with ID:', name);
      },
    });
  };

  const cols: Column<Transaction>[] = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'address', label: 'Address', width: 200 },
    { key: 'amount', label: 'Amount', width: 100 },
    { key: 'date', label: 'Date', width: 120 },
    { key: 'count', label: 'Count', width: 80 },
    { key: 'description', label: 'Description', width: 200 },
    { key: 'amount2', label: 'Amount 2', width: 100 },
    {
      key: 'action',
      label: 'Action',
      width: 100,
      renderCell: (item) => (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={[styles.actionButton]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Entypo name="edit" size={24} color="green" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.name)}
            style={[styles.actionButton]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AntDesign name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  const handleLoadMore = () => {
    if (transaction?.hasNextPage && !isFetching) {
      setPage(page + 1);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setTransactions([]);
    refetchTransaction().then(() => {
      setRefreshing(false);
    });
  }, []);

  React.useEffect(() => {
    if (transaction) {
      setTransactions((prev) => {
        const newTransactions = transaction.docs || [];
        return page === 1 ? newTransactions : [...prev, ...newTransactions];
      });
    }
  }, [transaction]);

  console.log('page', page, limit, isLoading, error);

  return (
    <>
      <Pressable onPress={upload} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Import</Text>
      </Pressable>

      <Table
        rows={transactions}
        columns={cols}
        isLoading={isLoading}
        skeletonNumber={10}
        onEndReached={handleLoadMore}
        horizontalScrollEnabled={false}
        hasNextPage={transaction?.hasNextPage}
      />
      <AddButton onPress={() => router.push('/home/TransactionForm')} />
    </>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
  },
  uploadButton: {
    padding: 10,
    backgroundColor: '#0a7ea4',
    borderRadius: 25,
    alignItems: 'center',
    margin: 10,
    width: 100,
    alignSelf: 'flex-end',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    margin: 20,
  },
  headerCell: {
    minWidth: 120,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    minWidth: 120,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  skeletonCell: {
    minWidth: 120,
    height: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
