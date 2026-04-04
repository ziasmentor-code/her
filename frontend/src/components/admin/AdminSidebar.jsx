// components/admin/AdminSidebar.jsx
import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Avatar } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as UsersIcon,
    School as MentorIcon,
    LocalHospital as DoctorIcon,
    Security as PoliceIcon,
    Work as JobsIcon,
    LibraryBooks as CoursesIcon,
    Chat as ChatIcon,
    BarChart as ReportsIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Users', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'Mentors', icon: <MentorIcon />, path: '/admin/mentors' },
    { text: 'Doctors', icon: <DoctorIcon />, path: '/admin/doctors' },
    { text: 'Police', icon: <PoliceIcon />, path: '/admin/police' },
    { text: 'Jobs', icon: <JobsIcon />, path: '/admin/jobs' },
    { text: 'Courses', icon: <CoursesIcon />, path: '/admin/courses' },
    { text: 'Chat Moderation', icon: <ChatIcon />, path: '/admin/chats' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/admin/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

function AdminSidebar({ activeItem, onItemClick }) {
    return (
        <Box sx={{
            width: 280,
            bgcolor: '#1a1a2e',
            color: '#fff',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            overflowY: 'auto',
            zIndex: 10,
        }}>
            {/* Logo */}
            <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="h5" sx={{ fontFamily: 'cursive', color: '#c27a5f', fontWeight: 'bold' }}>
                    HerCircle
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Admin Portal
                </Typography>
            </Box>

            {/* Admin Info */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Avatar sx={{ bgcolor: '#c27a5f' }}>A</Avatar>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Admin User</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Super Admin</Typography>
                </Box>
            </Box>

            {/* Menu Items */}
            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        onClick={() => onItemClick(item.text.toLowerCase())}
                        sx={{
                            cursor: 'pointer',
                            mb: 0.5,
                            mx: 1,
                            borderRadius: '12px',
                            width: 'auto',
                            bgcolor: activeItem === item.text.toLowerCase() ? '#c27a5f' : 'transparent',
                            '&:hover': {
                                bgcolor: activeItem === item.text.toLowerCase() ? '#c27a5f' : 'rgba(194,122,95,0.2)',
                            },
                            transition: 'all 0.3s',
                        }}
                    >
                        <ListItemIcon sx={{ color: activeItem === item.text.toLowerCase() ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.9rem',
                                    color: activeItem === item.text.toLowerCase() ? '#fff' : 'rgba(255,255,255,0.8)',
                                }
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />

            <List>
                <ListItem
                    sx={{
                        cursor: 'pointer',
                        mx: 1,
                        borderRadius: '12px',
                        '&:hover': { bgcolor: 'rgba(194,122,95,0.2)' },
                    }}
                >
                    <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ '& .MuiTypography-root': { color: 'rgba(255,255,255,0.8)' } }} />
                </ListItem>
            </List>
        </Box>
    );
}

export default AdminSidebar;