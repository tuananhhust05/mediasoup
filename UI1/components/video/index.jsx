import {useEffect,useRef} from 'react';

export default function video({ srcObject,flip }) {
  const videoRef = useRef();

  useEffect(() => {
    if (srcObject && videoRef.current) {
      videoRef.current.srcObject = srcObject;
    }
  }, [srcObject]);
  return (flip ? <video 
    style={{
      WebkitTransform: 'scaleX(-1)',
      transform: 'scaleX(-1)',
    }} 
    autoPlay ref={videoRef} width='100%' height='100%' muted />
    : <video 
    autoPlay ref={videoRef} width='100%' height='100%' muted />
    )
}