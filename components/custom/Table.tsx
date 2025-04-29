import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  headerStyle?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  keyExtractor?: (item: T, index: number) => string;
  skeletonNumber?: number;
  horizontalScrollEnabled?: boolean;
  onEndReached?: () => void;
  hasNextPage?: boolean;
}

const Table = <T extends object>({
  columns,
  rows,
  isLoading = false,
  headerStyle = {},
  cellStyle = {},
  containerStyle = {},
  keyExtractor = (_, index) => index.toString(),
  skeletonNumber = 10,
  horizontalScrollEnabled = true,
  onEndReached = () => {},
  hasNextPage = true,
}: DataTableProps<T>) => {
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  const SkeletonLoader = () => (
    <>
      {Array.from({ length: skeletonNumber }).map((_, idx) => (
        <View key={idx} style={styles.dataRow}>
          {columns.map((col, index) => (
            <View
              key={index}
              style={[styles.dataCell, { width: col.width }, cellStyle]}
            >
              <View style={styles.skeletonBox} />
            </View>
          ))}
        </View>
      ))}
    </>
  );

  return (
    <ScrollView style={[styles.container, containerStyle]} horizontal>
      <FlatList
        data={rows}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
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
        }
        renderItem={({ item }) => (
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
                    {String(item[col.key as keyof typeof item])}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={[styles.emptyContainer, { width: totalWidth }]}>
              <Text style={styles.emptyText}>No data available</Text>
            </View>
          )
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={hasNextPage ? <SkeletonLoader /> : null}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </ScrollView>
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
  skeletonBox: {
    height: 14,
    backgroundColor: '#ddd',
    borderRadius: 4,
    width: '100%',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default Table;
