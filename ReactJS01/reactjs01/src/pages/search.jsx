import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../util/axios.customize';
import ProductCard from '../components/ProductCard';
import { Spin, Input, Pagination } from 'antd';
import { SearchOutlined, RightOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';

/* ─────────── helpers ─────────── */
const CATEGORIES = [
    { label: 'iPhone', value: 'iphone' },
    { label: 'iPad',   value: 'ipad' },
    { label: 'Mac',    value: 'mac' },
    { label: 'Watch',  value: 'watch' },
    { label: 'Audio',  value: 'audio' },
];

const PRICE_RANGES = [
    { label: 'Dưới 10 triệu',   value: 'under10' },
    { label: '10 – 20 triệu',   value: '10-20' },
    { label: 'Trên 20 triệu',   value: 'above20' },
];

const COLORS = ['#1c1c1e', '#e0e5eb', '#fef3c7', '#3b82f6', '#f9a8d4', '#bbf7d0'];
const STORAGES = ['128GB', '256GB', '512GB', '1TB'];

const SORT_OPTIONS = [
    { label: 'Mới nhất',         value: 'newest' },
    { label: 'Giá: thấp → cao', value: 'price-asc' },
    { label: 'Giá: cao → thấp', value: 'price-desc' },
];

/* ─────────── sub-components ─────────── */
const FilterSection = ({ title, children }) => (
    <div style={{ marginBottom: '32px' }}>
        <p style={{
            fontSize: '10px', fontWeight: 700, color: '#9ca3af',
            textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px',
        }}>
            {title}
        </p>
        {children}
    </div>
);

const EmptyState = ({ query }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 24px', textAlign: 'center',
    }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 12px' }}>
            Không tìm thấy sản phẩm
        </h2>
        <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '400px', lineHeight: 1.6, margin: '0 0 32px' }}>
            {query
                ? `Không có kết quả nào cho "${query}". Thử từ khóa khác nhé!`
                : 'Chưa có sản phẩm nào trong danh mục này.'}
        </p>
        <Link
            to="/"
            style={{
                background: '#2563eb', color: '#fff',
                padding: '12px 28px', borderRadius: '9999px',
                fontWeight: 700, fontSize: '14px', textDecoration: 'none',
            }}
        >
            Về trang chủ
        </Link>
    </div>
);

/* ─────────── main page ─────────── */
const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query    = searchParams.get('query')    || '';
    const category = searchParams.get('category') || '';

    const [products,           setProducts]           = useState([]);
    const [loading,            setLoading]            = useState(true);
    const [sortBy,             setSortBy]             = useState('newest');
    const [filterName,         setFilterName]         = useState(query);
    const [selectedCategories, setSelectedCategories] = useState(category ? [category] : []);
    const [priceRange,         setPriceRange]         = useState('');
    const [selectedColor,      setSelectedColor]      = useState('');
    const [selectedStorage,    setSelectedStorage]    = useState('');
    const [viewMode,           setViewMode]           = useState('grid'); // 'grid' | 'list'
    const [currentPage,        setCurrentPage]        = useState(1);
    const PAGE_SIZE = 12;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (query)    params.append('query',    query);
                if (category) params.append('category', category);
                const res = await axios.get(`/v1/api/products/search?${params.toString()}`);
                if (Array.isArray(res)) {
                    let sorted = [...res];
                    if (sortBy === 'price-asc')  sorted.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
                    if (sortBy === 'price-desc') sorted.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
                    setProducts(sorted);
                    setCurrentPage(1);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [query, category, sortBy]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') setSearchParams({ query: filterName });
    };

    const toggleCategory = (val) => {
        setSelectedCategories(prev =>
            prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
        );
    };

    // pagination slice
    const paginated = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>

            {/* ── TOP SEARCH BAR ────────────────────────────── */}
            <div style={{
                background: '#fff',
                borderBottom: '1px solid #f0f0f0',
                padding: '28px 24px',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
                        <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} className="bc-link">Trang chủ</Link>
                        <RightOutlined style={{ fontSize: '9px' }} />
                        <span style={{ color: '#111', fontWeight: 600 }}>Kết quả tìm kiếm</span>
                    </div>

                    {/* Search input */}
                    <div style={{ maxWidth: '640px' }}>
                        <Input
                            size="large"
                            placeholder="Tìm kiếm sản phẩm..."
                            prefix={<SearchOutlined style={{ color: '#9ca3af', marginRight: '8px' }} />}
                            value={filterName}
                            onChange={e => setFilterName(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            style={{
                                borderRadius: '14px',
                                fontSize: '15px',
                                border: '1.5px solid #e5e7eb',
                                boxShadow: 'none',
                                padding: '10px 18px',
                            }}
                        />
                        <p style={{ marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>
                            {loading ? 'Đang tìm...' : (
                                <>
                                    Tìm thấy <strong style={{ color: '#111' }}>{products.length}</strong> sản phẩm
                                    {(query || category) && (
                                        <> cho <strong style={{ color: '#2563eb' }}>"{query || category}"</strong></>
                                    )}
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── BODY: sidebar + main ──────────────────────── */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

                {/* ── SIDEBAR ─────────────────────────────────── */}
                <aside style={{
                    width: '240px', flexShrink: 0,
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                    position: 'sticky',
                    top: '80px',
                }}>
                    {/* Danh mục */}
                    <FilterSection title="Danh mục">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {CATEGORIES.map(({ label, value }) => {
                                const checked = selectedCategories.includes(value);
                                return (
                                    <label
                                        key={value}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            cursor: 'pointer', fontSize: '14px', fontWeight: checked ? 600 : 400,
                                            color: checked ? '#2563eb' : '#374151',
                                        }}
                                        onClick={() => toggleCategory(value)}
                                    >
                                        <span style={{
                                            width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                                            border: checked ? '2px solid #2563eb' : '2px solid #d1d5db',
                                            background: checked ? '#2563eb' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s',
                                        }}>
                                            {checked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                        </span>
                                        {label}
                                    </label>
                                );
                            })}
                        </div>
                    </FilterSection>

                    {/* Khoảng giá */}
                    <FilterSection title="Khoảng giá">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {PRICE_RANGES.map(({ label, value }) => {
                                const checked = priceRange === value;
                                return (
                                    <label
                                        key={value}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            cursor: 'pointer', fontSize: '14px',
                                            fontWeight: checked ? 600 : 400,
                                            color: checked ? '#2563eb' : '#374151',
                                        }}
                                        onClick={() => setPriceRange(checked ? '' : value)}
                                    >
                                        <span style={{
                                            width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                                            border: checked ? '5px solid #2563eb' : '2px solid #d1d5db',
                                            background: '#fff',
                                            transition: 'all 0.15s',
                                        }} />
                                        {label}
                                    </label>
                                );
                            })}
                        </div>
                    </FilterSection>

                    {/* Màu sắc */}
                    <FilterSection title="Màu sắc">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                                    style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        backgroundColor: color,
                                        border: selectedColor === color ? '3px solid #2563eb' : '2px solid #e5e7eb',
                                        cursor: 'pointer',
                                        outline: selectedColor === color ? '2px solid #bfdbfe' : 'none',
                                        outlineOffset: '1px',
                                        transition: 'transform 0.15s',
                                    }}
                                    className="color-swatch"
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {/* Dung lượng */}
                    <FilterSection title="Dung lượng">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {STORAGES.map(size => {
                                const active = selectedStorage === size;
                                return (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedStorage(active ? '' : size)}
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            border: active ? '2px solid #2563eb' : '1.5px solid #e5e7eb',
                                            background: active ? '#eff6ff' : '#fff',
                                            color: active ? '#2563eb' : '#374151',
                                            fontSize: '12px', fontWeight: active ? 700 : 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </FilterSection>

                    {/* Reset */}
                    <button
                        onClick={() => { setSelectedCategories([]); setPriceRange(''); setSelectedColor(''); setSelectedStorage(''); }}
                        style={{
                            width: '100%', padding: '10px',
                            borderRadius: '10px',
                            border: '1.5px solid #e5e7eb',
                            background: '#fff', color: '#6b7280',
                            fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        className="reset-btn"
                    >
                        Xóa bộ lọc
                    </button>
                </aside>

                {/* ── MAIN CONTENT ──────────────────────────────── */}
                <main style={{ flex: 1, minWidth: 0 }}>

                    {/* Sort bar + view toggle */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
                    }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {SORT_OPTIONS.map(({ label, value }) => {
                                const active = sortBy === value;
                                return (
                                    <button
                                        key={value}
                                        onClick={() => setSortBy(value)}
                                        style={{
                                            padding: '9px 20px',
                                            borderRadius: '9999px',
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

                        {/* View toggle */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {[
                                { mode: 'grid', Icon: AppstoreOutlined },
                                { mode: 'list', Icon: UnorderedListOutlined },
                            ].map(({ mode, Icon }) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    style={{
                                        width: '36px', height: '36px',
                                        borderRadius: '10px',
                                        border: viewMode === mode ? 'none' : '1.5px solid #e5e7eb',
                                        background: viewMode === mode ? '#2563eb' : '#fff',
                                        color: viewMode === mode ? '#fff' : '#9ca3af',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', fontSize: '16px',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <Icon />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product grid / list */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '320px' }}>
                            <Spin size="large" />
                        </div>
                    ) : paginated.length === 0 ? (
                        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
                            <EmptyState query={query || category} />
                        </div>
                    ) : (
                        <>
                            <div style={
                                viewMode === 'grid'
                                    ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }
                                    : { display: 'flex', flexDirection: 'column', gap: '16px' }
                            }>
                                {paginated.map(p => (
                                    viewMode === 'grid'
                                        ? <ProductCard key={p._id} product={p} />
                                        : <ListCard key={p._id} product={p} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.length > PAGE_SIZE && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
                                    <Pagination
                                        current={currentPage}
                                        total={products.length}
                                        pageSize={PAGE_SIZE}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            <style>{`
                .bc-link:hover { color: #111 !important; }
                .color-swatch:hover { transform: scale(1.15); }
                .reset-btn:hover { border-color: #2563eb !important; color: #2563eb !important; }
            `}</style>
        </div>
    );
};

/* ── List-view card ──────────────────────────────────────────── */
const ListCard = ({ product }) => {
    const discount = product.promotionalPrice && product.price
        ? Math.round((1 - product.promotionalPrice / product.price) * 100)
        : 0;
    const finalPrice = product.promotionalPrice || product.price;

    return (
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <div style={{
                display: 'flex', gap: '20px', alignItems: 'center',
                background: '#fff', borderRadius: '16px', padding: '16px 20px',
                border: '1.5px solid #f0f0f0',
                transition: 'box-shadow 0.2s, transform 0.2s',
            }} className="list-card">
                {/* Image */}
                <div style={{
                    width: '100px', height: '100px', flexShrink: 0,
                    background: '#f9fafb', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/100'}
                        alt={product.name}
                        style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                    />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111', margin: '0 0 6px', lineHeight: 1.4 }}>
                        {product.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <span style={{ fontSize: '17px', fontWeight: 700, color: '#dc2626' }}>
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
                                fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px',
                            }}>
                                -{discount}%
                            </span>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <div style={{
                    padding: '10px 22px',
                    background: '#2563eb', color: '#fff',
                    borderRadius: '9999px', fontSize: '13px', fontWeight: 700,
                    flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                    Xem ngay
                </div>
            </div>

            <style>{`
                .list-card:hover {
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
            `}</style>
        </Link>
    );
};

export default SearchPage;
