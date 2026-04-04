// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Analytics from './components/admin/Analytics';
import Settings from './components/admin/Settings';

// 👇 Add all missing imports
import AnonymousPosts from './components/admin/AnonymousPosts';
import AnonymousComments from './components/admin/AnonymousComments';
import CoursesList from './components/admin/CoursesList';
import CourseCategories from './components/admin/CourseCategories';
import Lessons from './components/admin/Lessons';
import Enrollments from './components/admin/Enrollments';
import Certificates from './components/admin/Certificates';
import CourseReviews from './components/admin/CourseReviews';
import JobListings from './components/admin/JobListings';
import JobApplications from './components/admin/JobApplications';
import JobCategories from './components/admin/JobCategories';
import Employers from './components/admin/Employers';
import SOSAlerts from './components/admin/SOSAlerts';
import EmergencyContacts from './components/admin/EmergencyContacts';
import EmergencyResources from './components/admin/EmergencyResources';
import CounselingSessions from './components/admin/CounselingSessions';
import Counselors from './components/admin/Counselors';
import CounselorAvailability from './components/admin/CounselorAvailability';
import CrisisHelplines from './components/admin/CrisisHelplines';
import SessionReviews from './components/admin/SessionReviews';
import Donations from './components/admin/Donations';
// Hide Navbar for admin pages
function Layout({ children }) {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Navbar />}
            {children}
        </>
    );
}

// Admin Protected Route
function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('AdminProtectedRoute check:', { token: !!token, user });

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!user.is_superuser && user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* ✅ Admin Login - No protection */}
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* ✅ Protected Admin Routes */}
                        <Route 
                            path="/admin/dashboard" 
                            element={
                                <AdminProtectedRoute>
                                    <AdminLayout>
                                        <AdminDashboard />
                                    </AdminLayout>
                                </AdminProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin/users" 
                            element={
                                <AdminProtectedRoute>
                                    <AdminLayout>
                                        <UserManagement />
                                    </AdminLayout>
                                </AdminProtectedRoute>
                            } 
                        />

                        {/* Redirect /admin to dashboard if logged in, else login */}
                        <Route 
                            path="/admin" 
                            element={
                                localStorage.getItem('access_token') 
                                    ? <Navigate to="/admin/dashboard" /> 
                                    : <Navigate to="/admin/login" />
                            } 
                        />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" />} />
                        <Route 
    path="/admin/analytics" 
    element={
        <AdminProtectedRoute>
            <AdminLayout>
                <Analytics />
            </AdminLayout>
        </AdminProtectedRoute>
    } 
/>

<Route 
    path="/admin/settings" 
    element={
        <AdminProtectedRoute>
            <AdminLayout>
                <Settings />
            </AdminLayout>
        </AdminProtectedRoute>
    } 
/>
<Route path="/admin/anonymous/posts" element={<AdminProtectedRoute><AdminLayout><AnonymousPosts /></AdminLayout></AdminProtectedRoute>} />
<Route path="/admin/anonymous/comments" element={<AdminProtectedRoute><AdminLayout><AnonymousComments /></AdminLayout></AdminProtectedRoute>} />
<Route path="/admin/counseling/sessions" element={<AdminProtectedRoute><AdminLayout><CounselingSessions /></AdminLayout></AdminProtectedRoute>} />
<Route path="/admin/counseling/counselors" element={<AdminProtectedRoute><AdminLayout><Counselors /></AdminLayout></AdminProtectedRoute>} />
<Route path="/admin/safety/sos-alerts" element={<AdminProtectedRoute><AdminLayout><SOSAlerts /></AdminLayout></AdminProtectedRoute>} />
<Route path="/admin/safety/emergency-contacts" element={<AdminProtectedRoute><AdminLayout><EmergencyContacts /></AdminLayout></AdminProtectedRoute>} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;