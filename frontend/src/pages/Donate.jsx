import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Alert,
    Snackbar,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    InputAdornment,
    LinearProgress,
    Fade,
    Zoom,
    Avatar,
    CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

// Background image - using online image
import donationBg from '../assets/donation-bg.jpg';

// Success story images - using online images
import priyaImage from '../assets/priyas.jpg';
import meeraImage from '../assets/meerak.jpg';
import anjaliImage from '../assets/aleena.jpg';

function Donate() {
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [stats, setStats] = useState(null);
    const [recentDonations, setRecentDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const donationAmounts = [100, 500, 1000, 2500, 5000];

    // Fetch data when component loads
    useEffect(() => {
        fetchDonationStats();
        fetchRecentDonations();
    }, []);

    const fetchDonationStats = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/donate/donations/stats/');
            console.log('Stats received:', response.data);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats({
                total_donations: 0,
                total_amount: 0,
                impact_score: 0
            });
        }
    };

    const fetchRecentDonations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/donate/donations/');
            console.log('Donations received:', response.data);
            setRecentDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
            setRecentDonations([]);
        } finally {
            setLoading(false);
        }
    };

    const getImpactMessage = (amt) => {
        const num = parseInt(amt);
        if (num >= 5000) return "🎓 Supports a full legal aid case + 10 counseling sessions";
        if (num >= 2500) return "📚 Funds 5 women's skill development workshops";
        if (num >= 1000) return "💝 Provides complete counseling for 2 women";
        if (num >= 500) return "🛡️ Safety resources for 10 women";
        if (num > 0) return "✨ Every contribution makes a difference";
        return "Select an amount to see your impact";
    };

    const handleAmountSelect = (value) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmount = (e) => {
        setCustomAmount(e.target.value);
        setAmount(e.target.value);
    };

    const handleDonate = async () => {
        if (!amount || amount <= 0) {
            setSnackbar({ open: true, message: 'Please enter a valid amount', severity: 'warning' });
            return;
        }

        if (!email) {
            setSnackbar({ open: true, message: 'Please enter your email address', severity: 'warning' });
            return;
        }

        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Token ${token}` })
            };

            const donationData = {
                amount: parseFloat(amount),
                donation_type: 'one_time',
                message: message,
                email: email,
                name: name,
                phone: phone,
                is_anonymous: isAnonymous
            };

            console.log('Sending donation:', donationData);

            const response = await axios.post(
                'http://127.0.0.1:8000/api/donate/donations/create_donation/',
                donationData,
                { headers }
            );

            console.log('Response:', response.data);

            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: `✨ Thank you for your generous donation of ₹${amount}! You're changing lives. ✨`,
                    severity: 'success'
                });

                // Reset form
                setAmount('');
                setCustomAmount('');
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
                setIsAnonymous(false);
                
                // Refresh stats and recent donations
                await fetchDonationStats();
                await fetchRecentDonations();
            }
        } catch (error) {
            console.error('Donation error:', error);
            console.error('Error response:', error.response?.data);
            
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Something went wrong. Please try again.',
                severity: 'error'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const successStories = [
        { 
            image: priyaImage,
            quote: "Thanks to donors like you, I received legal aid and won my case. Now I help other women too.", 
            name: "Priya S.", 
            role: "Beneficiary turned Volunteer",
            icon: "🌟",
            location: "Mumbai"
        },
        { 
            image: meeraImage,
            quote: "The counseling sessions changed my life. I'm now financially independent and confident.", 
            name: "Meera K.", 
            role: "Career Program Graduate",
            icon: "💪",
            location: "Bangalore"
        },
        { 
            image: anjaliImage,
            quote: "Your support gave me safety and hope when I had nothing. Forever grateful.", 
            name: "Anjali R.", 
            role: "Safety Program Beneficiary",
            icon: "🕊️",
            location: "Delhi"
        }
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress sx={{ color: '#c27a5f' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            position: 'relative',
            backgroundImage: `url(${donationBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
        }}>
            {/* Light overlay for readability */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(253, 251, 249, 0.88)',
                zIndex: 0,
            }} />

            {/* Decorative Elements */}
            <Box sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(194,122,95,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: -100,
                left: -100,
                width: 350,
                height: 350,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(61,44,53,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Zoom in={true} timeout={800}>
                        <Box>
                            <Typography 
                                variant="overline" 
                                sx={{ 
                                    color: '#c27a5f', 
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    fontFamily: '"Nunito", sans-serif',
                                    mb: 1.5,
                                    display: 'inline-block',
                                    '&::before': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: 35,
                                        height: 1,
                                        background: '#c27a5f',
                                        marginRight: 2,
                                        verticalAlign: 'middle',
                                    },
                                    '&::after': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: 35,
                                        height: 1,
                                        background: '#c27a5f',
                                        marginLeft: 2,
                                        verticalAlign: 'middle',
                                    }
                                }}
                            >
                                GIVE BACK
                            </Typography>
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    fontFamily: '"Lora", serif',
                                    fontWeight: 400,
                                    color: '#3d2c35',
                                    mb: 2,
                                    fontSize: { xs: '2rem', md: '3.5rem' }
                                }}
                            >
                                Empower a Woman,{' '}
                                <em style={{ color: '#c27a5f', fontStyle: 'normal' }}>Change a Life</em>
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontFamily: '"Nunito", sans-serif',
                                    color: '#6b5260', 
                                    maxWidth: '650px', 
                                    mx: 'auto',
                                    fontWeight: 400,
                                    lineHeight: 1.8
                                }}
                            >
                                Your donation directly supports women in need — providing safety, 
                                education, and opportunities for a brighter future.
                            </Typography>
                        </Box>
                    </Zoom>
                </Box>

                <Grid container spacing={5}>
                    {/* Left Column - Impact & Stories */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Fade in={true} timeout={1000}>
                            <Box>
                                {/* Stats Overview */}
                                {stats && (
                                    <Paper elevation={0} sx={{ 
                                        p: 3, 
                                        bgcolor: '#ffffff',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(194,122,95,0.15)',
                                        mb: 3,
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="h6" sx={{ color: '#3d2c35', mb: 2 }}>
                                            📊 Our Impact So Far
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
                                            <Box>
                                                <Typography variant="h4" sx={{ color: '#c27a5f', fontWeight: 'bold' }}>
                                                    ₹{stats.total_amount.toLocaleString()}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#8a7a82' }}>
                                                    Total Donations
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h4" sx={{ color: '#c27a5f', fontWeight: 'bold' }}>
                                                    {stats.total_donations}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#8a7a82' }}>
                                                    Donors
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h4" sx={{ color: '#c27a5f', fontWeight: 'bold' }}>
                                                    {stats.impact_score}+
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#8a7a82' }}>
                                                    Lives Impacted
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                )}

                                <Paper elevation={0} sx={{ 
                                    p: 4, 
                                    bgcolor: '#ffffff',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(194,122,95,0.15)',
                                    mb: 3,
                                    boxShadow: '0 8px 32px rgba(61,44,53,0.08)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                    }
                                }}>
                                    <Typography variant="h5" sx={{ 
                                        fontFamily: '"Lora", serif',
                                        fontWeight: 500, 
                                        color: '#3d2c35', 
                                        mb: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <EmojiEventsIcon sx={{ color: '#c27a5f' }} />
                                        Your Impact
                                    </Typography>
                                    
                                    <Box sx={{ mb: 4 }}>
                                        {[
                                            { icon: <VolunteerActivismIcon />, amount: '₹500', desc: 'Safety resources for 10 women' },
                                            { icon: <FavoriteIcon />, amount: '₹1,000', desc: 'Complete counseling session' },
                                            { icon: <SchoolIcon />, amount: '₹2,500', desc: 'Skill development workshop' },
                                            { icon: <SecurityIcon />, amount: '₹5,000', desc: 'Full legal aid support' },
                                        ].map((item, idx) => (
                                            <Box key={idx} sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                mb: 2.5,
                                                p: 1.5,
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: 'rgba(194,122,95,0.06)',
                                                    transform: 'translateX(4px)'
                                                }
                                            }}>
                                                <Box sx={{ 
                                                    width: 44, 
                                                    height: 44, 
                                                    borderRadius: '12px', 
                                                    bgcolor: 'rgba(194,122,95,0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                    color: '#c27a5f'
                                                }}>
                                                    {item.icon}
                                                </Box>
                                                <Box>
                                                    <Typography variant="body1" fontWeight={700} color="#3d2c35">
                                                        {item.amount}
                                                    </Typography>
                                                    <Typography variant="body2" color="#8a7a82">
                                                        {item.desc}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box sx={{ 
                                        bgcolor: '#f7f0ee', 
                                        p: 2.5, 
                                        borderRadius: '16px',
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="body2" sx={{ color: '#c27a5f', fontWeight: 600, mb: 1 }}>
                                            {amount ? `✨ You're about to make an impact! ✨` : '🌸 Choose an amount above'}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#6b5260', fontWeight: 500 }}>
                                            {getImpactMessage(amount)}
                                        </Typography>
                                    </Box>
                                </Paper>

                                {/* Recent Donations */}
                                <Paper elevation={0} sx={{ 
                                    p: 3, 
                                    bgcolor: '#ffffff',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(194,122,95,0.15)',
                                }}>
                                    <Typography variant="h6" sx={{ color: '#3d2c35', mb: 2 }}>
                                        ❤️ Recent Donors
                                    </Typography>
                                    {recentDonations.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: '#8a7a82', textAlign: 'center', py: 2 }}>
                                            No donations yet. Be the first! 🙏
                                        </Typography>
                                    ) : (
                                        recentDonations.map((donation, idx) => (
                                            <Box key={donation.id || idx} sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                py: 1.5,
                                                borderBottom: idx < recentDonations.length - 1 ? '1px solid rgba(194,122,95,0.1)' : 'none'
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#f7f0ee', color: '#c27a5f' }}>
                                                        {donation.is_anonymous ? '🤝' : (donation.name?.charAt(0) || '❤️')}
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ color: '#6b5260' }}>
                                                        {donation.is_anonymous ? 'Anonymous Donor' : (donation.name || 'Well-wisher')}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#c27a5f' }}>
                                                    ₹{donation.amount}
                                                </Typography>
                                            </Box>
                                        ))
                                    )}
                                </Paper>

                                <Paper elevation={0} sx={{ 
                                    p: 3, 
                                    mt: 3,
                                    bgcolor: '#ffffff',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(194,122,95,0.15)',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="body2" sx={{ color: '#6b5260', fontWeight: 600, mb: 2 }}>
                                        🔒 Why Trust Us?
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <CheckCircleIcon sx={{ color: '#c27a5f', fontSize: 20, mb: 0.5 }} />
                                            <Typography variant="caption" sx={{ color: '#8a7a82', display: 'block' }}>
                                                100% Secure
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <CheckCircleIcon sx={{ color: '#c27a5f', fontSize: 20, mb: 0.5 }} />
                                            <Typography variant="caption" sx={{ color: '#8a7a82', display: 'block' }}>
                                                Tax Exempt 80G
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <CheckCircleIcon sx={{ color: '#c27a5f', fontSize: 20, mb: 0.5 }} />
                                            <Typography variant="caption" sx={{ color: '#8a7a82', display: 'block' }}>
                                                Instant Receipt
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        </Fade>
                    </Grid>

                    {/* Right Column - Donation Form */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Fade in={true} timeout={1000}>
                            <Paper elevation={0} sx={{ 
                                p: { xs: 3, md: 5 }, 
                                bgcolor: '#ffffff',
                                borderRadius: '28px',
                                border: '1px solid rgba(194,122,95,0.15)',
                                boxShadow: '0 8px 32px rgba(61,44,53,0.08)',
                            }}>
                                <Typography variant="h5" sx={{ 
                                    fontFamily: '"Lora", serif',
                                    fontWeight: 500, 
                                    color: '#3d2c35', 
                                    mb: 0.5 
                                }}>
                                    Make a Donation
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#8a7a82', mb: 3 }}>
                                    Your generosity helps us reach more women in need
                                </Typography>

                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3d2c35', mb: 2 }}>
                                    Select Amount
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    {donationAmounts.map((value) => (
                                        <Grid size={{ xs: 6, sm: 4 }} key={value}>
                                            <Zoom in={true} timeout={500}>
                                                <Button
                                                    fullWidth
                                                    variant={amount === value ? 'contained' : 'outlined'}
                                                    onClick={() => handleAmountSelect(value)}
                                                    sx={{
                                                        py: 1.8,
                                                        borderRadius: '14px',
                                                        bgcolor: amount === value ? '#c27a5f' : 'transparent',
                                                        borderColor: amount === value ? '#c27a5f' : 'rgba(194,122,95,0.3)',
                                                        color: amount === value ? 'white' : '#6b5260',
                                                        fontWeight: 700,
                                                        fontFamily: '"Nunito", sans-serif',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: amount === value ? '#d9977e' : '#f7f0ee',
                                                            borderColor: '#c27a5f',
                                                            transform: 'translateY(-2px)'
                                                        }
                                                    }}
                                                >
                                                    ₹{value}
                                                </Button>
                                            </Zoom>
                                        </Grid>
                                    ))}
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Custom Amount"
                                            type="number"
                                            value={customAmount}
                                            onChange={handleCustomAmount}
                                            placeholder="Enter any amount"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start" sx={{ color: '#c27a5f' }}>₹</InputAdornment>,
                                            }}
                                            sx={{ 
                                                mt: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '14px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover fieldset': {
                                                        borderColor: '#c27a5f',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#c27a5f',
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3, borderColor: 'rgba(194,122,95,0.1)' }} />

                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3d2c35', mb: 2 }}>
                                    Your Details
                                </Typography>
                                
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover fieldset': {
                                                        borderColor: '#c27a5f',
                                                    },
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover fieldset': {
                                                        borderColor: '#c27a5f',
                                                    },
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number (Optional)"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your phone number"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover fieldset': {
                                                        borderColor: '#c27a5f',
                                                    },
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Message (Optional)"
                                            multiline
                                            rows={2}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Leave a supportive message..."
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover fieldset': {
                                                        borderColor: '#c27a5f',
                                                    },
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={isAnonymous}
                                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                                    sx={{ 
                                                        color: '#c27a5f',
                                                        '&.Mui-checked': {
                                                            color: '#c27a5f',
                                                        }
                                                    }}
                                                />
                                            }
                                            label={<Typography sx={{ color: '#6b5260' }}>Donate anonymously (name will not be shown publicly)</Typography>}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3, borderColor: 'rgba(194,122,95,0.1)' }} />

                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3d2c35', mb: 2 }}>
                                    Payment Method
                                </Typography>
                                
                                <FormControl component="fieldset" sx={{ mb: 3 }}>
                                    <RadioGroup
                                        row
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <FormControlLabel 
                                            value="card" 
                                            control={<Radio sx={{ color: '#c27a5f', '&.Mui-checked': { color: '#c27a5f' } }} />} 
                                            label={<Typography sx={{ color: '#6b5260' }}>💳 Card</Typography>}
                                        />
                                        <FormControlLabel 
                                            value="upi" 
                                            control={<Radio sx={{ color: '#c27a5f', '&.Mui-checked': { color: '#c27a5f' } }} />} 
                                            label={<Typography sx={{ color: '#6b5260' }}>📱 UPI</Typography>}
                                        />
                                        <FormControlLabel 
                                            value="netbanking" 
                                            control={<Radio sx={{ color: '#c27a5f', '&.Mui-checked': { color: '#c27a5f' } }} />} 
                                            label={<Typography sx={{ color: '#6b5260' }}>🏦 Net Banking</Typography>}
                                        />
                                    </RadioGroup>
                                </FormControl>

                                {isProcessing && (
                                    <Box sx={{ mb: 2 }}>
                                        <LinearProgress sx={{ 
                                            bgcolor: 'rgba(194,122,95,0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: '#c27a5f'
                                            }
                                        }} />
                                        <Typography variant="caption" sx={{ color: '#8a7a82', mt: 1, display: 'block', textAlign: 'center' }}>
                                            Processing your donation...
                                        </Typography>
                                    </Box>
                                )}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleDonate}
                                    disabled={!amount || amount <= 0 || isProcessing}
                                    sx={{
                                        bgcolor: '#c27a5f',
                                        py: 2,
                                        borderRadius: '16px',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        fontFamily: '"Nunito", sans-serif',
                                        textTransform: 'none',
                                        '&:hover': {
                                            bgcolor: '#d9977e',
                                            transform: 'translateY(-2px)',
                                        },
                                        '&:disabled': {
                                            bgcolor: 'rgba(194,122,95,0.5)'
                                        },
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 16px rgba(194,122,95,0.3)'
                                    }}
                                >
                                    {isProcessing ? 'Processing...' : `Donate ₹${amount || '0'} Now`}
                                </Button>

                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2.5, color: '#8a7a82', fontFamily: '"Nunito", sans-serif' }}>
                                    🔒 Demo Mode - No actual payment will be processed
                                </Typography>
                            </Paper>
                        </Fade>
                    </Grid>
                </Grid>

                {/* Success Stories Section */}
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h5" sx={{ 
                        fontFamily: '"Lora", serif',
                        fontWeight: 500, 
                        color: '#3d2c35', 
                        textAlign: 'center',
                        mb: 2 
                    }}>
                        Real Stories,{' '}
                        <em style={{ color: '#c27a5f', fontStyle: 'normal' }}>Real Impact</em>
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#8a7a82', mb: 5 }}>
                        Meet the women whose lives have been transformed by your support
                    </Typography>
                    
                    <Grid container spacing={4} alignItems="stretch">
                        {successStories.map((story, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: 'flex' }}>
                                <Zoom in={true} timeout={800 + index * 100} style={{ width: '100%', display: 'flex' }}>
                                    <Card sx={{ 
                                        bgcolor: '#ffffff', 
                                        borderRadius: '20px', 
                                        boxShadow: '0 2px 12px rgba(61,44,53,0.04)',
                                        border: '1px solid rgba(194,122,95,0.1)',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(61,44,53,0.12)',
                                        }
                                    }}>
                                        <CardMedia
                                            component="img"
                                            image={story.image}
                                            alt={story.name}
                                            sx={{
                                                height: 260,
                                                width: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                            }}
                                        />
                                        
                                        {/* Icon Badge Overlay */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            bgcolor: 'rgba(255,255,255,0.95)',
                                            borderRadius: '30px',
                                            px: 1.5,
                                            py: 0.8,
                                            fontSize: '1.2rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            zIndex: 1
                                        }}>
                                            {story.icon}
                                        </Box>
                                        
                                        <CardContent sx={{ 
                                            p: 3, 
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <FormatQuoteIcon sx={{ 
                                                color: '#c27a5f', 
                                                fontSize: 28, 
                                                opacity: 0.3,
                                                mb: 1.5
                                            }} />
                                            
                                            <Typography variant="body2" sx={{ 
                                                color: '#6b5260', 
                                                mb: 2.5, 
                                                lineHeight: 1.7, 
                                                fontStyle: 'italic',
                                                flex: 1
                                            }}>
                                                "{story.quote}"
                                            </Typography>
                                            
                                            <Divider sx={{ my: 2, borderColor: 'rgba(194,122,95,0.1)' }} />
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar 
                                                    src={story.image}
                                                    alt={story.name}
                                                    sx={{ 
                                                        width: 48, 
                                                        height: 48, 
                                                        border: '2px solid #c27a5f'
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ 
                                                        fontWeight: 700, 
                                                        color: '#3d2c35', 
                                                        fontFamily: '"Nunito", sans-serif' 
                                                    }}>
                                                        {story.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#c27a5f', display: 'block', fontWeight: 600 }}>
                                                        {story.role}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                        <span style={{ fontSize: '0.7rem' }}>📍</span>
                                                        <Typography variant="caption" sx={{ color: '#8a7a82' }}>
                                                            {story.location}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* FAQ Section */}
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#8a7a82' }}>
                        Have questions? <span style={{ color: '#c27a5f', fontWeight: 600, cursor: 'pointer' }}>View our FAQ</span> or contact us at <span style={{ color: '#c27a5f', fontWeight: 600 }}>support@hercircle.org</span>
                    </Typography>
                </Box>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    sx={{ 
                        width: '100%',
                        bgcolor: snackbar.severity === 'success' ? '#c27a5f' : '#f7f0ee',
                        color: snackbar.severity === 'success' ? '#fff' : '#3d2c35',
                        borderRadius: '16px',
                        fontFamily: '"Nunito", sans-serif',
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success' ? '#fff' : '#c27a5f'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Donate;