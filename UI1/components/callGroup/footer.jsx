import styles from './footer.module.css';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Image from 'next/image';
import Video from '@/components/video';
import { postIcon } from '@/ultils/icon';

export default function footer({ ...props }) {
	const [isGrid, setIsGrid] = [props.isGrid, props.setIsGrid];
	const [isCamera, setIsCamera] = [props.isCamera, props.setIsCamera];
	const [isMicro, setIsMicro] = [props.isMicro, props.setIsMicro];
	const [isCall, setIsCall] = [props.isCall, props.setIsCall];
	const [myMedia, setMyMedia] = [props.myMedia, props.setMyMedia];
	const [isShowOptionCamera, setIsShowOptionCamera] = useState(false);
	const [isShowOptionAudio, setIsShowOptionAudio] = useState(false);
	const [showModalAddMember, setShowModalAddMember] = useState(false);
	const [showModalSetting, setShowModalSetting] = useState(false);
	const [isCameraSetting, setIsCameraSetting] = useState(isCamera);
	const [isMicroSetting, setIsMicroSetting] = useState(isMicro);
	const [isShowOptionAudioSetting, setIsShowOptionAudioSetting] =
		useState(false);
	const [isShowOptionCameraSetting, setIsShowOptionCameraSetting] =
		useState(false);
	const [isShareScreen, setIsShareScreen] = [
		props.isShareScreen,
		props.setIsShareScreen,
	];
	const [videoChoice, setVideoChoice] = [
		props.videoChoice,
		props.setVideoChoice,
	];
	const [audioChoice, setAudioChoice] = [
		props.audioChoice,
		props.setAudioChoice,
	];
	const allowShareScreen = props.allowShareScreen;
	const [raiseHand, setRaiseHand] = [props.raiseHand, props.setRaiseHand];
	const [showOptionEmotion, setShowOptionEmotion] = useState(false);
	const [copySuccessNotification, setCopySuccessNotification] = useState(false);
	const [copySuccessNotification2, setCopySuccessNotification2] = useState(false);
	const [windowWidth, setWindowWidth] = useState(0);
	const [showModalFunctionArea1, setShowModalFunctionArea1] = useState(false);
	const [showModalFunctionArea2, setShowModalFunctionArea2] = useState(false);
	useEffect(()=>{
		if (typeof window !== 'undefined') {
			setWindowWidth(window.innerWidth);
			window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
		}
	},[])
	const changeDisplay = () => {
		setIsGrid(!isGrid);
	};

	const handleCloseModalAddMember = () => {
		setShowModalAddMember(false);
	};

	const handleOpenModalAddMember = () => {
		setShowModalAddMember(true);
	};

	const changeStateCamera = () => {
		setIsCamera(!isCamera);
		setIsCameraSetting(!isCamera);
		props.stopVideo(isCamera);
	};

	const changeStateMicro = () => {
		setIsMicro(!isMicro);
		setIsMicroSetting(!isMicro);
		props.stopAudio(isMicro);
	};

	const changeStateCall = () => {
		setIsCall(!isCall);
		props.stopCall();
	};

	const changeStateIsShowOptionCamera = () => {
		setIsShowOptionCamera(!isShowOptionCamera);
	};

	const turnOffStateOptionCamera = (index) => {
		setIsShowOptionCamera(false);
		// setVideoChoice(index);
	};

	const changeEmotion = (e) => {
		e.preventDefault();
		e.target.classList.add('bg-secondary')
		setTimeout(() => {
			e.target.classList.remove('bg-secondary')
		},100)
		props.sendEmotion(e.target.getAttribute('data'));
	};

	const turnOffStateOptionAudio = (index) => {
		setIsShowOptionAudio(false);
		// setAudioChoice(index)
		// props.setAudioChoice(index);
		// console.log(index);
	};

	const changeStateIsShowOptionAudio = () => {
		setIsShowOptionAudio(!isShowOptionAudio);
	};

	const handleOpenModalSetting = () => {
		setShowModalSetting(true);
	};

	const handleCloseModalSetting = () => {
		setIsCameraSetting(isCamera);
		setIsMicroSetting(isMicro);
		setShowModalSetting(false);
	};

	const handleSaveChangeSetting = () => {
		setIsCamera(isCameraSetting);
		setIsMicro(isMicroSetting);
		setShowModalSetting(false);
	};
	const handleCloseModalFunctionArea1 = () => {
		setShowModalFunctionArea1(!showModalFunctionArea1)
	}
	const handleCloseModalFunctionArea2 = () => {
		setShowModalFunctionArea2(!showModalFunctionArea2)
	}
	return (
		<div className={`${styles.function_coverer}`}>
			<div className={`d-flex flex-row align-items-center h-100 w-100 ${windowWidth && windowWidth > 900 && 'px-4'} justify-content-between ${styles.container}`}>
				{(windowWidth && windowWidth > 900) ? (
					<div className={`d-flex ${styles.firstArea}`}>
						<Button
							className={`text-center rounded-circle d-flex justify-content-center align-items-center fs-4 ${styles.add_member}`}
							onClick={handleOpenModalAddMember}>
							<i
								className={`fa-solid fa-user-plus color_light p-1 m_0_5 ${styles.add_member_icon}`}></i>
						</Button>
						<Button
							className={'bg-secondary border-0 ms-5 d-flex align-items-center justify-content-center ' + styles.shareScreen}
							onClick={(e) => setIsShareScreen(!isShareScreen)}
							disabled={!allowShareScreen}>
							{isShareScreen ? (
								<Image
									src='./icon/share.svg'
									width={30}
									height={30}
									alt='share screen'></Image>
							) : (
								<Image
									src='./icon/share1.svg'
									alt='do not show screen'
									width={30}
									height={30}></Image>
							)}
						</Button>
						<Button
							className={`${
								styles.grid_icon_cover
							} position-relative fs-4 d-flex align-items-center justify-content-center ${
								!showOptionEmotion ? 'bg-transparent' : 'bg-secondary'
							} p-2 border-0 ms-4`}>
							<span
								onClick={() => setShowOptionEmotion(!showOptionEmotion)}>{postIcon[78]}</span>
							<div
								className={`${showOptionEmotion ? 'd-block' : 'd-none'} ${
									styles.modal_icon
								} position-absolute`}>
								<ul className='d-flex flex-row justify-content-around bg-black p-1 rounded'>
									<li className='px-1' onClick={changeEmotion} >
										<span data='75'>{postIcon[75]}</span>
									</li>
									<li className='px-1'  onClick={changeEmotion} >
										<span data='6'>{postIcon[6]}</span>
									</li>
									<li className='px-1'  onClick={changeEmotion} >
										<span data='11'>{postIcon[11]}</span>
									</li>
									<li className='px-1'  onClick={changeEmotion} >
										<span data='33'>{postIcon[33]}</span>
									</li>
									<li className='px-1'  onClick={changeEmotion} >
										<span data='61'>{postIcon[61]}</span>
									</li>
									<li className='px-1'  onClick={changeEmotion} >
										<span data='77'>{postIcon[77]}</span>
									</li>
									<li className='px-1'  onClick={changeEmotion}>
										<span data='78'>{postIcon[78]}</span>
									</li>
								</ul>
							</div>
						</Button>
						<Button
							className={`${
								styles.hand_icon_cover
							} fs-4 d-flex align-items-center justify-content-center ${
								!raiseHand ? 'bg-transparent' : 'bg-light'
							} border-1 border-secondary ms-4`}
							onClick={() => setRaiseHand(!raiseHand)}
							disabled={!props.allowRaiseHand}
							>
							<span>{postIcon[74]}</span>
						</Button>
					</div>
				) : (
					<>
						<Modal style={{top: '70%'}} show={showModalFunctionArea1} onHide={handleCloseModalFunctionArea1}>
							<Modal.Body style={{backgroundColor: '#000'}}>
								<div className={`d-flex ${styles.firstArea}`}>
									<Button
										className={`text-center rounded-circle d-flex justify-content-center align-items-center fs-4 ${styles.add_member}`}
										onClick={handleOpenModalAddMember}>
										<i
											className={`fa-solid fa-user-plus color_light p-1 m_0_5 ${styles.add_member_icon}`}></i>
									</Button>
									<Button
										className={'bg-secondary border-0 ms-5 d-flex align-items-center justify-content-center ' + styles.shareScreen}
										onClick={(e) => setIsShareScreen(!isShareScreen)}
										disabled={!allowShareScreen}>
										{isShareScreen ? (
											<Image
												src='./icon/share.svg'
												width={30}
												height={30}
												alt='share screen'></Image>
										) : (
											<Image
												src='./icon/share1.svg'
												alt='do not show screen'
												width={30}
												height={30}></Image>
										)}
									</Button>
									<Button
										className={`${
											styles.grid_icon_cover
										} position-relative fs-4 d-flex align-items-center justify-content-center ${
											!showOptionEmotion ? 'bg-transparent' : 'bg-secondary'
										} p-2 border-0 ms-4`}>
										<span
											onClick={() => setShowOptionEmotion(!showOptionEmotion)}>{postIcon[78]}</span>
										<div
											className={`${showOptionEmotion ? 'd-block' : 'd-none'} ${
												styles.modal_icon
											} position-absolute`}>
											<ul className='d-flex flex-row justify-content-around bg-black p-1 rounded'>
												<li className='px-1' onClick={changeEmotion} >
													<span data='75'>{postIcon[75]}</span>
												</li>
												<li className='px-1'  onClick={changeEmotion} >
													<span data='6'>{postIcon[6]}</span>
												</li>
												<li className='px-1'  onClick={changeEmotion} >
													<span data='11'>{postIcon[11]}</span>
												</li>
												<li className='px-1'  onClick={changeEmotion} >
													<span data='33'>{postIcon[33]}</span>
												</li>
												<li className='px-1'  onClick={changeEmotion} >
													<span data='61'>{postIcon[61]}</span>
												</li>
												<li className='px-1'  onClick={changeEmotion} >
													<span data='77'>{postIcon[77]}</span>
												</li>
												<li className='px-1'  onClick={changeEmotion}>
													<span data='78'>{postIcon[78]}</span>
												</li>
											</ul>
										</div>
									</Button>
									<Button
										className={`${
											styles.hand_icon_cover
										} fs-4 d-flex align-items-center justify-content-center ${
											!raiseHand ? 'bg-transparent' : 'bg-light'
										} border-1 border-secondary ms-4`}
										onClick={() => setRaiseHand(!raiseHand)}
										disabled={!props.allowRaiseHand}
										>
										<span>{postIcon[74]}</span>
									</Button>
								</div>
							</Modal.Body>
						</Modal>
						<Image style={{marginLeft:'10px'}} onClick={()=>setShowModalFunctionArea1(true)} src='/svg/more_vert.svg' width={30} height={60}/>
					</>
				)}
				<div className={`${styles.main_footer} d-flex flex-row algin-item`}>
					<div
						className={`${styles.function_camera} border border-1 border-primary rounded-pill d-inline-flex px-2`}>
						<button
							className={`${styles.camera_icon_cover} fs-4 bg-transparent border-0 border-0 d-flex align-items-center justify-content-center me-1`}
							onClick={changeStateCamera}>
							<div className={`${!isCamera ? 'd-none' : ''}`}>
								<i className='fa-solid fa-video color_light'></i>
							</div>
							<div className={`${isCamera ? 'd-none' : ''}`}>
								<i className='fa-solid fa-video-slash color_light'></i>
							</div>
						</button>
						<button
							className={`${styles.arrow_up} bg-transparent border-0 border-0 d-flex align-items-center justify-content-center ps-2`}
							onClick={changeStateIsShowOptionCamera}>
							<i
								className={`${styles.arrow_up_icon} ${styles.option_camera_show} fa-solid fa-angle-up color_light bg-transparent`}></i>
						</button>
						<div
							className={`${styles.popup_camera} rounded ${
								isShowOptionCamera
									? styles.slide_in + ' d-block'
									: styles.slide_out + ' d-none'
							}`}>
							<ul className={`${styles.camera_list} d-flex flex-column`}>
								{props.videoDevices.map((item, index) => (
									<li
										key={item.deviceId}
										className={`${styles.camera_item} py-1 d-inline-flex justify-content-between align-items-center px-2`}
										onClick={() => turnOffStateOptionCamera(index)}>
										<span className={`${styles.camera_text} flex-grow-1`}>
											{item.label}
										</span>
										{videoChoice == index ? (
											<i className='fa-solid fa-check'></i>
										) : (
											<div></div>
										)}
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className={`${styles.function_call} border-0 mx-4`}>
						<button
							className={`${
								styles.call_icon_cover
							} fs-5 border border-light border-1 rounded-circle d-flex align-items-center justify-content-center ${
								isCall ? 'bg-danger' : 'bg-success'
							}`}
							onClick={changeStateCall}>
							<div className={`${isCall ? 'd-none' : ''}`}>
								<i className={`fa-solid fa-phone color_light`}></i>
							</div>
							<div className={`${!isCall ? 'd-none' : ''}`}>
								<i className={`fa-solid fa-phone-slash color_light`}></i>
							</div>
						</button>
					</div>
					<div
						className={`${styles.function_audio} d-flex border border-1 border-primary rounded-pill px-2 position-relative`}>
						<button
							className={`${styles.audio_icon_cover} fs-4 bg-transparent border-0 border-0 d-flex align-items-center justify-content-center me-1`}
							onClick={changeStateMicro}>
							<div className={`${!isMicro ? 'd-none' : ''}`}>
								<i className='fa-solid fa-microphone color_light'></i>
							</div>
							<div className={`${isMicro ? 'd-none' : ''}`}>
								<i className='fa-solid fa-microphone-slash color_light'></i>
							</div>
						</button>
						<button
							className={`${styles.arrow_up} bg-transparent border-0 border-0 d-flex align-items-center justify-content-center ps-2`}
							onClick={changeStateIsShowOptionAudio}>
							<i
								className={`${styles.arrow_up_icon} ${styles.option_audio_show} fa-solid fa-angle-up color_light`}></i>
						</button>
						<div
							className={`${styles.popup_audio} rounded ${
								isShowOptionAudio
									? styles.slide_in + ' d-block'
									: styles.slide_out + ' d-none'
							}`}>
							<ul className={`${styles.camera_list} d-flex flex-column`}>
								{props.audioDevices.map((item, index) => (
									<li
										key={item.deviceId}
										className={`${styles.camera_item} py-1 d-inline-flex justify-content-between align-items-center px-2`}
										onClick={() => turnOffStateOptionAudio(index)}>
										<span className={`${styles.camera_text} flex-grow-1`}>
											{item.label}
										</span>
										{audioChoice == index ? (
											<i className='fa-solid fa-check'></i>
										) : (
											<div></div>
										)}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				{(windowWidth && windowWidth > 900) ? (
					<div className={`${styles.setting_change} d-flex `}>
						<Button
							className={`${styles.grid_icon_cover} fs-4 d-flex align-items-center justify-content-center bg-transparent border-0`}
							onClick={changeDisplay}
							disabled={isShareScreen}>
							{isGrid ? (
								<div>
									<svg
										width='36px'
										height='36px'
										viewBox='0 0 24 24'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										className={`${styles.grid_icon}`}>
										<rect
											x='0.5'
											y='1.3'
											width='10.2'
											height='9.4'
											rx='0.5'
											fill='transparent'
											stroke='#ffffffd0'
										/>
										<rect
											x='13.3'
											y='1.29996'
											width='10.2'
											height='9.4'
											rx='0.5'
											fill='inherit'
											stroke='#ffffffd0'
										/>
										<rect
											x='0.5'
											y='13.3'
											width='10.2'
											height='9.4'
											rx='0.5'
											fill='inherit'
											stroke='#ffffffd0'
										/>
										<rect
											x='13.3'
											y='13.3'
											width='10.2'
											height='9.4'
											rx='0.5'
											fill='transparent'
											stroke='#ffffffd0'
										/>
									</svg>
								</div>
							) : (
								<div>
									<svg
										width='36px'
										height='36px'
										viewBox='0 0 25 24'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										className={`${styles.grid_icon}`}>
										<rect
											x='1.5'
											y='1.5'
											width='13'
											height='21'
											rx='0.5'
											fill='transparent'
											stroke='#ffffffd0'
										/>
										<rect
											x='17.5'
											y='1.5'
											width='7'
											height='5'
											rx='0.5'
											fill='#ffffffd0'
											stroke='#ffffffd0'
										/>
										<rect
											x='17.5'
											y='17.5'
											width='7'
											height='5'
											rx='0.5'
											fill='#ffffffd0'
											stroke='#ffffffd0'
										/>
										<rect
											x='17.5'
											y='9.5'
											width='7'
											height='5'
											rx='0.5'
											fill='transparent'
											stroke='#ffffffd0'
										/>
									</svg>
								</div>
							)}
						</Button>
						<Button
							className={`${styles.setting_icon_cover} fs-4 rounded-circle d-flex align-items-center justify-content-center`}
							onClick={handleOpenModalSetting}>
							<i
								className={`fa-solid fa-gear color_light ${styles.setting_icon}`}></i>
						</Button>
					</div>
				): (
					<>
						<Modal style={{top: '70%'}} show={showModalFunctionArea2} onHide={handleCloseModalFunctionArea2}>
							<Modal.Body style={{backgroundColor: '#000'}}>
								<div className={`${styles.setting_change} d-flex `}>
									<Button
										className={`${styles.grid_icon_cover} fs-4 d-flex align-items-center justify-content-center bg-transparent border-0`}
										onClick={changeDisplay}
										disabled={isShareScreen}>
										{isGrid ? (
											<div>
												<svg
													width='36px'
													height='36px'
													viewBox='0 0 24 24'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
													className={`${styles.grid_icon}`}>
													<rect
														x='0.5'
														y='1.3'
														width='10.2'
														height='9.4'
														rx='0.5'
														fill='transparent'
														stroke='#ffffffd0'
													/>
													<rect
														x='13.3'
														y='1.29996'
														width='10.2'
														height='9.4'
														rx='0.5'
														fill='inherit'
														stroke='#ffffffd0'
													/>
													<rect
														x='0.5'
														y='13.3'
														width='10.2'
														height='9.4'
														rx='0.5'
														fill='inherit'
														stroke='#ffffffd0'
													/>
													<rect
														x='13.3'
														y='13.3'
														width='10.2'
														height='9.4'
														rx='0.5'
														fill='transparent'
														stroke='#ffffffd0'
													/>
												</svg>
											</div>
										) : (
											<div>
												<svg
													width='36px'
													height='36px'
													viewBox='0 0 25 24'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
													className={`${styles.grid_icon}`}>
													<rect
														x='1.5'
														y='1.5'
														width='13'
														height='21'
														rx='0.5'
														fill='transparent'
														stroke='#ffffffd0'
													/>
													<rect
														x='17.5'
														y='1.5'
														width='7'
														height='5'
														rx='0.5'
														fill='#ffffffd0'
														stroke='#ffffffd0'
													/>
													<rect
														x='17.5'
														y='17.5'
														width='7'
														height='5'
														rx='0.5'
														fill='#ffffffd0'
														stroke='#ffffffd0'
													/>
													<rect
														x='17.5'
														y='9.5'
														width='7'
														height='5'
														rx='0.5'
														fill='transparent'
														stroke='#ffffffd0'
													/>
												</svg>
											</div>
										)}
									</Button>
									<Button
										className={`${styles.setting_icon_cover} fs-4 rounded-circle d-flex align-items-center justify-content-center`}
										onClick={handleOpenModalSetting}>
										<i
											className={`fa-solid fa-gear color_light ${styles.setting_icon}`}></i>
									</Button>
								</div>
							</Modal.Body>
						</Modal>
						<Image style={{marginRight:'10px'}} onClick={()=>setShowModalFunctionArea2(true)} src='/svg/more_vert.svg' width={30} height={60}/>
					</>
				)}
			</div>
			<Modal show={showModalAddMember} onHide={handleCloseModalAddMember}>
				{/* <Modal.Header
					closeButton
					className={`${styles.modal_header} ps-3 pe-2 py-1`}>
					<Modal.Title className={`${styles.modal_title}`}>
						Chia sẻ cuộc họp
					</Modal.Title>
				</Modal.Header> */}
				<Modal.Body>
					{/* <search>
						<div
							className={`rounded-pill border border-1 border-dark d-flex align-items-center pe-3 mb-3`}>
							<i className='fa-solid fa-magnifying-glass ps-2 pe-1'></i>
							<div
								className={`flex-grow-1 position-relative ${styles.input_cover}`}>
								<input
									type='text'
									className={`border-0 ${styles.search_input} position-relative w-100`}
								/>
							</div>
						</div>
					</search>
					<div className='border-1 border border-grey w-100 mb-2'></div>
					<div
						className={`${styles.cover_container_member} d-inline-flex flex-row w-100`}>
						<ul className={`${styles.container_member} w-50`}>
							<li>
								<span>A</span>
								<ul className='ps-2'>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
									<li className={`d-flex flex-row align-items-center mb-2`}>
										<input
											type='checkbox'
											className={`rounded-circle ${styles.checkbox_member}`}
										/>
										<img
											src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
											className={`rounded-circle mx-2`}
											width={40}
											height={40}></img>
										<span className={`${styles.text_account}} flex-grow-1`}>
											Hoa bay mau
										</span>
									</li>
								</ul>
							</li>
						</ul>
						<ul
							className={`${styles.container_member} border border-1 border-secondary rounded`}>
							<p className='px-3 fs-6'>Đã Chọn</p>
							<li className={`d-flex flex-row align-items-center mb-2 ms-2`}>
								<img
									src='https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'
									className={`rounded-circle mx-2`}
									width={40}
									height={40}></img>
								<span className={`${styles.text_account_choice}`}>
									Hoa bay mau 123123123333333333333333333333
								</span>
								<i
									className={`${styles.button_close} mx-2 fa-regular fa-circle-xmark`}></i>
							</li>
						</ul>
					</div>
					<div className='border-1 border border-grey w-100 mb-2'></div>
					<footer>
						<div className='d-flex justify-content-end'>
							<Button
								className={`${styles.button_cancel_member} bg-secondary me-2 outline-none border-0`}
								onClick={handleCloseModalAddMember}>
								Hủy
							</Button>
							<Button className={`${styles.button_accept_member}`}>Thêm</Button>
						</div>
					</footer> */}
					<p>Cuộc họp đã sẵn sàng</p>
					<p>Hãy chia sẻ cuộc họp với những người tham gia khác bằng mã dưới đây:</p>
					<div style={{
						display: 'flex',
						textAlign: 'center',
						backgroundColor: '#F5F5F5',
						height: '50px',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						{props.room} 
						<span style={{marginLeft: '10px', cursor: 'pointer'}} className="material-symbols-outlined"
							onClick={()=>{
								navigator.clipboard.writeText(props.room)
								setCopySuccessNotification(true);
								setTimeout(()=>{
									setCopySuccessNotification(false);
								},2000)
							}}
						>
							content_copy
						</span>
					</div>
					{copySuccessNotification && (
						<p style={{textAlign: 'center', color: 'rgb(26,115,232)'}}>Đã sao chép vào khay nhớ tạm</p>
					)}
					<p>Hoặc đường link này:</p>
					<div style={{
						display: 'flex',
						textAlign: 'center',
						backgroundColor: '#F5F5F5',
						height: '50px',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						{`/selectDevice/${props.room}`} 
						<span style={{marginLeft: '10px', cursor: 'pointer'}} className="material-symbols-outlined"
							onClick={()=>{
								navigator.clipboard.writeText(`/selectDevice/${props.room}`)
								setCopySuccessNotification2(true);
								setTimeout(()=>{
									setCopySuccessNotification2(false);
								},2000)
							}}
						>
							content_copy
						</span>
					</div>
					{copySuccessNotification2 && (
						<p style={{textAlign: 'center', color: 'rgb(26,115,232)'}}>Đã sao chép vào khay nhớ tạm</p>
					)}
				</Modal.Body>
			</Modal>
			<Modal show={showModalSetting} onHide={handleCloseModalSetting}>
				<Modal.Header closeButton style={{ borderBottom: '1px solid #ccc' }}>
					<Modal.Title style={{ fontSize: '1rem' }}>
						Tình trạng thiết bị
					</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ padding: '0px' }}>
					<div className={`${styles.container_setting} p-4`}>
						<div
							className={`${
								styles.button_setting
							} border border-1 w-100 d-flex justify-content-between px-3 py-2 align-items-center ${
								isCameraSetting ? 'border-info' : 'border-danger'
							} `}>
							<div
								className={`${styles.text_setting} d-inline-flex align-items-center`}>
								<div className={`${isCameraSetting ? 'd-block' : 'd-none'}`}>
									<i className={`fa-solid fa-camera `}></i>
								</div>
								<div className={`${isCameraSetting ? 'd-none' : 'd-block'}`}>
									<i className={`fa-solid fa-video-slash `}></i>
								</div>
								<p className='ps-2 mb-0 user-select-none'>
									{isCameraSetting ? 'Camera đang hoạt động' : 'Camera đã tắt'}
								</p>
							</div>
							<input
								type='checkbox'
								className={`rounded-circle ${styles.checkbox_member}`}
								onChange={(e) => setIsCameraSetting(e.target.checked)}
								checked={isCameraSetting}
							/>
						</div>
						<div className={`pt-2`}>
							<h5 className='no-select'>Camera</h5>
							<div className='position-relative'>
								<div
									className={`${styles.item_choice_setting} border border-1 w-100 d-flex justify-content-between px-3 py-2 align-items-center mb-4 position-relative`}
									onClick={(e) =>
										setIsShowOptionCameraSetting(!isShowOptionCameraSetting)
									}>
									<div>
										<p className='user-select-none mb-0'>
											{props.videoDevices.length &&
												props.videoDevices[videoChoice].label}
										</p>
									</div>
									<div className={``}>
										<i className='fa-solid fa-chevron-down'></i>
									</div>
									<div
										className={`${styles.option_choice_setting} ${
											styles.option_choice_camera
										} ${
											isShowOptionCameraSetting ? 'd-block' : 'd-none'
										} border border-`}>
										<ul className='w-100'>
											{props.videoDevices.map((item, index) => (
												<li
													key={item.deviceId}
													className={`${styles.item_setting} py-1 px-2 d-inline-flex user-select-none justify-content-between w-100 align-items-center`}
													// onClick={() => setVideoChoice(index)}
												>
													<span>{item.label}</span>
													{videoChoice == index ? (
														<i className='fa-solid fa-check'></i>
													) : (
														<div></div>
													)}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
							<div>{isCamera && <Video srcObject={myMedia}></Video>}</div>
						</div>
						<div
							className={`${
								styles.button_setting
							} border border-1 w-100 d-flex justify-content-between px-3 py-2 align-items-center ${
								isMicroSetting ? 'border-info' : 'border-danger'
							} `}>
							<div
								className={`${styles.text_setting} d-inline-flex align-items-center`}>
								<div className={`${isMicroSetting ? 'd-block' : 'd-none'}`}>
									<i className={`fa-solid fa-microphone`}></i>
								</div>
								<div className={`${isMicroSetting ? 'd-none' : 'd-block'}`}>
									<i className={`fa-solid fa-microphone-slash`}></i>
								</div>
								<p className='ps-2 mb-0 user-select-none'>
									{isMicroSetting ? 'Micro đang hoạt động' : 'Micro đã tắt'}
								</p>
							</div>
							<input
								type='checkbox'
								className={`rounded-circle ${styles.checkbox_member}`}
								onChange={(e) => setIsMicroSetting(e.target.checked)}
								checked={isMicroSetting}
							/>
						</div>
						<div className={`pt-2`}>
							<span className='fs-5 fw-bold no-select'>Micro</span>
							<div className='position-relative'>
								<div
									className={`${styles.item_choice_setting} border border-1 w-100 d-flex justify-content-between px-3 py-2 align-items-center mb-4 position-relative`}
									onClick={(e) =>
										setIsShowOptionAudioSetting(!isShowOptionAudioSetting)
									}>
									<div>
										<p className='user-select-none mb-0'>
											{props.audioDevices.length &&
												props.audioDevices[audioChoice].label}
										</p>
									</div>
									<div>
										<i className='fa-solid fa-chevron-down'></i>
									</div>
									<div
										className={`${styles.option_choice_setting} ${
											styles.option_choice_micro
										} ${
											isShowOptionAudioSetting ? 'd-block' : 'd-none'
										} border border-`}>
										<ul className='w-100'>
											{props.audioDevices.map((item, index) => (
												<li
													key={item.deviceId}
													className={`${styles.item_setting} user-select-none py-1 px-2 d-inline-flex justify-content-between w-100 align-items-center`}
													// onClick={() => {setAudioChoice(index)}}
												>
													<span>{item.label}</span>
													{audioChoice == index ? (
														<i className='fa-solid fa-check'></i>
													) : (
														<div></div>
													)}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleCloseModalSetting}>
						Hủy
					</Button>
					<Button variant='primary' onClick={handleSaveChangeSetting}>
						Lưu thay đổi
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
