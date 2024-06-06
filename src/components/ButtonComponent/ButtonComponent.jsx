import { Button } from 'antd'
import React from 'react'


const ButtonComponent = ({size, style, textbutton, ...rests}) => {
    return (
        <Button
            style={style}
            size={size}
            {...rests}
        >
            {textbutton}
        </Button>
    )
}

export default ButtonComponent