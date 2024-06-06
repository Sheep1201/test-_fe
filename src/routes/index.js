import AdminPage from "../pages/AdminPage/AdminPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SigninPage from "../pages/SigninPage/SigninPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import TypeProductMousePage from "../pages/TypeProductPage/TypeProductMousePage";
import MyOrderPage from "../pages/MyOrder/MyOrder";
import TypeProductScreenPage from "../pages/TypeProductPage/TypeProductScreen";
import TypeProductKeyboardPage from "../pages/TypeProductPage/TypeProductKeyboardPage";
import TypeProductHeadphonePage from "../pages/TypeProductPage/TypeProductHeadphonePage";
import TypeProductPCPage from "../pages/TypeProductPage/TypeProductPCPage";
import TypeProductRamPage from "../pages/TypeProductPage/TypeProductRamPage";
import TypeProductRomPage from "../pages/TypeProductPage/TypeProductRomPage";
import TypeProductGearPage from "../pages/TypeProductPage/TypeProductGearPage";
import ProductCustomPage from "../pages/ProductCustomPage/ProductCustomPage";



export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true,
    },
    {
        path: '/type',
        page: TypeProductPage,
        isShowHeader: true,
    },
    {
        path: '/type/mouse',
        page: TypeProductMousePage,
        isShowHeader: true,
    },
    {
        path: '/type/screen',
        page: TypeProductScreenPage,
        isShowHeader: true,
    },
    {
        path: '/type/keyboard',
        page: TypeProductKeyboardPage,
        isShowHeader: true,
    },
    {
        path: '/type/headphone',
        page: TypeProductHeadphonePage,
        isShowHeader: true,
    },
    {
        path: '/type/PC',
        page: TypeProductPCPage,
        isShowHeader: true,
    },
    {
        path: '/type/ram',
        page: TypeProductRamPage,
        isShowHeader: true,
    },
    {
        path: '/type/rom',
        page: TypeProductRomPage,
        isShowHeader: true,
    },
    {
        path: '/type/gear',
        page: TypeProductGearPage,
        isShowHeader: true,
    },
    {
        path: '/sign-in',
        page: SigninPage,
        isShowHeader: false,
    },
    {
        path: '/sign-up',
        page: SignupPage,
        isShowHeader: false,
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: '/cart',
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: '/custom',
        page: ProductCustomPage,
        isShowHeader: true,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    }
]