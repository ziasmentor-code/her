// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            setLoading(false);
            return;
        }
        
        try {
            // ✅ Fix: Use correct endpoint (admin/users/me/ instead of auth/users/me/)
            const response = await api.get('/admin/users/me/');
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching user:', err);
            // If token is invalid, clear it
            if (err.response?.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                setUser(null);
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/admin/login/', { email, password });
            
            if (response.data.success) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: response.data.error };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        fetchUser();
    }, []); // ✅ Empty dependency array - runs only once

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};