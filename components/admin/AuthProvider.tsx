import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("[AuthProvider] Initializing onAuthStateChanged listener...");
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("[AuthProvider] Auth state changed. User:", currentUser ? currentUser.email : "Not logged in");
            setUser(currentUser);
            setLoading(false);
        }, (error) => {
            console.error("[AuthProvider] Auth state change error:", error);
            setLoading(false);
        });

        return () => {
            console.log("[AuthProvider] Cleaning up auth listener.");
            unsubscribe();
        };
    }, []);

    const logout = async () => {
        console.log("[AuthProvider] Logging out user...");
        try {
            await signOut(auth);
            console.log("[AuthProvider] User logged out successfully.");
        } catch (error) {
            console.error("[AuthProvider] Logout error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
