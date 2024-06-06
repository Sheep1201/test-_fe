import { Col, InputNumber, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import osicon from '../../asset/images/icon-info/icon_os.svg';
import caseicon from '../../asset/images/icon-info/icon_case.svg';
import cpuicon from '../../asset/images/icon-info/icon_cpu.svg';
import ramicon from '../../asset/images/icon-info/icon_memory.svg';
import harddrivericon from '../../asset/images/icon-info/icon_hard drive.svg';
import gpuicon from '../../asset/images/icon-info/icon_gpu.svg';
import motherboardicon from '../../asset/images/icon-info/icon_motherboard.svg';
import './style.css'
import OverView from '../OverViewComponent/OverView';
import * as ProductService from '../../services/ProductService';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addCart } from '../../redux/slide/cartSlide';

const ProductDetailComponent = ({ idProduct }) => {
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [numProduct, setNumProduct] = useState('1')
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '', image: '', type: '', price: '', countInStock: '', description: '', priceSale: '', selled: '', os: '', Case: '', cpu: '', ram: '', rom: '', gpu: '', main: ''
    })
    const fetchGetDetailsProduct = async (idProduct) => {
        const res = await ProductService.getDetailsProduct(idProduct)
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
    }
    useEffect(() => {
        if (idProduct) {
            fetchGetDetailsProduct(idProduct)
        }
    }, [idProduct])
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const formatPriceSale = (priceSale) => {
        return priceSale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const onChangeNumPrd = (value) => {
        setNumProduct(value)
    };
    const handleAddCart = () => {
        if(!user?.id){
            navigate('/sign-in', {state: location?.pathname})
        }else{
            dispatch(addCart({
                cartItem: {
                    name: stateProductDetails.name,
                    amount: numProduct,
                    image: stateProductDetails.image,
                    price: stateProductDetails.price,
                    priceSale: stateProductDetails.priceSale,
                    product: idProduct
                }
            }))
        }
    }


    return (
        <div id='containerProduct'>
            <Row>
                <Col span={16}>
                    <div className='product-image' style={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img alt="productImage" src={stateProductDetails.image} />
                    </div>
                </Col>
                <Col span={8} style={{ borderLeft: '2px solid rgb(235,235,235)' }}>
                    <div style={{ padding: '0px 60px' }}>
                        <div className='box-info'>
                            <div className="styleName-Product">{stateProductDetails.name}</div>
                            <div className="style-Description">{stateProductDetails.description}</div>
                        </div>
                        <div className='box-info'>
                            <div className="style-Price">{formatPrice(stateProductDetails.price)}</div>
                            <div className="style-PriceSale">{formatPriceSale(stateProductDetails.priceSale)}</div>
                        </div>
                        {stateProductDetails.type === 'PC' && (
                            <div className='box-info'>
                                <div className='icon-info'>
                                    <img alt="osicon" src={osicon} />
                                    <div className="style-Os">{stateProductDetails.os}</div>
                                </div>
                                <div className='icon-info'>
                                    <img alt="caseicon" src={caseicon} />
                                    <div className="style-Case">{stateProductDetails.Case}</div>
                                </div>
                                <div className='icon-info'>
                                    <img alt="cpuicon" src={cpuicon} />
                                    <div className="style-Cpu">{stateProductDetails.cpu}</div>
                                </div>
                                <div className='icon-info'>
                                    <img alt="ramicon" src={ramicon} />
                                    <div className="style-Ram">{stateProductDetails.ram}</div>
                                </div>
                                <div className='icon-info'>
                                    <img alt="harddrivericon" src={harddrivericon} />
                                    <div className="style-Rom">{stateProductDetails.rom}</div>
                                </div>
                                <div className='icon-info'>
                                    <img alt="gpuicon" src={gpuicon} />
                                    <div className="style-Gpu">{stateProductDetails.gpu}</div>
                                </div>
                                <div className='icon-info'>
                                    <img alt="motherboardicon" src={motherboardicon} />
                                    <div className="style-Main">{stateProductDetails.main}</div>
                                </div>
                            </div>
                        )}
                        <div className='box-info' style={{ border: 'none' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 25px', gap: '50px' }}>
                                <div style={{ color: 'rgb(43,178,70)' }}> Đã bán: {stateProductDetails.selled}</div>
                                <div style={{ color: 'rgb(255,117,0)' }}> Còn lại: {stateProductDetails.countInStock}</div>
                            </div>
                            <span>Số lượng: </span>
                            <InputNumber min={1} max={stateProductDetails.countInStock} defaultValue={1} onChange={onChangeNumPrd} />
                        </div>
                        <div style={{ width: '100%' }}>
                            <ButtonComponent textbutton={'Thêm vào giỏ hàng'} className='styleButtonAdd' onClick={handleAddCart}/>
                        </div>
                    </div>
                </Col>
            </Row>
            <OverView id={idProduct}/>
        </div>
    )
}

export default ProductDetailComponent