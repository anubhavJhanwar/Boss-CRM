import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useClientStore } from '../../store/clientStore';

const ClientDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { clientId } = route.params;
  const { selectedClient, fetchClientById, deleteClient, isLoading } = useClientStore();

  useEffect(() => {
    loadClient();
  }, [clientId]);

  const loadClient = async () => {
    await fetchClientById(clientId);
  };

  const handleEdit = () => {
    navigation.navigate('EditClient', { clientId });
  };

  const handleDelete = () => {
    // Web-compatible confirmation
    const confirmed = window.confirm('Are you sure you want to delete this client?');
    
    if (confirmed) {
      deleteClientAction();
    }
  };

  const deleteClientAction = async () => {
    try {
      await deleteClient(clientId);
      alert('Client deleted successfully');
      navigation.navigate('ClientsList');
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to delete client'));
    }
  };

  if (isLoading || !selectedClient) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Expiring Soon': return '#f59e0b';
      case 'Expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{selectedClient.name}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(selectedClient.status) }]}>
          <Text style={styles.badgeText}>{selectedClient.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription Details</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.value}>₹{selectedClient.amountPaid}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Mode:</Text>
          <Text style={styles.value}>{selectedClient.paymentMode}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subscription Months:</Text>
          <Text style={styles.value}>{selectedClient.subscriptionMonths}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {new Date(selectedClient.startDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.value}>
            {new Date(selectedClient.endDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Days Remaining:</Text>
          <Text style={[styles.value, { color: getStatusColor(selectedClient.status), fontWeight: 'bold' }]}>
            {selectedClient.daysRemaining > 0 ? selectedClient.daysRemaining : 'Expired'}
          </Text>
        </View>
      </View>

      {selectedClient.phoneNumber && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{selectedClient.phoneNumber}</Text>
          </View>
        </View>
      )}

      {selectedClient.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{selectedClient.notes}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit Client</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Client</Text>
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
    backgroundColor: '#1e293b',
    padding: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center'
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: -0.5
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  section: {
    backgroundColor: '#1e293b',
    padding: 24,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    letterSpacing: -0.3
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500'
  },
  value: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600'
  },
  notes: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22
  },
  actions: {
    padding: 16,
    marginTop: 16
  },
  editButton: {
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
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3
  }
});

export default ClientDetailsScreen;
