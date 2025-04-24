import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(
          user.role === "farmer" ? "/farmer-dashboard" : "/buyer-dashboard"
        );
      } else {
        router.replace("/register");
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AgroChain</Text>
      <Text style={styles.subtitle}>
        Pakistan's Premier B2B Agriculture Marketplace
      </Text>

      <View style={styles.roleContainer}>
        <Text style={styles.roleTitle}>Select Your Role</Text>

        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push("/login?role=farmer")}
        >
          <Text style={styles.roleButtonText}>I'm a Farmer</Text>
          <Text style={styles.roleDescription}>
            List your crops and connect with buyers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push("/login?role=buyer")}
        >
          <Text style={styles.roleButtonText}>I'm a Buyer</Text>
          <Text style={styles.roleDescription}>
            Find quality crops directly from farmers
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Why Choose AgroChain?</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>
            • Direct farmer-buyer connection
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>• Fair market prices</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>• Secure transactions</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>• Quality assurance</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2E7D32",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
    color: "#666",
  },
  roleContainer: {
    width: "100%",
    marginBottom: 40,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  roleButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 5,
  },
  roleDescription: {
    fontSize: 14,
    color: "#666",
  },
  featuresContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2E7D32",
  },
  featureItem: {
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#666",
  },
});
