import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-600 py-12 mt-auto border-t border-gray-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h2 className="text-xl font-bold text-black mb-4">TechStore</h2>
                        <p className="text-sm mb-4">© 2024 TechStore. Apple Authorized Reseller.</p>
                        <p className="text-xs leading-relaxed">
                            Cửa hàng bán lẻ ủy quyền chính thức của Apple tại Việt Nam, mang đến những trải nghiệm mua sắm đẳng cấp nhất.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-sm font-bold text-black uppercase mb-4 tracking-wider">Khám phá</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/search?category=iphone" className="hover:text-black transition-colors">iPhone</Link></li>
                            <li><Link to="/search?category=ipad" className="hover:text-black transition-colors">iPad</Link></li>
                            <li><Link to="/search?category=mac" className="hover:text-black transition-colors">MacBook</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className="text-sm font-bold text-black uppercase mb-4 tracking-wider">Chính sách</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="#" className="hover:text-black transition-colors">Chính sách bảo hành</Link></li>
                            <li><Link to="#" className="hover:text-black transition-colors">Chính sách đổi trả</Link></li>
                            <li><Link to="#" className="hover:text-black transition-colors">Giao hàng & Thanh toán</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-black uppercase mb-4 tracking-wider">Kết nối</h3>
                        <div className="flex space-x-4 text-xl mb-4">
                            <FacebookOutlined className="hover:text-blue-600 cursor-pointer transition-colors" />
                            <InstagramOutlined className="hover:text-pink-600 cursor-pointer transition-colors" />
                            <YoutubeOutlined className="hover:text-red-600 cursor-pointer transition-colors" />
                            <MailOutlined className="hover:text-gray-400 cursor-pointer transition-colors" />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <PhoneOutlined />
                            <span className="font-bold text-black">Hotline: 1900 6688</span>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
                    Thiết kế bởi TechStore Team. Bảo lưu mọi quyền.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
