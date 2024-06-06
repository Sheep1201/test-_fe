import { axiosJwt } from "./UserService"

export const createOrder = async (access_token, data) => {
    const cartItems = data.cartItems.cartItems; // Truy cập trực tiếp vào trường cartItems bên trong data
    const orderData = { ...data, cartItems }; // Tạo một object mới với trường cartItems là mảng sản phẩm

    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/order/create`, orderData, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}
export const getOrderByUserID = async (id, access_token) => {
    const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export const updateOrder = async (id, data, access_token) => {
    const res = await axiosJwt.put(`${process.env.REACT_APP_API_URL}/order/update-order/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const updatePaidOrder = async (id, data, access_token) => {
    const res = await axiosJwt.put(`${process.env.REACT_APP_API_URL}/order/update-order/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}


export const deleteOrder = async (id, access_token) => {
    const res = await axiosJwt.delete(`${process.env.REACT_APP_API_URL}/order/delete-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}

export const getAllOrder = async (access_token) => {
    const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}