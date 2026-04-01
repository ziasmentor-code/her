import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} />
            </Router>
        </AuthProvider>
    );
}

export default App;