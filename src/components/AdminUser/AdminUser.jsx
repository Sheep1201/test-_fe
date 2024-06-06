import './styleAdminUser.css'
import TableComponent from '../TableComponent/TableComponent'
import { Button, Modal, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { EyeFilled, EyeInvisibleFilled, PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import * as UserSevice from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message'
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';

export const User = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [stateUserDetails, setStateUserDetails] = useState({
        email: '', name: '', password: '', phone: '', address: ''
    })

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
    const handleOnChangeAddress = (value) => {
        setAddress(value)
    }

    const handleCreateAdmin = () => {
        mutation.mutate({ name, email, password, confirmPassword, phone, address, isAdmin: false }, {
            onSettled: () => {
                queryUser.refetch()
                setIsModalOpen(false);
            }
        })
    }
    const handleUpdate = () => {
        mutationUpdate.mutate({ id: rowSelected, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
                setIsOpenDrawer(false);
            }
        });
    }
    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected }, {
            onSettled: () => {
                queryUser.refetch()
                setIsModalOpenDelete(false);
            }
        })
    }

    const handleOnChangeDetails = (field, value) => {
        setStateUserDetails({
            ...stateUserDetails,
            [field]: value
        })
    }
    const resetFields = () => {
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setAddress('');
    };
    const mutation = useMutationHooks(
        data => UserSevice.signupUser(data)
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            const {
                id,
                ...rests
            } = data;
            UserSevice.updateUser(
                id, rests
            );
        }
    );
    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
            } = data;
            UserSevice.deleteUser(
                id
            );
        }
    );
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleCancel = () => {
        setIsModalOpen(false);
        resetFields()
    };
    const showModal = () => {
        setIsModalOpen(true);
    };


    const getAllUser = async () => {
        const res = await UserSevice.getAllUser()
        return res
    }
    const { data, isPending, isSuccess, } = mutation
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUser })
    const { isLoading: isLoadingUsers, data: users } = queryUser

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await UserSevice.getDetailUser(rowSelected)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                password: res?.data?.password,
                confirmPassword: res?.data?.confirmPassword,
                phone: res?.data?.phone,
                address: res?.data?.address,
            })
        }
        setIsPendingUpdate(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])
    const handleDetailsUser = async () => {
        if (rowSelected) {
            setIsPendingUpdate(true)
            fetchGetDetailsProduct()
        } setIsOpenDrawer(true)
    }
    const onClose = () => {
        setIsOpenDrawer(false);
        setRowSelected('')
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ fontSize: '20px', color: 'orange', marginLeft: '-5px' }} onClick={handleDetailsUser} />
                <DeleteOutlined style={{ fontSize: '20px', color: 'red', marginLeft: '10px' }} onClick={() => setIsModalOpenDelete(true)} />
            </div>
        )
    }

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
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
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
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps('email')
        },
        {
            title: 'Password',
            dataIndex: 'password',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ...getColumnSearchProps('address')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = users?.data?.length && users?.data?.filter(user => user.isAdmin === false).map((user) => {
        return { ...user, key: user._id }
    });
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success()
        }
    }, [isSuccess, data?.status])
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status !== 'ERR') {
            message.success()
        }
    }, [isSuccessUpdated, dataUpdated?.status])
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status !== 'ERR') {
            message.success()
        }
    }, [isSuccessDeleted, dataDeleted?.status])

    return (
        <div className='containerAdmin'>
            <div className='WrapperHeaderAdmin'>Danh sách người dùng</div>
            <Button className='button-admin' onClick={showModal}><PlusOutlined />Thêm mới</Button>
            <TableComponent columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
                return {
                    onClick: (event) => {
                        setRowSelected(record._id)
                    }, // click row
                };
            }} />
            <Modal title="Thêm mới quản trị viên" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
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
                                style={{ border: '1px solid', marginBottom: '30px' }}
                                placeholder="Nhập lại mật khẩu"
                                type={isShowConfirmPassword ? "text" : "password"}
                                size="large"
                                OnChange={handleOnChangeConfirmPassword}
                                value={confirmPassword} />
                        </div>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số điện thoại"
                            size="large"
                            OnChange={handleOnChangePhone}
                            value={phone}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Địa chỉ"
                            size="large"
                            OnChange={handleOnChangeAddress}
                            value={address}
                        />
                    </div>
                    <div className='form'>
                        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                        <Loading isPending={isPending}>
                            <ButtonComponent
                                disabled={!email.length || !password.length || !confirmPassword.length || !name.length || !phone.length || !address.length}
                                size="large"
                                textbutton="Thêm mới"
                                className='styleButtonEnter'
                                onClick={handleCreateAdmin}
                            /></Loading>
                        <br />
                    </div>
                </div>
            </Modal>
            <DrawerComponent title='Thông tin chi tiết' isOpen={isOpenDrawer} onClose={onClose} width='50%'>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '0px' }}>
                    <div className='form' style={{ width: '100%' }}>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Tên người dùng"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('name', value)}
                            value={stateUserDetails.name}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Email"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('email', value)}
                            value={stateUserDetails.email}
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
                                OnChange={(value) => handleOnChangeDetails('password', value)}
                                value={stateUserDetails.password} />
                        </div>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số điện thoại"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('phone', value)}
                            value={stateUserDetails.phone}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Địa chỉ"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('address', value)}
                            value={stateUserDetails.address}
                        />
                    </div>
                    <div className='form'>
                        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                        <Loading isPending={isPendingUpdate || isPendingUpdated}>
                            <ButtonComponent
                                size="large"
                                textbutton="Cập nhật"
                                className='styleButtonEnter'
                                onClick={handleUpdate}
                            /></Loading>
                        <br />
                    </div>
                </div>
            </DrawerComponent>
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa người dùng này?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}


export const AdminUser = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [stateUserDetails, setStateUserDetails] = useState({
        email: '', name: '', password: '', phone: '', address: ''
    })

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
    const handleOnChangeAddress = (value) => {
        setAddress(value)
    }

    const handleCreateAdmin = () => {
        mutation.mutate({ name, email, password, confirmPassword, phone, address, isAdmin: true }, {
            onSettled: () => {
                queryUser.refetch()
                setIsModalOpen(false);
            }
        })
    }
    const handleUpdate = () => {
        mutationUpdate.mutate({ id: rowSelected, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
                setIsOpenDrawer(false);
            }
        });
    }
    const handleOnChangeDetails = (field, value) => {
        setStateUserDetails({
            ...stateUserDetails,
            [field]: value
        })
    }
    const resetFields = () => {
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setAddress('');
    };
    const mutation = useMutationHooks(
        data => UserSevice.signupUser(data)
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            const {
                id,
                ...rests
            } = data;
            UserSevice.updateUser(
                id, rests
            );
        }
    );
    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
            } = data;
            UserSevice.deleteUser(
                id
            );
        }
    );
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleCancel = () => {
        setIsModalOpen(false);
        resetFields()
    };
    const showModal = () => {
        setIsModalOpen(true);
    };


    const getAllUser = async () => {
        const res = await UserSevice.getAllUser()
        return res
    }
    const { data, isPending, isSuccess, } = mutation
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUser })
    const { isLoading: isLoadingUsers, data: users } = queryUser

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await UserSevice.getDetailUser(rowSelected)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                password: res?.data?.password,
                phone: res?.data?.phone,
                address: res?.data?.address,
            })
        }
        setIsPendingUpdate(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])
    const handleDetailsUser = async () => {
        if (rowSelected) {
            setIsPendingUpdate(true)
            fetchGetDetailsProduct()
        } setIsOpenDrawer(true)
    }
    const onClose = () => {
        setIsOpenDrawer(false);
        setRowSelected('')
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected }, {
            onSettled: () => {
                queryUser.refetch()
                setIsModalOpenDelete(false);
            }
        })
    }
    const renderAction = (user) => {
        if (user.email !== 'nnhieu120103@gmail.com') {
            return (
                <div>
                    <EditOutlined style={{ fontSize: '20px', color: 'orange', marginLeft: '-5px' }} onClick={() => handleDetailsUser(user)} />
                    <DeleteOutlined style={{ fontSize: '20px', color: 'red', marginLeft: '10px' }} onClick={() => setIsModalOpenDelete(true)} />
                </div>
            );
        }
        // Trả về null nếu không muốn hiển thị gì cả
        return null;
    }    

    const dataTable = users?.data?.length && users?.data?.filter(user => user.isAdmin === true).map((user) => {
        return { ...user, key: user._id }
    });
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
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
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
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps('email')
        },
        {
            title: 'Password',
            dataIndex: 'password',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ...getColumnSearchProps('address')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => renderAction(record)
        },
    ];
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success()
        }
    }, [isSuccess, data?.status])
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status !== 'ERR') {
            message.success()
        }
    }, [isSuccessUpdated, dataUpdated?.status])
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status !== 'ERR') {
            message.success()
        }
    }, [isSuccessDeleted, dataDeleted?.status])

    return (
        <div className='containerAdmin'>
            <div className='WrapperHeaderAdmin'>Danh sách người dùng</div>
            <Button className='button-admin' onClick={showModal}><PlusOutlined />Thêm mới</Button>
            <TableComponent columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
                return {
                    onClick: (event) => {
                        setRowSelected(record._id)
                    }, // click row
                };
            }} />
            <Modal title="Thêm mới quản trị viên" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
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
                                style={{ border: '1px solid', marginBottom: '30px' }}
                                placeholder="Nhập lại mật khẩu"
                                type={isShowConfirmPassword ? "text" : "password"}
                                size="large"
                                OnChange={handleOnChangeConfirmPassword}
                                value={confirmPassword} />
                        </div>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số điện thoại"
                            size="large"
                            OnChange={handleOnChangePhone}
                            value={phone}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Địa chỉ"
                            size="large"
                            OnChange={handleOnChangeAddress}
                            value={address}
                        />
                    </div>
                    <div className='form'>
                        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                        <Loading isPending={isPending}>
                            <ButtonComponent
                                disabled={!email.length || !password.length || !confirmPassword.length || !name.length || !phone.length || !address.length}
                                size="large"
                                textbutton="Thêm mới"
                                className='styleButtonEnter'
                                onClick={handleCreateAdmin}
                            /></Loading>
                        <br />
                    </div>
                </div>
            </Modal>
            <DrawerComponent title='Thông tin chi tiết' isOpen={isOpenDrawer} onClose={onClose} width='50%'>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '0px' }}>
                    <div className='form' style={{ width: '100%' }}>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Tên người dùng"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('name', value)}
                            value={stateUserDetails.name}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Email"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('email', value)}
                            value={stateUserDetails.email}
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
                                OnChange={(value) => handleOnChangeDetails('password', value)}
                                value={stateUserDetails.password} />
                        </div>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số điện thoại"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('phone', value)}
                            value={stateUserDetails.phone}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Địa chỉ"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('address', value)}
                            value={stateUserDetails.address}
                        />
                    </div>
                    <div className='form'>
                        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                        <Loading isPending={isPendingUpdate || isPendingUpdated}>
                            <ButtonComponent
                                size="large"
                                textbutton="Cập nhật"
                                className='styleButtonEnter'
                                onClick={handleUpdate}
                            /></Loading>
                        <br />
                    </div>
                </div>
            </DrawerComponent>
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa người dùng này?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}
