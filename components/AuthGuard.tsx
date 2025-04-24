import React, { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "register" || segments[0] === "login";

    if (!user && !inAuthGroup) {
      // Redirect to the register page if not authenticated
      router.replace("/register");
    } else if (user && inAuthGroup) {
      // Redirect to the appropriate dashboard if authenticated
      router.replace(
        user.role === "farmer" ? "/farmer-dashboard" : "/buyer-dashboard"
      );
    }
  }, [user, loading, segments]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
