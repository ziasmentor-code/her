import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Donate from './pages/Donate';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from './pages/Hero';
import Home from './pages/Home';
import CareerSupport from './pages/CareerSupport';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SOSModal from './components/common/Sosmodal';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                     <Route path="/login" element={<Login />} />
                     <Route path="/register" element={<Register />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/sosmodal" element={<SOSModal/>} />

                    <Route path="/hero" element={<Hero />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/" element={<CareerSupport />} />
                    
                    
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} />
            </Router>
        </AuthProvider>
    );
}

export default App;