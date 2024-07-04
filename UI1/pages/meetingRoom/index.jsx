import Image from 'next/image';
import { useState, useEffect,
	//  useCallback 
	} from 'react';
import Layout from '@/components/callGroup/layout';
import styles from '@/styles/home.module.css';
import Video from '@/components/video';
import Audio from '@/components/audio';
import { postIcon } from '@/ultils/icon';
import FlyingIcon from '@/components/icon/flyingIcon';
// import { useRouter } from 'next/router';

const io = require('socket.io-client');
const mediasoupClient = require('mediasoup-client');
let device;
let rtpCapabilities;
let producerTransport;
let audioProducer;
let videoProducer;
let params = {
	// mediasoup params
	encodings: [
		{
			rid: 'r0',
			maxBitrate: 100000,
			scalabilityMode: 'S1T3',
		},
		{
			rid: 'r1',
			maxBitrate: 300000,
			scalabilityMode: 'S1T3',
		},
		{
			rid: 'r2',
			maxBitrate: 900000,
			scalabilityMode: 'S1T3',
		},
	],
	// https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
	codecOptions: {
		videoGoogleStartBitrate: 1000,
	},
};
let audioParams;
let videoParams = { params };
let consumingTransports = [];
let consumerTransports = [];
let screenShareProducer;
let isSetBaseMedia = false;
export default function meetingRoom({ room,name,video,audio,avatar }) {
	
	const [myScreenVideo, setMyScreenVideo] = useState();
	const [myScreenAudio, setMyScreenAudio] = useState();
	const [isShareScreen, setIsShareScreen] = useState(false);
	const [arrayMedia, setArrayMedia] = useState([]);
	const [myMedia, setMyMedia] = useState();
	const [widthVideo, setWidthVideo] = useState(100);
	const [heightVideo, setHeightVideo] = useState(100);
	const [isGrid, setIsGrid] = useState(true);
	const [isCall, setIsCall] = useState(true);
	const [isCamera, setIsCamera] = useState(true);
	const [isMicro, setIsMicro] = useState(true);
	const [hasVideo, setHasVideo] = useState(true);
	const [hasAudio, setHasAudio] = useState(true);
	const [audioDevices, setAudioDevices] = useState([]);
	const [videoDevices, setVideoDevices] = useState([]);
	const [videoChoice, setVideoChoice] = useState(0);
	const [audioChoice, setAudioChoice] = useState(0);
	const [audioId, setAudioId] = useState();
	const [videoId, setVideoId] = useState();
	const [myScreenVideoId, setMyScreenVideoId] = useState();
	const [myScreenAudioId, setMyScreenAudioId] = useState();
	const [columnsGrid, setColumnsGid] = useState(1);
	const [rowsGrid, setRowsGrid] = useState(1);
	const [allowShareScreen, setAllowShareScreen] = useState(true);
	const [raiseHand, setRaiseHand] = useState(false);
	const [arrayEmotion, setArrayEmotion] = useState([]);
	const [socket, setSocket] = useState(null);
	const [allowRaiseHand, setAllowRaiseHand] = useState(true);
	const [stream, setStream] = useState();
	useEffect(() => {
		const initDevices = async () => {
			if(!socket){ 
			const socketInstance = io('ws://:4000/mediasoup');
			try {
				socketInstance.on('connection-success', async ({ socketId },callback) => {
					const devices = await navigator.mediaDevices.enumerateDevices();
					const hasAudio = devices.some(
						(device) => device.kind === 'audioinput' && device.deviceId !== ''
					);
					const hasVideo = devices.some(
						(device) => device.kind === 'videoinput' && device.deviceId !== ''
					);
					const videoDevices = devices.filter(
						(device) => device.kind === 'videoinput' && device.deviceId !== ''
					);
					const audioDevices = devices.filter(
						(device) => device.kind === 'audioinput' && device.deviceId !== ''
					);

					setVideoDevices(videoDevices);
					setAudioDevices(audioDevices);
					callback(room);
				});

				socketInstance.on('producer-closed', ({ remoteProducerId }) => {
					// server notification is received when a producer is closed
					// we need to close the client-side consumer and associated transport
					console.log('consumer is :', consumerTransports);
					// if(consumerTransports.length < 1) return;
					const producerToClose = consumerTransports.find(
						(transportData) => transportData.producerId === remoteProducerId
					);
					if (producerToClose) {
						producerToClose.consumerTransport.close();
						producerToClose.consumer.close();

						// remove the consumer transport from the list
						consumerTransports = consumerTransports.filter(
							(transportData) => transportData.producerId !== remoteProducerId
						);
						consumingTransports = consumingTransports.filter(
							(transId) => transId !== remoteProducerId
						);
						// remove the video div element
						setArrayMedia((prev) =>
							prev.filter((item) => item.id !== remoteProducerId)
						);
					}
				});

				socketInstance.on('unshare-screen', () => {
					setIsShareScreen(false);
					setIsGrid(true);
					setAllowShareScreen(true);
				});

				socketInstance.on('pause-video', ({ videoId }) => {
					setArrayMedia((prev) =>
						prev.map((item) => {
							if (item.id == videoId) item.activeVideo = false;
							return item;
						})
					);
				});

				socketInstance.on('resume-video', ({ videoId }) => {
					setArrayMedia((prev) =>
						prev.map((item) => {
							if (item.id == videoId) item.activeVideo = true;
							return item;
						})
					);
				});

				socketInstance.on('pause-audio', ({ videoId, audioId }) => {
					setArrayMedia((prev) =>
						prev.map((item) => {
							if (item.id == videoId) item.activeAudio = false;
							return item;
						})
					);
				});

				socketInstance.on('resume-audio', ({ videoId, audioId }) => {
					setArrayMedia((prev) =>
						prev.map((item) => {
							if (item.id == videoId) item.activeAudio = true;
							return item;
						})
					);
				});
			} catch (e) {
				console.log(e);
			}
			
			// Save the socket instance in state
			setSocket(socketInstance);
			}
		};

		initDevices();

		// Cleanup socket connection when the component is unmounted
		return () => {
			// if (socket) {
			// 	socket.disconnect();
			// }
		};
	}, []);
	useEffect(() => {
		const init = async () => {
			if (socket) {
				try {
					let timer;

					socket.on('new-producer', ({ producerId }) =>
						signalNewConsumerTransport(producerId)
					);

					socket.on('raise-hand', ({videoId}) => {
						setAllowRaiseHand(false);
						setArrayMedia((prev) =>{
							const updatedArray = prev.map((item) => {
								if (item.id === videoId) {
									return { ...item, raiseHand: true };
								}
								return item;
							});
					
							// Sort the array to move the item with raiseHand=true to the front
							updatedArray.sort((a, b) => (b.raiseHand ? 1 : 0) - (a.raiseHand ? 1 : 0));
					
							return updatedArray;

						}
					);
					});

					socket.on('down-hand', ({videoId}) => {
						setAllowRaiseHand(true);
						setArrayMedia((prev) =>
						prev.map((item) => {
							if (item.id == videoId) item.raiseHand = false;
							return item;
						})
					);
					});

					socket.on('send-emotion', ({ emotion }) => {
						const left = Math.floor(Math.random() * 90) + 5;
						const data = {
							left,
							emotion,
						};
						setArrayEmotion((prev) => [...prev, data]);
	
						if (timer) {
							clearTimeout(timer);
						}
						timer = setTimeout(() => {
									setArrayEmotion([]);
								}, 4000);
					});

					socket.on('joinRoomPermission', ({name}, callback) => {
						if(confirm(`Allow ${name} to join?`)){
							callback({allow: true});
						}else{
							callback({allow: false});
						}
					})
					let stream
					if(audio && video){
						stream = await navigator.mediaDevices.getUserMedia({
							audio: { deviceId: { exact: audio }},
							video: {
								width: { min: 640, max: 1920 },
								height: { min: 400, max: 1080 },
								deviceId: { exact: video }
							},
						});
					}
					else{
						stream = await navigator.mediaDevices.getUserMedia({
							audio: true,
							video: {
								width: { min: 640, max: 1920 },
								height: { min: 400, max: 1080 },
							},
						});
					}
					setStream(stream)
					streamSuccess(stream);
				} catch (error) {
					console.error('Error accessing media devices:', error);
				}
			}
		};

		init();
	}, [socket]);
	useEffect(() => {
		const shareDisplay = async () => {
			try {
				if (isShareScreen && allowShareScreen) {
					const stream = await navigator.mediaDevices.getDisplayMedia({
						video: true,
					});
					const videoTrack = stream.getVideoTracks()[0];

					// Tạo một producer mới cho video màn hình
					const screenShareParams = {
						id: stream.id,
						track: stream.getVideoTracks()[0],
						...params, // Sử dụng các tham số video hiện tại
					};

					isSetBaseMedia = true;

					screenShareProducer = await producerTransport.produce(
						screenShareParams
					);
					screenShareProducer.on('trackended', () => {
						setIsShareScreen(false);
					})
					// Hiển thị video màn hình trong giao diện
					setMyScreenVideo(stream);
					setIsGrid(false);
				} else if (socket) {
					isSetBaseMedia = false;
					// Dừng tất cả các producers của video màn hình
					if(screenShareProducer) {
						await screenShareProducer.close();
						socket.emit('start-unshare-screen');
						setMyScreenVideo();
						setIsGrid(true);
					}
				}
			} catch (e) {
				console.log(e);
			}
		};

		shareDisplay();
	}, [isShareScreen]);
	const streamSuccess = (stream) => {
		setMyMedia(stream);
		audioParams = {
			id: stream.id,
			track: stream.getAudioTracks()[0],
			...audioParams,
		};
		videoParams = {
			id: stream.id,
			track: stream.getVideoTracks()[0],
			...videoParams,
		};

		joinRoom();
	};
	const joinRoom = () => {
		socket.emit('joinRoom', { roomName: room, name: name, avatar: avatar }, (data) => {
			console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`);
			// we assign to local variable and will be used when
			// loading the client Device (see createDevice above)
			rtpCapabilities = data.rtpCapabilities;
			// once we have rtpCapabilities from the Router, create Device
			createDevice();
		});
	};
	// A device is an endpoint connecting to a Router on the
	// server side to send/recive media
	const createDevice = async () => {
		try {
			device = new mediasoupClient.Device();

			// https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
			// Loads the device with RTP capabilities of the Router (server side)
			await device.load({
				// see getRtpCapabilities() below
				routerRtpCapabilities: rtpCapabilities,
			});

			console.log('Device RTP Capabilities', device.rtpCapabilities);

			// once the device loads, create transport
			createSendTransport();
		} catch (error) {
			console.log(error);
			if (error.name === 'UnsupportedError')
				console.warn('browser not supported');
		}
	};

	const createSendTransport = () => {
		// see server's socket.on('createWebRtcTransport', sender?, ...)
		// this is a call from Producer, so sender = true
		socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
			// The server sends back params needed
			// to create Send Transport on the client side
			if (params.error) {
				alert("Can't accept more user in this room");
				console.log(params.error);
				return;
			}

			// creates a new WebRTC Transport to send media
			// based on the server's producer transport params
			// https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
			producerTransport = device.createSendTransport(params);

			// https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
			// this event is raised when a first call to transport.produce() is made
			// see connectSendTransport() below
			producerTransport.on(
				'connect',
				async ({ dtlsParameters }, callback, errback) => {
					try {
						// Signal local DTLS parameters to the server side transport
						// see server's socket.on('transport-connect', ...)
						await socket.emit('transport-connect', {
							dtlsParameters,
						});

						// Tell the transport that parameters were transmitted.
						callback();
					} catch (error) {
						errback(error);
					}
				}
			);

			producerTransport.on('produce', async (parameters, callback, errback) => {
				try {
					// tell the server to create a Producer
					// with the following parameters and produce
					// and expect back a server side producer id
					// see server's socket.on('transport-produce', ...)
					await socket.emit(
						'transport-produce',
						{
							kind: parameters.kind,
							rtpParameters: parameters.rtpParameters,
							appData: parameters.appData,
							isScreenMedia: isSetBaseMedia,
						},
						({ id, producersExist, kind }) => {
							// Tell the transport that parameters were transmitted and provide it with the
							// server side producer's id.

							if (kind === 'video') {
								if (isSetBaseMedia) setMyScreenVideoId(id);
								else setVideoId(id);
							}
							if (kind === 'audio') {
								if (isSetBaseMedia) setMyScreenAudioId(id);
								else setAudioId(id);
							}

							callback({ id });

							// if producers exist, then join room
							if (producersExist) getProducers();
						}
					);
				} catch (error) {
					errback(error);
				}
			});
			connectSendTransport();
		});
	};

	const connectSendTransport = async () => {
		// we now call produce() to instruct the producer transport
		// to send media to the Router
		// https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
		// this action will trigger the 'connect' and 'produce' events above
		if (audioParams.track)
			audioProducer = await producerTransport.produce(audioParams);
		if (videoParams.track)
			videoProducer = await producerTransport.produce(videoParams);
	};

	const signalNewConsumerTransport = async (remoteProducerId) => {
		//check if we are already consuming the remoteProducerId
		if (consumingTransports.includes(remoteProducerId)) return;
		consumingTransports.push(remoteProducerId);

		await socket.emit(
			'createWebRtcTransport',
			{ consumer: true },
			async ({ params }) => {
				// The server sends back params needed
				// to create Send Transport on the client side
				if (params.error) {
					console.log(params.error);
					return;
				}
				console.log(`PARAMS... ${params}`);

				let consumerTransport;
				try {
					consumerTransport = device.createRecvTransport(params);
				} catch (error) {
					// exceptions:
					// {InvalidStateError} if not loaded
					// {TypeError} if wrong arguments.
					console.log(error);
					return;
				}

				consumerTransport.on(
					'connect',
					async ({ dtlsParameters }, callback, errback) => {
						try {
							// Signal local DTLS parameters to the server side transport
							// see server's socket.on('transport-recv-connect', ...)
							await socket.emit('transport-recv-connect', {
								dtlsParameters,
								serverConsumerTransportId: params.id,
							});

							// Tell the transport that parameters were transmitted.
							callback();
						} catch (error) {
							// Tell the transport that something was wrong
							errback(error);
						}
					}
				);

				await connectRecvTransport(
					consumerTransport,
					remoteProducerId,
					params.id
				);
			}
		);
	};

	// server informs the client of a new producer just joined

	const getProducers = () => {
		socket.emit('getProducers', async (producerIds) => {
			for (const element of producerIds) {
				await signalNewConsumerTransport(element);
			}
		});
	};

	const connectRecvTransport = async (
		consumerTransport,
		remoteProducerId,
		serverConsumerTransportId
	) => {
		// for consumer, we need to tell the server first
		// to create a consumer based on the rtpCapabilities and consume
		// if the router can consume, it will send back a set of params as below
		await socket.emit(
			'consume',
			{
				rtpCapabilities: device.rtpCapabilities,
				remoteProducerId,
				serverConsumerTransportId,
			},
			async ({ params }) => {
				if (params.error) {
					console.log('Cannot Consume');
					return;
				}

				console.log(`Consumer Params ${params}`);
				// then consume with the local consumer transport
				// which creates a consumer
				const consumer = await consumerTransport.consume({
					id: params.id,
					producerId: params.producerId,
					kind: params.kind,
					rtpParameters: params.rtpParameters,
				});

				consumerTransports = [
					...consumerTransports,
					{
						consumerTransport,
						serverConsumerTransportId: params.id,
						producerId: remoteProducerId,
						consumer,
					},
				];
				// destructure and retrieve the video track from the producer
				const { track } = consumer;
				const src = new MediaStream([track]);

				if (params.audioScreen) {
					setMyScreenAudio(src);
					setIsGrid(false);
					setIsShareScreen(true);
					setAllowShareScreen(false);
				} else if (params.videoScreen) {
					setMyScreenVideo(src);
					setIsGrid(false);
					setIsShareScreen(true);
					setAllowShareScreen(false);
				} else {
					const data = {
						id: remoteProducerId,
						srcObject: src,
						kind: params.kind,
						activeVideo: params.activeVideo,
						activeAudio: params.activeAudio,
						raiseHand: params.raiseHand,
						userName: params.userName,
						isAdmin: params.isAdmin,
						avatar: params.avatar,
					};
					setArrayMedia((prev) => [...prev, data]);
				}

				// the server consumer started with media paused
				// so we need to inform the server to resume
				socket.emit('consumer-resume', {
					serverConsumerId: params.serverConsumerId,
				});
			}
		);
	};

	function sendEmotion(emotion) {
		socket.emit('start-send-emotion', { emotion});
	}

	useEffect(() => {
		if(raiseHand){
			socket.emit('start-raise-hand', {videoId})
		}
		else if(socket) socket.emit('start-down-hand', {videoId})
	},[raiseHand])

	useEffect(() => {
		if (!isCamera) {
			if (videoProducer && videoParams) {
				videoProducer.pause();
				socket && socket.emit('start-pause-video', { videoId });
			}
		} else if (videoProducer && videoParams) {
			videoProducer.resume();
			socket && socket.emit('start-resume-video', { videoId });
		}

		if (!isMicro) {
			if (audioProducer && audioParams) {
				audioProducer.pause();
				socket && socket.emit('start-pause-audio', { videoId, audioId });
			}
		} else if (audioProducer && audioParams) {
			audioProducer.resume();
			socket && socket.emit('start-resume-audio', { videoId, audioId });
		}
	}, [isCamera, isMicro]);

	useEffect(() => {
		try {
			const n = arrayMedia.filter((item) => item.kind == 'video').length;
			if (n == 0) return;
			const n2 = Math.ceil(Math.sqrt(n));
			setWidthVideo(100 / n2);

			let heightChange;

			if (n > n2 * (n2 - 1)) {
				heightChange = 100 / n2;
			} else {
				heightChange = 100 / (n2 - 1);
			}

			const n3 = Math.ceil(Math.sqrt(n / 2));
			if (n3 < 4) setColumnsGid(n3);
			else setColumnsGid(3);

			const n4 = n / n3;
			setRowsGrid(n4);

			setHeightVideo(heightChange);
		} catch (e) {
			console.log(e);
		}
	}, [arrayMedia]);

	const stopCall = () => {
		socket.disconnect();
		stream.getTracks().forEach(track => track.stop());
		window.location.href = '/'
	}
	// const stopVideo = async (stop) => {
	// 	if(stop){
	// 		stream.getVideoTracks()[0].enabled = false;
	// 	}else{
	// 		stream.getVideoTracks()[0].enabled = true;
	// 	}
	// }
	// const stopAudio = (stop) => {
	// 	if(stop){
	// 		stream.getAudioTracks()[0].enabled = false;
	// 	}else{
	// 		stream.getAudioTracks()[0].enabled = true;
	// 	}
	// }
	const stopVideo = async (stop) => {
		if(stop){
			myMedia.getVideoTracks()[0].stop();
			myMedia.removeTrack(myMedia.getVideoTracks()[0]);
			await videoProducer.pause();
		}else{
			const newstream = await navigator.mediaDevices.getUserMedia({
				// audio: { deviceId: { exact: audio }},
				audio: false,
				video: {
					width: { min: 640, max: 1920 },
					height: { min: 400, max: 1080 },
					deviceId: { exact: video }
				},
			});
			myMedia.addTrack(newstream.getVideoTracks()[0])
			await videoProducer.replaceTrack({track: newstream.getVideoTracks()[0]})
		}
	}
	const stopAudio = async (stop) => {
		if(stop){
			myMedia.getAudioTracks()[0].stop();
			myMedia.removeTrack(myMedia.getAudioTracks()[0]);
			await audioProducer.pause();
		}else{
			const newstream = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: { exact: audio }},
				video: false
			});
			myMedia.addTrack(newstream.getAudioTracks()[0])
			await audioProducer.replaceTrack({track: newstream.getAudioTracks()[0]})
		}
	}
	const props = {
		isCall,
		setIsCall,
		isMicro,
		setIsMicro,
		isCamera,
		setIsCamera,
		isGrid,
		setIsGrid,
		myMedia,
		setMyMedia,
		videoDevices,
		audioDevices,
		videoChoice,
		setVideoChoice,
		audioChoice,
		setAudioChoice,
		isShareScreen,
		setIsShareScreen,
		allowShareScreen,
		setAllowShareScreen,
		raiseHand,
		setRaiseHand,
		sendEmotion,
		allowRaiseHand,
		stopCall,
		stopVideo,
		stopAudio,
		room,
	};
	return (
		<Layout {...props}>
			{/* <button onClick={() => {
				console.log(screenShareProducer)
			}}>test</button> */}
			<div style={{position: 'absolute', top: '20px', left: '20px', zIndex: '9999'}}>
				<p style={{color: '#FFF'}}>Room: {room}</p>
			</div>
			<div style={{ height: '100%' }} className='position-relative'>
				<div>
					{arrayEmotion.map((item, index) => (
						<FlyingIcon
							key={index}
							Icon={postIcon[item.emotion]}
							left={item.left}></FlyingIcon>
					))}
				</div>
				<div
					className={`${styles.my_video}`}
					style={{ ...(!isGrid ? { width: '25%' } : {}), height: '100%' }}>
					{/* view of video other local client show in main layout */}
					{!isGrid ? (
						<div
							className={`${styles.video_show_main} d-grid`}
							style={{
								gridTemplateColumns: `repeat(${columnsGrid},auto)`,
							}}>
							{arrayMedia.map((item) =>
								item.kind === 'video' ? (
									<div
										className={` ${styles.video_item_main} rounded ${
											'bg-dark' && item.activeVideo
										} d-flex position-relative algin-items-center justify-content-center`}
										key={item.id}>
										{item.activeVideo ? (
											<>
												<Video flip srcObject={item.srcObject} ></Video>
											</>
										) : (
											<div style={{
												textAlign: 'center',
												// width: '100%',
												// height: '100%',
											}}>
												<img
													className={` rounded-circle `}
													style={{ width: '50%'}}
													// style={{objectFit: 'contain'}}
													src={item.avatar ? item.avatar : 'https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'}>
												</img>
												<p style={{color: '#FFF',textAlign: 'center', fontWeight: 'bold'}}>{item.userName}</p>
											</div>
										)}
										{
								item.raiseHand ? <span className={styles.icon_hand}>{postIcon[74]}</span> : ''
							}
										{!item.activeAudio ? (
											<Image
												className={styles.no_micro_icon}
												src='./icon/no_micro.svg'
												alt='no-micro'
												width={40}
												height={40}></Image>
										) : (
											''
										)}
									</div>
								) : (
									<Audio key={item.id} srcObject={item.srcObject}></Audio>
								)
							)}
						</div>
					) : (
						<div></div>
					)}
					{/* view my video in grid layout */}
					{(isGrid || (isShareScreen && myScreenVideo)) && (
						<div
							style={{ width: '30vh', height: '20%' }}
							className={`position-fixed ${styles.my_video_grid}`}>
							{!isCamera ? (
								<div
									className={` ${styles.video_item} rounded bg-dark d-flex justify-content-center align-items-center`}
									style={{
										width: '100%',
										height: '100%',
									}}>
									<img
										className={`rounded-circle`}
										style={{ height: '50%' }}
										src={avatar ? avatar : 'https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'}>
									</img>
								</div>
							) : (
								<Video flip srcObject={myMedia}></Video>
							)}
							{
								raiseHand ? <span className={styles.icon_hand}>{postIcon[74]}</span> : ''
							}
							{!isMicro ? (
								<Image
									src='./icon/no_micro.svg'
									alt='no-micro'
									className={styles.no_micro_icon}
									width={40}
									height={40}></Image>
							) : (
								<Audio srcObject={myMedia}></Audio>
							)}
						</div>
					)}
				</div>
				{/* view my video in main layout */}
				{!isGrid ? (
					<div
						className={`${styles.video_coverer} position-relative`}
						style={{ ...(!isGrid ? { width: '75%' } : {}) }}>
						<div
							className={` ${styles.video_item} rounded`}
							style={{ width: `${100}%`, height: `${100}%` }}>
							{!isCamera && !isShareScreen ? (
								<div
									className={` ${styles.video_item} rounded bg-dark d-flex justify-content-center align-items-center`}
									style={{
										width: '100%',
										height: '100%',
									}}>
									<img
										className={`rounded-circle`}
										style={{ height: '50%' }}
										src={avatar ? avatar : 'https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'}></img>
								</div>
							) : (
								<Video
								 flip={!isShareScreen} srcObject={!isShareScreen ? myMedia : myScreenVideo}></Video>
							)
							}
							{
								raiseHand && !isShareScreen ? <span className={styles.icon_hand}>{postIcon[74]}</span> : ''
							}
							{isMicro ? (
								<Audio srcObject={myMedia}></Audio>
							) : (
								<Image
									src='./icon/no_micro.svg'
									alt='no-micro'
									className={styles.no_micro_icon}
									width={40}
									height={40}></Image>
							)}
						</div>
					</div>
				) : (
					// view other video in grid layout
					<div
						className={`${styles.video_coverer} position-relative`}
						style={{ ...(!isGrid ? { width: '70%' } : {}) }}>
						<div
							className={`${styles.video_show_grid} d-flex flex-wrap w-100 h-100 justify-content-center align-items-center`}>
							{arrayMedia.map((item) =>
								item.kind === 'video' ? (
									<div
										className={` ${styles.video_item} rounded ${
											'bg-dark' && item.activeVideo
										} d-flex justify-content-center align-items-center position-relative`}
										style={{
											width: `${widthVideo}%`,
											height: `${heightVideo}%`,
										}}
										key={item.id}>
										{item.activeVideo ? (
											<>
												<Video flip srcObject={item.srcObject}></Video>
											</>
										) : (
											<div style={{
												display: 'flex',
												justifyContent: 'center',
												width: '100%',
												height: '100%',
												backgroundColor: '#000',
												alignItems: 'center',
												flexDirection: 'column',
												borderRadius: '20px',
											}}>
												<img
													className={` rounded-circle`}
													style={{ maxWidth: '50%', maxHeight: '50%' }}
													// style={{objectFit: 'contain'}}
													src={item.avatar ? item.avatar : 'https://mandalay.com.vn/wp-content/uploads/2023/06/co-4-la-may-man-avatar-dep-18.jpg'}>
												</img>
												<p style={{color: '#FFF', textAlign: 'center', fontWeight: 'bold'}}>{item.userName}</p>
											</div>
										)}
										{
								item.raiseHand ? <span className={styles.icon_hand}>{postIcon[74]}</span> : ''
							}
										{!item.activeAudio ? (
											<Image
												src='./icon/no_micro.svg'
												alt='no-micro'
												className={styles.no_micro_icon}
												width={40}
												height={40}></Image>
										) : (
											''
										)}
									</div>
								) : (
									<Audio key={item.id} srcObject={item.srcObject}></Audio>
								)
							)}
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}

meetingRoom.getInitialProps = async (ctx) => {
	const { room, name, video, audio, avatar } = ctx.query;
	return {
		room,
		name,
		video,
		audio,
		avatar
	};
};
