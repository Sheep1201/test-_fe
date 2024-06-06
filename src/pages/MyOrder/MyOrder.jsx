import React, { useEffect, useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import * as OrderSevice from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';

const MyOrderPage = () => {
    const navigate = useNavigate()
    const handleNavigateType = () => {
        navigate('/type')
        window.scrollTo(0, 0);
    }
    const user = useSelector((state) => state.user);
    const [idDelete, setIdDelete] = useState('')
    const [idUpdate, setIdUpdate] = useState('')
    const fetchMyOrder = async () => {
        const res = await OrderSevice.getOrderByUserID(user?.id, user?.access_token);
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
        mutationDeleted.mutate({id: idDelete}, {
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
                id, { isPaid: true }
            );
        }
    );
    
    const { data: dataUpdate, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = mutationUpdate
    const handleUpdateOrder = () => {
        mutationUpdate.mutate({id: idUpdate}, {
            onSettled: () => {
                queryOrder.refetch();
                setIsModalOpenUpdate(false);
            }
        });
    };
    



    return (
        <Loading isPending={isPending}>
            <div id='containerProduct' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                        {order.isPaid === false ? (
                            <Row style={{ justifyContent: 'center', marginTop: '20px' }}>
                                {order.isDelivered === false ? (
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang chuẩn bị</span>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '500px', marginBottom: '20px' }}
                                            textbutton={'Hủy đơn hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenDelete(true)
                                                setIdDelete(order?._id);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontSize: '15px', marginTop: '30px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đang giao hàng</span>
                                        <ButtonComponent
                                            style={{ width: '200px', marginLeft: '500px', marginBottom: '20px' }}
                                            textbutton={'Đã nhận được hàng'}
                                            className='styleButtonAdd'
                                            onClick={() => {
                                                setIsModalOpenUpdate(true)
                                                setIdUpdate(order?._id);
                                            }}
                                        />
                                    </div>
                                )}
                            </Row>
                        ) : (
                            <div style={{ display: 'flex', height: '60px', alignItems: 'center' }}>
                                <span style={{ fontSize: '15px',marginLeft: '100px', color: 'rgb(39,200,100)' }}><b>Trạng thái:</b> Đã nhận được hàng</span>
                            </div>
                        )}
                    </div>
                ))):(
                    <>
                    <div style={{height: '300px', fontSize: '20px', fontWeight: 'bold'}}>Bạn chưa có đơn hàng nào, hãy tiếp tục mua hàng</div>
                    <ButtonComponent textbutton={'Tất cả sản phẩm'} className='styleButtonEnter' onClick={handleNavigateType} />
                    </>
                )}
            </div>
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteOrder}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa đơn hàng này này?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Thông báo!" open={isModalOpenUpdate} onCancel={handleCancelUpdate} onOk={handleUpdateOrder}>
                <Loading isPending={isPendingUpdate}>
                    <div>Bạn đã nhận được đơn hàng này?</div>
                </Loading>
            </ModalComponent>
        </Loading>
        
    );
};

export default MyOrderPage;
