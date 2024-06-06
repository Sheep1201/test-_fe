import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: '',
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const cartSlide = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCart: (state, action) => {
            const { cartItem } = action.payload;
            const itemCart = state?.cartItems?.find((item) => item?.product === cartItem.product);
            
            if (itemCart) {
                // Chuyển đổi giá trị `amount` thành số trước khi cộng
                itemCart.amount = Number(itemCart.amount) + Number(cartItem.amount);
            } 
            else {
                state.cartItems.push({
                    ...cartItem,
                    amount: Number(cartItem.amount) // Đảm bảo `amount` là một số khi thêm mới
                });
            }
        },
        editCart: (state, action) => {
            const { idProduct, editAmount } = action.payload;
            const itemCart = state?.cartItems?.find((item) => item?.product === idProduct);
            if (itemCart) {
                itemCart.amount = editAmount; // Cập nhật số lượng sản phẩm
            }
        },
        removeCart: (state, action) => {
            const { idProduct } = action.payload;
            const itemCart = state?.cartItems?.filter((item) => item?.product !== idProduct);
            state.cartItems = itemCart;
        },
        removeAllCart: (state) => {
            state.cartItems = [];
        }
    },
})

// Action creators are generated for each case reducer function
export const { addCart, editCart, removeCart, removeAllCart } = cartSlide.actions

export default cartSlide.reducer
