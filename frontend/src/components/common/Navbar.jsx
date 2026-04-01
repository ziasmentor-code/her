import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    FaPhoneAlt, 
    FaBook, 
    FaHandHoldingHeart, 
    FaHeart, 
    FaLanguage,
    FaUser,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaBars,
    FaTimes,
    FaBell,
    FaExclamationTriangle,
    FaShieldAlt,
    FaComments,
    FaQuestionCircle,
    FaHome,
    FaInfoCircle
} from 'react-icons/fa';
import { GiRose } from 'react-icons/gi';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { user, userRole, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const handleEmergencyAlert = () => {
        // Show emergency alert
        toast.error('🚨 EMERGENCY ALERT TRIGGERED! Help is on the way!', {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });
        
        // You can add more emergency actions here:
        // - Send SOS to emergency contacts
        // - Share location
        // - Call helpline
        // - Redirect to safety page
        
        navigate('/safety');
    };

    const handleExit = () => {
        setShowExitConfirm(true);
    };

    const confirmExit = () => {
        // Clear all data
        localStorage.clear();
        sessionStorage.clear();
        logout();
        
        // Redirect to a safe page
        window.location.href = 'https://www.google.com';
        
        toast.info('Exiting safely...');
    };

    // Main navigation links
    const navLinks = [
        { path: '/', label: 'Home', icon: FaHome, color: 'text-pink-400' },
        { path: '/help', label: 'Get Help', icon: FaPhoneAlt, color: 'text-pink-400' },
        { path: '/learn', label: 'Learn', icon: FaBook, color: 'text-blue-400' },
        { path: '/support', label: 'Support', icon: FaHandHoldingHeart, color: 'text-green-400' },
        { path: '/anonymous', label: 'Anonymous Chat', icon: FaComments, color: 'text-yellow-400' },
        { path: '/safety', label: 'Safety Tips', icon: FaShieldAlt, color: 'text-red-400' },
        { path: '/about', label: 'About', icon: FaInfoCircle, color: 'text-gray-400' },
    ];

    return (
        <>
            <nav className="bg-[#1a1a2e] text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-bold text-pink-400 flex items-center gap-2">
                            <GiRose className="text-3xl text-pink-400" />
                            <span>HerCircle</span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-gray-300 hover:text-white transition flex items-center gap-2 group"
                                >
                                    <link.icon className={`text-lg ${link.color} group-hover:scale-110 transition`} />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Buttons */}
                        <div className="hidden md:flex items-center space-x-3">
                            {/* Emergency Alert Button */}
                            <button
                                onClick={handleEmergencyAlert}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 animate-pulse"
                                title="Emergency SOS"
                            >
                                <FaExclamationTriangle className="text-lg" />
                                <span className="font-bold">SOS</span>
                            </button>

                            {/* Exit Button */}
                            <button
                                onClick={handleExit}
                                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                title="Exit Site"
                            >
                                <FaSignOutAlt className="text-lg" />
                                <span>Exit</span>
                            </button>

                            {/* Auth Buttons */}
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                                        <FaUser className="text-pink-400" />
                                        <span className="text-gray-300 text-sm">
                                            {user?.display_name || user?.username}
                                        </span>
                                        {userRole && (
                                            <span className="text-xs bg-pink-500 px-2 py-0.5 rounded-full">
                                                {userRole}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-300 hover:text-pink-400 transition flex items-center gap-2"
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="text-gray-300 hover:text-pink-400 transition flex items-center gap-2"
                                    >
                                        <FaSignInAlt />
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition flex items-center gap-2"
                                    >
                                        <FaUserPlus />
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white focus:outline-none"
                        >
                            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-700">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="block py-3 text-gray-300 hover:text-pink-400 transition flex items-center gap-3"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <link.icon className={`text-xl ${link.color}`} />
                                    {link.label}
                                </Link>
                            ))}
                            
                            {/* Mobile Emergency & Exit Buttons */}
                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={handleEmergencyAlert}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    <FaExclamationTriangle />
                                    SOS
                                </button>
                                <button
                                    onClick={handleExit}
                                    className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    <FaSignOutAlt />
                                    Exit
                                </button>
                            </div>
                            
                            {/* Mobile Auth */}
                            <div className="pt-4 mt-4 border-t border-gray-700">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center gap-2 py-2 text-gray-300">
                                            <FaUser className="text-pink-400" />
                                            <span>{user?.display_name || user?.username}</span>
                                            {userRole && (
                                                <span className="text-xs bg-pink-500 px-2 py-0.5 rounded-full">
                                                    {userRole}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="block w-full text-left py-2 text-pink-400 hover:text-pink-300 flex items-center gap-2"
                                        >
                                            <FaSignOutAlt />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block py-2 text-gray-300 hover:text-pink-400 flex items-center gap-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <FaSignInAlt />
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block py-2 text-pink-400 hover:text-pink-300 flex items-center gap-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <FaUserPlus />
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                        <div className="text-center">
                            <div className="text-5xl mb-4">⚠️</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Exit Site?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to exit? If you're in danger, please use the SOS button.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowExitConfirm(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmExit}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    Exit Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;