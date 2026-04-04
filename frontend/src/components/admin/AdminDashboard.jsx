// frontend/src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        
        if (!token) {
            window.location.href = '/admin/login';
            return;
        }
        
        if (userData) {
            setUser(JSON.parse(userData));
        }
        
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/admin/dashboard/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                window.location.href = '/admin/login';
                return;
            }
            
            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <div style={styles.container}>
            {/* Welcome Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Dashboard</h1>
                    <p style={styles.subtitle}>Welcome back, {user?.username || 'Admin'} 👋</p>
                </div>
                <div style={styles.dateBadge}>
                    {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <StatCard 
                    icon="👥" 
                    title="Total Users" 
                    value={stats?.total_users || 0}
                    change="+12%"
                    color="#4361ee"
                    bg="#e8ecff"
                />
                <StatCard 
                    icon="👑" 
                    title="Total Admins" 
                    value={stats?.total_admins || 0}
                    change="+2"
                    color="#f59f00"
                    bg="#fff3e0"
                />
                <StatCard 
                    icon="✅" 
                    title="Verified Users" 
                    value={stats?.total_verified || 0}
                    change="+5"
                    color="#2ecc71"
                    bg="#e8f8ef"
                />
                <StatCard 
                    icon="📊" 
                    title="Active Users" 
                    value={stats?.total_users ? Math.floor(stats.total_users * 0.8) : 0}
                    change="+8%"
                    color="#e74c3c"
                    bg="#fdecea"
                />
            </div>

            {/* Charts Section */}
            <div style={styles.chartsRow}>
                {/* User Growth Chart */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>📈 User Growth</h3>
                        <span style={styles.chartPeriod}>Last 7 days</span>
                    </div>
                    <div style={styles.chartContainer}>
                        <SimpleBarChart />
                    </div>
                </div>

                {/* Role Distribution */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>🥧 Role Distribution</h3>
                        <span style={styles.chartPeriod}>Current</span>
                    </div>
                    <div style={styles.chartContainer}>
                        <PieChart stats={stats} />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.recentCard}>
                <div style={styles.recentHeader}>
                    <h3 style={styles.recentTitle}>🕒 Recent Activity</h3>
                    <button style={styles.viewAllBtn}>View All →</button>
                </div>
                <div style={styles.activityList}>
                    <ActivityItem 
                        icon="👤" 
                        action="New user registered" 
                        user="emma_davis"
                        time="2 minutes ago"
                        color="#4361ee"
                    />
                    <ActivityItem 
                        icon="✅" 
                        action="User verified" 
                        user="oliver_brown"
                        time="1 hour ago"
                        color="#2ecc71"
                    />
                    <ActivityItem 
                        icon="👑" 
                        action="Admin login" 
                        user="newadmin"
                        time="3 hours ago"
                        color="#f59f00"
                    />
                    <ActivityItem 
                        icon="📝" 
                        action="Profile updated" 
                        user="john_doe"
                        time="5 hours ago"
                        color="#e74c3c"
                    />
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, color, bg }) => (
    <div style={statCardStyles.card}>
        <div style={{...statCardStyles.icon, backgroundColor: bg, color: color}}>
            {icon}
        </div>
        <div style={statCardStyles.info}>
            <p style={statCardStyles.title}>{title}</p>
            <p style={{...statCardStyles.value, color: color}}>{value}</p>
            <span style={{...statCardStyles.change, color: color}}>↑ {change}</span>
        </div>
    </div>
);

// Simple Bar Chart
const SimpleBarChart = () => {
    const data = [45, 52, 48, 61, 58, 67, 72];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
        <div style={barChartStyles.container}>
            {data.map((height, i) => (
                <div key={i} style={barChartStyles.barWrapper}>
                    <div style={barChartStyles.barContainer}>
                        <div style={{...barChartStyles.bar, height: `${(height / 100) * 150}px`}}>
                            <span style={barChartStyles.barValue}>{height}</span>
                        </div>
                    </div>
                    <span style={barChartStyles.barLabel}>{days[i]}</span>
                </div>
            ))}
        </div>
    );
};

// Pie Chart
const PieChart = ({ stats }) => {
    const admins = stats?.total_admins || 0;
    const verified = stats?.total_verified || 0;
    const users = (stats?.total_users || 0) - admins - verified;
    const total = admins + verified + users;
    
    const adminPercent = total ? (admins / total) * 100 : 0;
    const verifiedPercent = total ? (verified / total) * 100 : 0;
    const userPercent = total ? (users / total) * 100 : 0;
    
    return (
        <div style={pieChartStyles.container}>
            <div style={pieChartStyles.chart}>
                <div style={{...pieChartStyles.segment, width: `${adminPercent}%`, backgroundColor: '#f59f00'}}>
                    <span style={pieChartStyles.segmentLabel}>👑</span>
                </div>
                <div style={{...pieChartStyles.segment, width: `${verifiedPercent}%`, backgroundColor: '#2ecc71'}}>
                    <span style={pieChartStyles.segmentLabel}>✅</span>
                </div>
                <div style={{...pieChartStyles.segment, width: `${userPercent}%`, backgroundColor: '#4361ee'}}>
                    <span style={pieChartStyles.segmentLabel}>👤</span>
                </div>
            </div>
            <div style={pieChartStyles.legend}>
                <div style={pieChartStyles.legendItem}>
                    <div style={{...pieChartStyles.legendColor, backgroundColor: '#f59f00'}}></div>
                    <span>Admins ({admins})</span>
                </div>
                <div style={pieChartStyles.legendItem}>
                    <div style={{...pieChartStyles.legendColor, backgroundColor: '#2ecc71'}}></div>
                    <span>Verified ({verified})</span>
                </div>
                <div style={pieChartStyles.legendItem}>
                    <div style={{...pieChartStyles.legendColor, backgroundColor: '#4361ee'}}></div>
                    <span>Users ({users})</span>
                </div>
            </div>
        </div>
    );
};

// Activity Item
const ActivityItem = ({ icon, action, user, time, color }) => (
    <div style={activityStyles.item}>
        <div style={{...activityStyles.icon, backgroundColor: `${color}15`, color: color}}>
            {icon}
        </div>
        <div style={activityStyles.content}>
            <p style={activityStyles.action}>{action}</p>
            <p style={activityStyles.user}>@{user}</p>
        </div>
        <span style={activityStyles.time}>{time}</span>
    </div>
);

// Loading Spinner
const LoadingSpinner = () => (
    <div style={loadingStyles.container}>
        <div style={loadingStyles.spinner}></div>
        <p style={loadingStyles.text}>Loading dashboard...</p>
    </div>
);

// Error Display
const ErrorDisplay = ({ error }) => (
    <div style={errorStyles.container}>
        <span style={errorStyles.icon}>⚠️</span>
        <p style={errorStyles.text}>{error}</p>
        <button onClick={() => window.location.reload()} style={errorStyles.button}>
            Try Again
        </button>
    </div>
);

// Styles
const styles = {
    container: {
        padding: '24px',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a2e',
        margin: 0,
    },
    subtitle: {
        color: '#666',
        marginTop: '8px',
        fontSize: '14px',
    },
    dateBadge: {
        padding: '8px 16px',
        backgroundColor: 'white',
        borderRadius: '20px',
        fontSize: '13px',
        color: '#666',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
    },
    chartsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
    },
    chartCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    chartTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a2e',
        margin: 0,
    },
    chartPeriod: {
        fontSize: '12px',
        color: '#999',
    },
    chartContainer: {
        height: '200px',
    },
    recentCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    recentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    recentTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a2e',
        margin: 0,
    },
    viewAllBtn: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        color: '#666',
        fontSize: '13px',
    },
    activityList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
};

const statCardStyles = {
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
    },
    icon: {
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: '13px',
        color: '#666',
        marginBottom: '8px',
    },
    value: {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '4px',
    },
    change: {
        fontSize: '11px',
        fontWeight: '500',
    },
};

const barChartStyles = {
    container: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: '100%',
    },
    barWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        width: '40px',
    },
    barContainer: {
        height: '150px',
        display: 'flex',
        alignItems: 'flex-end',
    },
    bar: {
        width: '30px',
        backgroundColor: '#4361ee',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
        transition: 'height 0.5s',
    },
    barValue: {
        fontSize: '10px',
        color: 'white',
        position: 'absolute',
        top: '-18px',
    },
    barLabel: {
        fontSize: '11px',
        color: '#666',
    },
};

const pieChartStyles = {
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    chart: {
        display: 'flex',
        height: '40px',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '20px',
    },
    segment: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'width 0.5s',
    },
    segmentLabel: {
        fontSize: '18px',
    },
    legend: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
    },
    legendColor: {
        width: '12px',
        height: '12px',
        borderRadius: '3px',
    },
};

const activityStyles = {
    item: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
    },
    icon: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
    },
    content: {
        flex: 1,
    },
    action: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '2px',
    },
    user: {
        fontSize: '12px',
        color: '#666',
    },
    time: {
        fontSize: '11px',
        color: '#999',
    },
};

const loadingStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #4361ee',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    text: {
        marginTop: '16px',
        color: '#666',
    },
};

const errorStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    icon: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    text: {
        color: '#e74c3c',
        marginBottom: '16px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
};

// Add animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;