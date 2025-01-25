import { Navigate } from 'react-router-dom';
import authStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
    const { isLogin } = authStore((state) => ({
        user: state.user,
    }));

    // If the user is not authenticated, redirect to the login page
    if (!isLogin) {
        return <Navigate to="/login" />;
    }

    // If the user is authenticated, render the protected content
    return children;
};

export default ProtectedRoute;
