import { useEffect } from 'react';
import data from './demo.json';
import './index.css';

export default function DemoBox() {
    useEffect(() => {
        document.title = '盒子';
    }, []);
    
    const handleClickBox = link => {
        window.open(link, '_blank');
    };

    return (
        <div className="demo-box-page">
            {data.map((info, index) => {
                return (
                    <div className="demo-box-item" key={index} onClick={() => handleClickBox(info.link)}>
                        <img src={require(`../../../assets/images/demo-box/${info.image}`)['default']} alt={info.title + '-image'} />
                        <p>{info.title}</p>
                    </div>
                );
            })}
        </div>
    );
}