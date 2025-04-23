import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getValidationMessage } from "../utils/validations";

interface Crop {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: "Available" | "Sold";
}

interface NewCrop {
  name: string;
  quantity: string;
  price: string;
}

// Mock data for crops
const initialCrops: Crop[] = [
  {
    id: "1",
    name: "Wheat",
    quantity: 1000,
    price: 3000,
    status: "Available",
  },
  {
    id: "2",
    name: "Rice",
    quantity: 500,
    price: 2500,
    status: "Available",
  },
  {
    id: "3",
    name: "Cotton",
    quantity: 200,
    price: 4000,
    status: "Sold",
  },
];

export default function FarmerDashboard() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>(initialCrops);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [newCrop, setNewCrop] = useState<Omit<Crop, "id" | "status">>({
    name: "",
    quantity: 0,
    price: 0,
  });
  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: getValidationMessage("cropName", newCrop.name),
      quantity: getValidationMessage("quantity", newCrop.quantity.toString()),
      price: getValidationMessage("price", newCrop.price.toString()),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleAddCrop = () => {
    if (!validateForm()) {
      return;
    }

    const crop: Crop = {
      id: Date.now().toString(),
      name: newCrop.name,
      quantity: newCrop.quantity,
      price: newCrop.price,
      status: "Available",
    };
    setCrops([...crops, crop]);
    setNewCrop({ name: "", quantity: 0, price: 0 });
    setIsModalVisible(false);
  };

  const handleEditCrop = () => {
    if (!editingCrop || !validateForm()) {
      return;
    }

    const updatedCrops = crops.map((crop) =>
      crop.id === editingCrop.id
        ? {
            ...crop,
            name: newCrop.name,
            quantity: newCrop.quantity,
            price: newCrop.price,
          }
        : crop
    );
    setCrops(updatedCrops);
    setEditingCrop(null);
    setNewCrop({ name: "", quantity: 0, price: 0 });
    setIsModalVisible(false);
  };

  const handleDeleteCrop = (id: string) => {
    Alert.alert("Delete Crop", "Are you sure you want to delete this crop?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setCrops(crops.filter((crop) => crop.id !== id)),
      },
    ]);
  };

  const openEditModal = (crop: Crop) => {
    setEditingCrop(crop);
    setNewCrop({
      name: crop.name,
      quantity: crop.quantity,
      price: crop.price,
    });
    setIsModalVisible(true);
  };

  const renderCropItem = ({ item }: { item: Crop }) => (
    <View style={styles.cropItem}>
      <View style={styles.cropInfo}>
        <Text style={styles.cropName}>{item.name}</Text>
        <Text>Quantity: {item.quantity} kg</Text>
        <Text>Price: ${item.price}/kg</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteCrop(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Farmer Dashboard</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingCrop(null);
            setNewCrop({ name: "", quantity: 0, price: 0 });
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>Add New Crop</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={crops}
        renderItem={renderCropItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCrop ? "Edit Crop" : "Add New Crop"}
            </Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Crop Name"
              value={newCrop.name}
              onChangeText={(text) => {
                setNewCrop({ ...newCrop, name: text });
                setErrors({
                  ...errors,
                  name: getValidationMessage("cropName", text),
                });
              }}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errors.quantity ? styles.inputError : null]}
              placeholder="Quantity (kg)"
              value={newCrop.quantity.toString()}
              onChangeText={(text) => {
                const quantity = parseFloat(text) || 0;
                setNewCrop({ ...newCrop, quantity });
                setErrors({
                  ...errors,
                  quantity: getValidationMessage("quantity", text),
                });
              }}
              keyboardType="numeric"
            />
            {errors.quantity ? (
              <Text style={styles.errorText}>{errors.quantity}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errors.price ? styles.inputError : null]}
              placeholder="Price ($/kg)"
              value={newCrop.price.toString()}
              onChangeText={(text) => {
                const price = parseFloat(text) || 0;
                setNewCrop({ ...newCrop, price });
                setErrors({
                  ...errors,
                  price: getValidationMessage("price", text),
                });
              }}
              keyboardType="numeric"
            />
            {errors.price ? (
              <Text style={styles.errorText}>{errors.price}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
              <Button
                title="Add"
                onPress={editingCrop ? handleEditCrop : handleAddCrop}
              />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    padding: 10,
  },
  cropItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
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
    marginTop: 5,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
