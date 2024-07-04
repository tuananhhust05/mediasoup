import styles from './styles.module.css';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

export default function TeachingDocument() {
    const [showNavigation, setShowNavigation] = useState(false);
    return (
        <div className={styles.body}>
            <Header/>
            <div className={styles.mainContent}>
                
            </div>
            <Footer/>
        </div>
    )
}