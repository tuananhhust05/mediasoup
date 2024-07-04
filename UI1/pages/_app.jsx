import '@/styles/global.css';
import('bootstrap/dist/css/bootstrap.min.css');
if (typeof document !== 'undefined') {
  import('bootstrap/dist/js/bootstrap.bundle.min');
  // break;
}
// import 'bootstrap/scss/_variables.scss';
import Head from 'next/head';
import Script from 'next/script';
import '@/styles/iconFlying.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
			<Head>
					<title>Meeting365</title>
					<link rel='icon' href='/icon_365.png' />
					<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
			</Head>
					<Script
						src='https://kit.fontawesome.com/41f7b0205e.js'
						crossorigin='anonymous'></Script>
			<Component {...pageProps} />
		</>
	);
}
export default MyApp;
