import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Client } from '../types';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
}

/**
 * ClientCard Component
 * Displays client information in a card format
 */
const ClientCard: React.FC<ClientCardProps> = ({ client, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10b981';
      case 'Expiring Soon':
        return '#f59e0b';
      case 'Expired':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const statusColor = getStatusColor(client.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{client.name}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{client.status}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>₹{client.amountPaid}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Payment:</Text>
        <Text style={styles.value}>{client.paymentMode}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Days Remaining:</Text>
        <Text style={[styles.value, { color: statusColor, fontWeight: 'bold' }]}>
          {client.daysRemaining > 0 ? client.daysRemaining : 'Expired'}
        </Text>
      </View>

      {client.phoneNumber && (
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{client.phoneNumber}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    letterSpacing: -0.3
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },
  label: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500'
  },
  value: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600'
  }
});

export default ClientCard;
