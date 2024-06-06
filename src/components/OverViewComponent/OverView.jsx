import React, { useEffect, useState } from 'react'
import './style.css';
import img1 from '../../asset/images/overView/RDY-1000x600_2.webp'
import img2 from '../../asset/images/overView/RDY-600x345_4_Intel.avif'
import img3 from '../../asset/images/overView/RDY-600x345_5_NVIDIA.avif'
import img4 from '../../asset/images/overView/RDY-1000x300_6.avif'
import img5 from '../../asset/images/overView/RDY-1000x300_7.avif'
import img6 from '../../asset/images/overView/RDY-1000x300_8.avif'
import img7 from '../../asset/images/overView/imgSpecification.png'
import * as ProductService from '../../services/ProductService';

const OverView = (props) => {
    const { id } = props
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '', image: '', type: '', price: '', countInStock: '', description: '', priceSale: '', selled: '', os: '', Case: '', cpu: '', ram: '', rom: '', gpu: '', main: ''
    })
    const fetchGetDetailsProduct = async (id) => {
        const res = await ProductService.getDetailsProduct(id)
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
        if (id) {
            fetchGetDetailsProduct(id)
        }
    }, [id])
    return (
        <>
            <div className='box-ref'>
                <a href='#over-view-box'>Tổng quan sản phẩm</a>
                <a href='#Specification-box'>Chi tiết cấu hình</a>
            </div>
            <div id='over-view-box'>
                {stateProductDetails.type === 'PC' && (
                    <>
                        <img alt="productImage" src={img1} />
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ width: '600px' }}>
                                <img alt="productImage" src={img2} />
                                <span>
                                    <b>No Slowing Down</b><br />
                                    Our RDY systems carry the top processors for speeds and power to run multiple programs at once.
                                    Whether you’re gaming, streaming, editing, etc there won’t be anything slowing you down.
                                </span>
                            </div>
                            <div style={{ width: '600px' }}>
                                <img alt="productImage" src={img3} />
                                <span>
                                    <b>Gaming Performance Power</b><br />
                                    Our RDY systems carry some of the best graphics cards available. Play the games you want at the framerates you want.
                                    You’ll be ready to play at 1080p or 1440p resolutions when the next hottest game is out.
                                </span>
                            </div>
                        </div>
                        <img alt="productImage" src={img4} />
                        <img alt="productImage" src={img5} />
                        <img alt="productImage" src={img6} />
                        <br />
                        <div id='Specification-box'>
                            <h4>Specification:</h4>
                            <img alt="productImage" src={img7} />
                        </div>
                    </>
                )}
                {stateProductDetails.type !== 'PC' && (
                    <>
                        <div style={{ textAlign: 'center' }}>
                            <img alt="productImage" src={stateProductDetails.image} style={{ maxWidth: '100%', maxHeight: '500px', display: 'inline-block' }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>{stateProductDetails.description}</div>
                        <div id='Specification-box'>
                            <h4>Specification:</h4>
                        </div>
                    </>
                )}
            </div>

        </>
    )
}
export default OverView