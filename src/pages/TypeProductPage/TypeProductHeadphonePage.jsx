import React, { useEffect, useRef, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import './style.css';
import { Pagination } from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingComponent/Loading';

const TypeProductHeadphonePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const refSearch = useRef();
    const [stateProducts, setStateProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Thêm trạng thái cho trang hiện tại
    const pageSize = 6; // Kích thước trang
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

    const fetchHeadphoneProducts = async (search) => {
        const res = await ProductService.getAllProduct(search);
        if (search?.length > 0 || refSearch.current) {
            setStateProducts(res?.data);
            return [];
        } else {
            return res;
        }
    };

    useEffect(() => {
        if (refSearch.current) {
            setLoading(true);
            fetchHeadphoneProducts(searchProduct);
        }
        refSearch.current = true;
        setLoading(false);
    }, [searchProduct]);

    const { isLoading, data: products } = useQuery({
        queryKey: ['headphoneProducts'],
        queryFn: () => fetchHeadphoneProducts(searchProduct),
        retry: 3,
        retryDelay: 1000
    });

    useEffect(() => {
        if (products?.data?.length > 0) {
            setStateProducts(products?.data);
        }
    }, [products]);

    const onChange = (page) => { // Hàm xử lý sự kiện onChange cho phân trang
        setCurrentPage(page);
    };

    // Hàm lọc danh sách sản phẩm theo trang hiện tại và kích thước trang
    const getPaginatedProducts = (products, currentPage, pageSize) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return products.slice(startIndex, endIndex);
    };

    return (
        <Loading isPending={isLoading}>
            <div className="WrapperTypeProduct">
                {arr.map(({ name, value }) => (
                    <a href={`/type/${value}`} key={value}>
                        <TypeProduct name={name} />
                    </a>
                ))}
            </div>
            <div className="container">
                <div style={{ alignSelf: 'flex-start' }}>
                    <NavbarComponent />
                </div>
                <div>
                    <div className="WrapperProduct">
                        {getPaginatedProducts(stateProducts.filter((product) => product.type === 'headphone'), currentPage, pageSize)
                            .map((product) => {
                                const formattedPrice = product.price.toLocaleString('en-US');
                                const formattedPriceSale = product.priceSale.toLocaleString('en-US');
                                return (
                                    <CardComponent
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
                                    />
                                );
                            })}
                    </div>
                    <div className="WrapperPagination">
                        <Pagination current={currentPage} total={stateProducts.filter((product) => product.type === 'headphone').length} pageSize={pageSize} onChange={onChange} />
                    </div>
                </div>
            </div>
        </Loading>
    );
};

export default TypeProductHeadphonePage;
