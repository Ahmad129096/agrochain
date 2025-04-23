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
import { getValidationMessage } from "../utils/validations";

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: getValidationMessage("name", name),
      email: getValidationMessage("email", email),
      password: getValidationMessage("password", password),
      confirmPassword:
        password !== confirmPassword ? "Passwords do not match" : "",
      location: getValidationMessage("location", location),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleRegister = () => {
    if (!validateForm()) {
      return;
    }

    // TODO: Connect to backend for registration
    // For now, we'll simulate a successful registration
    if (role === "farmer") {
      router.push("/farmer-dashboard");
    } else if (role === "buyer") {
      router.push("/buyer-dashboard");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Register as {role === "farmer" ? "Farmer" : "Buyer"}
      </Text>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors({ ...errors, name: getValidationMessage("name", text) });
          }}
          style={[styles.input, errors.name ? styles.inputError : null]}
        />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}

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
          placeholder="Location"
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            setErrors({
              ...errors,
              location: getValidationMessage("location", text),
            });
          }}
          style={[styles.input, errors.location ? styles.inputError : null]}
        />
        {errors.location ? (
          <Text style={styles.errorText}>{errors.location}</Text>
        ) : null}

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({
              ...errors,
              password: getValidationMessage("password", text),
              confirmPassword:
                text !== confirmPassword ? "Passwords do not match" : "",
            });
          }}
          style={[styles.input, errors.password ? styles.inputError : null]}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors({
              ...errors,
              confirmPassword:
                text !== password ? "Passwords do not match" : "",
            });
          }}
          style={[
            styles.input,
            errors.confirmPassword ? styles.inputError : null,
          ]}
        />
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push(`/login?role=${role}`)}
        >
          <Text style={styles.loginText}>
            Already have an account? Login as {role}
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
  registerButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#2E7D32",
    fontSize: 14,
  },
});
