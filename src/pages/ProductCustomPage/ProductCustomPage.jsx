import React, { useState } from 'react';
import './styleCustomPage.css';
import caseicon from '../../asset/images/gaming-pc-01-H9-Elite-white-main-175-solo.avif';
import ramicon from '../../asset/images/Default-DDR5-x2-400-..avif';
import romicon from '../../asset/images/WD-BLUE-SN580-3D-400,.avif';
import cpuicon from '../../asset/images/gearvn-intel-core-i9-13900k-1_3fe44acd82da4cebb15df131ae91c84f.webp';
import gpuicon from '../../asset/images/VGA-Dual-400-.png';
import coolingicon from '../../asset/images/iBP-DEEPCOOL-LS520-240MM-400.avif';
import mainicon from '../../asset/images/main.png';
import powericon from '../../asset/images/powersupply.png';

const ProductCustomPage = () => {
    const [selectedHexagon, setSelectedHexagon] = useState(null);

    const handleHexagonClick = (hexagon) => {
        setSelectedHexagon(hexagon);
    };

    return (
        <div id='containerProduct' style={{ display: 'flex', flexDirection: 'column' }}>
            <div className='buttonCustom'>
                <div style={{ margin: '0px 0px 100px 130px' }}>
                    <div 
                        className={`hexagon-wrapper-small ${selectedHexagon === 'cpu' ? 'clicked' : ''}`}
                        onClick={() => handleHexagonClick('cpu')}
                    >
                        <div className='hexagon-small'>
                            <img alt="Custom" src={cpuicon} style={{ width: '70px' }} /><b>Cpu</b>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '0px 0px 100px 120px' }}>
                    <div 
                        className={`hexagon-wrapper-small ${selectedHexagon === 'gpu' ? 'clicked' : ''}`}
                        onClick={() => handleHexagonClick('gpu')}
                    >
                        <div className='hexagon-small'>
                            <img alt="Custom" src={gpuicon} style={{ width: '70px' }} /><b>Gpu</b>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '200px 0px 100px -530px' }}>
                    <div 
                        className={`hexagon-wrapper-small ${selectedHexagon === 'ram' ? 'clicked' : ''}`}
                        onClick={() => handleHexagonClick('ram')}
                    >
                        <div className='hexagon-small'>
                            <img alt="Custom" src={ramicon} style={{ width: '70px' }} /><b>Ram</b>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '180px 0px 100px 60px' }}>
                    <div 
                        className={`hexagon-wrapper ${selectedHexagon === 'case' ? 'clicked' : ''}`}
                        onClick={() => handleHexagonClick('case')}
                    >
                        <div className='hexagon'>
                            <img alt="Custom" src={caseicon} style={{ width: '100px' }} /><b>Case</b>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '200px 0px 100px 60px' }}>
                    <div 
                        className={`hexagon-wrapper-small ${selectedHexagon === 'rom' ? 'clicked' : ''}`}
                        onClick={() => handleHexagonClick('rom')}
                    >
                        <div className='hexagon-small'>
                            <img alt="Custom" src={romicon} style={{ width: '70px' }} /><b>Rom</b>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '400px 0px 100px -600px' }}>
                    <div 
                        className={`hexagon-wrapper-small ${selectedHexagon === 'main' ? 'clicked' : ''}`}
                        onClick={() => handleHexagonClick('main')}
                    >
                        <div className='hexagon-small'>
                            <img alt="Custom" src={mainicon} style={{ width: '70px' }} /><b>Main</b>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '470px 0px 100px 50px' }}>
                    <div 
                        className={`hexagon-wrapper-small ${selectedHexagon === 'power' ? 'clicked' : ''}`}
                        onClick={() => handleHexagonClick('power')}
                    >
                        <div className='hexagon-small'>
                            <img alt="Custom" src={powericon} style={{ width: '70px' }} /><b>Power Supply</b>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '400px 0px 100px 50px' }}>
                    <div 
                        className={`hexagon-wrapper-small ${selectedHexagon === 'cooling' ? 'clicked' : ''}`}
                        onClick={() => handleHexagonClick('cooling')}
                    >
                        <div className='hexagon-small'>
                            <img alt="Custom" src={coolingicon} style={{ width: '70px' }} /><b>Cooling</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCustomPage;
