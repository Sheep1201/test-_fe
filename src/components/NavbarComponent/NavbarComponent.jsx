import React from 'react';
import './style.css';
import { Checkbox, Slider } from 'antd';


const NavbarComponent = () => {
    const formatter = (value) => {
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return <h2>{option}</h2>
                })
            case 'checkBox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange} >
                        {options.map((option) => {
                            return (
                                <Checkbox
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            default:
                return {}
        }
    }

    return (
        <div className='filterBox'>
            <div className='filterBoxOption'>
                <h1>Bộ lọc</h1>
            </div>
            <div className='filterBoxOption'>
                <h1>Giá</h1>
                <Slider min={0} max={200000000} range={{ draggableTrack: true }} defaultValue={[0, 200000000]} tipFormatter={formatter}
                    trackStyle={[{ backgroundColor: 'red' }]} // Đổi màu track của Slider
                    railStyle={{ backgroundColor: '#efefef' }} // Đổi màu phần rail của Slider
                />
            </div>
            <div className='filterBoxOption'>
                <h1>CPU</h1>
                {renderContent('checkBox', [
                    { value: 'Intel', label: 'Intel' },
                    { value: 'Ryzen', label: 'Ryzen' }
                ])}
            </div>
            <div className='filterBoxOption'>
                <h1>GPU</h1>
                {renderContent('checkBox', [
                    { value: 'RTX', label: 'RTX' },
                    { value: 'AMD', label: 'AMD' }
                ])}
            </div>
            <div className='filterBoxOption'>
                <h1>Ram</h1>
                {renderContent('checkBox', [
                    { value: '8GB', label: '8GB' },
                    { value: '16GB', label: '16GB' },
                    { value: '32GB', label: '32GB' },
                    { value: '64GB', label: '64GB' }
                ])}
            </div>
            <div className='filterBoxOption' style={{borderBottom: '0px'}}>
                <h1>Storage</h1>
                {renderContent('checkBox', [
                    { value: '512GB', label: '512GB' },
                    { value: '1T', label: '1T' },
                    { value: '2T', label: '2T' },
                    { value: '4T', label: '4T' }
                ])}
            </div>
        </div>
    )
}

export default NavbarComponent