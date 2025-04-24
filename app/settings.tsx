import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { user, logout, switchRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSwitchRole = async () => {
    setLoading(true);
    try {
      await switchRole();
      Alert.alert("Success", "Role switched successfully!");
      // Navigate to the appropriate dashboard based on new role
      if (user?.role === "farmer") {
        router.replace("/buyer-dashboard");
      } else {
        router.replace("/farmer-dashboard");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to switch role");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <Text style={styles.info}>Name: {user?.name}</Text>
        <Text style={styles.info}>Email: {user?.email}</Text>
        <Text style={styles.info}>Current Role: {user?.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSwitchRole}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Switching..."
              : `Switch to ${user?.role === "farmer" ? "Buyer" : "Farmer"}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
