import './styleAdminProduct.css'
import TableComponent from '../TableComponent/TableComponent'
import { Button, Select, Space, Upload } from 'antd'
import React, { useEffect, useRef, useState } from 'react';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message'
import * as ProductService from '../../services/ProductService';
import { getBase64 } from '../../ultils';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';

export const AdminProduct = () => {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [type, setType] = useState('')
    const [price, setPrice] = useState('')
    const [countInStock, setCountInStock] = useState('')
    const [description, setDescription] = useState('')
    const [priceSale, setPriceSale] = useState('')
    const [selled, setSelled] = useState('')
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '', image: '', type: '', price: '', countInStock: '', description: '', priceSale: '', selled: ''
    })
    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangeImage = async ({ fileList }) => {
        if (fileList.length === 0) {
            setImage('');
            return;
        }

        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImage(file.preview);
    }
    const handleOnChangeType = (value) => {
        setType(value)
    }
    const handleOnChangePrice = (value) => {
        setPrice(value)
    }
    const handleOnChangeCountInStock = (value) => {
        setCountInStock(value)
    }
    const handleOnChangeDescription = (value) => {
        setDescription(value)
    }
    const handleOnChangePriceSale = (value) => {
        setPriceSale(value)
    }
    const handleOnChangeSelled = (value) => {
        setSelled(value)
    }

    const handleCreate = () => {
        mutation.mutate({ name, image, type, price, countInStock, description, priceSale, selled}, {
            onSettled: () => {
                queryProduct.refetch()
                setIsModalOpen(false);
            }
        })
    }
    const handleUpdate = () => {
        mutationUpdate.mutate({ id: rowSelected, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
                setIsOpenDrawer(false);
            }
        });
    }


    const handleOnChangeDetails = (field, value) => {
        setStateProductDetails({
            ...stateProductDetails,
            [field]: value
        })
    }
    const resetFields = () => {
        setName('');
        setImage('');
        setType('');
        setPrice('');
        setCountInStock('');
        setDescription('');
        setPriceSale('');
        setSelled('');
    };
    const mutation = useMutationHooks(
        (data) => {
            const {
                name, image, type, price, countInStock, description, priceSale, selled
            } = data
            const res = ProductService.createProduct({
                name, image, type, price, countInStock, description, priceSale, selled
            })
            return res
        }
    );
    const mutationUpdate = useMutationHooks(
        (data) => {
            const {
                id,
                ...rests
            } = data;
            ProductService.updateProduct(
                id, rests
            );
        }
    );
    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
            } = data;
            ProductService.deleteProduct(
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

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }
    const { data, isPending, isSuccess } = mutation
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    const { isLoading: isLoadingProducts, data: products } = queryProduct

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                image: res?.data?.image,
                type: res?.data?.type,
                price: res?.data?.price,
                countInStock: res?.data?.countInStock,
                description: res?.data?.description,
                priceSale: res?.data?.priceSale,
                selled: res?.data?.selled
            })
        }
        setIsPendingUpdate(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])
    const handleOnChangeImageDetails = async ({ fileList }) => {
        if (fileList.length === 0) {
            setStateProductDetails({
                ...stateProductDetails,
                image: '' // Xóa ảnh khi không có file được chọn
            });
            return;
        }

        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImage(file.preview);
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview // Lưu đường dẫn ảnh vào stateProductDetails
        });
    }


    const handleDetailsProduct = async () => {
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

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected }, {
            onSettled: () => {
                queryProduct.refetch()
                setIsModalOpenDelete(false);
            }
        })
    }

    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ fontSize: '20px', color: 'orange', marginLeft: '-5px' }} onClick={handleDetailsProduct} />
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

    const formatPrice = (price) => {
        return price.toLocaleString('en-US');
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image) => <img src={image} alt="product" style={{ width: '100px', height: 'auto' }} />
        },
        {
            title: 'Type',
            dataIndex: 'type',
            ...getColumnSearchProps('type')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price) => formatPrice(price),
            sorter: (a, b) => a.price - b.price,
            ...getColumnSearchProps('price')
        },
        {
            title: 'PriceSale',
            dataIndex: 'priceSale',
            render: (priceSale) => formatPrice(priceSale),
            sorter: (a, b) => a.priceSale - b.priceSale,
            ...getColumnSearchProps('priceSale')
        },
        {
            title: 'CountInStock',
            dataIndex: 'countInStock',
            sorter: (a, b) => a.countInStock - b.countInStock,
            ...getColumnSearchProps('countInStock')
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
            ...getColumnSearchProps('selled')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = products?.data?.length && products?.data?.filter(product => product.type !== 'PC').map((product) => {
        return { ...product, key: product._id }
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

    const onChange = (value) => {
        handleOnChangeType(value)
    };
    const onSearch = (value) => {
    };
    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <div className='containerAdmin'>
            <div className='WrapperHeaderAdmin'>Danh sách sản phẩm</div>
            <Button className='button-admin' onClick={showModal}><PlusOutlined />Thêm mới</Button>
            <ModalComponent forceRender title="Thêm mới sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '0px' }}>
                    <div className='form' style={{ width: '100%' }}>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Tên sản phẩm"
                            size="large"
                            OnChange={handleOnChangeName}
                            value={name}
                        />
                        <Select className='select-admin'
                            showSearch
                            placeholder="Loại hàng"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                                {
                                    value: 'ram',
                                    label: 'Ram',
                                },
                                {
                                    value: 'ssd/hdd',
                                    label: 'Ssd/Hdd',
                                },
                                {
                                    value: 'gear',
                                    label: 'Gear',
                                },
                                {
                                    value: 'mouse',
                                    label: 'Chuột',
                                },
                                {
                                    value: 'keyboard',
                                    label: 'Bàn phím',
                                },
                                {
                                    value: 'headphone',
                                    label: 'Tai nghe',
                                },
                                {
                                    value: 'screen',
                                    label: 'Màn hình',
                                },
                            ]}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Giá"
                            size="large"
                            OnChange={handleOnChangePrice}
                            value={price}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số lượng"
                            size="large"
                            OnChange={handleOnChangeCountInStock}
                            value={countInStock}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Mô tả"
                            size="large"
                            OnChange={handleOnChangeDescription}
                            value={description}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Giá chưa giảm"
                            size="large"
                            OnChange={handleOnChangePriceSale}
                            value={priceSale}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Đã bán"
                            size="large"
                            OnChange={handleOnChangeSelled}
                            value={selled}
                        />
                        <Upload onChange={handleOnChangeImage}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        {image && (
                            <img src={image} alt='image' style={{ height: '60px', width: '60px', borderRadius: '5%', objectFit: 'cover' }} />
                        )}
                    </div>
                    <div className='form'>
                        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                        <Loading isPending={isPending}>
                            <ButtonComponent
                                disabled={!name.length || !type.length || !price.length || !countInStock.length || !description.length
                                    || !priceSale.length || !selled.length || isNaN(price) || isNaN(priceSale) || isNaN(selled)}
                                size="large"
                                textbutton="Thêm mới"
                                className='styleButtonEnter'
                                onClick={handleCreate}
                            /></Loading>
                        <br />
                    </div>
                </div>
            </ModalComponent>
            <TableComponent style={{ width: '1600px' }} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                return {
                    onClick: (event) => {
                        setRowSelected(record._id)
                    }, // click row
                };
            }} />
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={onClose} width='50%'>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '0px' }}>
                    <div className='form' style={{ width: '100%' }}>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Tên sản phẩm"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('name', value)}
                            value={stateProductDetails.name}
                        />
                        <Select className='select-admin'
                            showSearch
                            placeholder="Loại hàng"
                            optionFilterProp="children"
                            OnChange={(value) => handleOnChangeDetails('type', value)}
                            value={stateProductDetails.type}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                                {
                                    value: 'ram',
                                    label: 'Ram',
                                },
                                {
                                    value: 'ssd/hdd',
                                    label: 'Ssd/Hdd',
                                },
                                {
                                    value: 'gear',
                                    label: 'Gear',
                                },
                                {
                                    value: 'mouse',
                                    label: 'Chuột',
                                },
                                {
                                    value: 'keyboard',
                                    label: 'Bàn phím',
                                },
                                {
                                    value: 'headphone',
                                    label: 'Tai nghe',
                                },
                                {
                                    value: 'screen',
                                    label: 'Màn hình',
                                },
                            ]}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Giá"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('price', value)}
                            value={stateProductDetails.price}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số lượng"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('countInStock', value)}
                            value={stateProductDetails.countInStock}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Mô tả"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('description', value)}
                            value={stateProductDetails.description}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Giá chưa giảm"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('priceSale', value)}
                            value={stateProductDetails.priceSale}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Đã bán"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('selled', value)}
                            value={stateProductDetails.selled}
                        />
                        <Upload onChange={handleOnChangeImageDetails}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        {stateProductDetails.image && (
                            <img src={stateProductDetails.image} alt='image' style={{ height: '60px', width: '60px', borderRadius: '5%', objectFit: 'cover' }} />
                        )}
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
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa sản phẩm này?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}
export const AdminProductPC = () => {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [type, setType] = useState('')
    const [price, setPrice] = useState('')
    const [countInStock, setCountInStock] = useState('')
    const [description, setDescription] = useState('')
    const [priceSale, setPriceSale] = useState('')
    const [selled, setSelled] = useState('')
    const [os, setOs] = useState('')
    const [Case, setCase] = useState('')
    const [cpu, setCpu] = useState('')
    const [ram, setRam] = useState('')
    const [rom, setRom] = useState('')
    const [gpu, setGpu] = useState('')
    const [main, setMain] = useState('')
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '', image: '', type: '', price: '', countInStock: '', description: '', priceSale: '', selled: '', os: '', Case: '', cpu: '', ram: '', rom: '', gpu: '', main: ''
    })
    const handleOnChangeImage = async ({ fileList }) => {
        if (fileList.length === 0) {
            setImage('');
            return;
        }

        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImage(file.preview);
    }
    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangeType = (value) => {
        setType(value)
    }
    const handleOnChangePrice = (value) => {
        setPrice(value)
    }
    const handleOnChangeCountInStock = (value) => {
        setCountInStock(value)
    }
    const handleOnChangeDescription = (value) => {
        setDescription(value)
    }
    const handleOnChangePriceSale = (value) => {
        setPriceSale(value)
    }
    const handleOnChangeSelled = (value) => {
        setSelled(value)
    }
    const handleOnChangeOs = (value) => {
        setOs(value)
    }
    const handleOnChangeCase = (value) => {
        setCase(value)
    }
    const handleOnChangeCpu = (value) => {
        setCpu(value)
    }
    const handleOnChangeRam = (value) => {
        setRam(value)
    }
    const handleOnChangeRom = (value) => {
        setRom(value)
    }
    const handleOnChangeGpu = (value) => {
        setGpu(value)
    }
    const handleOnChangeMain = (value) => {
        setMain(value)
    }

    const handleCreate = () => {
        mutation.mutate({ name, image, type, price, countInStock, description, priceSale, selled, os, Case, cpu, ram, rom, gpu, main  }, {
            onSettled: () => {
                queryProduct.refetch()
                setIsModalOpen(false);
            }
        })
    }
    const handleUpdate = () => {
        mutationUpdate.mutate({ id: rowSelected, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
                setIsOpenDrawer(false);
            }
        });
    }


    const handleOnChangeDetails = (field, value) => {
        setStateProductDetails({
            ...stateProductDetails,
            [field]: value
        })
    }
    const resetFields = () => {
        setName('');
        setImage('');
        setType('PC');
        setPrice('');
        setCountInStock('');
        setDescription('');
        setPriceSale('');
        setSelled('');
        setOs('');
        setCase('');
        setCpu('');
        setRam('');
        setRom('');
        setGpu('');
        setMain('');
    };
    const mutation = useMutationHooks(
        (data) => {
            const {
                name, image, type, price, countInStock, description, priceSale, selled, os, Case, cpu, ram, rom, gpu, main
            } = data
            const res = ProductService.createProduct({
                name, image, type, price, countInStock, description, priceSale, selled, os, Case, cpu, ram, rom, gpu, main
            })
            return res
        }
    );
    const mutationUpdate = useMutationHooks(
        (data) => {
            const {
                id,
                ...rests
            } = data;
            ProductService.updateProduct(
                id, rests
            );
        }
    );
    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
            } = data;
            ProductService.deleteProduct(
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

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }
    const { data, isPending, isSuccess } = mutation
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    const { isLoading: isLoadingProducts, data: products } = queryProduct

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                image: res?.data?.image,
                type: res?.data?.type,
                price: res?.data?.price,
                countInStock: res?.data?.countInStock,
                description: res?.data?.description,
                priceSale: res?.data?.priceSale,
                selled: res?.data?.selled,
                os: res?.data?.os,
                Case: res?.data?.Case,
                cpu: res?.data?.cpu,
                ram: res?.data?.ram,
                rom: res?.data?.rom,
                gpu: res?.data?.gpu,
                main: res?.data?.main,
            })
        }
        setIsPendingUpdate(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])
    const handleOnChangeImageDetails = async ({ fileList }) => {
        if (fileList.length === 0) {
            setStateProductDetails({
                ...stateProductDetails,
                image: '' // Xóa ảnh khi không có file được chọn
            });
            return;
        }

        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImage(file.preview);
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview // Lưu đường dẫn ảnh vào stateProductDetails
        });
    }


    const handleDetailsProduct = async () => {
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

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected }, {
            onSettled: () => {
                queryProduct.refetch()
                setIsModalOpenDelete(false);
            }
        })
    }

    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ fontSize: '20px', color: 'orange', marginLeft: '-5px' }} onClick={handleDetailsProduct} />
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

    const formatPrice = (price) => {
        return price.toLocaleString('en-US');
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image) => <img src={image} alt="product" style={{ width: '100px', height: 'auto' }} />
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price) => formatPrice(price),
            sorter: (a, b) => a.price - b.price,
            ...getColumnSearchProps('price')
        },
        {
            title: 'PriceSale',
            dataIndex: 'priceSale',
            render: (priceSale) => formatPrice(priceSale),
            sorter: (a, b) => a.priceSale - b.priceSale,
            ...getColumnSearchProps('priceSale')
        },
        {
            title: 'CountInStock',
            dataIndex: 'countInStock',
            sorter: (a, b) => a.countInStock - b.countInStock,
            ...getColumnSearchProps('countInStock')
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
            ...getColumnSearchProps('selled')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = products?.data?.length && products?.data?.filter(product => product.type === 'PC').map((product) => {
        return { ...product, key: product._id }
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

    const onChange = (value) => {
        handleOnChangeType(value)
    };
    const onSearch = (value) => {
    };
    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <div className='containerAdmin'>
            <div className='WrapperHeaderAdmin'>Danh sách sản phẩm</div>
            <Button className='button-admin' onClick={showModal}><PlusOutlined />Thêm mới</Button>
            <ModalComponent forceRender title="Thêm mới sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '0px' }}>
                    <div className='form' style={{ width: '100%' }}>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Tên sản phẩm"
                            size="large"
                            OnChange={handleOnChangeName}
                            value={name}
                        />
                        <Select className='select-admin'
                            showSearch
                            placeholder="Loại hàng"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                                {
                                    value: 'PC',
                                    label: 'PC',
                                }
                            ]}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Giá"
                            size="large"
                            OnChange={handleOnChangePrice}
                            value={price}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số lượng"
                            size="large"
                            OnChange={handleOnChangeCountInStock}
                            value={countInStock}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Mô tả"
                            size="large"
                            OnChange={handleOnChangeDescription}
                            value={description}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Giá chưa giảm"
                            size="large"
                            OnChange={handleOnChangePriceSale}
                            value={priceSale}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Đã bán"
                            size="large"
                            OnChange={handleOnChangeSelled}
                            value={selled}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Hệ điều hành"
                            size="large"
                            OnChange={handleOnChangeOs}
                            value={os}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Case"
                            size="large"
                            OnChange={handleOnChangeCase}
                            value={Case}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Cpu"
                            size="large"
                            OnChange={handleOnChangeCpu}
                            value={cpu}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Ram"
                            size="large"
                            OnChange={handleOnChangeRam}
                            value={ram}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Rom"
                            size="large"
                            OnChange={handleOnChangeRom}
                            value={rom}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Gpu"
                            size="large"
                            OnChange={handleOnChangeGpu}
                            value={gpu}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Main"
                            size="large"
                            OnChange={handleOnChangeMain}
                            value={main}
                        />
                        <Upload onChange={handleOnChangeImage}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        {image && (
                            <img src={image} alt='image' style={{ height: '60px', width: '60px', borderRadius: '5%', objectFit: 'cover' }} />
                        )}
                    </div>
                    <div className='form'>
                        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                        <Loading isPending={isPending}>
                            <ButtonComponent
                                disabled={!name.length || !type.length || !price.length || !countInStock.length || !description.length
                                    || !priceSale.length || !selled.length || isNaN(price) || isNaN(priceSale) || isNaN(selled)|| !os.length|| !Case.length|| !cpu.length|| !ram.length|| !rom.length|| !gpu.length|| !main.length}
                                size="large"
                                textbutton="Thêm mới"
                                className='styleButtonEnter'
                                onClick={handleCreate}
                            /></Loading>
                        <br />
                    </div>
                </div>
            </ModalComponent>
            <TableComponent style={{ width: '1600px' }} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                return {
                    onClick: (event) => {
                        setRowSelected(record._id)
                    }, // click row
                };
            }} />
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={onClose} width='50%'>
                <div className='container' style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '0px' }}>
                    <div className='form' style={{ width: '100%' }}>
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Tên sản phẩm"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('name', value)}
                            value={stateProductDetails.name}
                        />
                        <Select className='select-admin'
                            showSearch
                            placeholder="Loại hàng"
                            optionFilterProp="children"
                            OnChange={(value) => handleOnChangeDetails('type', value)}
                            value={stateProductDetails.type}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                                {
                                    value: 'PC',
                                    label: 'PC',
                                }
                            ]}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Giá"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('price', value)}
                            value={stateProductDetails.price}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Số lượng"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('countInStock', value)}
                            value={stateProductDetails.countInStock}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Mô tả"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('description', value)}
                            value={stateProductDetails.description}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Giá chưa giảm"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('priceSale', value)}
                            value={stateProductDetails.priceSale}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Đã bán"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('selled', value)}
                            value={stateProductDetails.selled}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Hệ điều hành"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('os', value)}
                            value={stateProductDetails.os}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Case"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('Case', value)}
                            value={stateProductDetails.Case}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Cpu"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('cpu', value)}
                            value={stateProductDetails.cpu}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Ram"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('ram', value)}
                            value={stateProductDetails.ram}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Rom"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('rom', value)}
                            value={stateProductDetails.rom}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Gpu"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('gpu', value)}
                            value={stateProductDetails.gpu}
                        />
                        <InputComponent
                            style={{ border: '1px solid', marginBottom: '30px' }}
                            placeholder="Main"
                            size="large"
                            OnChange={(value) => handleOnChangeDetails('main', value)}
                            value={stateProductDetails.main}
                        />
                        <Upload onChange={handleOnChangeImageDetails}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        {stateProductDetails.image && (
                            <img src={stateProductDetails.image} alt='image' style={{ height: '60px', width: '60px', borderRadius: '5%', objectFit: 'cover' }} />
                        )}
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
            <ModalComponent forceRender title="Cảnh báo!" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn chắc chắn muốn xóa sản phẩm này?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}
