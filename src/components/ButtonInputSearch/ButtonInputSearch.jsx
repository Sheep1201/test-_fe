import React, { useState } from 'react'
import { SearchOutlined, } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';


const ButtonInputSearch = (props) => {
    const { size, placeholder, textbutton } = props
    const [isSearchClick, setIsSearchClick] = useState(false)
    const handleclick = () => {
        setIsSearchClick (true)
    }

    return (
        <div style={{display: 'flex'}}>
            <InputComponent
                style={{borderTopRightRadius: '0', borderBottomRightRadius: '0', border: '1px solid'}}
                size={size} 
                placeholder={placeholder} 
                {...props}
            />
            <ButtonComponent
                style={{borderTopLeftRadius: '0', borderBottomLeftRadius: '0', backgroundColor: 'rgb(0,0,0)', color: '#fff', border: '0'}}  
                size={size} 
                icon={<SearchOutlined />}
                textbutton={textbutton}
                onClick={handleclick}
            />
        </div>
    )
}

export default ButtonInputSearch
