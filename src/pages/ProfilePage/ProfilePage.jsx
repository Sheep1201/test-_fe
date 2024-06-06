import React, { useEffect, useState } from 'react';
import './Profile.css';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as UserSevice from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message'
import { Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slide/userSlide';

const ProfilePage = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const mutation = useMutationHooks(
        (data) => {
            const {id, access_token, ...rests} = data
            UserSevice.updateUser(id, rests, access_token)
        }
    )

    const { data, isPending, isSuccess } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
    }, [user])
    useEffect( () => {
        if( isSuccess && data?.status !== 'ERR' ){
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        }
    }, [isSuccess, data?.status])

    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePhone = (value) => {
        setPhone(value)
    }
    const handleOnChangeAddress = (value) => {
        setAddress(value)
    }

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserSevice.getDetailUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token}))
    }
    const handleUpdate = () => {
        mutation.mutate({id: user?.id, email, name, phone, address, access_token: user?.access_token})
    }

    return (
        <div className='container'>
            <div className='box-form-infor'>
                <div className='box-name'>
                    <span>Thông tin tài khoản</span>
                </div>
                <div className='form-infor'>
                    <Col className='form-infor-c1' span={5}>
                        <span>Tên:</span>
                        <span>Email:</span>
                        <span>Số điện thoại:</span>
                        <span>Địa chỉ:</span>
                    </Col>
                    <Col className='form-infor-c2' span={19}>
                        <InputComponent
                            style={{ border: '1px solid'}}
                            placeholder="Tên người dùng"
                            size="large"
                            OnChange={handleOnChangeName}
                            value={name}
                        />
                        <InputComponent
                            style={{ border: '1px solid'}}
                            placeholder="Email"
                            size="large"
                            OnChange={handleOnChangeEmail}
                            value={email}
                        />
                        <InputComponent
                            style={{ border: '1px solid'}}
                            placeholder="Điện thoại"
                            size="large"
                            OnChange={handleOnChangePhone}
                            value={phone}
                        />
                        <InputComponent
                            style={{ border: '1px solid'}}
                            placeholder="Địa chỉ"
                            size="large"
                            OnChange={handleOnChangeAddress}
                            value={address}
                        />
                    </Col>
                </div>
                <div className='form-button'>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isPending={isPending}>
                        <br/><ButtonComponent
                            disabled={!email || !name || !phone || !address}
                            size="large"
                            textbutton="Cập nhật"
                            className='styleButtonEnter'
                            onClick={handleUpdate}
                        />
                    </Loading>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage