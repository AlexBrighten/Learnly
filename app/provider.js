"use client";

import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import axios from "axios";

function Provider({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      CheckIsNewUser();
      // Set auth cookie for middleware
      user.getIdToken().then((token) => {
        document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;
      });
    } else if (!loading) {
      // Clear the cookie when signed out
      document.cookie = "firebase-auth-token=; path=/; max-age=0";
    }
  }, [user, loading]);

  const CheckIsNewUser = async () => {
    try {
      const resp = await axios.post("/api/create-user", {
        user: {
          uid: user.uid,
          fullName: user.displayName || "User",
          email: user.email,
        },
      });
      console.log(resp.data);
    } catch (error) {
      console.error("Error checking/creating user:", error);
    }
  };

  return <div>{children}</div>;
}

export default Provider;
