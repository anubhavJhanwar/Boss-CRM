import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useClientStore } from '../../store/clientStore';

/**
 * AddClientScreen Component
 * Form to add a new client
 */
const AddClientScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { createClient, isLoading } = useClientStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    paymentMode: 'Cash' as 'Cash' | 'Online',
    amountPaid: '',
    subscriptionMonths: '',
    notes: ''
  });
  
  const [useManualDate, setUseManualDate] = useState(false);
  const [manualStartDate, setManualStartDate] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter client name');
      return;
    }
    if (!formData.amountPaid || parseFloat(formData.amountPaid) <= 0) {
      alert('Please enter valid amount');
      return;
    }
    if (!formData.subscriptionMonths || parseInt(formData.subscriptionMonths) <= 0) {
      alert('Please enter valid subscription months');
      return;
    }

    try {
      const clientData: any = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        paymentMode: formData.paymentMode,
        amountPaid: parseFloat(formData.amountPaid),
        subscriptionMonths: parseInt(formData.subscriptionMonths),
        notes: formData.notes.trim()
      };

      if (useManualDate && manualStartDate) {
        clientData.manualStartDate = manualStartDate;
      }

      await createClient(clientData);
      alert('Client added successfully');
      navigation.goBack();
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to add client'));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter client name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Payment Mode *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.paymentMode}
            onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
          >
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="Online" value="Online" />
          </Picker>
        </View>

        <Text style={styles.label}>Amount Paid *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={formData.amountPaid}
          onChangeText={(text) => setFormData({ ...formData, amountPaid: text })}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Subscription Months *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of months"
          value={formData.subscriptionMonths}
          onChangeText={(text) => setFormData({ ...formData, subscriptionMonths: text })}
          keyboardType="numeric"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Use Manual Start Date</Text>
          <Switch
            value={useManualDate}
            onValueChange={setUseManualDate}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={useManualDate ? '#3b82f6' : '#f3f4f6'}
          />
        </View>

        {useManualDate && (
          <>
            <Text style={styles.label}>Manual Start Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2024-01-01"
              value={manualStartDate}
              onChangeText={setManualStartDate}
            />
          </>
        )}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter any notes"
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Client</Text>
          )}
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
  form: {
    padding: 16
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    overflow: 'hidden'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12
  },
  button: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3
  }
});

export default AddClientScreen;
