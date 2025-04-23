import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
}

export default function PaymentModal({
  visible,
  onClose,
  amount,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const validateInputs = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      Alert.alert("Validation Error", "Please fill in all payment details", [
        { text: "OK" },
      ]);
      return false;
    }

    if (cardNumber.replace(/\s/g, "").length < 16) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid 16-digit card number",
        [{ text: "OK" }]
      );
      return false;
    }

    if (expiryDate.length < 5) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid expiry date (MM/YY)",
        [{ text: "OK" }]
      );
      return false;
    }

    if (cvv.length < 3) {
      Alert.alert("Validation Error", "Please enter a valid CVV (3-4 digits)", [
        { text: "OK" },
      ]);
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    console.log("=====================> in this value");

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Payment Successful",
        `Your payment of $${amount.toFixed(
          2
        )} has been processed successfully.`,
        [
          {
            text: "OK",
            onPress: () => {
              setLoading(false);
              // Reset form
              setCardNumber("");
              setExpiryDate("");
              setCvv("");
              onSuccess();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Payment Failed",
        "There was an error processing your payment. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Complete Payment</Text>

          <View style={styles.paymentDetails}>
            <Text style={styles.amountLabel}>Total Amount:</Text>
            <Text style={styles.amount}>${amount.toFixed(2)}</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
              placeholderTextColor="#666"
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="numeric"
                maxLength={5}
                placeholderTextColor="#666"
              />

              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.payButton,
                loading && styles.disabledButton,
              ]}
              onPress={handlePayment}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Processing..." : "Pay Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2E7D32",
    textAlign: "center",
  },
  paymentDetails: {
    marginBottom: 20,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    minWidth: 120,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  payButton: {
    backgroundColor: "#2E7D32",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
