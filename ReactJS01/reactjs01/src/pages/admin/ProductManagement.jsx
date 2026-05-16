import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, notification, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from '../../util/axios.customize';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('/v1/api/products/search'),
                axios.get('/v1/api/products/categories')
            ]);
            if (prodRes && Array.isArray(prodRes)) {
                setProducts(prodRes);
            }
            if (catRes && Array.isArray(catRes)) {
                setCategories(catRes);
            }
        } catch (error) {
            console.error("Fetch data error:", error);
            notification.error({ message: "Lỗi", description: "Không thể tải dữ liệu" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showModal = (record = null) => {
        if (record) {
            setEditingId(record._id);
            form.setFieldsValue({
                ...record,
                category: record.category?._id || record.category,
                images: record.images ? record.images.join('\n') : ''
            });
        } else {
            setEditingId(null);
            form.resetFields();
            form.setFieldsValue({ stock: 0, sold: 0 });
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        // Format images from textarea string to array
        const payload = {
            ...values,
            images: values.images ? values.images.split('\n').map(url => url.trim()).filter(url => url) : []
        };

        try {
            if (editingId) {
                await axios.put(`/v1/api/products/${editingId}`, payload);
                notification.success({ message: "Thành công", description: "Đã cập nhật sản phẩm" });
            } else {
                await axios.post('/v1/api/products', payload);
                notification.success({ message: "Thành công", description: "Đã thêm sản phẩm mới" });
            }
            setIsModalVisible(false);
            fetchData();
        } catch (error) {
            notification.error({ message: "Lỗi", description: error.message || "Có lỗi xảy ra" });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/v1/api/products/${id}`);
            notification.success({ message: "Thành công", description: "Đã xóa sản phẩm" });
            fetchData();
        } catch (error) {
            notification.error({ message: "Lỗi", description: "Không thể xóa sản phẩm" });
        }
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                <img src={images && images.length > 0 ? images[0] : 'https://placehold.co/50x50'} alt="product" style={{ width: 50, height: 50, objectFit: 'contain' }} />
            )
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (cat) => cat?.name || '---'
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price?.toLocaleString()} ₫`
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            key: 'sold',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa sản phẩm này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản lý Sản phẩm</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm sản phẩm
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={products} 
                rowKey="_id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="name"
                            label="Tên sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                        >
                            <Input placeholder="VD: iPhone 15 Pro Max" />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories.map(cat => (
                                    <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="price"
                            label="Giá bán (VNĐ)"
                            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                        >
                            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>

                        <Form.Item
                            name="promotionalPrice"
                            label="Giá khuyến mãi (VNĐ)"
                        >
                            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="stock"
                            label="Số lượng tồn kho"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>

                        <Form.Item
                            name="sold"
                            label="Đã bán"
                        >
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="description"
                        label="Mô tả sản phẩm"
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả..." />
                    </Form.Item>

                    <Form.Item
                        name="images"
                        label="Link hình ảnh (Mỗi link 1 dòng)"
                        help="Dán URL hình ảnh từ internet. Bấm Enter để xuống dòng cho hình tiếp theo."
                    >
                        <Input.TextArea rows={4} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {editingId ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagement;
