import { Card } from 'antd';
import React from 'react';
import './style.css';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';

const CardComponent = (props) => {
    const { description, image, name, price, priceSale, selled, id } = props
    const navigate = useNavigate();
    const handleDetailsProduct = (id) => {
        navigate(`/product-detail/${id}`);
        window.scrollTo(0, 0); // Di chuyển đến đầu trang khi chuyển trang
    }
    return (
        <Card
            hoverable
            style={{ width: 280, padding: 'none', overflow: 'hidden'}}
            cover={<img alt="image" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <div style={{ height: '180px', width: '100%', padding: '2px'}}>
                <div className="styleNameProduct">{name}</div>
                <div className="styleDescription" >
                    <span>
                        {description}
                    </span>
                </div>
            </div>
            <div style={{ height: '80px', width: '100%', display: 'flex', gap: '60px', backgroundColor: '#efefef', padding: '20px'}}>
                <div>
                    <div className="stylePrice">{price}đ</div>
                    {priceSale != null && (
                        <div className="stylePriceSale">{priceSale}đ</div>
                    )}
                </div>
                    <ButtonComponent textbutton={'Mua ngay'} className="styleButtonBuy" onClick={handleDetailsProduct}/>
            </div>
        </Card>
    )
}

export default CardComponent;
