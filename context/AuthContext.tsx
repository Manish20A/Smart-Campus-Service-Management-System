"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { dataStore } from "@/lib/data/store";
import { SEED_USERS } from "@/lib/data/seedData";

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: {
    email: string;
    pass: string;
    displayName: string;
    rollNumber: string;
    departmentId: string;
    year: string;
    phone: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user session
  useEffect(() => {
    // 1. Check if mock/demo session is stored
    const storedUid = typeof window !== "undefined" ? localStorage.getItem("campusdesk_current_uid") : null;
    if (storedUid) {
      const existing = dataStore.getUserById(storedUid);
      if (existing) {
        setUser(existing);
      } else {
        // default to student demo
        setUser(SEED_USERS[3]);
      }
    } else {
      // default demo student
      setUser(SEED_USERS[3]);
      if (typeof window !== "undefined") {
        localStorage.setItem("campusdesk_current_uid", SEED_USERS[3].uid);
      }
    }

    // 2. Listen to Firebase Auth if active
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const profile = dataStore.getUserById(fbUser.uid);
          if (profile) {
            setUser(profile);
          }
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      let loggedIn = false;
      if (isFirebaseConfigured && auth) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, pass);
          const profile = dataStore.getUserById(cred.user.uid);
          if (profile) {
            setUser(profile);
            if (typeof window !== "undefined") {
              localStorage.setItem("campusdesk_current_uid", profile.uid);
            }
            loggedIn = true;
          }
        } catch (firebaseErr: any) {
          console.warn("Live Firebase auth returned an error, falling back to local demo profile:", firebaseErr);
        }
      }

      if (!loggedIn) {
        // Demo matching
        const found = dataStore.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          setUser(found);
          if (typeof window !== "undefined") {
            localStorage.setItem("campusdesk_current_uid", found.uid);
          }
        } else {
          // create student session for any custom entered email
          const newStudent: UserProfile = {
            uid: `user-${Date.now()}`,
            email,
            displayName: email.split("@")[0] || "Student User",
            role: "student",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailNotifications: {
              onRequestCreated: true,
              onStatusChanged: true,
              onCommentAdded: true,
              onEscalated: true,
              onCompleted: true,
            },
          };
          dataStore.createUser(newStudent);
          setUser(newStudent);
          if (typeof window !== "undefined") {
            localStorage.setItem("campusdesk_current_uid", newStudent.uid);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    pass: string;
    displayName: string;
    rollNumber: string;
    departmentId: string;
    year: string;
    phone: string;
  }) => {
    setIsLoading(true);
    try {
      let uid = `user-${Date.now()}`;
      if (isFirebaseConfigured && auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, data.email, data.pass);
          uid = cred.user.uid;
        } catch (fbErr) {
          console.warn("Live Firebase user registration bypassed, creating local demo student:", fbErr);
        }
      }

      const dept = dataStore.getDepartmentById(data.departmentId);

      const newProfile: UserProfile = {
        uid,
        email: data.email,
        displayName: data.displayName,
        role: "student",
        rollNumber: data.rollNumber,
        departmentId: data.departmentId,
        departmentName: dept ? dept.name : undefined,
        year: data.year,
        phone: data.phone,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailNotifications: {
          onRequestCreated: true,
          onStatusChanged: true,
          onCommentAdded: true,
          onEscalated: true,
          onCompleted: true,
        },
      };

      setUser(newProfile);
      localStorage.setItem("campusdesk_current_uid", newProfile.uid);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    // Set to demo student
    setUser(SEED_USERS[3]);
    if (typeof window !== "undefined") {
      localStorage.setItem("campusdesk_current_uid", SEED_USERS[3].uid);
    }
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  const switchDemoRole = (role: UserRole) => {
    let target = SEED_USERS[3]; // student
    if (role === "admin") target = SEED_USERS[0]; // admin
    else if (role === "staff") target = SEED_USERS[1]; // staff cse

    setUser(target);
    if (typeof window !== "undefined") {
      localStorage.setItem("campusdesk_current_uid", target.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role: user?.role || "student",
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
