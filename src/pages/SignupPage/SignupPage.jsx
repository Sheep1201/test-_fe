import React, { useEffect, useState } from 'react';
import './styleSignup.css';
import logo from '../../asset/images/Logo.png'
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import * as UserSevice from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message'

const SignupPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phone, setPhone] = useState('')

    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePhone = (value) => {
        setPhone(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }
    const handleOnChangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }
    const navigate = useNavigate()
    const handleNavigateSignin = () => {
        navigate('/sign-in')
    }

    const handleSignup = () => {
        mutation.mutate({name, email, password, confirmPassword, phone })
    }

    const mutation = useMutationHooks(
        data => UserSevice.signupUser(data)
    )

    const { data, isPending, isSuccess } = mutation

    useEffect( () => {
        if( isSuccess && data?.status !== 'ERR' ){
            message.success()
            navigate('/sign-in')
        }
    }, [isSuccess, navigate, data?.status])

    return (
        <div>
            <div className='HeaderPage'>
                <img alt="logo" src={logo} />
            </div>
            <div className='container'>
                <div className='box-form'>
                    <div className='box-name'>
                        <span>Đăng ký tài khoản</span>
                    </div>
                    <div className='form'>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Tên người dùng"
                            size="large"
                            OnChange={handleOnChangeName}
                            value={name}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Email"
                            size="large"
                            OnChange={handleOnChangeEmail}
                            value={email}
                        />
                        <div style={{ position: 'relative', width: '350px', marginBottom: '30px' }}>
                            <span onClick={() => setIsShowPassword(!isShowPassword)}
                                style={{
                                    zIndex: 10,
                                    position: 'absolute',
                                    top: '10px',
                                    right: '12px'
                                }}
                            >
                                {
                                    isShowPassword ? (
                                        <EyeFilled />
                                    ) : (
                                        <EyeInvisibleFilled />
                                    )
                                }
                            </span>
                            <InputComponent
                                style={{ border: '1px solid' }}
                                placeholder="Mật khẩu"
                                type={isShowPassword ? "text" : "password"}
                                size="large"
                                OnChange={handleOnChangePassword}
                                value={password} />
                        </div>
                        <div style={{ position: 'relative', width: '350px' }}>
                            <span onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                                style={{
                                    zIndex: 10,
                                    position: 'absolute',
                                    top: '10px',
                                    right: '12px',
                                }}>
                                {
                                    isShowConfirmPassword ? (
                                        <EyeFilled />
                                    ) : (
                                        <EyeInvisibleFilled />
                                    )
                                }
                            </span>
                            <InputComponent
                                style={{ border: '1px solid', marginBottom: '10px' }}
                                placeholder="Nhập lại mật khẩu"
                                type={isShowConfirmPassword ? "text" : "password"}
                                size="large"
                                OnChange={handleOnChangeConfirmPassword}
                                value={confirmPassword} />
                        </div>
                        <InputComponent
                            style={{ border: '1px solid', marginTop: '20px' }}
                            placeholder="Số điện thoại"
                            size="large"
                            OnChange={handleOnChangePhone}
                            value={phone}
                        />
                    </div>
                    <div className='form'>
                        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                        <Loading isPending={isPending}>
                            <ButtonComponent
                                disabled={!email.length || !password.length || !confirmPassword.length || !name.length || !phone.length}
                                size="large"
                                textbutton="Đăng ký"
                                className='styleButtonEnter'
                                onClick={handleSignup}
                            /></Loading>
                        <br />
                        <ButtonComponent
                            size="large"
                            textbutton="Đăng nhập"
                            className='styleButtonEnter'
                            onClick={handleNavigateSignin}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage