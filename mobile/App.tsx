import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useAuthStore } from './store/authStore';

// Screens
import LoginScreen from './screens/auth/LoginScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import ClientsListScreen from './screens/clients/ClientsListScreen';
import AddClientScreen from './screens/clients/AddClientScreen';
import EditClientScreen from './screens/clients/EditClientScreen';
import ClientDetailsScreen from './screens/clients/ClientDetailsScreen';
import SettingsScreen from './screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator();

// Custom Menu Button Component
function MenuButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuButton}>
      <View style={styles.menuIcon}>
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </View>
    </TouchableOpacity>
  );
}

// Custom Drawer Modal
function DrawerMenu({ visible, onClose, navigation }: any) {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: 'Dashboard', screen: 'Dashboard', icon: '📊' },
    { name: 'Clients', screen: 'ClientsList', icon: '👥' },
    { name: 'Add Client', screen: 'AddClient', icon: '➕' },
    { name: 'Settings', screen: 'Settings', icon: '⚙️' },
  ];

  const handleNavigate = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.drawerContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView>
            <View style={styles.drawerHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
              </View>
              <Text style={styles.drawerUserName}>{user?.name}</Text>
              <Text style={styles.drawerUserEmail}>{user?.email}</Text>
            </View>

            <View style={styles.drawerMenu}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.screen}
                  style={styles.drawerItem}
                  onPress={() => handleNavigate(item.screen)}
                >
                  <Text style={styles.drawerIcon}>{item.icon}</Text>
                  <Text style={styles.drawerItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.drawerFooter}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutIcon}>🚪</Text>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export default function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [menuVisible, setMenuVisible] = useState(false);
  const [navigationRef, setNavigationRef] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer ref={setNavigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#1e293b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#0f172a' },
            headerLeft: isAuthenticated ? () => (
              <MenuButton onPress={() => setMenuVisible(true)} />
            ) : undefined,
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Dashboard' }}
              />
              <Stack.Screen
                name="ClientsList"
                component={ClientsListScreen}
                options={{ title: 'Clients' }}
              />
              <Stack.Screen
                name="AddClient"
                component={AddClientScreen}
                options={{ title: 'Add Client' }}
              />
              <Stack.Screen
                name="EditClient"
                component={EditClientScreen}
                options={{ title: 'Edit Client' }}
              />
              <Stack.Screen
                name="ClientDetails"
                component={ClientDetailsScreen}
                options={{ title: 'Client Details' }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
              />
            </>
          )}
        </Stack.Navigator>
        {isAuthenticated && navigationRef && (
          <DrawerMenu
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            navigation={navigationRef}
          />
        )}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuIcon: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  drawerHeader: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  drawerUserName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  drawerUserEmail: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  drawerMenu: {
    paddingVertical: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  drawerIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    letterSpacing: -0.2,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
