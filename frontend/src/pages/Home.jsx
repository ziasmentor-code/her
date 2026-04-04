import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Card, Button, Avatar, Stack, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import {
    FaShieldAlt, FaComments, FaHeart, FaHandHoldingHeart,
    FaArrowRight, FaUsers, FaBriefcase, FaBook, FaStar,
    FaQuoteLeft, FaCheckCircle
} from 'react-icons/fa';

import ishaImage from '../assets/isha.png';
import priyaImage from '../assets/priya1.jpg';
import advctImage from '../assets/advct.jpg';
import rianImage from '../assets/rian.jpg';

import woman1 from '../assets/woman1.jpg';
import woman2 from '../assets/woman2.jpg';
import woman3 from '../assets/woman3.jpg';
import woman4 from '../assets/woman4.jpg';

import counselingImg from '../assets/counseling.jpg';
import jobsImg from '../assets/jobs.jpg';
import coursesImg from '../assets/courses.jpg';
import safetyImg from '../assets/safety.jpg';
import anonymousChatImg from '../assets/anonymous-chat.jpg'; // Make sure this file exists

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');

  :root {
    --bg:         #fdfbf9;
    --surface:    #ffffff;
    --rose:       #f7f0ee;
    --rose-mid:   #ecddd8;
    --terra:      #c27a5f;
    --terra-lt:   #d9977e;
    --terra-dim:  rgba(194,122,95,0.12);
    --plum:       #3d2c35;
    --plum-mid:   #6b5260;
    --slate:      #8a7a82;
    --border:     rgba(194,122,95,0.15);
    --green:      #4a7c6f;
    --green-bg:   rgba(74,124,111,0.08);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .reveal     { opacity: 0; }
  .reveal.in  { animation: fadeUp 0.75s cubic-bezier(.22,1,.36,1) forwards; }

  .svc-card {
    transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease;
  }
  .svc-card:hover {
    transform: translateY(-6px) !important;
    box-shadow: 0 20px 40px rgba(61,44,53,0.12) !important;
  }

  .team-card {
    transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease;
  }
  .team-card:hover {
    transform: translateY(-8px) !important;
    box-shadow: 0 20px 44px rgba(61,44,53,0.10) !important;
  }

  .woman-card {
    transition: all 0.4s ease;
    cursor: pointer;
  }
  .woman-card:hover {
    transform: translateY(-8px);
  }
  .woman-card:hover .woman-image {
    transform: scale(1.1);
  }
  .woman-image {
    transition: transform 0.5s ease;
  }

  .stat-tile { transition: transform 0.3s ease; }
  .stat-tile:hover { transform: translateY(-4px); }

  .cta-btn {
    transition: transform 0.25s ease, box-shadow 0.25s ease !important;
  }
  .cta-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(194,122,95,0.35) !important;
  }
`;

function useReveal(threshold = 0.12) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) el.classList.add('in'); },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return ref;
}

function Label({ children, center }) {
    return (
        <Typography sx={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.2em', color: 'var(--terra)',
            textTransform: 'uppercase', mb: 1.5,
            display: 'flex', alignItems: 'center',
            justifyContent: center ? 'center' : 'flex-start', gap: 1.2,
        }}>
            <Box component="span" sx={{
                display: 'inline-block', width: 18, height: 2,
                bgcolor: 'var(--terra)', borderRadius: 4, opacity: 0.7
            }} />
            {children}
        </Typography>
    );
}

function Heading({ children, light, center }) {
    return (
        <Typography sx={{
            fontFamily: '"Lora", serif', fontWeight: 400,
            fontSize: { xs: '2rem', md: '2.8rem' },
            lineHeight: 1.25,
            color: light ? '#fdfbf9' : 'var(--plum)',
            textAlign: center ? 'center' : 'left', mb: 2,
        }}>
            {children}
        </Typography>
    );
}

function Body({ children, light, center, sx = {} }) {
    return (
        <Typography sx={{
            fontFamily: '"Nunito", sans-serif', fontWeight: 400,
            fontSize: '0.95rem', lineHeight: 1.8,
            color: light ? 'rgba(253,251,249,0.75)' : 'var(--slate)',
            textAlign: center ? 'center' : 'left', ...sx,
        }}>
            {children}
        </Typography>
    );
}

export default function Home() {

    useEffect(() => {
        const tag = document.createElement('style');
        tag.innerHTML = GLOBAL_CSS;
        document.head.appendChild(tag);
        return () => document.head.removeChild(tag);
    }, []);

    const services = [
        {
            icon: '🎯',
            title: 'Career Counseling',
            desc: 'One-on-one guidance from expert counselors — resume review, interview prep, and a personalised career roadmap.',
            link: '/counseling',
            cta: 'Book a Session',
            img: counselingImg,
            chips: ['Free', 'Expert'],
        },
        {
            icon: '💼',
            title: 'Job Opportunities',
            desc: '200+ active openings from women-friendly companies — remote, part-time, and full-time across all industries.',
            link: '/career',
            cta: 'Browse Jobs',
            img: jobsImg,
            chips: ['200+ Jobs', 'Remote'],
        },
        {
            icon: '📚',
            title: 'Professional Courses',
            desc: 'Free & paid courses in leadership, digital skills, communication and more — with recognised certificates.',
            link: '/courses',
            cta: 'Explore Courses',
            img: coursesImg,
            chips: ['30+ Courses', 'Certificate'],
        },
        {
            icon: '🛡️',
            title: 'Safety & Support',
            desc: '24/7 emergency support, legal guidance, and mental health resources. Your privacy always comes first.',
            link: '/safety',
            cta: 'Get Support',
            img: safetyImg,
            chips: ['24/7', 'Confidential'],
        },
    ];

    const team = [
        { image: ishaImage,  name: 'Dr. Isha',     role: 'Founder & CEO',           bio: '15+ years in women empowerment & career counseling' },
        { image: priyaImage, name: 'Priya Menon',  role: 'Head of Career Services', bio: 'Former HR Director · Career Coach for 1000+ women' },
        { image: advctImage, name: 'Adv. Lakshmi', role: 'Legal & Policy Advisor',  bio: 'Specialising in workplace rights & gender equality' },
        { image: rianImage,  name: 'Rian',         role: 'Tech & Innovation Lead',  bio: 'Tech lead · Women in STEM advocate' },
    ];

    const stats = [
        { value: '1,000+', label: 'Women Supported',   icon: '💛' },
        { value: '200+',   label: 'Partner Companies', icon: '🤝' },
        { value: '50+',    label: 'Workshops Held',    icon: '📖' },
        { value: '92%',    label: 'Satisfaction Rate', icon: '⭐' },
    ];

    const womenImages = [
        { image: woman1, name: 'Mahira',   role: 'Software Engineer' },
        { image: woman2, name: 'Jaquline', role: 'Entrepreneur' },
        { image: woman3, name: 'Juliya',   role: 'Marketing Lead' },
        { image: woman4, name: 'Sarah',    role: 'Legal Advisor' }, // Fixed: Added name
    ];

    const svcRef   = useReveal();
    const aboutRef = useReveal();
    const teamRef  = useReveal();
    const impRef   = useReveal();
    const ctaRef   = useReveal();
    const womenRef = useReveal();

    return (
        <Box sx={{ fontFamily: '"Nunito", sans-serif', bgcolor: 'var(--bg)' }}>
            <Hero />

            {/* ══ QUICK NAV STRIP ════════════════════════════════════════ */}
            <Box sx={{ bgcolor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { label: 'Get Counseling', href: '/counseling' },
                            { label: 'Find Jobs',      href: '/career' },
                            { label: 'Join Courses',   href: '/courses' },
                            { label: 'Safety Support', href: '/safety' },
                            { label: 'Anonymous Chat', href: '/anonymous' },
                        ].map((item, i) => (
                            <Button key={i} component={Link} to={item.href} sx={{
                                fontFamily: '"Nunito", sans-serif',
                                fontSize: '0.8rem', fontWeight: 700,
                                color: 'var(--plum-mid)', textTransform: 'none',
                                px: 3, py: 2, borderRadius: 0,
                                borderBottom: '2.5px solid transparent',
                                letterSpacing: '0.02em',
                                '&:hover': { color: 'var(--terra)', borderBottomColor: 'var(--terra)', bgcolor: 'transparent' },
                                transition: 'all 0.2s ease',
                            }}>
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ══ WELCOME BANNER ═════════════════════════════════════════ */}
            <Box sx={{ bgcolor: 'var(--rose)', py: { xs: 5, md: 7 } }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{
                            fontFamily: '"Lora", serif', fontWeight: 400,
                            fontSize: { xs: '1.5rem', md: '2.1rem' },
                            color: 'var(--plum)', lineHeight: 1.45, mb: 2,
                        }}>
                            You deserve support, opportunity,<br />and a community that believes in you. 🌷
                        </Typography>
                        <Body center sx={{ maxWidth: 560, mx: 'auto' }}>
                            HerCircle is a safe space built by women, for women — helping you grow in your career,
                            protect your rights, and find the strength to move forward.
                        </Body>
                    </Box>
                </Container>
            </Box>

            {/* ══ WOMEN IMAGES SECTION ═══════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#ffffff' }}>
                <Container maxWidth="lg">
                    <Box ref={womenRef} className="reveal" sx={{ textAlign: 'center', mb: 6 }}>
                        <Label center>Our Community</Label>
                        <Heading center>
                            Thousands of Women{' '}
                            <em style={{ color: 'var(--terra)' }}>Trust HerCircle</em>
                        </Heading>
                        <Body center sx={{ maxWidth: 560, mx: 'auto' }}>
                            Join a growing community of women who have transformed their lives with our support
                        </Body>
                    </Box>

                    <Grid container spacing={3} justifyContent="center">
                        {womenImages.map((woman, index) => (
                            <Grid size={{ xs: 6, sm: 3, md: 3 }} key={index}>
                                <Box className="woman-card" sx={{ textAlign: 'center', p: 2 }}>
                                    <Box sx={{
                                        position: 'relative', width: '100%', paddingTop: '100%',
                                        borderRadius: '20px', overflow: 'hidden', mb: 2,
                                        boxShadow: '0 8px 20px rgba(61,44,53,0.1)',
                                    }}>
                                        <Box
                                            component="img"
                                            src={woman.image}
                                            alt={woman.name}
                                            className="woman-image"
                                            sx={{
                                                position: 'absolute', top: 0, left: 0,
                                                width: '100%', height: '100%', objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                    <Typography sx={{
                                        fontFamily: '"Nunito", sans-serif',
                                        fontSize: '0.85rem', fontWeight: 700, color: 'var(--plum)',
                                    }}>
                                        {woman.name}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: '"Nunito", sans-serif',
                                        fontSize: '0.7rem', color: 'var(--terra)', fontWeight: 600,
                                    }}>
                                        {woman.role}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{
                        mt: 5, p: 4, bgcolor: 'var(--rose)',
                        borderRadius: '20px', textAlign: 'center',
                        maxWidth: 700, mx: 'auto',
                    }}>
                        <FaQuoteLeft size={32} color="#c27a5f" style={{ opacity: 0.3, marginBottom: 16 }} />
                        <Typography sx={{
                            fontFamily: '"Lora", serif', fontSize: '1.1rem',
                            color: 'var(--plum)', fontStyle: 'italic', mb: 2,
                        }}>
                            "HerCircle changed my life. I found not just a job, but a family that supports me every step of the way."
                        </Typography>
                        <Typography sx={{
                            fontFamily: '"Nunito", sans-serif',
                            fontSize: '0.85rem', fontWeight: 700, color: 'var(--terra)',
                        }}>
                            — Sarah M., HerCircle Member
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ══ SERVICES SECTION ══════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 11 }, bgcolor: '#ffffff' }}>
                <Container maxWidth="lg">
                    <Box ref={svcRef} className="reveal" sx={{ textAlign: 'center', mb: 7 }}>
                        <Typography variant="overline" sx={{
                            color: '#c27a5f', fontWeight: 700,
                            letterSpacing: '0.15em',
                            fontFamily: '"Nunito", sans-serif',
                            mb: 1, display: 'inline-block',
                        }}>
                            OUR SERVICES
                        </Typography>
                        <Typography variant="h3" sx={{
                            fontFamily: '"Lora", serif', fontWeight: 500,
                            color: '#3d2c35', mb: 2,
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}>
                            How We <span style={{ color: '#c27a5f' }}>Support</span> You
                        </Typography>
                        <Typography sx={{
                            fontFamily: '"Nunito", sans-serif',
                            color: '#8a7a82', maxWidth: 600, mx: 'auto',
                            fontSize: '1rem', lineHeight: 1.7,
                        }}>
                            Comprehensive support system designed to help you grow, succeed, and stay safe
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {services.map((s, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={i}>
                                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Card sx={{
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: '1px solid #f0e8e4',
                                        bgcolor: '#fff',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        },
                                    }}>
                                        <Box sx={{
                                            px: 3, pt: 3, pb: 1.5,
                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                            flexShrink: 0,
                                        }}>
                                            <Typography sx={{ fontSize: '1.8rem' }}>{s.icon}</Typography>
                                            <Typography sx={{
                                                fontFamily: '"Lora", serif',
                                                fontSize: '1.3rem', fontWeight: 700, color: '#3d2c35',
                                            }}>
                                                {s.title}
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            width: '100%',
                                            height: 220,
                                            flexShrink: 0,
                                            overflow: 'hidden',
                                            bgcolor: '#f5f0ec',
                                        }}>
                                            <img
                                                src={s.img}
                                                alt={s.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    objectPosition: 'center top',
                                                    display: 'block',
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/600x400/f7f0ee/c27a5f?text=' + s.title;
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Typography sx={{
                                                color: '#6b5260', lineHeight: 1.7,
                                                fontSize: '0.95rem', mb: 2.5,
                                            }}>
                                                {s.desc}
                                            </Typography>

                                            <Box sx={{
                                                display: 'flex', justifyContent: 'space-between',
                                                alignItems: 'center', flexWrap: 'wrap', gap: 1,
                                            }}>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {s.chips.map((chip, ci) => (
                                                        <Chip
                                                            key={ci}
                                                            label={chip}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#f7f0ee',
                                                                color: '#c27a5f',
                                                                fontWeight: 600,
                                                                fontFamily: '"Nunito", sans-serif',
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                                <Button
                                                    component={Link}
                                                    to={s.link}
                                                    variant="contained"
                                                    sx={{
                                                        bgcolor: '#c27a5f',
                                                        borderRadius: '40px',
                                                        textTransform: 'none',
                                                        px: 3,
                                                        fontWeight: 600,
                                                        '&:hover': { bgcolor: '#d9977e', transform: 'translateX(3px)' },
                                                        transition: 'all 0.3s',
                                                    }}
                                                >
                                                    {s.cta} →
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Anonymous Chat Card with Image */}
                    <Box sx={{ mt: 4 }}>
                        <Card sx={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid #e8e0f0',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                            },
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: 'center',
                            }}>
                                {/* Image Section */}
                                <Box sx={{
                                    width: { xs: '100%', md: '35%' },
                                    height: { xs: 220, md: 'auto' },
                                    overflow: 'hidden',
                                    position: 'relative',
                                    backgroundColor: '#6b4e8a',
                                }}>
                                    <img 
                                        src={anonymousChatImg}
                                        alt="Anonymous Chat Support"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/600x400/6b4e8a/ffffff?text=Anonymous+Chat';
                                        }}
                                    />
                                </Box>
                                
                                {/* Content Section */}
                                <Box sx={{ p: 4, flex: 1 }}>
                                    <Typography sx={{ color: '#3d2c35', fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
                                        Need someone to talk to?
                                    </Typography>
                                    <Typography sx={{ color: '#8a7a82', mb: 2 }}>
                                        Connect anonymously with our community. Share your thoughts, seek advice, or just listen.
                                        No registration needed, completely confidential.
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                        {['100% Anonymous', 'No Sign-up', '24/7 Support'].map((item, i) => (
                                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaCheckCircle size={14} color="#6b4e8a" />
                                                <Typography sx={{ fontSize: '0.75rem', color: '#6b4e8a' }}>{item}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Button
                                        component={Link}
                                        to="/anonymous"
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#6b4e8a',
                                            borderRadius: '30px',
                                            px: 4, py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            boxShadow: 'none',
                                            '&:hover': { bgcolor: '#9b6fc0', transform: 'translateY(-2px)', boxShadow: 'none' },
                                            transition: 'all 0.3s',
                                        }}
                                    >
                                        Start Anonymous Chat →
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    </Box>

                    {/* Quick Access */}
                    <Box sx={{ mt: 5, p: 4, bgcolor: '#f8f6f4', borderRadius: '20px', textAlign: 'center' }}>
                        <Typography sx={{
                            fontFamily: '"Nunito", sans-serif',
                            fontSize: '0.9rem', color: '#8a7a82', mb: 2,
                        }}>
                            ⚡ Quick Access
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {[
                                { label: '🎯 Counseling', href: '/counseling', color: '#c27a5f' },
                                { label: '💼 Jobs',       href: '/career',     color: '#4a7c6f' },
                                { label: '📚 Courses',    href: '/courses',    color: '#8b6b4a' },
                                { label: '🛡️ Safety',    href: '/safety',     color: '#c53030' },
                                { label: '💬 Chat',       href: '/anonymous',  color: '#6b4e8a' },
                            ].map((item, i) => (
                                <Button
                                    key={i}
                                    component={Link}
                                    to={item.href}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: '40px',
                                        borderColor: item.color,
                                        color: item.color,
                                        textTransform: 'none',
                                        px: 3,
                                        fontWeight: 600,
                                        fontFamily: '"Nunito", sans-serif',
                                        '&:hover': { bgcolor: item.color, color: '#fff', borderColor: item.color },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>
             <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'var(--bg)' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 5, md: 9 }} alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box ref={aboutRef} className="reveal" sx={{ position: 'relative' }}>
                                <Box sx={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(135deg, var(--rose) 0%, transparent 65%)',
                                    borderRadius: '20px',
                                    transform: 'translate(-12px,-12px)', zIndex: 0,
                                }} />
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
                                    alt="Women supporting women"
                                    sx={{
                                        width: '100%', display: 'block',
                                        borderRadius: '20px', position: 'relative', zIndex: 1,
                                        boxShadow: '0 16px 48px rgba(61,44,53,0.12)',
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute', bottom: 20, right: -16, zIndex: 2,
                                    bgcolor: 'var(--terra)', color: '#fff',
                                    py: 2, px: 3, borderRadius: '14px',
                                    boxShadow: '0 8px 24px rgba(194,122,95,0.35)',
                                    textAlign: 'center', minWidth: 120,
                                }}>
                                    <Typography sx={{ fontFamily: '"Lora", serif', fontSize: '1.8rem', fontWeight: 400, lineHeight: 1 }}>
                                        2024
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.62rem', fontWeight: 700, opacity: 0.88, mt: 0.3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                        Est.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 7 }}>
                            <Box ref={useReveal()} className="reveal">
                                <Label>About Us</Label>
                                <Heading>Who We <em style={{ color: 'var(--terra)' }}>Are</em></Heading>
                                <Body sx={{ mb: 4 }}>
                                    HerCircle is a women-led initiative built on the belief that every woman deserves
                                    support, opportunity, and a community that truly understands her journey.
                                    We provide career guidance, legal resources, mental health support, and a warm,
                                    judgment-free space where women can grow and thrive.
                                </Body>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                                    {[
                                        { icon: '💛', title: 'Our Mission', text: 'To create a world where every woman has the support, skills, and opportunities to thrive in her career and life.' },
                                        { icon: '🌱', title: 'Our Vision',  text: 'A future where women navigate their careers with confidence — free from bias, with equal pay and leadership.' },
                                        { icon: '🤝', title: 'Our Values', text: 'Safety, Empowerment, Inclusivity, and Compassion — in everything we do.' },
                                    ].map((item, i) => (
                                        <Box key={i} sx={{
                                            display: 'flex', gap: 2.5,
                                            pb: i < 2 ? 3 : 0,
                                            borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                                        }}>
                                            <Typography sx={{ fontSize: '1.2rem', mt: 0.2, flexShrink: 0 }}>{item.icon}</Typography>
                                            <Box>
                                                <Typography sx={{
                                                    fontFamily: '"Lora", serif', fontSize: '1rem',
                                                    fontWeight: 500, color: 'var(--plum)', mb: 0.4,
                                                }}>
                                                    {item.title}
                                                </Typography>
                                                <Body sx={{ fontSize: '0.875rem' }}>{item.text}</Body>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Button component={Link} to="/about" sx={{
                                    fontFamily: '"Nunito", sans-serif',
                                    fontSize: '0.82rem', fontWeight: 700,
                                    color: 'var(--terra)', textTransform: 'none',
                                    px: 3.5, py: 1.3,
                                    border: '1.5px solid var(--terra)',
                                    borderRadius: '10px',
                                    display: 'inline-flex', alignItems: 'center', gap: 1,
                                    '&:hover': { bgcolor: 'var(--terra)', color: '#fff', borderColor: 'var(--terra)' },
                                    transition: 'all 0.25s ease',
                                }}>
                                    Learn More About Us <FaArrowRight size={11} />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ══ TEAM ═══════════════════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 11 }, bgcolor: 'var(--rose)' }}>
                <Container maxWidth="lg">
                    <Box ref={teamRef} className="reveal" sx={{ textAlign: 'center', mb: 7 }}>
                        <Label center>Meet the Team</Label>
                        <Heading center>
                            The Women Behind{' '}
                            <em style={{ color: 'var(--terra)' }}>HerCircle</em>
                        </Heading>
                        <Body center sx={{ maxWidth: 440, mx: 'auto' }}>
                            Passionate, experienced, and here for you — every step of the way.
                        </Body>
                    </Box>

                    <Grid container spacing={3} justifyContent="center">
                        {team.map((t, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                <Box className="reveal team-card" ref={useReveal()} sx={{ animationDelay: `${i * 0.09}s`, height: '100%' }}>
                                    <Card sx={{
                                        textAlign: 'center',
                                        bgcolor: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '18px',
                                        boxShadow: '0 2px 12px rgba(61,44,53,0.05)',
                                        overflow: 'hidden', height: '100%',
                                    }}>
                                        <Box sx={{ overflow: 'hidden', height: 190, bgcolor: 'var(--rose-mid)', flexShrink: 0 }}>
                                            {t.image ? (
                                                <Box
                                                    component="img"
                                                    src={t.image}
                                                    alt={t.name}
                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                                                />
                                            ) : (
                                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👩‍💼</Box>
                                            )}
                                        </Box>
                                        <Box sx={{ p: 3 }}>
                                            <Typography sx={{
                                                fontFamily: '"Lora", serif', fontSize: '1.05rem',
                                                fontWeight: 500, color: 'var(--plum)', mb: 0.4,
                                            }}>
                                                {t.name}
                                            </Typography>
                                            <Typography sx={{
                                                fontFamily: '"Nunito", sans-serif', fontSize: '0.68rem',
                                                fontWeight: 700, color: 'var(--terra)',
                                                textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5,
                                            }}>
                                                {t.role}
                                            </Typography>
                                            <Box sx={{ width: 28, height: 2, bgcolor: 'var(--rose-mid)', mx: 'auto', mb: 1.5, borderRadius: 4 }} />
                                            <Body sx={{ fontSize: '0.8rem', lineHeight: 1.55 }}>{t.bio}</Body>
                                        </Box>
                                    </Card>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ══ IMPACT ═════════════════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'var(--plum)', position: 'relative', overflow: 'hidden' }}>
                {[500, 320, 180].map((s, i) => (
                    <Box key={i} sx={{
                        position: 'absolute', top: '50%', right: -s / 3,
                        transform: 'translateY(-50%)',
                        width: s, height: s, borderRadius: '50%',
                        border: `1px solid rgba(255,255,255,${0.03 + i * 0.02})`,
                        pointerEvents: 'none',
                    }} />
                ))}
                <Container maxWidth="lg">
                    <Box ref={impRef} className="reveal" sx={{ textAlign: 'center', mb: 7 }}>
                        <Label center>Our Impact</Label>
                        <Heading light center>
                            Making a Difference,{' '}
                            <em style={{ color: 'var(--terra-lt)' }}>One Woman at a Time</em>
                        </Heading>
                        <Body light center sx={{ maxWidth: 480, mx: 'auto' }}>
                            Real numbers. Real lives changed.
                        </Body>
                    </Box>

                    <Grid container spacing={0}>
                        {[
                            { value: '1,000+', label: 'Women Empowered',   sub: 'Successfully placed in jobs' },
                            { value: '200+',   label: 'Partner Companies', sub: 'Women-friendly employers' },
                            { value: '50+',    label: 'Workshops Held',    sub: 'Skill development sessions' },
                            { value: '92%',    label: 'Satisfaction Rate', sub: 'Women satisfied with support' },
                        ].map((s, i) => (
                            <Grid size={{ xs: 6, md: 3 }} key={i}>
                                <Box ref={useReveal()} className="reveal" sx={{
                                    textAlign: 'center',
                                    py: { xs: 4, md: 6 }, px: 2,
                                    borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                                    borderBottom: { xs: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none', md: 'none' },
                                    animationDelay: `${i * 0.1}s`,
                                }}>
                                    <Typography sx={{
                                        fontFamily: '"Lora", serif',
                                        fontSize: { xs: '2.5rem', md: '3.4rem' },
                                        fontWeight: 400, color: 'var(--terra-lt)',
                                        lineHeight: 1, mb: 1,
                                    }}>
                                        {s.value}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: '"Nunito", sans-serif',
                                        fontSize: '0.75rem', fontWeight: 700,
                                        color: '#fff', letterSpacing: '0.08em',
                                        textTransform: 'uppercase', mb: 0.5,
                                    }}>
                                        {s.label}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: '"Nunito", sans-serif',
                                        fontSize: '0.72rem', color: 'rgba(253,251,249,0.42)',
                                    }}>
                                        {s.sub}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ══ CTA CARD ═══════════════════════════════════════════════ */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'var(--bg)' }}>
                <Container maxWidth="md">
                    <Box ref={ctaRef} className="reveal" sx={{
                        bgcolor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '24px',
                        p: { xs: 4, md: 7 },
                        textAlign: 'center',
                        boxShadow: '0 8px 40px rgba(61,44,53,0.07)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <Box sx={{
                            position: 'absolute', top: -60, right: -60,
                            width: 220, height: 220, borderRadius: '50%',
                            background: 'radial-gradient(circle, var(--rose) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }} />
                        <Box sx={{
                            position: 'absolute', bottom: -40, left: -40,
                            width: 180, height: 180, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(194,122,95,0.06) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }} />

                        <Typography sx={{ fontSize: '2.8rem', mb: 2, display: 'block' }}>🌸</Typography>
                        <Label center>Join Us</Label>
                        <Heading center>
                            Ready to Take the{' '}
                            <em style={{ color: 'var(--terra)' }}>Next Step?</em>
                        </Heading>
                        <Body center sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                            Whether you need support, want to share your story, or simply connect with
                            like-minded women — HerCircle is here for you. Always.
                        </Body>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button component={Link} to="/register" className="cta-btn" sx={{
                                fontFamily: '"Nunito", sans-serif',
                                fontSize: '0.88rem', fontWeight: 700,
                                textTransform: 'none',
                                bgcolor: 'var(--terra)', color: '#fff',
                                px: 4.5, py: 1.5, borderRadius: '12px',
                                boxShadow: '0 4px 16px rgba(194,122,95,0.25)',
                                display: 'inline-flex', alignItems: 'center', gap: 1.2,
                                '&:hover': { bgcolor: 'var(--terra-lt)' },
                            }}>
                                Join HerCircle — It's Free <FaArrowRight size={13} />
                            </Button>
                            <Button component={Link} to="/about" sx={{
                                fontFamily: '"Nunito", sans-serif',
                                fontSize: '0.88rem', fontWeight: 700,
                                textTransform: 'none', color: 'var(--plum-mid)',
                                px: 4, py: 1.5, borderRadius: '12px',
                                border: '1.5px solid var(--rose-mid)',
                                '&:hover': { bgcolor: 'var(--rose)', borderColor: 'var(--terra)', color: 'var(--terra)' },
                                transition: 'all 0.25s ease',
                            }}>
                                Learn More
                            </Button>
                        </Box>

                        <Typography sx={{
                            fontFamily: '"Nunito", sans-serif', fontSize: '0.75rem',
                            color: 'var(--slate)', mt: 3, opacity: 0.7,
                        }}>
                            🔒 100% private & confidential · No spam · Cancel anytime
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ══ TRUST STRIP ════════════════════════════════════════════ */}
            <Box sx={{ py: 5, bgcolor: 'var(--plum)' }}>
                <Container maxWidth="lg">
                    <Grid container>
                        {[
                            { icon: '🔒', title: '100% Confidential', sub: 'Your data is always safe' },
                            { icon: '🕐', title: '24 / 7 Support',    sub: "We're always here for you" },
                            { icon: '💚', title: 'Free to Join',      sub: 'No cost, no hidden fees' },
                        ].map((item, i) => (
                            <Grid size={{ xs: 12, md: 4 }} key={i}>
                                <Box sx={{
                                    textAlign: 'center', py: 3, px: 4,
                                    borderRight: { md: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' },
                                }}>
                                    <Typography sx={{ fontSize: '1.5rem', mb: 1 }}>{item.icon}</Typography>
                                    <Typography sx={{
                                        fontFamily: '"Lora", serif', fontSize: '1rem',
                                        fontWeight: 500, color: '#fdfbf9', mb: 0.4,
                                    }}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: '"Nunito", sans-serif',
                                        fontSize: '0.78rem', color: 'rgba(253,251,249,0.48)', fontWeight: 400,
                                    }}>
                                        {item.sub}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

       
    

        </Box>
    );
}