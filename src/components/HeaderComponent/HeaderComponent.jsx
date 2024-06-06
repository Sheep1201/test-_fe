import { Badge, Col, Row, Popover } from 'antd';
import React, { useState } from 'react';
import './style.css';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import Logo from '../../asset/images/Logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slide/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slide/productSlide';

const HeaderComponent = ({ isHidden = false }) => {
    const [loading, setLoading] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false); // Trạng thái để kiểm soát hiển thị của Popover
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const cart = useSelector((state) => state.cart);

    const handleNavigateLogin = () => {
        navigate('/sign-in');
    };

    const handleCartPage = () => {
        navigate('/cart');
    };

    const handleLogout = async () => {
        setLoading(true);
        await UserService.LogoutUser();
        localStorage.removeItem('access_token');
        dispatch(resetUser());
        setLoading(false);
        navigate('/');
    };

    const handleMenuClick = (path) => {
        navigate(path);
        setPopoverVisible(false); // Đóng Popover khi chọn một dòng
    };

    const content = (
        <div className='content-popup'>
            <p onClick={() => handleMenuClick('/profile-user')}>Thông tin</p>
            {user?.isAdmin && (
                <p onClick={() => handleMenuClick('/system/admin')}>Admin page</p>
            )}
            <p onClick={() => handleMenuClick('/my-order')}>Đơn hàng của tôi</p>
            <p onClick={handleLogout}>Đăng xuất</p>
        </div>
    );

    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value));
    };

    return (
        <Row className="WrapperHeader" style={{ justifyContent: isHidden ? 'space-between' : 'unset' }}>
            <Col className="WrapperLogoHeader" span={6}>
                <Link to="/">
                    <img style={{ height: 'auto', width: '70%' }} src={Logo} alt="Logo" />
                </Link>
            </Col>
            {!isHidden && (
                <Col span={12}>
                    <ButtonInputSearch
                        placeholder="VD: Màn hình, chuột, bàn phím, ram,..."
                        size="large"
                        textbutton="Tìm kiếm"
                        allowClear
                        onChange={onSearch}
                    />
                </Col>
            )}
            <Col span={6} style={{ display: 'flex' }}>
                <Loading isPending={loading}>
                    <div className='WrapperHeaderAccount'>
                        <UserOutlined style={{ fontSize: '25px', marginLeft: '15px' }} />
                        {user?.name ? (
                            <Popover 
                                content={content} 
                                trigger="click" 
                                visible={popoverVisible}
                                onVisibleChange={setPopoverVisible}
                            >
                                <div style={{ cursor: 'pointer' }}>HI! {user.name}</div>
                            </Popover>
                        ) : (
                            <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                <span>Đăng nhập/Đăng ký</span>
                                <div>
                                    <span href="sign-in">Tài khoản</span>
                                    <CaretDownOutlined />
                                </div>
                            </div>
                        )}
                    </div>
                </Loading>
                {!isHidden && (
                    <div className='WrapperHeaderAccount' onClick={handleCartPage}>
                        <Badge count={cart?.cartItems?.length} size='small' color='rgb(255,0,0)'>
                            <ShoppingCartOutlined style={{ fontSize: '30px' }} />
                        </Badge>
                        <span style={{ fontSize: '12px' }}>Cart</span>
                    </div>
                )}
            </Col>
        </Row>
    );
};
export default HeaderComponent;
