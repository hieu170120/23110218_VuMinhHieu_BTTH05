import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, notification, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from '../../util/axios.customize';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/v1/api/banners');
            if (res && Array.isArray(res)) {
                setBanners(res);
            }
        } catch (error) {
            console.error("Fetch banners error:", error);
            notification.error({ message: "Lỗi", description: "Không thể tải dữ liệu banner" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const showModal = (record = null) => {
        if (record) {
            setEditingId(record._id);
            form.setFieldsValue({ ...record });
        } else {
            setEditingId(null);
            form.resetFields();
            form.setFieldsValue({ type: 'hero', isActive: true, linkTo: '/' });
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        try {
            if (editingId) {
                await axios.put(`/v1/api/banners/${editingId}`, values);
                notification.success({ message: "Thành công", description: "Đã cập nhật banner" });
            } else {
                await axios.post('/v1/api/banners', values);
                notification.success({ message: "Thành công", description: "Đã thêm banner mới" });
            }
            setIsModalVisible(false);
            fetchBanners();
        } catch (error) {
            notification.error({ message: "Lỗi", description: error.message || "Có lỗi xảy ra" });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/v1/api/banners/${id}`);
            notification.success({ message: "Thành công", description: "Đã xóa banner" });
            fetchBanners();
        } catch (error) {
            notification.error({ message: "Lỗi", description: "Không thể xóa banner" });
        }
    };

    const handleToggleActive = async (checked, record) => {
        try {
            await axios.put(`/v1/api/banners/${record._id}`, { ...record, isActive: checked });
            notification.success({ message: "Cập nhật trạng thái thành công" });
            fetchBanners();
        } catch (error) {
            notification.error({ message: "Lỗi cập nhật trạng thái" });
            fetchBanners(); // revert switch visually
        }
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (url) => (
                <img src={url} alt="banner" style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 8 }} />
            )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type) => type === 'hero' ? <span style={{color: '#2563eb', fontWeight: 'bold'}}>Hero (Lớn)</span> : <span>Sub (Nhỏ)</span>
        },
        {
            title: 'Liên kết',
            dataIndex: 'linkTo',
            key: 'linkTo',
        },
        {
            title: 'Trạng thái',
            key: 'isActive',
            render: (_, record) => (
                <Switch 
                    checked={record.isActive} 
                    onChange={(checked) => handleToggleActive(checked, record)} 
                />
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa banner này?"
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
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản lý Banner</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm Banner
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={banners} 
                rowKey="_id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingId ? "Sửa banner" : "Thêm banner mới"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề chính"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="VD: iPhone 15 Pro" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả phụ"
                    >
                        <Input placeholder="VD: Titan. Thật bền..." />
                    </Form.Item>

                    <Form.Item
                        name="imageUrl"
                        label="Link hình ảnh"
                        rules={[{ required: true, message: 'Vui lòng nhập link hình ảnh' }]}
                    >
                        <Input placeholder="https://example.com/banner.jpg" />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="type"
                            label="Loại Banner"
                            rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                        >
                            <Select>
                                <Select.Option value="hero">Hero Banner (Đầu trang)</Select.Option>
                                <Select.Option value="sub">Sub Banner (Banner phụ)</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="linkTo"
                            label="Link đích khi click"
                        >
                            <Input placeholder="/search?category=iphone" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="isActive"
                        label="Hiển thị"
                        valuePropName="checked"
                    >
                        <Switch />
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

export default BannerManagement;
