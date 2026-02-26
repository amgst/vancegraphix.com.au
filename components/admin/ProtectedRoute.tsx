import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        console.log("[ProtectedRoute] Still loading auth state...");
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="animate-spin text-blue-600 mb-4 mx-auto" size={40} />
                    <p className="text-gray-500 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        console.warn("[ProtectedRoute] No user found, redirecting to login.");
        return <Navigate to="/admin/login" replace />;
    }

    console.log("[ProtectedRoute] Authorized access for:", user.email);
    return <Outlet />;
};

export default ProtectedRoute;
