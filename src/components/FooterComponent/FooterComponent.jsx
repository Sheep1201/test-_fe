import { Col, Row } from 'antd'
import React from 'react'
import './style.css';
import Logo from '../../asset/images/Logo.png';
import Logo1 from '../../asset/images/new_intel_logo.avif';
import Logo2 from '../../asset/images/logos-purchase_V2.avif';


import { FacebookOutlined, InstagramOutlined, TwitterOutlined, TikTokOutlined, YoutubeOutlined } from '@ant-design/icons';

const FooterComponent = () => (
    <Row className="WrapperFooter">
        <Col span={2}></Col>
        <Col span={20}>
            <div className="WrapperFooterRow1">
                <img style={{ height: 'auto', width: '70%' }} src={Logo} alt="Logo" />
                <div>
                    <h1>Giới thiệu về PCPOWER:</h1>
                    <div>PCPOWER tượng trưng cho một số niềm tin chính: Đổi mới, Chất lượng, Lựa chọn, Cộng đồng, Hiệu suất.
                        Đây là những thuộc tính cơ bản của cuộc sống bên trong và bên ngoài chơi game. Bạn cần tất cả để giành chiến thắng.
                        Dẫn đầu gói, PCPOWER đang chơi game, được xác định.</div>
                </div>
            </div>
            <div className="WrapperFooterRow1">

                <div className='WrapperFooterCol'>
                    <h1>Cửa hàng PCPOWER:</h1>
                    <div>52 Mỹ Đình, Nam Từ Liêm, Hà Nội</div>
                    <div>Hotline: 0397623575</div>
                    <div>138 Thái Hà, Đống Đa, Hà Nội</div>
                    <div>Hotline: 0397623575</div>
                    <div>701 Quang Trung, tp Hà Tĩnh, Hà Tĩnh</div>
                    <div>Hotline: 0397623575</div>
                </div>
                <div className='WrapperFooterCol'>
                    <h1>Hỗ trợ</h1>
                    <div>Trang chủ Hỗ trợ</div>
                    <div>Trạng thái đơn hàng</div>
                    <div>Trình điều khiển &; Tải xuống</div>
                    <div>Chính sách đổi trả</div>
                    <div>Bảo hành</div>
                    <div>Câu hỏi thường gặp / Cơ sở kiến thức</div>
                    <div>Chi tiết vận chuyển</div>
                    <div>Đổi cũ lấy mới</div>
                    <div>Điểm thưởng</div>
                </div>
                <div className='WrapperFooterCol'>
                    <h1>Công ty</h1>
                    <div>Về chúng tôi</div>
                    <div>Nghề nghiệp</div>
                    <div>Tin tức</div>
                    <div>Đánh giá của khách hàng</div>
                    <div>Bản tin</div>
                </div>
                <div className='WrapperFooterCol'>
                    <h1>Liên hệ với chúng tôi</h1>
                    <FacebookOutlined className='socialIcon' />
                    <InstagramOutlined className='socialIcon' />
                    <TwitterOutlined className='socialIcon' />
                    <TikTokOutlined className='socialIcon' />
                    <YoutubeOutlined className='socialIcon' />
                    <div style={{fontSize: '17px'}}>Hotline: 0397623575</div>
                </div>
            </div>
            <div className="WrapperFooterRow2">
                <h1>PCPOWER ĐƯỢC CUNG CẤP BỞI: 	&#169;Nguyen Ngoc Hieu</h1>
                <img style={{ height: 'auto', width: '70%' }} src={Logo1} alt="Logo" /><img style={{ height: 'auto', width: '70%' }} src={Logo2} alt="Logo" />
            </div>
        </Col>
        <Col span={2} style={{ display: 'flex' }}></Col>
    </Row>
)
export default FooterComponent
