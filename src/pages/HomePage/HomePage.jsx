import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import './style.css';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../asset/images/AMD-Ryzen8000G_TV-Wall_2560x700.webp';
import slider2 from '../../asset/images/Intel14thGen-2023_TV-Wall_2560x700.webp';
import slider3 from '../../asset/images/arcrefresh-TVWall.webp';
import CardComponent from '../../components/CardComponent/CardComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import Custom from '../../asset/images/custom_main_1200x688.webp';
import ShopNow from '../../asset/images/rdy_main.png';
import iconSuport from '../../asset/images/icon_support_home.svg';
import iconReward from '../../asset/images/icon_rewardpoints.svg';
import iconShip from '../../asset/images/icon_fast_ship.svg';
import iconAssembled from '../../asset/images/icon_assembled.svg';
import iconLifttime from '../../asset/images/icon_lifttime support.svg';
import Gears from '../../asset/images/gears_main.webp';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';

const HomePage = () => {
    const arr = [
        { name: 'Tất cả', value: '' },
        { name: 'Màn hình', value: 'screen' },
        { name: 'Bàn Phím', value: 'keyboard' },
        { name: 'Chuột', value: 'mouse' },
        { name: 'Tai nghe', value: 'headphone' },
        { name: 'PC', value: 'PC' },
        { name: 'Ram', value: 'ram' },
        { name: 'Ổ cứng', value: 'rom' },
        { name: 'Gear', value: 'gear' }
    ];
    const fetchAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const { data: products } = useQuery({ queryKey: ['product'], queryFn: fetchAllProduct, retry: 3, retryDelay: 1000 })
    const sortedProducts = products?.data?.sort((a, b) => b.selled - a.selled);
    // Chọn 5 sản phẩm đầu tiên từ mảng đã được sắp xếp
    const pcProducts = sortedProducts?.filter(product => product.type === 'PC' && product.countInStock >= 1);
    const top5PcProducts = pcProducts?.slice(0, 5);

    const navigate = useNavigate()
    const handleNavigateType = () => {
        navigate('/type/PC')
        window.scrollTo(0, 0);
    }
    const handleNavigateGear = () => {
        navigate('/type/gear')
        window.scrollTo(0, 0);
    }
    const handleNavigateCustom = () => {
        navigate('/custom')
        window.scrollTo(0, 0);
    }

    return (
        <div>
            <div>
                <div className="WrapperTypeProduct">
                    {arr.map(({ name, value }) => { // Destructure name và value từ mỗi phần tử của mảng arr
                        return (
                            <a href={`/type/${value}`} key={value}>
                                <TypeProduct name={name} />
                            </a>
                        );
                    })}
                </div>
            </div>
            <div id="container">
                <SliderComponent arrImages={[slider1, slider2, slider3]} />
                <h3 style={{ height: '100px', fontSize: '30px', fontWeight: 'bolder', padding: '60px', textAlign: 'center' }}>
                    Gaming PC Bán Chạy Nhất
                </h3>
                <div style={{ width: '100%', marginTop: '20px', display: 'flex', gap: '60px', justifyContent: 'center' }}>
                    {top5PcProducts?.map((product) => {
                        const formattedPrice = product.price.toLocaleString('en-US');
                        const formattedPriceSale = product.priceSale.toLocaleString('en-US');
                        return (<CardComponent
                            key={product._id}
                            countInStock={product.countInStock}
                            description={product.description}
                            image={product.image}
                            name={product.name}
                            price={formattedPrice}
                            type={product.type}
                            priceSale={formattedPriceSale}
                            selled={product.selled}
                            id={product._id}
                        />)
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ButtonComponent textbutton={'Xem tất cả PC'} className='styleButtonEnter' onClick={handleNavigateType} />
                </div>
                <div className='WrapperMenu' style={{ backgroundColor: 'rgb(255,221,221)' }}>
                    <img alt="Custom" src={ShopNow} />
                    <div style={{ textAlign: 'center', alignItems: 'center', marginRight: '50px', display: 'flex', flexDirection: 'column' }}>
                        <h4>Prebuilt Gaming PC</h4>
                        <div>Bắt đầu hành trình chơi game của bạn với các hệ thống dựng sẵn RDY được thiết kế chuyên nghiệp và nhận Giao hàng miễn phí trong 2 ngày!</div>
                        <ButtonComponent textbutton={'Xem ngay'} className='styleButtonEnter' onClick={handleNavigateType} />
                    </div>
                </div>
                {/* <div className='WrapperMenu'>
                    <div style={{ textAlign: 'center', alignItems: 'center', marginLeft: '50px', display: 'flex', flexDirection: 'column' }}>
                        <h4>Custom Gaming PC</h4>
                        <div>Tùy chỉnh xây dựng PC chơi game hoàn hảo dựa trên các trò chơi bạn chơi và chúng tôi sẽ giao hàng sau 5 ngày làm việc!</div>
                        <ButtonComponent textbutton={'Xem ngay'} className='styleButtonEnter' onClick={handleNavigateCustom} />
                    </div>
                    <img alt="Custom" src={Custom} />
                </div> */}
                <div className='WrapperMenu' style={{ backgroundColor: 'rgb(242,246,250)' }}>
                    <img alt="Custom" src={Gears} />
                    <div style={{ textAlign: 'center', alignItems: 'center', marginRight: '50px', display: 'flex', flexDirection: 'column' }}>
                        <h4>Gears Store</h4>
                        <div>Chuẩn bị và sẵn sàng chơi game với các phụ kiện PC, thiết bị ngoại vi, quần áo iBUYPOWER yêu thích của bạn và hơn thế nữa!</div>
                        <ButtonComponent textbutton={'Xem ngay'} className='styleButtonEnter' onClick={handleNavigateGear} />
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px 200px' }}>
                    <h4>Why PCPOWER?</h4>
                    <div>Vậy điều gì khiến chúng tôi khác biệt với các đối thủ cạnh tranh? Ngoài việc cung cấp giá cả tốt nhất cho bạn trong thị trường biến động của các thành phần PC,
                        PCPOWER tự hào mang đến trải nghiệm chơi game tốt nhất từ những game thủ mới đến những chuyên gia dày dạn kinh nghiệm. Chúng tôi sử dụng các thành phần linh kiện công nghệ mới nhất và tốt nhất từ các công ty như Intel,
                        AMD, NVIDIA, Microsoft, ASUS, MSI, Western Digital, Samsung, v.v. Tiếp tục cuộn để tìm hiểu thêm...</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px 200px' }}>
                    <h4>Những gì chúng tôi đang cung cấp</h4>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className='WrapperSuport'>
                            <img alt="Custom" src={iconSuport} />
                            <h4>Chúng tôi sẵn sàng trợ giúp 24/7</h4>
                        </div>
                        <div className='WrapperSuport'>
                            <img alt="Custom" src={iconReward} />
                            <h4>Tích thêm điểm, nhận thêm quà</h4>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px 5%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className='WrapperSuport2'>
                            <img alt="Custom" src={iconShip} />
                            <div>
                                <h1>Giao hàng miễn phí</h1>
                                <h5>Tất cả các bộ PC gaming tại PCPOWER đều được miễn phí vận chuyển!</h5>
                            </div>
                        </div>
                        <div className='WrapperSuport2'>
                            <img alt="Custom" src={iconAssembled} />
                            <div>
                                <h1>Lắp ráp tại shop</h1>
                                <h5>Mỗi bộ PC gaming tại PCPOWER
                                    đều được lắp ráp chuyên nghiệp bằng tay bởi kỹ thuật viên.</h5>
                            </div>
                        </div>
                        <div className='WrapperSuport2'>
                            <img alt="Custom" src={iconLifttime} />
                            <div>
                                <h1>Bảo hành 3 năm tiêu chuẩn</h1>
                                <h5>Sản phẩm tại PCPOWER đi kèm với bảo hành tiêu chuẩn 3 năm,
                                    bảo hành phụ tùng 1 năm được hỗ trợ bởi các kỹ thuật viên của chúng tôi.</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage