import React, { useEffect, useState } from 'react';
import './styleSignin.css';
import logo from '../../asset/images/Logo.png'
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import * as UserSevice from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slide/userSlide';

const SigninPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const mutation = useMutationHooks(
        data => UserSevice.loginUser(data)
    )
    const { data, isPending, isSuccess } = mutation

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            if (location?.state) {
                navigate(location.state)
            }else{
                navigate('/')
            }
            message.success()
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token)
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }
        }
    }, [isSuccess, navigate, data, data?.status])

    const handleGetDetailsUser = async (id, token) => {
        const storage = localStorage.getItem('refresh_token')
        const refresh_token = JSON.parse(storage)
        const res = await UserSevice.getDetailUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token, refresh_token }))
    }

    const handleSignin = () => {
        mutation.mutate({
            email, password
        })
    }

    const handleNavigateSignup = () => {
        navigate('/sign-up')
    }
    return (
        <div>
            <div className='HeaderPage'>
                <img alt="cpuicon" src={logo} />
            </div>
            <div className='container'>
                <div className='box-form-signin'>
                    <div className='box-name'>
                        <span>Đăng nhập</span>
                    </div>
                    <div className='form'>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Email"
                            size="large"
                            OnChange={handleOnChangeEmail}
                            value={email}
                        />
                        <div style={{ position: 'relative', width: '350px' }}>
                            <span style={{ zIndex: 10, position: 'absolute', top: '10px', right: '12px' }}
                                onClick={() => setIsShowPassword(!isShowPassword)}>
                                {
                                    isShowPassword ? (
                                        <EyeFilled />
                                    ) : (
                                        <EyeInvisibleFilled />
                                    )
                                }
                            </span>
                            <InputComponent
                                style={{ border: '1px solid', marginBottom: '10px' }}
                                placeholder="Mật khẩu"
                                type={isShowPassword ? "text" : "password"}
                                size="large"
                                OnChange={handleOnChangePassword}
                                value={password}
                            />
                        </div>
                        <ul style={{ marginLeft: '200px', color: 'rgb(104,204,253)' }}>
                            <li><a href="link_to_forgot_password_page">Quên mật khẩu?</a></li>
                        </ul>
                    </div>
                    <div className='form'>
                        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                        <Loading isPending={isPending} >
                            <ButtonComponent
                                size="large"
                                textbutton="Đăng nhập"
                                className='styleButtonEnter'
                                disabled={!email.length || !password.length}
                                onClick={handleSignin}
                            />
                        </Loading>
                        <br />
                        <ButtonComponent
                            size="large"
                            textbutton="Tạo tài khoản"
                            className='styleButtonEnter'
                            onClick={handleNavigateSignup}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SigninPage