import {useEffect,useRef} from 'react';

export default function video({ srcObject }) {
  const audioRef = useRef();

  useEffect(() => {
    if (srcObject && audioRef.current) {
      audioRef.current.srcObject = srcObject;
    }
  }, [srcObject]);
  return (<audio autoPlay ref={audioRef} hidden/>)
}