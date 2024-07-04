import styles from './styles.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Pagination from '@/components/home/pagination/pagination';
import { Modal, Button } from 'react-bootstrap';

export default function Footer() {
    return (
        <>
            <div className={styles.footer}>
                <div className={styles.leftFooter}>
                    <p className={styles.footerText} style={{
                        color: 'white',
                        fontSize: '30px',
                        padding: '20px',
                        fontWeight: '600'
                    }}>Liên hệ với chúng tôi</p>
                    <div style={{
                        color: 'white',
                        padding: '20px'
                    }}>
                        <div className={styles.footerText} style={{
                            fontSize: '25px',
                            fontWeight: '600',
                        }}>
                            Địa chỉ
                        </div> 
                        <div className={styles.footerText}>
                            Mèo mèo mèo mèo mèo
                        </div>
                    </div>
                    <div className={styles.footerText} style={{
                        color: 'white',
                        padding: '20px',
                        fontWeight: '600'
                    }}>
                        <div style={{
                            fontSize: '25px'
                        }}>
                            Liên hệ
                        </div> 
                        <div>
                            0000000000
                        </div>
                        <div>
                            meo@gmail.com
                        </div>
                    </div>
                </div>
                <div className={styles.rigtFooter}>
                    <p className={styles.footerText} style={{
                        color: 'white',
                        fontSize: '30px',
                        padding: '20px',
                        fontWeight: '600'
                    }}>Please like and subscribe to my Chanel=)))))</p>
                    <div className={styles.inputArea}>
                        <label className={styles.footerText} style={{
                            color: 'white',
                            fontSize: '25px',
                            width: '100%',
                            fontWeight: '600'
                        }}>Tên</label>
                        <input className={styles.input} type='text'></input>
                    </div>
                    <div className={styles.inputArea}>
                        <label className={styles.footerText} style={{
                            color: 'white',
                            fontSize: '25px',
                            width: '100%',
                            fontWeight: '600'
                        }}>Email</label>
                            <input className={styles.input} type='text'></input>
                        </div>
                    <div className={styles.inputArea}>
                        <label className={styles.footerText} style={{
                            color: 'white',
                            fontSize: '25px',
                            width: '100%',
                            fontWeight: '600'
                        }}>Số điện thoại</label>
                        <input className={styles.input} type='text'></input>
                    </div>
                    <button className={styles.button}>
                        <div style={{
                            fontWeight:'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color:'white',
                        }}>Đăng kí</div>
                    </button>
                </div>
            </div>
        </>
    )
}