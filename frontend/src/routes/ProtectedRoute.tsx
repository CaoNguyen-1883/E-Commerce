import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../lib/stores";
import { UserRole } from "../lib/types";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    requireAuth = true,
}) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    // If route requires authentication and user is not authenticated
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If route has role restrictions and user doesn't have required role
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
        case UserRole.ADMIN:
            return <Navigate to="/admin" replace />;
        case UserRole.CUSTOMER:
            return <Navigate to="/customer" replace />;
        case UserRole.SELLER:
            return <Navigate to="/seller" replace />;
        case UserRole.STAFF:
            return <Navigate to="/staff" replace />;
        default:
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};