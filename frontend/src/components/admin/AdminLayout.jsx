// frontend/src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (menuPath) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuPath]: !prev[menuPath]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const menuItems = [
        // 📊 Dashboard
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        
        // 👥 Accounts
        { path: '/admin/users', icon: '👥', label: 'Users' },
        
        // 💬 Anonymous Posts
        { 
            path: '/admin/anonymous', 
            icon: '💬', 
            label: 'Anonymous Posts',
            subItems: [
                { path: '/admin/anonymous/posts', label: 'Anonymous Posts' },
                { path: '/admin/anonymous/comments', label: 'Anonymous Comments' }
            ]
        },
        
        // 📚 Courses
        { 
            path: '/admin/courses', 
            icon: '📚', 
            label: 'Courses',
            subItems: [
                { path: '/admin/courses/list', label: 'Courses' },
                { path: '/admin/courses/categories', label: 'Course Categories' },
                { path: '/admin/courses/lessons', label: 'Lessons' },
                { path: '/admin/courses/enrollments', label: 'Enrollments' },
                { path: '/admin/courses/certificates', label: 'Certificates' },
                { path: '/admin/courses/reviews', label: 'Reviews' }
            ]
        },
        
        // 💼 Jobs
        { 
            path: '/admin/jobs', 
            icon: '💼', 
            label: 'Jobs',
            subItems: [
                { path: '/admin/jobs/listings', label: 'Job Listings' },
                { path: '/admin/jobs/applications', label: 'Job Applications' },
                { path: '/admin/jobs/categories', label: 'Job Categories' },
                { path: '/admin/jobs/employers', label: 'Employers' },
                { path: '/admin/jobs/alerts', label: 'Job Alerts' },
                { path: '/admin/jobs/saved', label: 'Saved Jobs' }
            ]
        },
        
        // 🛡️ Safety
        { 
            path: '/admin/safety', 
            icon: '🛡️', 
            label: 'Safety',
            subItems: [
                { path: '/admin/safety/sos-alerts', label: 'SOS Alerts' },
                { path: '/admin/safety/emergency-contacts', label: 'Emergency Contacts' },
                { path: '/admin/safety/emergency-resources', label: 'Emergency Resources' }
            ]
        },
        
        // 💬 Counseling
        { 
            path: '/admin/counseling', 
            icon: '💬', 
            label: 'Counseling',
            subItems: [
                { path: '/admin/counseling/sessions', label: 'Counseling Sessions' },
                { path: '/admin/counseling/counselors', label: 'Counselors' },
                { path: '/admin/counseling/availability', label: 'Counselor Availability' },
                { path: '/admin/counseling/crisis-helplines', label: 'Crisis Helplines' },
                { path: '/admin/counseling/reviews', label: 'Session Reviews' }
            ]
        },
        
        // 💰 Donations
        { 
            path: '/admin/donations', 
            icon: '💰', 
            label: 'Donations',
            subItems: [
                { path: '/admin/donations/list', label: 'Donations' }
            ]
        },
        
        // 📈 Analytics & Settings
        { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
        { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>🏥</span>
                    <span style={styles.logoText}>HerCircle</span>
                    <span style={styles.logoBadge}>Admin</span>
                </div>

                <nav style={styles.nav}>
                    {menuItems.map((item) => (
                        <div key={item.path}>
                            {/* Main Menu Item */}
                            <div
                                onClick={() => item.subItems && toggleMenu(item.path)}
                                style={{
                                    ...styles.navItem,
                                    ...(location.pathname === item.path ? styles.navItemActive : {}),
                                    cursor: item.subItems ? 'pointer' : 'default'
                                }}
                            >
                                {!item.subItems ? (
                                    <Link to={item.path} style={styles.navLink}>
                                        <span style={styles.navIcon}>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ) : (
                                    <div style={styles.navLink}>
                                        <span style={styles.navIcon}>{item.icon}</span>
                                        <span>{item.label}</span>
                                        <span style={styles.arrow}>
                                            {openMenus[item.path] ? '▼' : '▶'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Sub Menu Items */}
                            {item.subItems && openMenus[item.path] && (
                                <div style={styles.subMenu}>
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.path}
                                            to={subItem.path}
                                            style={{
                                                ...styles.subNavItem,
                                                ...(location.pathname === subItem.path ? styles.subNavItemActive : {})
                                            }}
                                        >
                                            <span style={styles.subNavIcon}>•</span>
                                            <span>{subItem.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <span>🚪</span> Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                {children}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
    },
    sidebar: {
        width: '280px',
        backgroundColor: '#1a1a2e',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
    },
    logo: {
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    logoIcon: {
        fontSize: '28px',
    },
    logoText: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    logoBadge: {
        fontSize: '10px',
        backgroundColor: '#4361ee',
        padding: '2px 8px',
        borderRadius: '20px',
        marginLeft: 'auto',
    },
    nav: {
        flex: 1,
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    navItem: {
        borderRadius: '10px',
        transition: 'all 0.3s',
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        color: '#a0a0b0',
        textDecoration: 'none',
        width: '100%',
        boxSizing: 'border-box',
    },
    navItemActive: {
        backgroundColor: '#4361ee',
        '& a': { color: 'white' },
    },
    navIcon: {
        fontSize: '20px',
    },
    arrow: {
        marginLeft: 'auto',
        fontSize: '12px',
    },
    subMenu: {
        paddingLeft: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    subNavItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        color: '#a0a0b0',
        textDecoration: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        transition: 'all 0.3s',
    },
    subNavItemActive: {
        backgroundColor: '#4361ee',
        color: 'white',
    },
    subNavIcon: {
        fontSize: '14px',
    },
    logoutBtn: {
        margin: '20px',
        padding: '12px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '14px',
        transition: 'background 0.3s',
    },
    content: {
        marginLeft: '280px',
        flex: 1,
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
    },
};

export default AdminLayout;