import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import PaymentModal from "../components/PaymentModal";

interface Crop {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  farmer: {
    _id: string;
    name: string;
  };
  status: string;
}

interface Stats {
  totalPurchases: number;
  totalSpent: number;
  favoriteCrop: string;
  activeOrders: number;
}

export default function BuyerDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalPurchases: 0,
    totalSpent: 0,
    favoriteCrop: "None",
    activeOrders: 0,
  });
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/crops");
      if (!response.ok) {
        throw new Error("Failed to fetch crops");
      }
      const data = await response.json();
      // Filter out crops owned by the current user
      const otherFarmersCrops = data.filter(
        (crop: Crop) => crop.farmer._id !== user?.id
      );
      setCrops(otherFarmersCrops);

      // Calculate stats (mock data for now)
      setStats({
        totalPurchases: 5,
        totalSpent: 1250,
        favoriteCrop: "Wheat",
        activeOrders: 2,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      Alert.alert("Error", "Failed to fetch crops");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (crop: Crop) => {
    setSelectedCrop(crop);
    setIsPaymentModalVisible(true);
  };

  const handlePaymentSuccess = async () => {
    if (selectedCrop) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/crops/${selectedCrop._id}/purchase`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to purchase crop");
        }

        // Update the crop status in the local state
        setCrops((prevCrops) =>
          prevCrops.map((crop) =>
            crop._id === selectedCrop._id ? { ...crop, status: "Sold" } : crop
          )
        );

        Alert.alert("Success", "Crop purchased successfully!");
      } catch (error) {
        Alert.alert("Error", "Failed to purchase crop");
      } finally {
        setSelectedCrop(null);
        setIsPaymentModalVisible(false);
      }
    }
  };

  const renderCropItem = ({ item }: { item: Crop }) => (
    <View style={styles.cropItem}>
      <View style={styles.cropInfo}>
        <Text style={styles.cropName}>{item.name}</Text>
        <Text>Quantity: {item.quantity} kg</Text>
        <Text>Price: ${item.price}/kg</Text>
        <Text>Farmer: {item.farmer.name}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Sold" ? styles.soldStatus : styles.availableStatus,
          ]}
        >
          Status: {item.status}
        </Text>
      </View>
      {item.status !== "Sold" && (
        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => handlePurchase(item)}
        >
          <Text style={styles.purchaseButtonText}>Purchase</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCrops}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buyer Dashboard</Text>
        <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPurchases}</Text>
          <Text style={styles.statLabel}>Total Purchases</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${stats.totalSpent}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.favoriteCrop}</Text>
          <Text style={styles.statLabel}>Favorite Crop</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeOrders}</Text>
          <Text style={styles.statLabel}>Active Orders</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
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
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />

      <PaymentModal
        visible={isPaymentModalVisible}
        onClose={() => {
          setSelectedCrop(null);
          setIsPaymentModalVisible(false);
        }}
        onSuccess={handlePaymentSuccess}
        crop={selectedCrop}
      />
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
    padding: 10,
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
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
    padding: 10,
  },
  settingsButton: {
    backgroundColor: "#666",
    padding: 12,
    borderRadius: 5,
  },
  settingsButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  cropItem: {
    backgroundColor: "#fff",
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
  purchaseButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  purchaseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
