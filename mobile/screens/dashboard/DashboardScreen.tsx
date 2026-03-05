import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useClientStore } from '../../store/clientStore';
import { useAuthStore } from '../../store/authStore';
import StatCard from '../../components/StatCard';
import { useFocusEffect } from '@react-navigation/native';

/**
 * DashboardScreen Component
 * Main dashboard showing key statistics and navigation
 */
const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { dashboardStats, fetchDashboardStats, isLoading } = useClientStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  // Refresh stats when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    await fetchDashboardStats();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  if (isLoading && !dashboardStats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Boss Tracker</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Active Clients"
          value={dashboardStats?.activeClients || 0}
          color="#10b981"
        />
        <StatCard
          title="Expired Clients"
          value={dashboardStats?.expiredClients || 0}
          color="#ef4444"
        />
        <StatCard
          title="Revenue This Month"
          value={`₹${dashboardStats?.revenueThisMonth || 0}`}
          color="#3b82f6"
        />
        <StatCard
          title="Expiring in 7 Days"
          value={dashboardStats?.expiringClients || 0}
          color="#f59e0b"
        />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ClientsList')}
        >
          <Text style={styles.actionButtonText}>📋 View All Clients</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => navigation.navigate('AddClient')}
        >
          <Text style={styles.actionButtonText}>➕ Add New Client</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.5
  },
  date: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500'
  },
  statsContainer: {
    padding: 20
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  actionButtonSecondary: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3
  }
});

export default DashboardScreen;
