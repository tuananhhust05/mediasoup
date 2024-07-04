import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import style from "./styles.module.css"
import Select from "react-select";
import { useRouter } from 'next/navigation'
import * as Yup from "yup";
import Head from 'next/head';

const HomePage = () => {
    const [currentTime, setCurrentTime] = useState();
    const [roomId, setRoomId] = useState();
    useEffect(() => {
        const intervalId = setInterval(() => {
            let datenow = new Date();
            const formattedTime = datenow.toLocaleTimeString('vn-VN', {
                hour12: false, // Use 24-hour format
              }).slice(0, -3);
            
            const formattedDate = datenow.toLocaleDateString('vn-VN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
            });
            setCurrentTime(`${formattedTime} • ${formattedDate}`);
        }, 1000);
        return () => clearInterval(intervalId);
    },[])
    return (
        <div className={style.body}>
            <div className={style.headerContainer}>
                <header className={style.header}>
                    <div className={style.headerChild}>
                        <div className={style.logoContainer}>
                            <div className={style.logoParrent}>
                                <div className={style.logoChild}>
                                    <div className={style.logo}>
                                        <img className={style.logoImage} src={'https://*/favicon/HH365.ico'}></img>
                                        <span className={style.logoText}>Meeting365</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.dateContainer}>
                            <div className={style.dateParrent}>
                                <div className={style.dateChild}>
                                    <div className={style.date}>
                                        {currentTime}
                                    </div>
                                </div>
                                <div className={style.dateChild}>
                                    <div className={style.headerIcon}>
                                        <div className={style.headerIconChild}>
                                            <div>
                                                <div className={style.headerIconChildDetail}>
                                                    <div>
                                                        <span>
                                                            <button className={style.headerIconFirstChild}>
                                                                <span className="material-symbols-outlined">
                                                                    help
                                                                </span>
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className={style.headerIconChildDetail}>
                                                    <div>
                                                        <span>
                                                            <button className={style.headerIconSecondChild}>
                                                                <span className="material-symbols-outlined">
                                                                    chat_info
                                                                </span>
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className={style.headerIconChildDetail}>
                                                    <div>
                                                        <span>
                                                            <button className={style.headerIconThirdChild}>
                                                                <span className="material-symbols-outlined">
                                                                    settings
                                                                </span>
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
            <div className={style.container}>
                <div className={style.mainbody}>
                    <div style={{height: '64px'}}></div>
                    <div className={style.content}>
                        <div className={style.mainContent}>
                            <div className={style.leftContent}>
                                <div className={style.leftHeader}>
                                    Cuộc họp video chất lượng
                                    Tích hợp với các ứng dụng trong hệ sinh thái 365.
                                </div>
                                <div className={style.leftDetailText}>
                                    Giao diện thân thiện, dễ làm quen, đảm bảo tối ưu chất lượng cuộc họp.
                                </div>
                                <div className={style.leftActionContainer}>
                                    <div className={style.leftActionArea}>
                                        <div className={style.createRoomContainer}>
                                            <div>
                                                <div style={{display: 'inline'}}>
                                                    <button className={style.createRoomButton} 
                                                        onClick={() => {
                                                            const uuid = require('uuid');
                                                            const myUUID = uuid.v4();
                                                            window.location.href = `/selectDevice?roomId=${myUUID}`
                                                        }}>
                                                        <span className="material-symbols-outlined">
                                                            video_call
                                                        </span>
                                                        <span style={{position: 'relative', marginLeft: '8px'}}>Tạo cuộc họp</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={style.joinRoomArea}>
                                            <div className={style.joinRoomInputArea}>
                                                <label className={style.joinRoomInputLabel}>
                                                    <span className={style.joinRoomSpan}>
                                                        <span className={style.joinRoomKeyboardIcon + " material-symbols-outlined"}>
                                                            keyboard
                                                        </span>
                                                        <input type='text' className={style.joinRoomInput} placeholder='Nhập mã để tham gia cuộc họp'
                                                            onChange={(e)=>setRoomId(e.target.value)}
                                                        />
                                                    </span>
                                                </label>
                                            </div>
                                            <div style={{display: 'inline'}} 
                                                onClick={()=>{
                                                        if(roomId){
                                                            window.location.href = `/selectDevice?roomId=${roomId}`
                                                        }
                                                }}>
                                                <button className={style.joinRoomButton}>
                                                    <span style={{position: 'relative', color: roomId && 'rgb(26,115,232)'}}>Tham gia</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage