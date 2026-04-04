// CareerSupport.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaBriefcase, FaChartLine, FaUsers, FaHandSparkles, 
    FaLaptopCode, FaHeart, FaShieldAlt, FaStar, 
    FaArrowRight, FaCalendarAlt, FaChalkboardTeacher,
    FaNetworkWired, FaLightbulb, FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const CareerSupport = () => {
    const [activeTab, setActiveTab] = useState('women');
    const [selectedJob, setSelectedJob] = useState(null);

    // Job opportunities data
    const jobOpportunities = [
        {
            id: 1,
            title: "Senior Software Engineer",
            company: "TechForward India",
            location: "Bangalore (Remote Available)",
            type: "Full-time",
            experience: "5-8 years",
            skills: ["React", "Node.js", "Python", "AWS"],
            salary: "₹18-25 LPA",
            diversityHire: true,
            womenLed: true,
            description: "Looking for women leaders to drive technical innovation"
        },
        {
            id: 2,
            title: "Product Manager",
            company: "WomenInTech Solutions",
            location: "Mumbai / Hybrid",
            type: "Full-time",
            experience: "4-7 years",
            skills: ["Product Strategy", "Agile", "User Research", "Analytics"],
            salary: "₹20-28 LPA",
            diversityHire: true,
            womenLed: true,
            description: "Lead product development for women-centric applications"
        },
        {
            id: 3,
            title: "Marketing Director",
            company: "SheLeads Media",
            location: "Delhi NCR",
            type: "Full-time",
            experience: "6-10 years",
            skills: ["Digital Marketing", "Brand Strategy", "Team Leadership"],
            salary: "₹22-30 LPA",
            diversityHire: true,
            womenLed: true,
            description: "Drive marketing initiatives for women empowerment brands"
        },
        {
            id: 4,
            title: "Data Scientist",
            company: "Analytics HerWay",
            location: "Pune / Remote",
            type: "Full-time",
            experience: "3-6 years",
            skills: ["Python", "Machine Learning", "SQL", "Statistics"],
            salary: "₹15-22 LPA",
            diversityHire: true,
            womenLed: false,
            description: "Use data to solve real-world problems for women"
        },
        {
            id: 5,
            title: "HR Business Partner",
            company: "Inclusive Workplaces",
            location: "Hyderabad",
            type: "Full-time",
            experience: "5-8 years",
            skills: ["HR Strategy", "D&I Initiatives", "Employee Relations"],
            salary: "₹12-18 LPA",
            diversityHire: true,
            womenLed: true,
            description: "Champion diversity and inclusion in the workplace"
        },
        {
            id: 6,
            title: "UX/UI Designer",
            company: "DesignHer Studio",
            location: "Chennai / Remote",
            type: "Contract",
            experience: "2-5 years",
            skills: ["Figma", "User Research", "Prototyping", "Adobe XD"],
            salary: "₹8-12 LPA",
            diversityHire: true,
            womenLed: true,
            description: "Create beautiful, inclusive digital experiences"
        }
    ];

    // Mentorship programs
    const mentorshipPrograms = [
        {
            id: 1,
            title: "Tech Leadership Mentorship",
            mentor: "Priya Sharma - Engineering Director @ Google",
            duration: "6 months",
            focus: "Technical career growth, leadership skills",
            spots: "15 spots available"
        },
        {
            id: 2,
            title: "Executive Coaching Program",
            mentor: "Anjali Mehta - Former CEO @ Women's Web",
            duration: "3 months",
            focus: "Executive presence, strategic thinking",
            spots: "10 spots available"
        },
        {
            id: 3,
            title: "Entrepreneurship Bootcamp",
            mentor: "Kavita Iyer - Founder @ HerVenture Capital",
            duration: "4 months",
            focus: "Business planning, fundraising, scaling",
            spots: "20 spots available"
        }
    ];

    // Upcoming workshops
    const workshops = [
        {
            id: 1,
            title: "Navigating Bias in Tech",
            date: "April 15, 2026",
            time: "3:00 PM IST",
            speaker: "Dr. Sneha Patel",
            format: "Virtual Workshop",
            spots: "50 seats"
        },
        {
            id: 2,
            title: "Salary Negotiation Masterclass",
            date: "April 22, 2026",
            time: "4:30 PM IST",
            speaker: "Ritu Gupta - Career Coach",
            format: "Interactive Session",
            spots: "40 seats"
        },
        {
            id: 3,
            title: "Building Personal Brand",
            date: "April 29, 2026",
            time: "5:00 PM IST",
            speaker: "Neha Singh - LinkedIn Top Voice",
            format: "Webinar",
            spots: "Unlimited"
        }
    ];

    const handleApplyJob = (job) => {
        toast.success(`✨ Application started for ${job.title} at ${job.company}!`, {
            position: 'top-center',
            autoClose: 3000,
        });
        setSelectedJob(job);
    };

    const handleRegisterMentorship = (program) => {
        toast.info(`📝 Registered for ${program.title}! We'll contact you soon.`, {
            position: 'top-center',
            autoClose: 3000,
        });
    };

    const handleRegisterWorkshop = (workshop) => {
        toast.success(`🎉 Registered for ${workshop.title} on ${workshop.date}!`, {
            position: 'top-center',
            autoClose: 3000,
        });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600&display=swap');

                .career-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 24px;
                    font-family: 'Open Sans', sans-serif;
                }

                /* Hero Section */
                .career-hero {
                    background: linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%);
                    border-radius: 24px;
                    padding: 60px 48px;
                    margin-bottom: 60px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .career-hero::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -20%;
                    width: 300px;
                    height: 300px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .career-hero h1 {
                    font-size: 3rem;
                    font-weight: 800;
                    font-family: 'Montserrat', sans-serif;
                    margin-bottom: 20px;
                    position: relative;
                }

                .career-hero p {
                    font-size: 1.2rem;
                    line-height: 1.6;
                    max-width: 600px;
                    margin-bottom: 30px;
                    opacity: 0.95;
                    position: relative;
                }

                .hero-stats {
                    display: flex;
                    gap: 40px;
                    margin-top: 40px;
                    position: relative;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 800;
                    font-family: 'Montserrat', sans-serif;
                    display: block;
                }

                .stat-label {
                    font-size: 0.85rem;
                    opacity: 0.9;
                }

                /* Tabs */
                .career-tabs {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 40px;
                    border-bottom: 2px solid #E2E8F0;
                    padding-bottom: 12px;
                }

                .tab-btn {
                    padding: 12px 24px;
                    background: none;
                    border: none;
                    font-size: 1rem;
                    font-weight: 600;
                    font-family: 'Montserrat', sans-serif;
                    color: #718096;
                    cursor: pointer;
                    transition: all 0.3s;
                    position: relative;
                }

                .tab-btn:hover {
                    color: #6B46C1;
                }

                .tab-btn.active {
                    color: #6B46C1;
                }

                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -14px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: #6B46C1;
                    border-radius: 2px;
                }

                /* Job Cards */
                .jobs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 24px;
                    margin-bottom: 48px;
                }

                .job-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.3s;
                    cursor: pointer;
                }

                .job-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
                    border-color: #9F7AEA;
                }

                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: 16px;
                }

                .job-title {
                    font-size: 1.2rem;
                    font-weight: 700;
                    font-family: 'Montserrat', sans-serif;
                    color: #2D3748;
                    margin-bottom: 4px;
                }

                .company-name {
                    color: #6B46C1;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .badge {
                    background: #FAF5FF;
                    color: #6B46C1;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 600;
                }

                .job-details {
                    margin: 16px 0;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .detail {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: #4A5568;
                }

                .skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin: 16px 0;
                }

                .skill-tag {
                    background: #F7FAFC;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    color: #4A5568;
                }

                .salary {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #6B46C1;
                    margin: 12px 0;
                }

                .apply-btn {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #6B46C1, #9F7AEA);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 16px;
                }

                .apply-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(107,70,193,0.3);
                }

                /* Mentorship Cards */
                .mentorship-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 24px;
                }

                .mentorship-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.3s;
                }

                .mentorship-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
                }

                .mentor-name {
                    color: #6B46C1;
                    font-weight: 600;
                    margin: 12px 0;
                }

                .register-btn {
                    width: 100%;
                    padding: 10px;
                    background: white;
                    border: 2px solid #6B46C1;
                    color: #6B46C1;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 16px;
                }

                .register-btn:hover {
                    background: #6B46C1;
                    color: white;
                }

                /* Workshop Cards */
                .workshop-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 24px;
                }

                .workshop-card {
                    background: linear-gradient(135deg, #FAF5FF, white);
                    border: 1px solid #E9D8FD;
                    border-radius: 16px;
                    padding: 24px;
                }

                .workshop-date {
                    display: inline-block;
                    background: #E9D8FD;
                    color: #6B46C1;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 12px;
                }

                @media (max-width: 768px) {
                    .career-hero {
                        padding: 40px 24px;
                    }
                    
                    .career-hero h1 {
                        font-size: 2rem;
                    }
                    
                    .hero-stats {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .jobs-grid,
                    .mentorship-grid,
                    .workshop-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="career-container">
                {/* Hero Section */}
                <div className="career-hero">
                    <h1>Empower Your Career Journey</h1>
                    <p>
                        We give women the support and skills to navigate bias and lean into their strengths, 
                        and we give companies tools to ensure women have opportunities to advance and feel valued at work.
                    </p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Women Placed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">150+</span>
                            <span className="stat-label">Partner Companies</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">92%</span>
                            <span className="stat-label">Success Rate</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="career-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'women' ? 'active' : ''}`}
                        onClick={() => setActiveTab('women')}
                    >
                        <FaBriefcase style={{ marginRight: '8px' }} />
                        Jobs for Women
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'mentorship' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mentorship')}
                    >
                        <FaChalkboardTeacher style={{ marginRight: '8px' }} />
                        Mentorship Programs
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'workshops' ? 'active' : ''}`}
                        onClick={() => setActiveTab('workshops')}
                    >
                        <FaCalendarAlt style={{ marginRight: '8px' }} />
                        Skill Workshops
                    </button>
                </div>

                {/* Jobs Section */}
                {activeTab === 'women' && (
                    <>
                        <div className="jobs-grid">
                            {jobOpportunities.map(job => (
                                <div key={job.id} className="job-card">
                                    <div className="job-header">
                                        <div>
                                            <div className="job-title">{job.title}</div>
                                            <div className="company-name">{job.company}</div>
                                        </div>
                                        {job.womenLed && <span className="badge">👩‍💼 Women-Led</span>}
                                    </div>
                                    
                                    <div className="job-details">
                                        <span className="detail">
                                            <FaBriefcase size={12} /> {job.type}
                                        </span>
                                        <span className="detail">
                                            📍 {job.location}
                                        </span>
                                        <span className="detail">
                                            ⭐ {job.experience}
                                        </span>
                                    </div>
                                    
                                    <div className="skills">
                                        {job.skills.map((skill, idx) => (
                                            <span key={idx} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                    
                                    <div className="salary">{job.salary}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '12px' }}>
                                        {job.description}
                                    </div>
                                    
                                    <button className="apply-btn" onClick={() => handleApplyJob(job)}>
                                        Apply Now → 
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <Link to="/jobs" style={{ color: '#6B46C1', fontWeight: '600', textDecoration: 'none' }}>
                                View All Jobs → 
                            </Link>
                        </div>
                    </>
                )}

                {/* Mentorship Section */}
                {activeTab === 'mentorship' && (
                    <div className="mentorship-grid">
                        {mentorshipPrograms.map(program => (
                            <div key={program.id} className="mentorship-card">
                                <FaHeart size={32} color="#9F7AEA" />
                                <h3 style={{ fontSize: '1.3rem', margin: '16px 0 8px', fontFamily: 'Montserrat' }}>
                                    {program.title}
                                </h3>
                                <div className="mentor-name">{program.mentor}</div>
                                <div className="job-details">
                                    <span className="detail">⏱️ {program.duration}</span>
                                    <span className="detail">🎯 {program.focus}</span>
                                </div>
                                <div style={{ color: '#6B46C1', fontWeight: '600', margin: '12px 0' }}>
                                    {program.spots}
                                </div>
                                <button className="register-btn" onClick={() => handleRegisterMentorship(program)}>
                                    Apply for Mentorship
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Workshops Section */}
                {activeTab === 'workshops' && (
                    <div className="workshop-grid">
                        {workshops.map(workshop => (
                            <div key={workshop.id} className="workshop-card">
                                <div className="workshop-date">
                                    <FaCalendarAlt size={10} style={{ marginRight: '4px' }} />
                                    {workshop.date} | {workshop.time}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', margin: '12px 0', fontFamily: 'Montserrat' }}>
                                    {workshop.title}
                                </h3>
                                <div style={{ color: '#6B46C1', fontWeight: '600', margin: '8px 0' }}>
                                    🎤 {workshop.speaker}
                                </div>
                                <div className="job-details">
                                    <span className="detail">💻 {workshop.format}</span>
                                    <span className="detail">👥 {workshop.spots}</span>
                                </div>
                                <button className="register-btn" onClick={() => handleRegisterWorkshop(workshop)}>
                                    Register Now →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Resources Section */}
                <div style={{ 
                    marginTop: '60px', 
                    padding: '40px', 
                    background: '#FAF5FF', 
                    borderRadius: '24px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontFamily: 'Montserrat', marginBottom: '20px', color: '#2D3748' }}>
                        Need Help Navigating Workplace Bias?
                    </h2>
                    <p style={{ color: '#4A5568', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
                        Connect with our career counselors who specialize in helping women overcome workplace challenges
                    </p>
                    <button style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #6B46C1, #9F7AEA)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        Talk to a Career Coach →
                    </button>
                </div>
            </div>
        </>
    );
};

export default CareerSupport;