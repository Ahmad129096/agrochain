import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

interface Crop {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: "Available" | "Sold";
  farmerId: string;
}

interface Stats {
  totalCrops: number;
  availableCrops: number;
  soldCrops: number;
  totalRevenue: number;
}

export default function FarmerDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalCrops: 0,
    availableCrops: 0,
    soldCrops: 0,
    totalRevenue: 0,
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/crops", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCrops(data);

      // Calculate stats
      const totalCrops = data.length;
      const availableCrops = data.filter(
        (crop: Crop) => crop.status === "Available"
      ).length;
      const soldCrops = data.filter(
        (crop: Crop) => crop.status === "Sold"
      ).length;
      const totalRevenue = data
        .filter((crop: Crop) => crop.status === "Sold")
        .reduce(
          (sum: number, crop: Crop) => sum + crop.price * crop.quantity,
          0
        );

      setStats({
        totalCrops,
        availableCrops,
        soldCrops,
        totalRevenue,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch crops");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCrop.name,
          quantity: Number(newCrop.quantity),
          price: Number(newCrop.price),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add crop");
      }

      await fetchCrops();
      setIsAddModalVisible(false);
      setNewCrop({ name: "", quantity: "", price: "" });
    } catch (error) {
      Alert.alert("Error", "Failed to add crop");
    }
  };

  const renderCropItem = ({ item }: { item: Crop }) => (
    <View style={styles.cropItem}>
      <View style={styles.cropInfo}>
        <Text style={styles.cropName}>{item.name}</Text>
        <Text>Quantity: {item.quantity} kg</Text>
        <Text>Price: ${item.price}/kg</Text>
        <Text
          style={[
            styles.status,
            item.status === "Sold" ? styles.soldStatus : styles.availableStatus,
          ]}
        >
          Status: {item.status}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Farmer Dashboard</Text>
        <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCrops}</Text>
          <Text style={styles.statLabel}>Total Crops</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.availableCrops}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.soldCrops}</Text>
          <Text style={styles.statLabel}>Sold</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${stats.totalRevenue}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add New Crop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={crops}
        renderItem={renderCropItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Crop</Text>
            <TextInput
              style={styles.input}
              placeholder="Crop Name"
              value={newCrop.name}
              onChangeText={(text) => setNewCrop({ ...newCrop, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity (kg)"
              value={newCrop.quantity}
              onChangeText={(text) =>
                setNewCrop({ ...newCrop, quantity: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Price per kg ($)"
              value={newCrop.price}
              onChangeText={(text) => setNewCrop({ ...newCrop, price: text })}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddCrop}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    gap: 15,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  settingsButton: {
    backgroundColor: "#666",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  settingsButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  cropItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2E7D32",
  },
  status: {
    marginTop: 5,
    fontWeight: "bold",
  },
  availableStatus: {
    color: "#2E7D32",
  },
  soldStatus: {
    color: "#f44336",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2E7D32",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  saveButton: {
    backgroundColor: "#2E7D32",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
