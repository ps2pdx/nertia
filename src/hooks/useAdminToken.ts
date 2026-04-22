"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";

export function useAdminToken(): string | null {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    if (!user) {
      setToken(null);
      return;
    }
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setToken(null);
      return;
    }
    currentUser.getIdToken().then((t) => {
      if (live) setToken(t);
    });
    return () => {
      live = false;
    };
  }, [user]);

  return token;
}
