import styles from './styles.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Pagination from '@/components/home/pagination/pagination';
import { Modal, Button } from 'react-bootstrap';

export default function Header() {
    const [showNavigation, setShowNavigation] = useState(false);
    return (
        <>
            <Modal contentClassName={styles.myModalCT} backdropClassName={styles.myModalBD} show={showNavigation} onHide={()=>setShowNavigation(false)}>
                <Modal.Body className={styles.modalBody}>
                    <div className={styles.headerNavigation}>
                        <Link className={styles.link} href="http://*:5000/teachingMaterial">Trang chủ</Link>
                    </div>
                    <div className={styles.headerNavigation}>
                        Hình ảnh trực quan
                    </div>
                    <div className={styles.headerNavigation}>
                        Video
                    </div>
                    <div className={styles.headerNavigation}>
                        <Link className={styles.link} href="http://*:5000/teachingMaterial/teachingGame">Trò chơi học tập</Link>
                    </div>
                    <div className={styles.headerNavigation}>
                        <Link className={styles.link} href="http://*:5000/teachingMaterial/teachingDocument">Tài liệu giảng dạy</Link>
                    </div>	
				</Modal.Body>
            </Modal>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>
                    <img src='https://lh3.googleusercontent.com/sZCtuI5NKeq_V0sn3AxE4u8ZPabmvIpeld3HH7dYT5EWUL0OuutlqK15gZ8ml6hyKLfuC-pPDsLINltHJi5V8FlDBqUgLpf3fQ=w57-rw'>

                    </img>
                </div>
                <div className={styles.headerNavigation}>
                    <Link className={styles.link} href="http://*:5000/teachingMaterial">Trang chủ</Link>
                </div>
                <div className={styles.headerNavigation}>
                    Hình ảnh trực quan
                </div>
                <div className={styles.headerNavigation}>
                    Video
                </div>
                <div className={styles.headerNavigation}>
                    <Link className={styles.link} href="http://*:5000/teachingMaterial/teachingGame">Trò chơi học tập</Link>
                </div>
                <div className={styles.headerNavigation}>
                    <Link className={styles.link} href="http://*:5000/teachingMaterial/teachingDocument">Tài liệu giảng dạy</Link>
                </div>	
            </div>
            <div className={styles.headerMobile}>
                <Image onClick={()=>setShowNavigation(true)} style={{objectFit:'cover', marginLeft: '20px'}} width={20} height={40} src={'/gameImg/Mega menu.png'} />
            </div>
        </>
    )
}