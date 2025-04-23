import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import PaymentModal from "../components/PaymentModal";

interface Crop {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: "Available" | "Sold";
}

// Mock data for available crops
const availableCrops: Crop[] = [
  {
    id: "1",
    name: "Wheat",
    quantity: 100,
    price: 50,
    status: "Available",
  },
  {
    id: "2",
    name: "Rice",
    quantity: 200,
    price: 30,
    status: "Available",
  },
  {
    id: "3",
    name: "Cotton",
    quantity: 150,
    price: 40,
    status: "Available",
  },
];

export default function BuyerDashboard() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>(availableCrops);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePurchase = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedCrop) {
      const updatedCrops = crops.map((crop) =>
        crop.id === selectedCrop.id
          ? { ...crop, status: "Sold" as const }
          : crop
      );
      setCrops(updatedCrops);
      Alert.alert(
        "Purchase Successful",
        `You have successfully purchased ${selectedCrop.name}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buyer Dashboard</Text>

      <FlatList
        data={crops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cropItem}>
            <View style={styles.cropInfo}>
              <Text style={styles.cropName}>{item.name}</Text>
              <Text>Quantity: {item.quantity} kg</Text>
              <Text>Price: ${item.price}/kg</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
            </View>
            {item.status === "Available" && (
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={() => handlePurchase(item)}
              >
                <Text style={styles.purchaseButtonText}>Purchase</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedCrop ? selectedCrop.price * selectedCrop.quantity : 0}
        onSuccess={handlePaymentSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2E7D32",
  },
  cropItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  status: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  purchaseButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
  },
  purchaseButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
