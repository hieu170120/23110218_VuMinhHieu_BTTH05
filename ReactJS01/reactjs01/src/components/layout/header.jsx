import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';

const navLinks = [
    { label: 'iPhone', href: '/search?category=iphone' },
    { label: 'iPad',   href: '/search?category=ipad' },
    { label: 'Mac',    href: '/search?category=mac' },
    { label: 'Watch',  href: '/search?category=watch' },
    { label: 'Audio',  href: '/search?category=audio' },
    { label: 'Phụ kiện', href: '/search' },
];

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        localStorage.clear('access_token');
        setAuth({ isAuthenticated: false, user: { email: '', name: '' } });
        navigate('/');
    };

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                transition: 'background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s',
                background: scrolled
                    ? 'rgba(0,0,0,0.85)'
                    : 'rgba(0,0,0,1)',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.5)' : 'none',
                color: '#fff',
            }}
        >
            {/* 3-column grid: logo | nav | actions */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    height: '60px',
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 24px',
                }}
            >
                {/* ── Column 1: Logo (left) */}
                <Link
                    to="/"
                    style={{
                        justifySelf: 'start',
                        fontSize: '20px',
                        fontWeight: 700,
                        letterSpacing: '-0.5px',
                        color: '#fff',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    TechStore
                </Link>

                {/* ── Column 2: Nav (center) */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    {navLinks.map(({ label, href }) => (
                        <Link
                            key={label}
                            to={href}
                            style={{
                                color: '#d1d5db',
                                fontSize: '14px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                letterSpacing: '0.01em',
                                transition: 'color 0.2s',
                                position: 'relative',
                                paddingBottom: '4px',
                            }}
                            className="nav-link"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* ── Column 3: Icons (right) */}
                <div
                    style={{
                        justifySelf: 'end',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        fontSize: '18px',
                    }}
                >
                    <Link
                        to="/search"
                        style={{ color: '#d1d5db', transition: 'color 0.2s' }}
                        className="icon-btn"
                    >
                        <SearchOutlined />
                    </Link>

                    <div style={{ position: 'relative', cursor: 'pointer' }} className="icon-btn">
                        <ShoppingCartOutlined style={{ color: '#d1d5db' }} />
                        <span
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#2563eb',
                                color: '#fff',
                                fontSize: '10px',
                                borderRadius: '9999px',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                            }}
                        >
                            0
                        </span>
                    </div>

                    {/* User Dropdown */}
                    <div className="dropdown-wrap" style={{ position: 'relative' }}>
                        <div
                            className="icon-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                color: '#d1d5db',
                            }}
                        >
                            <UserOutlined />
                            {auth.isAuthenticated && (
                                <span style={{ fontSize: '12px', fontWeight: 400 }}>
                                    {auth.user.name || auth.user.email?.split('@')[0]}
                                </span>
                            )}
                        </div>

                        <div className="dropdown-menu">
                            {auth.isAuthenticated ? (
                                <>
                                    {auth.user.role === 'admin' && (
                                        <>
                                            <Link to="/admin/products" className="dropdown-item" style={{ color: '#059669', fontWeight: 700 }}>
                                                Quản lý Sản phẩm
                                            </Link>
                                            <Link to="/admin/banners" className="dropdown-item" style={{ color: '#059669', fontWeight: 700 }}>
                                                Quản lý Banner
                                            </Link>
                                        </>
                                    )}
                                    <Link to="/user" className="dropdown-item">Tài khoản</Link>
                                    <div onClick={handleLogout} className="dropdown-item danger">Đăng xuất</div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="dropdown-item">Đăng nhập</Link>
                                    <Link to="/register" className="dropdown-item">Đăng ký</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline styles for hover & dropdown */}
            <style>{`
                .nav-link:hover { color: #fff !important; }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 1.5px;
                    background: #fff;
                    transform: scaleX(0);
                    transition: transform 0.25s ease;
                    transform-origin: center;
                    border-radius: 2px;
                }
                .nav-link:hover::after { transform: scaleX(1); }

                .icon-btn:hover { color: #fff !important; }

                .dropdown-wrap:hover .dropdown-menu {
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: translateY(0) !important;
                }
                .dropdown-menu {
                    position: absolute;
                    right: 0; top: calc(100% + 12px);
                    background: #fff;
                    color: #111;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
                    min-width: 160px;
                    padding: 8px 0;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-6px);
                    transition: all 0.25s ease;
                }
                .dropdown-item {
                    display: block;
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #111;
                    text-decoration: none;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .dropdown-item:hover { background: #f3f4f6; }
                .dropdown-item.danger { color: #dc2626; }
                .dropdown-item.danger:hover { background: #fef2f2; }
            `}</style>
        </header>
    );
};

export default Header;