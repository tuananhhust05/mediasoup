/**
 * integrating mediasoup server with a node.js application
 */

/* Please follow mediasoup installation requirements */
/* https://mediasoup.org/documentation/v3/mediasoup/installation/ */
import express from 'express';
import cors from 'cors';
import os from 'os';

const NoWorkers = Object.keys(os.cpus()).length;

const app = express()

app.use(cors());

import https from 'httpolyglot'
import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

import { Server } from 'socket.io'
import mediasoup from 'mediasoup'
// import { joinRoom } from './controller/RoomController';

app.get('*', (req, res, next) => {
  const path = '/sfu/'

  if (req.path.indexOf(path) == 0 && req.path.length > path.length) return next()

  res.send(`You need to specify a room name in the path e.g. 'https://127.0.0.1/sfu/room'`)
})

app.use('/sfu/:room', express.static(path.join(__dirname, 'public')))

// SSL cert for HTTPS access
const options = {
  key: fs.readFileSync('./server/ssl/key.pem', 'utf-8'),
  cert: fs.readFileSync('./server/ssl/cert.pem', 'utf-8')
}

const httpsServer = https.createServer(options, app)
httpsServer.listen(4000, () => {
  console.log('listening on port: ' + 4000)
})

const io = new Server(httpsServer, { cors: { origin: '*' } })

// socket.io namespace (could represent a room?)
const connections = io.of('/mediasoup')

/**
 * Worker
 * |-> Router(s)
 *     |-> Producer Transport(s)
 *         |-> Producer
 *     |-> Consumer Transport(s)
 *         |-> Consumer 
 **/
let workers = [];
let nextMediasoupWorkerIdx = 0;
let lastMediasoupWorkerIdx = 0;
let isAdmin = false
let rooms = {};          // { roomName1: { Router, rooms, chat: [ socketId1, ... ] }, ...}
let peers = {};          // { socketId1: { roomName1, socket, transports = [id1, id2,] }, producers = [id1, id2,] }, consumers = [id1, id2,], peerDetails }, ...}
let transports = [];     // [ { socketId1, roomName1, transport, consumer }, ... ]
let producers = [];      // [ { socketId1, roomName1, producer, }, ... ]
let consumers = [];      // [ { socketId1, roomName1, consumer, }, ... ]
let managerDevice = [];
let shareVideoId;
let shareAudioId;
const createWorkers = async () => {
  for(let i = 0; i < NoWorkers; i ++){
    let newWorker = await mediasoup.createWorker({
      rtcMinPort: 2000,
      rtcMaxPort: 3000,
    })
    console.log(`worker pid ${newWorker.pid}`)
    newWorker.on('died', error => {
      // This implies something serious happened, so kill the application
      console.error('mediasoup worker has died')
      setTimeout(() => process.exit(1), 2000) // exit in 2 seconds
    })
    workers.push(newWorker)
  }
}
function getMediasoupWorker() {
  const worker = workers[nextMediasoupWorkerIdx]
  lastMediasoupWorkerIdx = nextMediasoupWorkerIdx
  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0

  return worker
}
// We create a Worker as soon as our application starts
createWorkers(); 

// This is an Array of RtpCapabilities
// https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities/#RtpCodecCapability
// list of media codecs supported by mediasoup ...
// https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts
const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
      'x-google-start-bitrate': 1000,
      // 
    },
  },
]
connections.on('connection', async socket => {
  let worker = getMediasoupWorker();
  socket.emit('connection-success', {
    socketId: socket.id,
  }, (room) => {
    socket.join(room);
  })

  const removeItems = (items, socketId, type) => {
    items.forEach(item => {
      if (item.socketId === socket.id) {
        item[type].close()
      }
    })
    items = items.filter(item => item.socketId !== socket.id)

    return items
  }

  socket.on('disconnect', () => {
    // do some cleanup
    console.log('peer disconnected')
    consumers = removeItems(consumers, socket.id, 'consumer')
    producers = removeItems(producers, socket.id, 'producer')
    transports = removeItems(transports, socket.id, 'transport')

    if (!peers[socket.id]) return;
    const { roomName } = peers[socket.id];
    if(peers[socket.id].isScreenMedia){
      socket.to(roomName).emit('unshare-screen', {});
      shareAudioId = null;
      shareVideoId = null;
    }
    delete peers[socket.id]

    // remove socket from room
    rooms[roomName] = {
      router: rooms[roomName].router,
      peers: rooms[roomName].peers.filter(socketId => socketId !== socket.id),
      chat: rooms[roomName].chat
    }
    if (rooms[roomName].peers.length == 0){
      delete rooms[roomName];
    }
  })

  socket.on('joinRoom', async ({ roomName, name, avatar }, callback) => {
    // create Router if it does not exist
    // const router1 = rooms[roomName] && rooms[roomName].get('data').router || await createRoom(roomName, socket.id)
    // let allowJoin = false;
    const router1 = await createRoom(roomName, socket.id)
    // Object.values(peers).forEach(peer => {
    //   if(peer.roomName == roomName && peer.peerDetails.isAdmin){
    //     peer.socket.emit('joinRoomPermission',{ name: name }, ({allow})=>{
    //       if(allow){
    //         allowJoin = allow;
    //       }
    //     })
    //   }
    // })
    // console.log('asked done')
    // if(allowJoin || isAdmin){
      peers[socket.id] = {
        socket,
        roomName,           // Name for the Router this Peer joined
        transports: [],
        producers: [],
        consumers: [],
        peerDetails: {
          name: name,
          isAdmin: isAdmin,   // Is this Peer the Admin?
          avatar: avatar,
        },
      }
      isAdmin = false
      // get Router RTP Capabilities
      const rtpCapabilities = router1.rtpCapabilities
      // call callback from the client and send back the rtpCapabilities
      callback({ rtpCapabilities })
    // }else{
    //   rooms[roomName] = {
    //     router: router1,
    //     peers: rooms[roomName].peers.filter(peer => peer != socket.id),
    //   }
    //   callback({ allowJoin })
    // }
  })

  const createRoom = async (roomName, socketId) => {
    // worker.createRouter(options)
    // options = { mediaCodecs, appData }
    // mediaCodecs -> defined above
    // appData -> custom application data - we are not supplying any
    // none of the two are required
    let router1;
    let peers = [];
    let chat = [];
    if (rooms[roomName]) {
      router1 = rooms[roomName].router;
      peers = rooms[roomName].peers || [];
      chat = rooms[roomName].chat ? rooms[roomName].chat : [];
      nextMediasoupWorkerIdx = lastMediasoupWorkerIdx
    } else {
      router1 = await worker.createRouter({ mediaCodecs,allowIceRestart: true, });
      isAdmin = true
    }
    rooms[roomName] = {
      router: router1,
      peers: [...peers, socketId],
      chat: chat,
    }
    return router1
  }
  // socket.on('createRoom', async (callback) => {
  //   if (router === undefined) {
  //     // worker.createRouter(options)
  //     // options = { mediaCodecs, appData }
  //     // mediaCodecs -> defined above
  //     // appData -> custom application data - we are not supplying any
  //     // none of the two are required
  //     router = await worker.createRouter({ mediaCodecs, })
  //     console.log(`Router ID: ${router.id}`)
  //   }

  //   getRtpCapabilities(callback)
  // })

  // const getRtpCapabilities = (callback) => {
  //   const rtpCapabilities = router.rtpCapabilities

  //   callback({ rtpCapabilities })
  // }

  // Client emits a request to create server side Transport
  // We need to differentiate between the producer and consumer transports
  socket.on('createWebRtcTransport', async ({ consumer }, callback) => {
    // get Room Name from Peer's properties
    const roomName = peers[socket.id].roomName

    // get Router (Room) object this peer is in based on RoomName
    const router = rooms[roomName].router


    createWebRtcTransport(router).then(
      transport => {
        callback({
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          }
        })

        // add transport to Peer's properties
        addTransport(transport, roomName, consumer)
      },
      error => {
        console.log(error)
      })
  })

  const addTransport = (transport, roomName, consumer) => {

    transports = [
      ...transports,
      { socketId: socket.id, transport, roomName, consumer, }
    ]

    peers[socket.id] = {
      ...peers[socket.id],
      transports: [
        ...peers[socket.id].transports,
        transport.id,
      ]
    }
  }

  const addProducer = (producer, roomName, isScreenMedia) => {
    producers = [
      ...producers,
      { socketId: socket.id, producer, roomName, isScreenMedia}
    ]

    peers[socket.id] = {
      ...peers[socket.id],
      producers: [
        ...peers[socket.id].producers,
        producer.id,
      ],
      isScreenMedia: isScreenMedia,
    }
  }

  const addConsumer = (consumer, roomName) => {
    // add the consumer to the consumers list
    consumers = [
      ...consumers,
      { socketId: socket.id, consumer, roomName, }
    ]

    // add the consumer id to the peers list
    peers[socket.id] = {
      ...peers[socket.id],
      consumers: [
        ...peers[socket.id].consumers,
        consumer.id,
      ]
    }
  }

  socket.on('getProducers', callback => {
    //return all producer transports
    const { roomName } = peers[socket.id]

    let producerList = []
    producers.forEach(producerData => {
      //the producers list should not contain producers from emitter
      if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
        producerList = [...producerList, producerData.producer.id]
      }
    })

    // return the producer list back to the client
    callback(producerList)
  })

  const informConsumers = (roomName, socketId, id) => {
    console.log(`just joined, id ${id} ${roomName}, ${socketId}`)
    // A new producer just joined
    // let all consumers to consume this producer
    producers.forEach(producerData => {
      if (producerData.socketId !== socketId && producerData.roomName === roomName) {
        const producerSocket = peers[producerData.socketId].socket
        // use socket to send producer id to producer
        producerSocket.emit('new-producer', { producerId: id })
      }
    })
  }

  const getTransport = (socketId) => {
    const [producerTransport] = transports.filter(transport => transport.socketId === socketId && !transport.consumer)
    return producerTransport.transport
  }

  // see client's socket.emit('transport-connect', ...)
  socket.on('transport-connect', ({ dtlsParameters }) => {
    // console.log('DTLS PARAMS... ', { dtlsParameters })

    getTransport(socket.id).connect({ dtlsParameters })
  })

  // see client's socket.emit('transport-produce', ...)
  socket.on('transport-produce', async ({ kind, rtpParameters, appData, isScreenMedia}, callback) => {
    // call produce based on the prameters from the client
    const producer = await getTransport(socket.id).produce({
      kind,
      rtpParameters,
    })

    // add producer to the producers array
    const { roomName } = peers[socket.id]

    console.log(isScreenMedia);

    addProducer(producer, roomName, isScreenMedia)

    if(kind === 'video' && isScreenMedia) shareVideoId = producer.id;
    if(kind === 'audio' && isScreenMedia) shareAudioId = producer.id;

    informConsumers(roomName, socket.id, producer.id)

    console.log('Producer ID: ', producer.id, producer.kind)
    const producerId = producer.id;

    producer.on('transportclose', () => {
      console.log('transport for this producer closed ')
      producer.close()
    })

    // Send back to the client the Producer's id
    callback({
      id: producer.id,
      producersExist: producers.length > 1 ? true : false,
      kind: producer.kind,
    })
  })

  socket.on('start-raise-hand', ({videoId}) => {
    const { roomName } = peers[socket.id];

    // Broadcast the 'raise-hand' event to all clients in the same room
    socket.to(roomName).emit('raise-hand', {videoId });
    const matchingDevice = managerDevice.find(item => item.id === videoId);

    if (matchingDevice) {
      matchingDevice.raiseHand = true;
    }
  })

  socket.on('start-down-hand', ({videoId}) => {
    const { roomName } = peers[socket.id];

    // Broadcast the 'raise-hand' event to all clients in the same room
    socket.to(roomName).emit('down-hand', { videoId });
    const matchingDevice = managerDevice.find(item => item.id === videoId);

    if (matchingDevice) {
      matchingDevice.raiseHand = false;
    }
  })

  socket.on("start-pause-video", ({ videoId }) => {
    const { roomName } = peers[socket.id];

    // Broadcast the 'raise-hand' event to all clients in the same room
    socket.to(roomName).emit('pause-video', { videoId });
    const matchingDevice = managerDevice.find(item => item.id === videoId);

    if (matchingDevice) {
      matchingDevice.activeVideo = false;
    }
  })

  socket.on("start-unshare-screen", () => {
    console.log('stop unshare screen');
    const { roomName } = peers[socket.id];
    producers.forEach(pro => {
      if(pro.producer.id == shareVideoId || pro.producer.id == shareAudioId){
        pro.producer.close();
      }
    })
    producers = producers.filter(pro => pro.producer.id != shareVideoId &&  pro.producer.id != shareAudioId)
    Object.values(peers).forEach(peer => {
      if(peer.socket.id == socket.id){
        peer.producers.filter(id => id != shareVideoId && id !=  shareAudioId)
      }
    })
    socket.to(roomName).emit('unshare-screen', {});
    shareAudioId = null;
    shareVideoId = null;
  })

  socket.on("start-resume-video", ({ videoId }) => {
    const { roomName } = peers[socket.id];

    // Broadcast the 'raise-hand' event to all clients in the same room
    socket.to(roomName).emit('resume-video', { videoId });
    const matchingDevice = managerDevice.find(item => item.id === videoId);

    if (matchingDevice) {
      matchingDevice.activeVideo = true;
    }
  })

  socket.on("start-pause-audio", ({ videoId, audioId }) => {
    const { roomName } = peers[socket.id];

    // Broadcast the 'raise-hand' event to all clients in the same room
    socket.to(roomName).emit('pause-audio', { videoId });
    const matchingDevice = managerDevice.find(item => item.id === videoId);

    if (matchingDevice) {
      matchingDevice.activeAudio = false;
    }
  })

  socket.on('start-send-emotion', ({ emotion }) => {
    const { roomName } = peers[socket.id];

    // Broadcast the 'raise-hand' event to all clients in the same room
    connections.to(roomName).emit('send-emotion', {emotion});
  })

  socket.on("start-resume-audio", ({ videoId, audioId }) => {
    const { roomName } = peers[socket.id];

    // Broadcast the 'raise-hand' event to all clients in the same room
    socket.to(roomName).emit('resume-audio', { videoId });
    const matchingDevice = managerDevice.find(item => item.id === videoId);

    if (matchingDevice) {
      matchingDevice.activeAudio = true;
    }
  })

  // see client's socket.emit('transport-recv-connect', ...)
  socket.on('transport-recv-connect', async ({ dtlsParameters, serverConsumerTransportId }) => {
    // console.log(`DTLS PARAMS: ${dtlsParameters}`)
    const consumerTransport = transports.find(transportData => (
      transportData.consumer && transportData.transport.id == serverConsumerTransportId
    )).transport
    await consumerTransport.connect({ dtlsParameters })
  })

  socket.on('consume', async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) => {
    try {
      const { roomName } = peers[socket.id]
      const router = rooms[roomName].router
      let consumerTransport = transports.find(transportData => (
        transportData.consumer && transportData.transport.id == serverConsumerTransportId
      )).transport
      // check if the router can consume the specified producer
      if (router.canConsume({
        producerId: remoteProducerId,
        rtpCapabilities
      })) {
        // transport can now consume and return a consumer
        const consumer = await consumerTransport.consume({
          producerId: remoteProducerId,
          rtpCapabilities,
          paused: true,
        })

        consumer.on('transportclose', () => {
          console.log('transport close from consumer')
        })

        consumer.on('producerclose', () => {
          console.log('producer of consumer closed')
          socket.emit('producer-closed', { remoteProducerId })
          consumerTransport.close([])
          transports = transports.filter(transportData => transportData.transport.id !== consumerTransport.id)
          consumer.close()
          consumers = consumers.filter(consumerData => consumerData.consumer.id !== consumer.id)
        })

        addConsumer(consumer, roomName)

        let audioScreen = false;
        let videoScreen = false;

        if(remoteProducerId == shareAudioId) audioScreen = true;
        if(remoteProducerId == shareVideoId) videoScreen = true;
        let remoteProducerPeer;
        Object.values(peers).forEach(peer => {
          if(peer.producers.some(id => id == remoteProducerId)){
            remoteProducerPeer = peer
          }
        })
        const params = {
          id: consumer.id,
          producerId: remoteProducerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          serverConsumerId: consumer.id,
          activeAudio: true,
          activeVideo: true,
          audioScreen,
          videoScreen,
          userName: remoteProducerPeer ? remoteProducerPeer.peerDetails.name : null,
          isAdmin: remoteProducerPeer ? remoteProducerPeer.peerDetails.isAdmin : null,
          avatar: remoteProducerPeer ? remoteProducerPeer.peerDetails.avatar : null,
          
        }

        const matchingDevice = managerDevice.find(item => item.id == remoteProducerId);

        if (matchingDevice) {
          params.activeAudio = matchingDevice.activeAudio;
          params.activeVideo = matchingDevice.activeVideo;
          params.raiseHand = matchingDevice.raiseHand;
        } else {
          managerDevice.push({ id: remoteProducerId, activeVideo: true, activeAudio: true, raiseHand: false });
        }


        // from the consumer extract the following params
        // to send back to the Client

        // send the parameters to the client
        callback({ params })
      }
    } catch (error) {
      console.log(error.message)
      callback({
        params: {
          error: error
        }
      })
    }
  })

  socket.on('consumer-resume', async ({ serverConsumerId }) => {
    console.log('consumer resume')
    const { consumer } = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId)
    await consumer.resume()
  })
  socket.on('sendChat', ({message,room})=>{
    if(message && room){
      try{
        rooms[room].chat = [
          ...rooms[room].chat,
          {
            socket: socket.id,
            message: message,
            avatar: peers[socket.id].peerDetails.avatar,
            name: peers[socket.id].peerDetails.name,
            time: new Date().getTime(),
          },
        ]
      }
      catch(error){
        console.log(rooms[room]);
        console.log(error);
      }
    }
    rooms[room].peers.forEach(id => {
      if(peers[id] && rooms[room]){
        peers[id].socket.emit('receiveChat', {chat : rooms[room].chat});
      }
    })
  })
  socket.on('getChat', ({room})=>{
    socket.emit('receiveChat', {chat : rooms[room] ? rooms[room].chat : []})
  })
})

const createWebRtcTransport = async (router) => {
  return new Promise(async (resolve, reject) => {
    try {
      // https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
      const webRtcTransport_options = {
        listenIps: [
          {
            ip: '0.0.0.0', // replace with relevant IP address
            announcedIp: '****',
          }
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      }

      // https://mediasoup.org/documentation/v3/mediasoup/api/#router-createWebRtcTransport
      let transport = await router.createWebRtcTransport(webRtcTransport_options)

      transport.on('dtlsstatechange', dtlsState => {
        if (dtlsState === 'closed') {
          transport.close()
        }
      })

      transport.on('close', () => {
        console.log('transport closed')
      })

      resolve(transport)

    } catch (error) {
      reject(error)
    }
  })
}