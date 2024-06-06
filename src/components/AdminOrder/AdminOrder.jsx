import React, { useEffect, useRef, useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import * as OrderSevice from '../../services/OrderService';
import * as UserSevice from '../../services/UserService';
import * as ProductSevice from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Button, Col, Input, Row, Space } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { TeamOutlined, ShoppingOutlined, DollarOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';


export const AdminOrder = () => {
    const user = useSelector((state) => state.user);
    const [idDelete, setIdDelete] = useState('')
    const [idUpdate, setIdUpdate] = useState('')
    const fetchMyOrder = async () => {
        const res = await OrderSevice.getAllOrder(user?.access_token);
        return res.data;
    };

    const queryOrder = useQuery({ queryKey: ['user'], queryFn: fetchMyOrder });
    const { isPending, data } = queryOrder;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
    const formatTotalPrice = (totalPrice) => {
        return totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
    const handleCancelUpdate = () => {
        setIsModalOpenUpdate(false)
    }
    const [isModalOpenUpdatePaid, setIsModalOpenUpdatePaid] = useState(false)
    const handleCancelUpdatePaid = () => {
        setIsModalOpenUpdatePaid(false)
    }

    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
            } = data;
            OrderSevice.deleteOrder(
                id
            );
        }
    );

    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const handleDeleteOrder = () => {
        mutationDeleted.mutate({ id: idDelete }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenDelete(false);
            }
        });
    };


    const mutationUpdate = useMutationHooks(
        (data) => {
            const {
                id
            } = data;
            OrderSevice.updateOrder(
                id, { isDelivered: true }
            );
        }
    );

    const { data: dataUpdate, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = mutationUpdate
    const handleUpdateOrder = () => {
        mutationUpdate.mutate({ id: idUpdate }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdate(false);
            }
        });
    };
    const mutationUpdatePaid = useMutationHooks(
        (data) => {
            const {
                id
            } = data;
            OrderSevice.updatePaidOrder(
                id, { isPaid: true }
            );
        }
    );

    const { data: dataUpdatePaid, isPending: isPendingUpdatePaid, isSuccess: isSuccessUpdatePaid } = mutationUpdate
    const handleUpdatePaidOrder = () => {
        mutationUpdatePaid.mutate({ id: idUpdate }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdatePaid(false);
            }
        });
    };


    return (
        <Loading isPending={isPending}>
            <div id='containerProduct' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{fontSize: '25px', fontWeight: 'bold'}}>Tất cả đơn hàng</div><br/>
                {data && data.length > 0 ? (data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order, index) => (
                    <div key={index} style={{ border: '1px solid black', borderRadius: '5px', width: '75%', marginBottom: '20px' }}>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={14}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '25px' }}>Mã đơn hàng: #{order._id}</span>
                            </Col>
                            <Col span={4}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Số lượng</span>
                            </Col>
                            <Col span={4}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '35px' }}>Giá thành</span>
                            </Col>
                            <Col span={2}></Col>
                        </Row>
                        <hr />
                        {order.cartItems?.map((cartItem, cartIndex) => (
                            <Row key={cartItem.id || cartIndex}>
                                <Col style={{ marginLeft: '25px' }} span={14}>
                                    <img alt="productImage" src={cartItem.image} style={{ maxWidth: '15%', marginRight: '15px' }} />
                                    <span>{cartItem.name}</span>
                                </Col>
                                <Col style={{ marginTop: '20px' }} span={4}>
                                    <span>{cartItem.amount}</span>
                                </Col>
                                <Col style={{ marginTop: '10px' }} span={4}>
                                    <div className="style-Price">{formatPrice(cartItem.price)}</div>
                                </Col>
                            </Row>
                        ))}
                        <hr />
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={11}>
                                {order.paymentMethod === '1' ? (
                                    <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Nhận hàng tại cửa hàng</b></span>
                                ) : (
                                    <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Địa chỉ giao:</b> {order.shippingAddress?.address}</span>
                                )}
                            </Col>
                            <Col span={8}>
                                <span style={{ fontSize: '15px' }}><b>Ngày mua:</b> {formatDate(order.createdAt)}</span>
                            </Col>
                            <Col span={5}>
                                <span style={{ fontSize: '15px', color: 'red' }}><b>Tổng tiền: {formatTotalPrice(order.totalPrice)}</b></span>
                            </Col>
                        </Row>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={11}>
                                <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Khách hàng:</b> {(order.shippingAddress?.fullname)}</span>
                            </Col>
                            <Col span={8}>
                                <span style={{ fontSize: '15px' }}><b>Email:</b> {(order.shippingAddress?.email)}</span>
                            </Col>
                            <Col span={5}>
                                <span style={{ fontSize: '15px' }}><b>Điện thoại:</b> 0{(order.shippingAddress?.phone)}</span>
                            </Col>
                        </Row>
                        {order.isPaid === false ? (
                            <Row style={{ justifyContent: 'center', marginTop: '20px' }}>
                                {order.isDelivered === false ? (
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang chuẩn bị</span>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '200px', marginBottom: '20px' }}
                                            textbutton={'Đang giao hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '10px', marginBottom: '20px' }}
                                            textbutton={'Hủy đơn hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenDelete(true)
                                                setIdDelete(order?._id);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex' }}>
                                            <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang giao hàng</span>
                                        </div>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '330px', marginBottom: '20px' }}
                                            textbutton={'Đã giao'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                    </>
                                )}
                            </Row>
                        ) : (
                            <div style={{ display: 'flex', height: '60px', alignItems: 'center' }}>
                                <span style={{ fontSize: '15px', marginLeft: '100px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đã nhận được hàng</span>
                            </div>
                        )}
                    </div>
                ))) : (
                    <div style={{ height: '100vh', width: '700px', marginLeft: '500px', fontSize: '20px', fontWeight: 'bold' }}>Chưa có đơn hàng nào</div>
                )}
            </div>
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteOrder}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa sản phẩm này?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdate} onCancel={handleCancelUpdate} onOk={handleUpdateOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Chuyển trạng thái giao hàng?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdatePaid} onCancel={handleCancelUpdatePaid} onOk={handleUpdatePaidOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Chuyển trạng thái đã giao hàng?</div>
                </Loading>
            </ModalComponent>
        </Loading>

    );
};

export const AdminNewOrder = () => {
    const user = useSelector((state) => state.user);
    const [idDelete, setIdDelete] = useState('')
    const [idUpdate, setIdUpdate] = useState('')
    const fetchMyOrder = async () => {
        const res = await OrderSevice.getAllOrder(user?.access_token);
        return res.data;
    };

    const queryOrder = useQuery({ queryKey: ['user'], queryFn: fetchMyOrder });
    const { isPending, data } = queryOrder;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
    const formatTotalPrice = (totalPrice) => {
        return totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
    const handleCancelUpdate = () => {
        setIsModalOpenUpdate(false)
    }
    const [isModalOpenUpdatePaid, setIsModalOpenUpdatePaid] = useState(false)
    const handleCancelUpdatePaid = () => {
        setIsModalOpenUpdatePaid(false)
    }

    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
            } = data;
            OrderSevice.deleteOrder(
                id
            );
        }
    );

    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const handleDeleteOrder = () => {
        mutationDeleted.mutate({ id: idDelete }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenDelete(false);
            }
        });
    };


    const mutationUpdate = useMutationHooks(
        (data) => {
            const {
                id
            } = data;
            OrderSevice.updateOrder(
                id, { isDelivered: true }
            );
        }
    );

    const { data: dataUpdate, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = mutationUpdate
    const handleUpdateOrder = () => {
        mutationUpdate.mutate({ id: idUpdate }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdate(false);
            }
        });
    };
    const mutationUpdatePaid = useMutationHooks(
        (data) => {
            const {
                id
            } = data;
            OrderSevice.updatePaidOrder(
                id, { isPaid: true }
            );
        }
    );

    const { data: dataUpdatePaid, isPending: isPendingUpdatePaid, isSuccess: isSuccessUpdatePaid } = mutationUpdate
    const handleUpdatePaidOrder = () => {
        mutationUpdatePaid.mutate({ id: idUpdate }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdatePaid(false);
            }
        });
    };


    return (
        <Loading isPending={isPending}>
            <div id='containerProduct' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{fontSize: '25px', fontWeight: 'bold'}}>Đơn hàng mới</div><br/>
                {data && data.length > 0 ? (data.filter(order => !order.isDelivered && !order.isPaid).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order, index) => (
                    <div key={index} style={{ border: '1px solid black', borderRadius: '5px', width: '75%', marginBottom: '20px' }}>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={14}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '25px' }}>Mã đơn hàng: #{order._id}</span>
                            </Col>
                            <Col span={4}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Số lượng</span>
                            </Col>
                            <Col span={4}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '35px' }}>Giá thành</span>
                            </Col>
                            <Col span={2}></Col>
                        </Row>
                        <hr />
                        {order.cartItems?.map((cartItem, cartIndex) => (
                            <Row key={cartItem.id || cartIndex}>
                                <Col style={{ marginLeft: '25px' }} span={14}>
                                    <img alt="productImage" src={cartItem.image} style={{ maxWidth: '15%', marginRight: '15px' }} />
                                    <span>{cartItem.name}</span>
                                </Col>
                                <Col style={{ marginTop: '20px' }} span={4}>
                                    <span>{cartItem.amount}</span>
                                </Col>
                                <Col style={{ marginTop: '10px' }} span={4}>
                                    <div className="style-Price">{formatPrice(cartItem.price)}</div>
                                </Col>
                            </Row>
                        ))}
                        <hr />
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={11}>
                                {order.paymentMethod === '1' ? (
                                    <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Nhận hàng tại cửa hàng</b></span>
                                ) : (
                                    <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Địa chỉ giao:</b> {order.shippingAddress?.address}</span>
                                )}
                            </Col>
                            <Col span={8}>
                                <span style={{ fontSize: '15px' }}><b>Ngày mua:</b> {formatDate(order.createdAt)}</span>
                            </Col>
                            <Col span={5}>
                                <span style={{ fontSize: '15px', color: 'red' }}><b>Tổng tiền: {formatTotalPrice(order.totalPrice)}</b></span>
                            </Col>
                        </Row>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={11}>
                                <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Khách hàng:</b> {(order.shippingAddress?.fullname)}</span>
                            </Col>
                            <Col span={8}>
                                <span style={{ fontSize: '15px' }}><b>Email:</b> {(order.shippingAddress?.email)}</span>
                            </Col>
                            <Col span={5}>
                                <span style={{ fontSize: '15px' }}><b>Điện thoại:</b> 0{(order.shippingAddress?.phone)}</span>
                            </Col>
                        </Row>
                        {order.isPaid === false ? (
                            <Row style={{ justifyContent: 'center', marginTop: '20px' }}>
                                {order.isDelivered === false ? (
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang chuẩn bị</span>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '200px', marginBottom: '20px' }}
                                            textbutton={'Đang giao hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '10px', marginBottom: '20px' }}
                                            textbutton={'Hủy đơn hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenDelete(true)
                                                setIdDelete(order?._id);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex' }}>
                                            <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang giao hàng</span>
                                        </div>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '330px', marginBottom: '20px' }}
                                            textbutton={'Đã giao'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                    </>
                                )}
                            </Row>
                        ) : (
                            <div style={{ display: 'flex', height: '60px', alignItems: 'center' }}>
                                <span style={{ fontSize: '15px', marginLeft: '100px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đã nhận được hàng</span>
                            </div>
                        )}
                    </div>
                ))) : (
                    <div style={{ height: '100vh', width: '700px', marginLeft: '500px', fontSize: '20px', fontWeight: 'bold' }}>Chưa có đơn hàng nào</div>
                )}
            </div>
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteOrder}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa sản phẩm này?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdate} onCancel={handleCancelUpdate} onOk={handleUpdateOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Chuyển trạng thái giao hàng?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdatePaid} onCancel={handleCancelUpdatePaid} onOk={handleUpdatePaidOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Chuyển trạng thái đã giao hàng?</div>
                </Loading>
            </ModalComponent>
        </Loading>

    );
};

export const AdminDeliveredOrder = () => {
    const user = useSelector((state) => state.user);
    const [idDelete, setIdDelete] = useState('')
    const [idUpdate, setIdUpdate] = useState('')
    const fetchMyOrder = async () => {
        const res = await OrderSevice.getAllOrder(user?.access_token);
        return res.data;
    };

    const queryOrder = useQuery({ queryKey: ['user'], queryFn: fetchMyOrder });
    const { isPending, data } = queryOrder;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
    const formatTotalPrice = (totalPrice) => {
        return totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
    const handleCancelUpdate = () => {
        setIsModalOpenUpdate(false)
    }
    const [isModalOpenUpdatePaid, setIsModalOpenUpdatePaid] = useState(false)
    const handleCancelUpdatePaid = () => {
        setIsModalOpenUpdatePaid(false)
    }

    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
            } = data;
            OrderSevice.deleteOrder(
                id
            );
        }
    );

    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const handleDeleteOrder = () => {
        mutationDeleted.mutate({ id: idDelete }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenDelete(false);
            }
        });
    };


    const mutationUpdate = useMutationHooks(
        (data) => {
            const {
                id
            } = data;
            OrderSevice.updateOrder(
                id, { isDelivered: true }
            );
        }
    );

    const { data: dataUpdate, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = mutationUpdate
    const handleUpdateOrder = () => {
        mutationUpdate.mutate({ id: idUpdate }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdate(false);
            }
        });
    };
    const mutationUpdatePaid = useMutationHooks(
        (data) => {
            const {
                id
            } = data;
            OrderSevice.updatePaidOrder(
                id, { isPaid: true }
            );
        }
    );

    const { data: dataUpdatePaid, isPending: isPendingUpdatePaid, isSuccess: isSuccessUpdatePaid } = mutationUpdate
    const handleUpdatePaidOrder = () => {
        mutationUpdatePaid.mutate({ id: idUpdate }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdatePaid(false);
            }
        });
    };


    return (
        <Loading isPending={isPending}>
            <div id='containerProduct' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{fontSize: '25px', fontWeight: 'bold'}}>Đơn hàng đang vận chuyển</div><br/>
                {data && data.length > 0 ? (data.filter(order => order.isDelivered && !order.isPaid).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order, index) => (
                    <div key={index} style={{ border: '1px solid black', borderRadius: '5px', width: '75%', marginBottom: '20px' }}>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={14}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '25px' }}>Mã đơn hàng: #{order._id}</span>
                            </Col>
                            <Col span={4}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Số lượng</span>
                            </Col>
                            <Col span={4}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '35px' }}>Giá thành</span>
                            </Col>
                            <Col span={2}></Col>
                        </Row>
                        <hr />
                        {order.cartItems?.map((cartItem, cartIndex) => (
                            <Row key={cartItem.id || cartIndex}>
                                <Col style={{ marginLeft: '25px' }} span={14}>
                                    <img alt="productImage" src={cartItem.image} style={{ maxWidth: '15%', marginRight: '15px' }} />
                                    <span>{cartItem.name}</span>
                                </Col>
                                <Col style={{ marginTop: '20px' }} span={4}>
                                    <span>{cartItem.amount}</span>
                                </Col>
                                <Col style={{ marginTop: '10px' }} span={4}>
                                    <div className="style-Price">{formatPrice(cartItem.price)}</div>
                                </Col>
                            </Row>
                        ))}
                        <hr />
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={11}>
                                {order.paymentMethod === '1' ? (
                                    <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Nhận hàng tại cửa hàng</b></span>
                                ) : (
                                    <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Địa chỉ giao:</b> {order.shippingAddress?.address}</span>
                                )}
                            </Col>
                            <Col span={8}>
                                <span style={{ fontSize: '15px' }}><b>Ngày mua:</b> {formatDate(order.createdAt)}</span>
                            </Col>
                            <Col span={5}>
                                <span style={{ fontSize: '15px', color: 'red' }}><b>Tổng tiền: {formatTotalPrice(order.totalPrice)}</b></span>
                            </Col>
                        </Row>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={11}>
                                <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Khách hàng:</b> {(order.shippingAddress?.fullname)}</span>
                            </Col>
                            <Col span={8}>
                                <span style={{ fontSize: '15px' }}><b>Email:</b> {(order.shippingAddress?.email)}</span>
                            </Col>
                            <Col span={5}>
                                <span style={{ fontSize: '15px' }}><b>Điện thoại:</b> 0{(order.shippingAddress?.phone)}</span>
                            </Col>
                        </Row>
                        {order.isPaid === false ? (
                            <Row style={{ justifyContent: 'center', marginTop: '20px' }}>
                                {order.isDelivered === false ? (
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang chuẩn bị</span>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '200px', marginBottom: '20px' }}
                                            textbutton={'Đang giao hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '10px', marginBottom: '20px' }}
                                            textbutton={'Hủy đơn hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenDelete(true)
                                                setIdDelete(order?._id);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex' }}>
                                            <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang giao hàng</span>
                                        </div>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '330px', marginBottom: '20px' }}
                                            textbutton={'Đã giao'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                    </>
                                )}
                            </Row>
                        ) : (
                            <div style={{ display: 'flex', height: '60px', alignItems: 'center' }}>
                                <span style={{ fontSize: '15px', marginLeft: '100px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đã nhận được hàng</span>
                            </div>
                        )}
                    </div>
                ))) : (
                    <div style={{ height: '100vh', width: '700px', marginLeft: '500px', fontSize: '20px', fontWeight: 'bold' }}>Chưa có đơn hàng nào</div>
                )}
            </div>
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteOrder}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa sản phẩm này?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdate} onCancel={handleCancelUpdate} onOk={handleUpdateOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Chuyển trạng thái giao hàng?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdatePaid} onCancel={handleCancelUpdatePaid} onOk={handleUpdatePaidOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Chuyển trạng thái đã giao hàng?</div>
                </Loading>
            </ModalComponent>
        </Loading>

    );
};

export const AdminPaidedOrder = () => {
    const user = useSelector((state) => state.user);
    const [idDelete, setIdDelete] = useState('')
    const [idUpdate, setIdUpdate] = useState('')
    const fetchMyOrder = async () => {
        const res = await OrderSevice.getAllOrder(user?.access_token);
        return res.data;
    };

    const queryOrder = useQuery({ queryKey: ['user'], queryFn: fetchMyOrder });
    const { isPending, data } = queryOrder;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
    const formatTotalPrice = (totalPrice) => {
        return totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
    const handleCancelUpdate = () => {
        setIsModalOpenUpdate(false)
    }
    const [isModalOpenUpdatePaid, setIsModalOpenUpdatePaid] = useState(false)
    const handleCancelUpdatePaid = () => {
        setIsModalOpenUpdatePaid(false)
    }

    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
            } = data;
            OrderSevice.deleteOrder(
                id
            );
        }
    );

    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const handleDeleteOrder = () => {
        mutationDeleted.mutate({ id: idDelete }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenDelete(false);
            }
        });
    };


    const mutationUpdate = useMutationHooks(
        (data) => {
            const {
                id
            } = data;
            OrderSevice.updateOrder(
                id, { isDelivered: true }
            );
        }
    );

    const { data: dataUpdate, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = mutationUpdate
    const handleUpdateOrder = () => {
        mutationUpdate.mutate({ id: idUpdate }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdate(false);
            }
        });
    };
    const mutationUpdatePaid = useMutationHooks(
        (data) => {
            const {
                id
            } = data;
            OrderSevice.updatePaidOrder(
                id, { isPaid: true }
            );
        }
    );

    const { data: dataUpdatePaid, isPending: isPendingUpdatePaid, isSuccess: isSuccessUpdatePaid } = mutationUpdate
    const handleUpdatePaidOrder = () => {
        mutationUpdatePaid.mutate({ id: idUpdate }, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdatePaid(false);
            }
        });
    };


    return (
        <Loading isPending={isPending}>
            <div id='containerProduct' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{fontSize: '25px', fontWeight: 'bold'}}>Đơn hàng đã hoàn thành</div><br/>
                {data && data.length > 0 ? (data.filter(order => order.isPaid).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order, index) => (
                    <div key={index} style={{ border: '1px solid black', borderRadius: '5px', width: '75%', marginBottom: '20px' }}>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={14}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '25px' }}>Mã đơn hàng: #{order._id}</span>
                            </Col>
                            <Col span={4}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Số lượng</span>
                            </Col>
                            <Col span={4}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '35px' }}>Giá thành</span>
                            </Col>
                            <Col span={2}></Col>
                        </Row>
                        <hr />
                        {order.cartItems?.map((cartItem, cartIndex) => (
                            <Row key={cartItem.id || cartIndex}>
                                <Col style={{ marginLeft: '25px' }} span={14}>
                                    <img alt="productImage" src={cartItem.image} style={{ maxWidth: '15%', marginRight: '15px' }} />
                                    <span>{cartItem.name}</span>
                                </Col>
                                <Col style={{ marginTop: '20px' }} span={4}>
                                    <span>{cartItem.amount}</span>
                                </Col>
                                <Col style={{ marginTop: '10px' }} span={4}>
                                    <div className="style-Price">{formatPrice(cartItem.price)}</div>
                                </Col>
                            </Row>
                        ))}
                        <hr />
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={11}>
                                {order.paymentMethod === '1' ? (
                                    <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Nhận hàng tại cửa hàng</b></span>
                                ) : (
                                    <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Địa chỉ giao:</b> {order.shippingAddress?.address}</span>
                                )}
                            </Col>
                            <Col span={8}>
                                <span style={{ fontSize: '15px' }}><b>Ngày mua:</b> {formatDate(order.createdAt)}</span>
                            </Col>
                            <Col span={5}>
                                <span style={{ fontSize: '15px', color: 'red' }}><b>Tổng tiền: {formatTotalPrice(order.totalPrice)}</b></span>
                            </Col>
                        </Row>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                            <Col span={11}>
                                <span style={{ fontSize: '15px', marginLeft: '25px' }}><b>Khách hàng:</b> {(order.shippingAddress?.fullname)}</span>
                            </Col>
                            <Col span={8}>
                                <span style={{ fontSize: '15px' }}><b>Email:</b> {(order.shippingAddress?.email)}</span>
                            </Col>
                            <Col span={5}>
                                <span style={{ fontSize: '15px' }}><b>Điện thoại:</b> 0{(order.shippingAddress?.phone)}</span>
                            </Col>
                        </Row>
                        {order.isPaid === false ? (
                            <Row style={{ justifyContent: 'center', marginTop: '20px' }}>
                                {order.isDelivered === false ? (
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang chuẩn bị</span>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '200px', marginBottom: '20px' }}
                                            textbutton={'Đang giao hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '10px', marginBottom: '20px' }}
                                            textbutton={'Hủy đơn hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenDelete(true)
                                                setIdDelete(order?._id);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex' }}>
                                            <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang giao hàng</span>
                                        </div>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '330px', marginBottom: '20px' }}
                                            textbutton={'Đã giao'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                    </>
                                )}
                            </Row>
                        ) : (
                            <div style={{ display: 'flex', height: '60px', alignItems: 'center' }}>
                                <span style={{ fontSize: '15px', marginLeft: '100px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đã nhận được hàng</span>
                            </div>
                        )}
                    </div>
                ))) : (
                    <div style={{ height: '100vh', width: '700px', marginLeft: '500px', fontSize: '20px', fontWeight: 'bold' }}>Chưa có đơn hàng nào</div>
                )}
            </div>
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteOrder}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa sản phẩm này?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdate} onCancel={handleCancelUpdate} onOk={handleUpdateOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Chuyển trạng thái giao hàng?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdatePaid} onCancel={handleCancelUpdatePaid} onOk={handleUpdatePaidOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Chuyển trạng thái đã giao hàng?</div>
                </Loading>
            </ModalComponent>
        </Loading>

    );
};


export const Stats = () => {
    const user = useSelector((state) => state.user);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const fetchMyOrder = async () => {
        const res = await OrderSevice.getAllOrder(user?.access_token);
        return res.data;
    };

    const getAllUser = async () => {
        const res = await UserSevice.getAllUser();
        return res.data;
    };

    const getAllProduct = async () => {
        const res = await ProductSevice.getAllProduct();
        return res.data;
    };

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder });
    const { isPending: isOrdersPending, data: orders } = queryOrder;
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUser });
    const { isLoading: isLoadingUsers, data: users } = queryUser;
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct });
    const { isLoading: isLoadingProducts, data: products } = queryProduct;

    let totalRevenue = 0;
    let totalOrders = 0;
    if (orders && orders.length > 0) {
        totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
        totalOrders = orders.length;
    }

    const totalUsers = users?.length;

    const formatRevenue = (revenue) => {
        return revenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const formatPrice = (price) => {
        return price.toLocaleString('en-US');
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image) => <img src={image} alt="product" style={{ width: '100px', height: 'auto' }} />,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            ...getColumnSearchProps('type'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price) => formatPrice(price),
            sorter: (a, b) => a.price - b.price,
            ...getColumnSearchProps('price'),
        },
        {
            title: 'PriceSale',
            dataIndex: 'priceSale',
            render: (priceSale) => formatPrice(priceSale),
            sorter: (a, b) => a.priceSale - b.priceSale,
            ...getColumnSearchProps('priceSale'),
        },
        {
            title: 'CountInStock',
            dataIndex: 'countInStock',
            sorter: (a, b) => a.countInStock - b.countInStock,
            ...getColumnSearchProps('countInStock'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: (text) => (
                <span title={text}>
                    {text.length > 50 ? `${text.substring(0, 50)}...` : text}
                </span>
            ),
        },
        {
            title: 'Selled',
            dataIndex: 'selled',
            sorter: (a, b) => a.selled - b.selled,
            ...getColumnSearchProps('selled'),
        },
    ];

    const dataTable = products?.length > 0
        ? products
            .filter(product => product.countInStock <= '10')
            .map((product) => ({ ...product, key: product._id }))
        : [];
    const dataTableSelled = products?.length > 0
        ? products
            .sort((a, b) => b.selled - a.selled)
            .map((product) => ({ ...product, key: product._id }))
        : [];

    return (
        <div>
            <Loading isPending={isOrdersPending || isLoadingUsers || isLoadingProducts}>
                <div id='containerProduct' style={{ display: 'flex', gap: '100px', width: '1600px', alignItems: 'center' }}>
                    <div style={{ marginLeft: '-100px' }}>
                        <div style={{ height: '150px', width: '400px', backgroundColor: 'rgb(255,50,50)', display: 'flex', alignItems: 'center' }}>
                            <DollarOutlined style={{ color: 'white', fontSize: '100px', marginLeft: '20px' }} />
                            <span style={{ marginLeft: '50px', color: 'white', fontSize: '30px' }}>{formatRevenue(totalRevenue)}</span>
                        </div>
                        <div style={{ height: '50px', width: '400px', backgroundColor: 'rgb(200,0,0)', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginLeft: '20px', color: 'white', fontSize: '15px', fontWeight: 'bold' }}>Thống kê doanh thu</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ height: '150px', width: '400px', backgroundColor: 'rgb(39,169,227)', display: 'flex', alignItems: 'center' }}>
                            <ShoppingOutlined style={{ color: 'white', fontSize: '100px', marginLeft: '20px' }} />
                            <span style={{ marginLeft: '70px', color: 'white', fontSize: '30px' }}>{totalOrders} đơn hàng</span>
                        </div>
                        <div style={{ height: '50px', width: '400px', backgroundColor: 'rgb(47,146,187)', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginLeft: '20px', color: 'white', fontSize: '15px', fontWeight: 'bold' }}>Thống kê số lượng đơn hàng</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ height: '150px', width: '400px', backgroundColor: 'rgb(40,183,121)', display: 'flex', alignItems: 'center' }}>
                            <TeamOutlined style={{ color: 'white', fontSize: '100px', marginLeft: '20px' }} />
                            <span style={{ marginLeft: '70px', color: 'white', fontSize: '30px' }}>{totalUsers} người dùng</span>
                        </div>
                        <div style={{ height: '50px', width: '400px', backgroundColor: 'rgb(23,167,105)', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginLeft: '20px', color: 'white', fontSize: '15px', fontWeight: 'bold' }}>Thống kê số lượng người dùng</span>
                        </div>
                    </div>
                </div>
                <hr style={{ width: '1600px'}}/>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', }}>Sản phẩm bán chạy nhất</span>
                    <TableComponent style={{ width: '1600px', marginLeft: '30px' }} columns={columns} isLoading={isLoadingProducts} data={dataTableSelled} />
                </div>
                <hr style={{ width: '1600px'}}/>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', }}>Sản phẩm sắp hết hàng</span>
                    <TableComponent style={{ width: '1600px' }} columns={columns} isLoading={isLoadingProducts} data={dataTable} />
                </div>
            </Loading>
        </div>
    );
};