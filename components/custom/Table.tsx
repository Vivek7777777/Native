import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  headerStyle?: object;
  cellStyle?: object;
  containerStyle?: object;
  keyExtractor?: (item: T, index: number) => string;
}

const Table = <T extends object>({
  columns,
  rows,
  headerStyle = {},
  cellStyle = {},
  containerStyle = {},
  keyExtractor = (_, index) => index.toString(),
}: DataTableProps<T>) => {
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  const renderRow = ({ item }: { item: T }) => (
    <View style={styles.dataRow}>
      {columns.map((col) => (
        <View
          key={String(col.key)}
          style={[styles.dataCell, { width: col.width }, cellStyle]}
        >
          {col.renderCell ? (
            col.renderCell(item)
          ) : (
            <Text style={styles.cellText} numberOfLines={1}>
              {String(item[col.key])}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ width: totalWidth }}
      >
        <View>
          <View style={[styles.headerRow, headerStyle]}>
            {columns.map((col) => (
              <View
                key={String(col.key)}
                style={[styles.headerCell, { width: col.width }]}
              >
                <Text style={styles.headerText}>{col.label}</Text>
              </View>
            ))}
          </View>
          <FlatList
            data={rows}
            renderItem={renderRow}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              <View style={[styles.emptyContainer, { width: totalWidth }]}>
                <Text style={styles.emptyText}>No data available</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dataCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Table;
