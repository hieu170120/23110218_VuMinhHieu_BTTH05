import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../util/axios.customize';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../components/context/auth.context';
import { Spin } from 'antd';
import { RightOutlined, ShoppingOutlined } from '@ant-design/icons';

const SectionTitle = ({ title, sub, linkTo, linkLabel }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.5px' }}>
                {title}
            </h2>
            {sub && <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '16px' }}>{sub}</p>}
        </div>
        {linkTo && (
            <Link
                to={linkTo}
                style={{
                    color: '#2563eb',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    paddingBottom: '4px',
                    borderBottom: '1.5px solid transparent',
                    transition: 'border-color 0.2s',
                }}
                className="see-all-link"
            >
                {linkLabel || 'Xem tất cả'} <RightOutlined style={{ fontSize: '11px' }} />
            </Link>
        )}
    </div>
);

const ProductGrid = ({ products }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '24px',
    }}>
        {products.map(product => (
            <ProductCard key={product._id} product={product} />
        ))}
    </div>
);

const HomePage = () => {
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        latestProducts: [],
        bestSellingProducts: [],
        promotionalProducts: [],
    });

    const [banners, setBanners] = useState({
        heroBanners: [],
        subBanners: [],
    });

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [prodRes, bannerRes] = await Promise.all([
                    axios.get('/v1/api/products/home'),
                    axios.get('/v1/api/banners/active')
                ]);
                
                if (prodRes && prodRes.latestProducts) setData(prodRes);
                if (bannerRes && bannerRes.heroBanners) setBanners(bannerRes);
            } catch (error) {
                console.error('Failed to fetch home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    const hero = banners.heroBanners?.[0] || {
        title: "iPhone 15 Pro",
        description: "Titan. Thật bền. Thật nhẹ. Thật Pro.",
        imageUrl: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2000&auto=format&fit=crop",
        linkTo: "/search?category=iphone"
    };

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>

            {/* ── HERO ─────────────────────────────────────────── */}
            <section style={{
                position: 'relative',
                height: '88vh',
                background: '#000',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}>
                <img
                    src={hero.imageUrl}
                    alt="Hero"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
                />
                {/* gradient overlay bottom */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
                    background: 'linear-gradient(to bottom, transparent, #000)',
                }} />

                <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', padding: '0 24px' }}>
                    <p style={{
                        color: '#60a5fa', fontSize: '14px', fontWeight: 700,
                        letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px',
                    }}>
                        Mới ra mắt
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(48px, 8vw, 80px)',
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '-2px',
                        lineHeight: 1.05,
                        margin: '0 0 20px',
                    }}>
                        {hero.title}
                    </h1>
                    <p style={{ fontSize: '20px', color: '#d1d5db', marginBottom: '40px', fontWeight: 400 }}>
                        {hero.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <Link
                            to={hero.linkTo || '/search'}
                            style={{
                                background: '#2563eb',
                                color: '#fff',
                                padding: '14px 32px',
                                borderRadius: '9999px',
                                fontWeight: 700,
                                fontSize: '15px',
                                textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                transition: 'background 0.2s, transform 0.2s',
                            }}
                            className="hero-btn-primary"
                        >
                            Mua ngay <ShoppingOutlined />
                        </Link>
                        <Link
                            to={hero.linkTo || '/search'}
                            style={{
                                color: '#60a5fa',
                                fontSize: '15px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '14px 24px',
                                border: '1.5px solid rgba(96,165,250,0.4)',
                                borderRadius: '9999px',
                                transition: 'border-color 0.2s, color 0.2s',
                            }}
                            className="hero-btn-ghost"
                        >
                            Tìm hiểu thêm <RightOutlined style={{ fontSize: '12px' }} />
                        </Link>
                    </div>
                </div>

                {/* scroll indicator */}
                <div style={{
                    position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10,
                }}>
                    <div style={{
                        width: '1.5px', height: '48px',
                        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))',
                        animation: 'scrollLine 1.5s ease-in-out infinite',
                    }} />
                </div>
            </section>

            {/* ── MAIN CONTENT ─────────────────────────────────── */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px' }}>

                {/* Ưu đãi cực sốc */}
                {data.promotionalProducts?.length > 0 && (
                    <section style={{ marginBottom: '96px' }}>
                        <SectionTitle
                            title="Ưu đãi cực sốc 🔥"
                            sub="Những sản phẩm đang giảm giá mạnh nhất tại TechStore"
                            linkTo="/search"
                            linkLabel="Xem tất cả"
                        />
                        <ProductGrid products={data.promotionalProducts} />
                    </section>
                )}

                {/* Banner 2-col */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '96px' }}>
                    {banners.subBanners?.length > 0 ? (
                        banners.subBanners.slice(0, 2).map((sub, idx) => (
                            <div key={sub._id || idx} style={{
                                background: idx === 0 ? '#f5f5f7' : 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
                                borderRadius: '28px',
                                padding: '48px 40px',
                                textAlign: 'center',
                                minHeight: '420px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative',
                            }} className="banner-card">
                                <h3 style={{ fontSize: '26px', fontWeight: 800, color: idx === 0 ? '#111' : '#60a5fa', margin: '0 0 12px' }}>{sub.title}</h3>
                                <p style={{ fontSize: '16px', color: idx === 0 ? '#555' : '#9ca3af', marginBottom: '28px' }}>{sub.description}</p>
                                <Link
                                    to={sub.linkTo || '/search'}
                                    style={{
                                        background: idx === 0 ? '#111' : '#fff',
                                        color: idx === 0 ? '#fff' : '#111',
                                        padding: '12px 28px',
                                        borderRadius: '9999px',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        transition: 'background 0.2s',
                                        zIndex: 2,
                                    }}
                                >
                                    Xem chi tiết
                                </Link>
                                <img
                                    src={sub.imageUrl}
                                    alt={sub.title}
                                    style={{
                                        width: idx === 0 ? '80%' : '60%', 
                                        marginTop: '24px', 
                                        opacity: idx === 0 ? 1 : 0.75,
                                        transition: 'transform 0.6s ease',
                                    }}
                                    className="banner-img"
                                />
                            </div>
                        ))
                    ) : (
                        <>
                            {/* MacBook Fallback */}
                            <div style={{
                                background: '#f5f5f7',
                                borderRadius: '28px',
                                padding: '48px 40px',
                                textAlign: 'center',
                                minHeight: '420px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative',
                            }} className="banner-card">
                                <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#111', margin: '0 0 12px' }}>MacBook Air M3</h3>
                                <p style={{ fontSize: '16px', color: '#555', marginBottom: '28px' }}>Siêu mỏng. Siêu mạnh. Siêu M3.</p>
                                <Link
                                    to="/search?category=mac"
                                    style={{
                                        background: '#111',
                                        color: '#fff',
                                        padding: '12px 28px',
                                        borderRadius: '9999px',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        transition: 'background 0.2s',
                                        zIndex: 2,
                                    }}
                                >
                                    Xem chi tiết
                                </Link>
                                <img
                                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
                                    alt="MacBook"
                                    style={{
                                        width: '80%', marginTop: '24px',
                                        transition: 'transform 0.6s ease',
                                    }}
                                    className="banner-img"
                                />
                            </div>

                            {/* Apple Watch Fallback */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
                                borderRadius: '28px',
                                padding: '48px 40px',
                                textAlign: 'center',
                                minHeight: '420px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative',
                            }} className="banner-card">
                                <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#60a5fa', margin: '0 0 12px' }}>Apple Watch Ultra 2</h3>
                                <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '28px' }}>Cuộc phiêu lưu cấp độ mới.</p>
                                <Link
                                    to="/search?category=watch"
                                    style={{
                                        background: '#fff',
                                        color: '#111',
                                        padding: '12px 28px',
                                        borderRadius: '9999px',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        transition: 'background 0.2s',
                                        zIndex: 2,
                                    }}
                                >
                                    Mua ngay
                                </Link>
                                <img
                                    src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800&auto=format&fit=crop"
                                    alt="Watch"
                                    style={{
                                        width: '60%', marginTop: '24px', opacity: 0.75,
                                        transition: 'transform 0.6s ease',
                                    }}
                                    className="banner-img"
                                />
                            </div>
                        </>
                    )}
                </section>

                {/* Mới nhất */}
                {data.latestProducts?.length > 0 && (
                    <section style={{ marginBottom: '96px' }}>
                        <SectionTitle
                            title="Mới nhất tại cửa hàng"
                            linkTo="/search"
                            linkLabel="Xem tất cả"
                        />
                        <ProductGrid products={data.latestProducts} />
                    </section>
                )}

                {/* Được yêu thích */}
                {data.bestSellingProducts?.length > 0 && (
                    <section style={{
                        background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                        borderRadius: '36px',
                        padding: '64px 48px',
                        marginBottom: '48px',
                    }}>
                        <SectionTitle
                            title="Được yêu thích nhất ❤️"
                            sub="Khám phá những lựa chọn hàng đầu từ cộng đồng iFan"
                            linkTo="/search"
                            linkLabel="Xem tất cả"
                        />
                        <ProductGrid products={data.bestSellingProducts} />
                    </section>
                )}
            </div>

            {/* ── SUPPORT CTA ───────────────────────────────────── */}
            <section style={{
                borderTop: '1px solid #f0f0f0',
                padding: '80px 24px',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px', color: '#111' }}>Bạn cần hỗ trợ?</h2>
                    <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '48px', lineHeight: 1.6 }}>
                        Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm được sản phẩm Apple ưng ý nhất.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {[
                            { title: '💬 Chat với chuyên gia', desc: 'Nhận tư vấn trực tuyến 24/7' },
                            { title: '📍 Tìm cửa hàng', desc: 'Ghé thăm địa chỉ gần bạn nhất' },
                        ].map(({ title, desc }) => (
                            <div key={title} className="support-card">
                                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: '#111' }}>{title}</h4>
                                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                .hero-btn-primary:hover { background: #1d4ed8 !important; transform: scale(1.02); }
                .hero-btn-ghost:hover { border-color: #60a5fa !important; color: #93c5fd !important; }
                .see-all-link:hover { border-bottom-color: #2563eb !important; }
                .banner-card:hover .banner-img { transform: scale(1.04) translateY(-4px); }
                .support-card {
                    border: 1.5px solid #e5e7eb;
                    border-radius: 20px;
                    padding: 28px 32px;
                    min-width: 220px;
                    cursor: pointer;
                    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
                }
                .support-card:hover {
                    border-color: #2563eb;
                    box-shadow: 0 4px 24px rgba(37,99,235,0.1);
                    transform: translateY(-2px);
                }
                @keyframes scrollLine {
                    0%   { opacity: 0; transform: scaleY(0); transform-origin: top; }
                    50%  { opacity: 1; transform: scaleY(1); transform-origin: top; }
                    100% { opacity: 0; transform: scaleY(1); transform-origin: bottom; }
                }
            `}</style>
        </div>
    );
};

export default HomePage;