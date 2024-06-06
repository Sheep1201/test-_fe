import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
    const {id} = useParams()
    return (
        <div>
            <ProductDetailComponent idProduct={id} />
        </div>
    )
}

export default ProductDetailsPage