import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useAuthStore } from '../../store/authStore';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuthStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user?.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Version:</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>App Type:</Text>
          <Text style={styles.value}>Single Admin CRM</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Subscription CRM</Text>
        <Text style={styles.footerSubtext}>Stock Broker Client Management</Text>
        <Text style={styles.footerHint}>💡 Use the menu (☰) to navigate</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  section: {
    backgroundColor: '#1e293b',
    padding: 24,
    marginTop: 12,
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
  infoRow: {
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
  footer: {
    padding: 24,
    alignItems: 'center',
    marginTop: 32
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
    letterSpacing: -0.3
  },
  footerSubtext: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500'
  },
  footerHint: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
    marginTop: 12,
    fontStyle: 'italic'
  }
});

export default SettingsScreen;
