import styles from '@/styles/callGroup/layout.module.css'; 
// import {Container} from 'react-bootstrap';
import Footer from './footer';
export default function layout({children,...props}){
  return (
      <div className={styles.container}>
        {children}
        <Footer {...props} ></Footer>
      </div>
  )
}