import { Button, Col, InputNumber, Radio, Row, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { editCart, removeAllCart, removeCart } from '../../redux/slide/cartSlide';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import Loading from '../../components/LoadingComponent/Loading';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserSevice from '../../services/UserService';
import * as OrderSevice from '../../services/OrderService';
import { updateUser } from '../../redux/slide/userSlide';



const OrderPage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch()
    const [numberProduct, setNumberProduct] = useState('')
    const [voucher, setVoucher] = useState('')
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const handleVoucherChange = (e) => {
        setVoucher(e.target.value);
    };
    // Tính tổng tiền và giảm giá trực tiếp
    const totalPrice = cart?.cartItems?.reduce((acc, item) => acc + (item.priceSale * item.amount), 0) || 0;
    const totalPriceSale = cart?.cartItems?.reduce((acc, item) => acc + ((item.priceSale - item.price) * item.amount), 0) || 0;
    const voucherDiscount = voucher === 'pcpower' ? 500000 : 0;
    const totalSavings = totalPriceSale + voucherDiscount;
    const total = totalPrice - totalSavings - voucherDiscount;
    const onChangeNumPrd = (value, idProduct) => {
        if (numberProduct[idProduct] !== value) {
            setNumberProduct((prev) => ({ ...prev, [idProduct]: value }));
            dispatch(editCart({ idProduct, editAmount: value }));
        }
    };


    const handleDeleteItem = (idProduct) => {
        dispatch(removeCart({ idProduct }))
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showModal = () => {
        if (!user?.access_token) {
            // Nếu không tồn tại, hiển thị thông báo lỗi
            message.error("Vui lòng đăng nhập để tiếp tục thanh toán.");
            return; // Dừng hàm ở đây
        }

        // Kiểm tra xem giỏ hàng có chứa ít nhất một sản phẩm không
        if (!cart?.cartItems || cart.cartItems.length === 0) {
            // Nếu không có sản phẩm trong giỏ hàng, hiển thị thông báo lỗi
            message.error("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.");
            return; // Dừng hàm ở đây
        }
        setIsModalOpen(true);
    };


    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserSevice.updateUser(id, rests, access_token)
        }
    )
    const mutationAddOrder = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            const res = OrderSevice.createOrder(id, { ...rests }, access_token)
            return res
        }
    )

    const { data, isPending, isSuccess } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
    }, [user])
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        }
    }, [isSuccess, data?.status])

    const handleOnChangeName = (e) => {
        setName(e.target.value);
    };
    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleOnChangePhone = (e) => {
        setPhone(e.target.value);
    };
    const handleOnChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserSevice.getDetailUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }
    const [valueRadio, setValueRadio] = useState(1);
    const onChangeRadio = (e) => {
        setValueRadio(e.target.value);
    };


    const handlePay = () => {
        mutationAddOrder.mutate({
            access_token: user?.access_token, cartItems: cart, fullname: name, email: email, phone: phone, address: address,
            paymentMethod: valueRadio, totalPrice: total, user: user?.id
        })
        mutation.mutate({ id: user?.id, email, name, phone, address, access_token: user?.access_token });
    }
    useEffect(() => {
        if (mutationAddOrder.isSuccess && mutationAddOrder.data?.status !== 'ERR') {
            message.success('Thanh toán thành công');
            dispatch(removeAllCart());  // Xóa toàn bộ giỏ hàng khi thanh toán thành công
            setIsModalOpen(false);  // Đóng modal khi thanh toán thành công
        }
    }, [mutationAddOrder.isSuccess, mutationAddOrder.data?.status, dispatch]);


    return (
        <div id='containerProduct' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ border: '1px solid black', borderRadius: '5px', width: '75%', height: '100%' }}>
                <Row style={{ alignItems: 'center', justifyContent: 'center', height: '30px' }}>
                    <Col span={14}><span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '25px' }}>Tất cả ({cart?.cartItems?.length} sản phẩm)</span>
                    </Col>
                    <Col span={4}><span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '30px' }}>Số lượng</span>
                    </Col>
                    <Col span={4}><span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '30px' }}>Giá thành</span>
                    </Col>
                    <Col span={2}>
                    </Col>
                </Row>
                <hr />
                {cart?.cartItems?.map((item, index) => {
                    return (
                        <Row key={item.id || index}>
                            <Col style={{ marginLeft: '25px' }} span={14}>
                                <img alt="productImage" src={item.image} style={{ maxWidth: '15%', marginRight: '15px' }} />
                                <span>{item.name}</span>
                            </Col>
                            <Col style={{ marginTop: '20px' }} span={4}>
                                <InputNumber min={1} max={10} defaultValue={item?.amount} onChange={(value) => onChangeNumPrd(value, item.product)} />
                            </Col>
                            <Col style={{ marginTop: '10px' }} span={4}>
                                <div className="style-Price">{formatPrice(item.price)}đ</div>
                                <div className="style-PriceSale">{formatPrice(item.priceSale)}đ</div>
                            </Col>
                            <DeleteOutlined style={{ fontSize: '20px', color: 'red' }} onClick={() => handleDeleteItem(item.product)} />
                        </Row>
                    )
                })}
            </div>
            <div style={{ border: '1px solid black', borderRadius: '5px', width: '23%' }}>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                        Tổng tiền:
                    </span>
                    <span>
                        {formatPrice(totalPrice)}đ
                    </span>
                </div>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                        Giảm giá trực tiếp:
                    </span>
                    <span style={{ color: 'orange' }}>
                        {formatPrice(totalPriceSale)}đ
                    </span>
                </div>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                        Giảm giá voucher:
                    </span>
                    {voucher === 'pcpower' ? (
                        <span style={{ color: 'orange' }}>
                            1,000,000đ
                        </span>
                    ) : (
                        <span style={{ color: 'orange' }}>
                            0đ
                        </span>
                    )}
                </div>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                        Tiết kiệm được:
                    </span>
                    <span style={{ color: 'orange' }}>
                        {formatPrice(totalSavings)}đ
                    </span>
                </div>
                <div style={{ padding: '10px' }}>
                    <InputComponent placeholder={'Nhập voucher'} onChange={handleVoucherChange} value={voucher} />
                </div>
                <hr />
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'red' }}>
                        Thành tiền:
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'red' }}>
                        {formatPrice(total)}đ
                    </span>
                </div>
                <span style={{ fontSize: '13px', margin: '0px 75px' }}>
                    (Đã bao gồm thuế VAT)
                </span>
                <div style={{ padding: '10px' }}>
                    <ButtonComponent textbutton={'Thanh toán'} className='styleButtonAdd' onClick={showModal} />
                </div>
            </div>
            <ModalComponent forceRender title="Cập nhật thông tin thanh toán" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '0px' }}>
                    <div className='form' style={{ width: '100%' }}>
                        <div style={{ fontSize: '15px', display: 'flex', width: '100%' }}>Tên người nhận:</div>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Tên người dùng"
                            size="large"
                            onChange={handleOnChangeName}
                            value={name}
                        />
                        <div style={{ fontSize: '15px', display: 'flex', width: '100%' }}>Email:</div>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Email"
                            size="large"
                            onChange={handleOnChangeEmail}
                            value={email}
                        />
                        <div style={{ fontSize: '15px', display: 'flex', width: '100%' }}>Số điện thoại:</div>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số điện thoại"
                            size="large"
                            onChange={handleOnChangePhone}
                            value={phone}
                        />
                        <Radio.Group onChange={onChangeRadio} value={valueRadio}>
                            <Space direction="vertical">
                                <Radio value={1}>Nhận hàng tại cửa hàng</Radio>
                                <Radio value={2}>Giao hàng tận nơi</Radio>
                                <Radio value={3}>Thanh toán bằng chuyển tiền</Radio>
                            </Space>
                        </Radio.Group>
                        <br />
                        {valueRadio === 2 && (
                            <>
                                <div style={{ fontSize: '15px', display: 'flex', width: '100%' }}>Địa chỉ nhận hàng:</div>
                                <InputComponent
                                    style={{ border: '1px solid', marginBottom: '30px' }}
                                    placeholder="Địa chỉ"
                                    size="large"
                                    onChange={handleOnChangeAddress}
                                    value={address}
                                />
                            </>
                        )}
                        {valueRadio === 3 && (
                            <div style={{ width: '100%', height: '60px' }}>
                                <Button style={{ width: '100%', height: '100%' }}>
                                    Thanh toán Paypal
                                </Button>
                            </div>
                        )}
                        {(valueRadio === 1 || valueRadio === 2) && (
                            <div className='form'>
                                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                                <Loading isPending={isPending}>
                                    <ButtonComponent
                                        textbutton="Thanh toán"
                                        size="large"
                                        className='styleButtonEnter'
                                        onClick={handlePay}
                                    />
                                </Loading>
                                <br />
                            </div>
                        )}
                    </div>
                </div>
            </ModalComponent>
        </div >
    )
}

export default OrderPage;
