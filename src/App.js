import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './ultils'
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from './redux/slide/userSlide';
import * as UserSevice from './services/UserService';
import Loading from './components/LoadingComponent/Loading'

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsLoading(false)
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserSevice.axiosJwt.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    let storageRefeshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefeshToken)
    const decodedRefreshToken = JSON.parse(refreshToken)
    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserSevice.refreshToken()
        config.headers['token'] = `Bearer ${data.access_token}`
      } else{
        dispatch(resetUser())
      }
    }
    return config;
  }, (err) => {
    // Do something with request error
    return Promise.reject(err);
  });

  const handleGetDetailsUser = async (id, token) => {
    let storageRefeshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefeshToken)
    const res = await UserSevice.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
  }

  return (
    <div>
      <Loading isPending={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const isCheckAuth = !route.isPrivate || user.isAdmin
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              return (
                <Route key={route.path} path={isCheckAuth ? route.path : '/'} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}
export default App