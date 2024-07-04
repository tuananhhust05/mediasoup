import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import style from "./styles.module.css"
import Select from "react-select";
import { useRouter } from 'next/navigation'
import * as Yup from "yup";

const selectDevice = ({roomId}) => {
    const [audioDevices, setAudioDevices] = useState([]);
	const [videoDevices, setVideoDevices] = useState([]);
    const [configData, setConfigData] = useState({
        roomId: roomId
    });
    const [errors, setErrors] = useState({});
    const router = useRouter()
    const customStyles = {
        control: (provided) => ({
          ...provided,
          border: '2px solid #000', // Customize the border
        }),
    };
    const validationSchema = Yup.object().shape({
        roomId: Yup.string().required("Vui lòng nhập ID phòng họp"),
        name: Yup.string().required("Vui lòng nhập tên"),
        video: Yup.string().required("Vui lòng chọn thiết bị camera"),
        audio: Yup.string().required("Vui lòng chọn thiết bị microphone"),
    })
    useEffect(()=>{
        const initDevices = async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(
                (device) => device.kind === 'videoinput' && device.deviceId !== ''
            );
            const audioDevices = devices.filter(
                (device) => device.kind === 'audioinput' && device.deviceId !== ''
            );
            setVideoDevices(videoDevices)
            setAudioDevices(audioDevices)
        }
        initDevices()
        return () => {
        }
    },[]);
    return (
        <div className={style.container}>
            <div className={style.form_container}>
                {/* <div className={style.input}>
                    <label style={{display: 'block'}}>ID của phòng họp <span style={{color: 'red'}}>*</span></label>
                    <input placeholder="  Hãy điền ID cuộc họp" style={{width: '100%'}} className={style.input_text} type="text"
                        onChange={(e) => 
                            setConfigData((prev)=>({
                                ...prev,
                                roomId: e.target.value,
                            }))}
                    ></input>
                    {errors.roomId && (
                        <p style={{ color: "red", margin: "10px 10px 0 0" }}>
                        {errors.roomId}
                        </p>
                    )}
                </div> */}
                <div className={style.input}>
                    <label style={{display: 'block',fontWeight: 'bold'}}>Tên của bạn <span style={{color: 'red'}}>*</span></label>
                    <input placeholder="  Hãy điền tên của bạn" style={{width: '100%'}} className={style.input_text} type="text" 
                        onChange={(e) => 
                            setConfigData((prev)=>({
                                ...prev,
                                name: e.target.value,
                            }))}>
                    </input>
                    {errors.name && (
                        <p style={{ color: "red", margin: "10px 10px 0 0" }}>
                        {errors.name}
                        </p>
                    )}
                </div>
                <div className={style.input}>
                    <label style={{display: 'block',fontWeight: 'bold'}}>Thiết bị camera <span style={{color: 'red'}}>*</span></label>
                    {videoDevices && <Select 
                        options={videoDevices.map(opt => ({
                            label: opt.label,
                            value: opt.deviceId
                        }))}
                        placeholder={'Hãy chọn Camera'}
                        styles={customStyles}
                        onChange={(e)=>{
                            setConfigData((prev)=>({
                                ...prev,
                                video: e.value,
                            }))
                        }}
                    />}
                    {errors.video && (
                        <p style={{ color: "red", margin: "10px 10px 0 0" }}>
                        {errors.video}
                        </p>
                    )}
                </div>
                <div className={style.input}>
                    <label style={{display: 'block',fontWeight: 'bold'}}>Thiết bị microphone <span style={{color: 'red'}}>*</span></label>
                    {audioDevices && <Select 
                        options={audioDevices.map(opt => ({
                            label: opt.label,
                            value: opt.deviceId
                        }))}
                        placeholder={'Hãy chọn Micro'}
                        styles={customStyles}
                        onChange={(e)=>{
                            setConfigData((prev)=>({
                                ...prev,
                                audio: e.value,
                            }))
                        }}
                    />}
                    {errors.audio && (
                        <p style={{ color: "red", margin: "10px 10px 0 0" }}>
                        {errors.audio}
                        </p>
                    )}
                </div>
                <div className={style.input}>
                    <label style={{display: 'block',fontWeight: 'bold'}}>Link dẫn đến hình avatar của bạn (nếu có)</label>
                    <input style={{width: '100%'}} className={style.input_text} type="text" 
                        onChange={(e) => 
                            setConfigData((prev)=>({
                                ...prev,
                                avatar: e.target.value,
                            }))
                        }>
                    </input>
                </div>
                <div className={style.button} style={{textDecoration: 'none'}} 
                    onClick={async ()=>{
                        try{
                            await validationSchema.validate(configData, { abortEarly: false });
                            window.location.href = configData.avatar 
                            ? `/meetingRoom?room=${configData.roomId}&name=${configData.name}&video=${configData.video}&audio=${configData.audio}&avatar=${configData.avatar}`
                            : `/meetingRoom?room=${configData.roomId}&name=${configData.name}&video=${configData.video}&audio=${configData.audio}`
                        }catch(error){
                            const newErrors = {};
                            if (error?.inner) {
                                error.inner.forEach((err) => {
                                    newErrors[err.path] = err.message;
                                });
                            }
                            setErrors(newErrors);
                        }
                    }}
                    >
                    Tham gia ngay
                </div>
            </div>
        </div>
    )
}
selectDevice.getInitialProps = async (ctx) => {
    const { roomId } = ctx.query;
    return {
        roomId
    }
}
export default selectDevice