import { Input } from 'antd'
import React from 'react'

const InputComponent = ({ size, placeholder, OnChange, value, ...rest }) => {
    const handleOnChangeInput = (e) => {
        if (OnChange && typeof OnChange === 'function') {
            OnChange(e.target.value);
        }
    };

    return (
        <Input
            style={{ borderTopRightRadius: '0', borderBottomRightRadius: '0', backgroundColor: '#fff' }}
            size={size}
            placeholder={placeholder}
            onChange={handleOnChangeInput}
            value={value}
            {...rest}
        />
    );
};

export default InputComponent
