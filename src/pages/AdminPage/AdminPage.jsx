import React, { useState } from 'react';
import { ProductOutlined, UserOutlined, ShoppingOutlined, BarChartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { getItem } from '../../ultils';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { User, AdminUser } from '../../components/AdminUser/AdminUser';
import { AdminProduct, AdminProductPC } from '../../components/AdminProduct/AdminProduct';
import { AdminOrder, AdminNewOrder, AdminDeliveredOrder, AdminPaidedOrder, Stats } from '../../components/AdminOrder/AdminOrder';

const items = [
    getItem('Quản lý người dùng', 'user', <UserOutlined />, [
        getItem('Quản lý người dùng', 'user1'),
        getItem('Quản lý quản trị viên', 'user2'),
    ]),
    getItem('Quản lý sản phẩm', 'product', <ProductOutlined />, [
        getItem('Quản lý sản phẩm', 'product1'),
        getItem('Quản lý PC', 'product2'),
    ]),
    getItem('Quản lý đơn hàng', 'order', <ShoppingOutlined />, [
        getItem('Tất cả đơn hàng', 'order'),
        getItem('Đơn hàng mới', 'order1'),
        getItem('Đơn hàng đang vận chuyển', 'order2'),
        getItem('Đơn hàng đã hoàn thành', 'order3'),
    ]),
    getItem('Thống kê', 'stats', <BarChartOutlined />, [
        getItem('Thống kê', 'stats'),
    ]),
];
const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                return func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};
const levelKeys = getLevelKeys(items);
const AdminPage = () => {
    const [stateOpenKeys, setStateOpenKeys] = useState([]);
    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };
    const [keySelected, SetKeySelected] = useState('')
    const handleOnClick = ({ key }) => {
        SetKeySelected(key)
    }

    const renderPage = (key) => {
        switch (key) {
            case 'user1':
                return (
                    <User />
                )
            case 'user2':
                return (
                    <AdminUser />
                )
            case 'product1':
                return (
                    <AdminProduct />
                )
            case 'product2':
                return (
                    <AdminProductPC />
                )
            case 'order':
                return (
                    <AdminOrder />
                )
            case 'order1':
                return (
                    <AdminNewOrder />
                )
            case 'order2':
                return (
                    <AdminDeliveredOrder />
                )
            case 'order3':
                return (
                    <AdminPaidedOrder />
                )
            case 'stats':
                return (
                    <Stats />
                )
            default:
                return <></>
        }
    }

    return (
        <>
            <HeaderComponent isHidden />
            <div style={{ height: '100%', display: 'flex' }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[]}
                    openKeys={stateOpenKeys}
                    onOpenChange={onOpenChange}
                    style={{ width: '256px'}}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{display: 'flex', height: '100%', width: '100%' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    );
};
export default AdminPage;

