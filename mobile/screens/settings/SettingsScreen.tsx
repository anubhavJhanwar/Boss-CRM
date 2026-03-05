import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    // Confirmation dialog
    const confirmed = Platform.OS === 'web' 
      ? window.confirm(
          'Are you sure you want to delete your account permanently?\n\n' +
          'This will delete:\n' +
          '• Your account\n' +
          '• All your clients\n' +
          '• All your data\n\n' +
          'This action cannot be undone!'
        )
      : true; // For mobile, you'd use Alert.alert

    if (!confirmed) return;

    // Second confirmation
    const doubleConfirmed = Platform.OS === 'web'
      ? window.confirm('Are you ABSOLUTELY sure? This cannot be undone!')
      : true;

    if (!doubleConfirmed) return;

    try {
      setIsDeleting(true);

      // Call delete account API
      const response = await api.delete('/auth/delete-account');

      if (response.data.success) {
        // Show success message
        if (Platform.OS === 'web') {
          alert('Account deleted successfully');
        }

        // Logout and redirect to login
        await logout();
      }
    } catch (error: any) {
      console.error('Delete account error:', error);
      const message = error.response?.data?.message || 'Failed to delete account';
      
      if (Platform.OS === 'web') {
        alert(message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

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
          <Text style={styles.value}>2.0.0</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Database:</Text>
          <Text style={styles.value}>Firebase Firestore</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>App Type:</Text>
          <Text style={styles.value}>Single Admin CRM</Text>
        </View>
      </View>

      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>⚠️ Danger Zone</Text>
        
        <TouchableOpacity
          style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? 'Deleting...' : '🗑️ Delete Account Permanently'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.dangerWarning}>
          This will permanently delete your account, all clients, and all data. This action cannot be undone.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Boss Tracker</Text>
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
  dangerSection: {
    backgroundColor: '#1e293b',
    padding: 24,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ef4444'
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 16,
    letterSpacing: -0.3
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  deleteButtonDisabled: {
    backgroundColor: '#7f1d1d',
    opacity: 0.6
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  dangerWarning: {
    fontSize: 12,
    color: '#fca5a5',
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center'
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32
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
