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

export default function HomeScreen() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [refreshing, setRefreshing] = React.useState(false);

  const cols: { key: keyof Transaction; label: string; width: number }[] = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'address', label: 'Address', width: 200 },
    { key: 'amount', label: 'Amount', width: 100 },
    { key: 'date', label: 'Date', width: 120 },
    { key: 'count', label: 'Count', width: 80 },
    { key: 'description', label: 'Description', width: 200 },
    { key: 'amount2', label: 'Amount 2', width: 100 },
  ];

  const {
    data: transaction,
    isLoading,
    isFetching,
    refetch: refetchTransaction,
  } = useGetTransactions(page, limit);
  const { mutate: uploadTransaction } = useUploadTransaction();

  const handleNextPage = () => {
    if (transaction?.hasNextPage) setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (transaction?.hasPreviousPage) setPage((prev) => prev - 1);
  };

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

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.row}>
      {cols.map((col) => (
        <Text
          key={col.key}
          style={[styles.cell, { width: col.width }]}
          numberOfLines={1}
        >
          {item[col.key]}
        </Text>
      ))}
    </View>
  );

  const handleLoadMore = () => {
    if (transaction?.hasNextPage && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonCell}>
      {cols.map((_, index) => (
        <View key={index} style={styles.skeletonCell} />
      ))}
    </View>
  );

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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Pressable onPress={upload} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Import</Text>
      </Pressable>

      <Text style={styles.title}>Transaction</Text>

      <ScrollView horizontal>
        <View>
          <View style={styles.tableHeader}>
            {cols.map((col) => (
              <Text
                key={col.key}
                style={[styles.headerCell, { width: col.width }]}
              >
                {col.label}
              </Text>
            ))}
          </View>

          {isLoading && page === 1 ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
              ))}
            </>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              onEndReachedThreshold={0.9}
              onEndReached={() => {
                if (transaction?.hasNextPage && !isFetching) {
                  setPage((prev) => prev + 1);
                }
              }}
              ListFooterComponent={
                isFetching ? (
                  <>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <React.Fragment key={index}>
                        {renderSkeleton()}
                      </React.Fragment>
                    ))}
                  </>
                ) : null
              }
              ListEmptyComponent={
                !isLoading && !isFetching ? (
                  <Text style={styles.emptyText}>No transactions found.</Text>
                ) : null
              }
              nestedScrollEnabled
            />
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  uploadButton: {
    padding: 10,
    backgroundColor: '#0a7ea4',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: 100,
    alignSelf: 'flex-end',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    backgroundColor: '#ddd',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
  },
  headerCell: {
    minWidth: 120,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
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
