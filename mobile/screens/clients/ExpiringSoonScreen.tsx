import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

interface ExpiringClient {
  id: string;
  clientName: string;
  phoneNumber: string;
  expiryDate: string;
  daysLeft: number;
  amountPaid: number;
  status: string;
}

const ExpiringSoonScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [clients, setClients] = useState<ExpiringClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadClients();
    }, [])
  );

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients/expiring-soon');
      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (error) {
      console.error('Error loading expiring clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  const getDaysColor = (daysLeft: number) => {
    if (daysLeft <= 3) return '#ef4444'; // Red
    if (daysLeft <= 5) return '#f59e0b'; // Orange
    return '#eab308'; // Yellow
  };

  const renderClient = ({ item }: { item: ExpiringClient }) => (
    <TouchableOpacity
      style={styles.clientCard}
      onPress={() => navigation.navigate('ClientDetails', { clientId: item.id })}
    >
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        {item.phoneNumber && (
          <Text style={styles.clientPhone}>📞 {item.phoneNumber}</Text>
        )}
        <Text style={styles.clientAmount}>₹{item.amountPaid}</Text>
        <Text style={styles.expiryDate}>
          Expires: {new Date(item.expiryDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={[styles.daysBadge, { backgroundColor: getDaysColor(item.daysLeft) }]}>
        <Text style={styles.daysNumber}>{item.daysLeft}</Text>
        <Text style={styles.daysLabel}>{item.daysLeft === 1 ? 'day' : 'days'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Loading expiring clients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚠️ Expiring Soon</Text>
        <Text style={styles.headerSubtitle}>Next 7 days</Text>
      </View>

      {clients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyTitle}>All Good!</Text>
          <Text style={styles.emptyText}>
            No plans expiring in the next 7 days
          </Text>
        </View>
      ) : (
        <FlatList
          data={clients}
          renderItem={renderClient}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500'
  },
  header: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f59e0b',
    marginBottom: 4,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  listContainer: {
    padding: 16
  },
  clientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  clientInfo: {
    flex: 1,
    marginRight: 16
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.3
  },
  clientPhone: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4
  },
  clientAmount: {
    fontSize: 15,
    color: '#10b981',
    fontWeight: '700',
    marginBottom: 4
  },
  expiryDate: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500'
  },
  daysBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 70
  },
  daysNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 32
  },
  daysLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.3
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20
  }
});

export default ExpiringSoonScreen;
