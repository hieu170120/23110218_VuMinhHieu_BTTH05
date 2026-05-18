import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../util/axios.customize';
import ProductCard from '../components/ProductCard';
import { Pagination, Spin, Select } from 'antd';
import { RightOutlined, AppstoreOutlined, UnorderedListOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

const PAGE_SIZE_OPTIONS = [8, 12, 16, 24];

/* ── List-view card nhỏ gọn ── */
const ListCard = ({ product }) => {
    const discount = product.promotionalPrice && product.price
        ? Math.round((1 - product.promotionalPrice / product.price) * 100)
        : 0;
    const finalPrice = product.promotionalPrice || product.price;

    return (
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <div className="cat-list-card">
                <div style={{
                    width: '110px', height: '110px', flexShrink: 0,
                    background: '#f9fafb', borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/110'}
                        alt={product.name}
                        style={{ width: '90px', height: '90px', objectFit: 'contain' }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111', margin: '0 0 6px', lineHeight: 1.4 }}>
                        {product.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 10px', lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626' }}>
                            {finalPrice.toLocaleString('vi-VN')}₫
                        </span>
                        {product.promotionalPrice && (
                            <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' }}>
                                {product.price.toLocaleString('vi-VN')}₫
                            </span>
                        )}
                        {discount > 0 && (
                            <span style={{
                                background: '#dc2626', color: '#fff',
                                fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                            }}>
                                -{discount}%
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                    <div style={{
                        padding: '10px 24px', background: '#2563eb', color: '#fff',
                        borderRadius: '9999px', fontSize: '13px', fontWeight: 700,
                        whiteSpace: 'nowrap', transition: 'background 0.2s',
                    }} className="cat-list-btn">
                        Xem ngay
                    </div>
                </div>
            </div>
        </Link>
    );
};

/* ── Main Page ── */
const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [data, setData]           = useState({ products: [], totalProducts: 0, totalPages: 1, currentPage: 1, category: null });
    const [loading, setLoading]     = useState(true);
    const [page, setPage]           = useState(1);
    const [limit, setLimit]         = useState(12);
    const [sortBy, setSortBy]       = useState('newest');
    const [viewMode, setViewMode]   = useState('grid');

    const fetchProducts = useCallback(async (pg, lmt, sort) => {
        setLoading(true);
        try {
            const sortParam = sort === 'price-asc'
                ? 'price'
                : sort === 'price-desc'
                    ? '-price'
                    : '-createdAt';

            const res = await axios.get(
                `/v1/api/products/category/${categoryId}?page=${pg}&limit=${lmt}&sort=${sortParam}`
            );
            if (res && res.products) {
                setData(res);
            }
        } catch (err) {
            console.error('Fetch category error:', err);
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        setPage(1);
        fetchProducts(1, limit, sortBy);
    }, [categoryId, sortBy, limit, fetchProducts]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts(newPage, limit, sortBy);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLimitChange = (val) => {
        setLimit(val);
        setPage(1);
    };

    const SORT_OPTIONS = [
        { label: 'Mới nhất', value: 'newest' },
        { label: 'Giá: thấp → cao', value: 'price-asc' },
        { label: 'Giá: cao → thấp', value: 'price-desc' },
    ];

    return (
        <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>

            {/* ── HEADER BAR ─────────────────────────────── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '24px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
                        <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }} className="cat-bc-link">
                            Trang chủ
                        </Link>
                        <RightOutlined style={{ fontSize: '9px' }} />
                        <span style={{ color: '#111', fontWeight: 600 }}>
                            {data.category?.name || 'Danh mục'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#6b7280', fontSize: '13px', fontWeight: 500,
                                    padding: '0', marginBottom: '8px', transition: 'color 0.2s',
                                }}
                                className="cat-back-btn"
                            >
                                <ArrowLeftOutlined /> Quay lại
                            </button>
                            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.5px' }}>
                                {data.category?.name || '...'}
                            </h1>
                            {!loading && (
                                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
                                    <strong style={{ color: '#111' }}>{data.totalProducts}</strong> sản phẩm
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px' }}>

                {/* ── TOOLBAR ───────────────────────────────── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#fff', borderRadius: '16px', padding: '14px 20px',
                    marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                }}>
                    {/* Sort */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Sắp xếp:</span>
                        {SORT_OPTIONS.map(({ label, value }) => {
                            const active = sortBy === value;
                            return (
                                <button
                                    key={value}
                                    onClick={() => setSortBy(value)}
                                    style={{
                                        padding: '7px 18px', borderRadius: '9999px',
                                        border: active ? 'none' : '1.5px solid #e5e7eb',
                                        background: active ? '#2563eb' : '#fff',
                                        color: active ? '#fff' : '#374151',
                                        fontSize: '13px', fontWeight: active ? 700 : 500,
                                        cursor: 'pointer',
                                        boxShadow: active ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right side: limit + view toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>Hiển thị:</span>
                            <Select
                                value={limit}
                                onChange={handleLimitChange}
                                size="small"
                                style={{ width: 70 }}
                            >
                                {PAGE_SIZE_OPTIONS.map(n => (
                                    <Option key={n} value={n}>{n}</Option>
                                ))}
                            </Select>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                            {[
                                { mode: 'grid', Icon: AppstoreOutlined },
                                { mode: 'list', Icon: UnorderedListOutlined },
                            ].map(({ mode, Icon }) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    style={{
                                        width: '34px', height: '34px', borderRadius: '10px',
                                        border: viewMode === mode ? 'none' : '1.5px solid #e5e7eb',
                                        background: viewMode === mode ? '#2563eb' : '#fff',
                                        color: viewMode === mode ? '#fff' : '#9ca3af',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s',
                                    }}
                                >
                                    <Icon />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── PRODUCT LIST ──────────────────────────── */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '320px' }}>
                        <Spin size="large" />
                    </div>
                ) : data.products.length === 0 ? (
                    <div style={{
                        background: '#fff', borderRadius: '20px',
                        padding: '80px 24px', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: '0 0 10px' }}>
                            Chưa có sản phẩm nào
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '15px' }}>
                            Danh mục này hiện chưa có sản phẩm. Hãy quay lại sau!
                        </p>
                        <Link to="/" style={{
                            display: 'inline-block', marginTop: '24px',
                            background: '#2563eb', color: '#fff',
                            padding: '12px 28px', borderRadius: '9999px',
                            fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                        }}>
                            Về trang chủ
                        </Link>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                                gap: '20px',
                            }}>
                                {data.products.map(p => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {data.products.map(p => (
                                    <ListCard key={p._id} product={p} />
                                ))}
                            </div>
                        )}

                        {/* ── PAGINATION ───────────────────────────── */}
                        {data.totalPages > 1 && (
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: '12px',
                                marginTop: '48px',
                                padding: '28px',
                                background: '#fff',
                                borderRadius: '20px',
                                boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                            }}>
                                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                                    Trang <strong style={{ color: '#111' }}>{data.currentPage}</strong> / {data.totalPages} 
                                    &nbsp;·&nbsp; Tổng <strong style={{ color: '#111' }}>{data.totalProducts}</strong> sản phẩm
                                </p>
                                <Pagination
                                    current={data.currentPage}
                                    total={data.totalProducts}
                                    pageSize={limit}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showQuickJumper
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
                .cat-bc-link:hover { color: #111 !important; }
                .cat-back-btn:hover { color: #2563eb !important; }
                .cat-list-card {
                    display: flex; gap: '20px'; align-items: center;
                    background: #fff; border-radius: 16px; padding: 16px 20px;
                    border: 1.5px solid #f0f0f0; gap: 20px;
                    transition: box-shadow 0.2s, transform 0.2s;
                }
                .cat-list-card:hover {
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                .cat-list-btn:hover { background: #1d4ed8 !important; }
            `}</style>
        </div>
    );
};

export default CategoryPage;
