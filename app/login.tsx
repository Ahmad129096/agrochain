import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { validateEmail, getValidationMessage } from "../utils/validations";

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: getValidationMessage("email", email),
      password: password ? "" : "Password is required",
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    // TODO: Connect to backend for authentication
    // For now, we'll simulate a successful login
    if (role === "farmer") {
      router.push("/farmer-dashboard");
    } else if (role === "buyer") {
      router.push("/buyer-dashboard");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {role === "farmer" ? "Farmer Login" : "Buyer Login"}
      </Text>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({
              ...errors,
              email: getValidationMessage("email", text),
            });
          }}
          style={[styles.input, errors.email ? styles.inputError : null]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({
              ...errors,
              password: text ? "" : "Password is required",
            });
          }}
          style={[styles.input, errors.password ? styles.inputError : null]}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push(`/register?role=${role}`)}
        >
          <Text style={styles.registerText}>
            Don't have an account? Register as {role}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#2E7D32",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 5,
    borderRadius: 5,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#2E7D32",
    fontSize: 14,
  },
});
