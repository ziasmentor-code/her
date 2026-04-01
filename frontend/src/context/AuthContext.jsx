import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

const fetchUser = async () => {
    try {
        const response = await api.get('/auth/users/me/');
        setUser(response.data);
    } catch (error) {
        console.error('Error fetching user:', error);
        if (error.response?.status === 401) {
            // Token expired, try to refresh
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const refreshResponse = await api.post('/auth/token/refresh/', {
                    refresh: refreshToken
                });
                localStorage.setItem('access_token', refreshResponse.data.access);
                // Retry fetching user
                const userResponse = await api.get('/auth/users/me/');
                setUser(userResponse.data);
            } catch (refreshError) {
                logout();
            }
        } else {
            logout();
        }
    } finally {
        setLoading(false);
    }
};

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/token/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            await fetchUser();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register/', userData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
        userRole: user?.role,
        isUser: user?.role === 'USER',
        isMentor: user?.role === 'MENTOR',
        isDoctor: user?.role === 'DOCTOR',
        isPolice: user?.role === 'POLICE',
        isAdmin: user?.role === 'ADMIN',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};