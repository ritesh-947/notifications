import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Button, IconButton, Box } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import './WebRTCVideoCall.css';

console.log('a');
const WebRTCVideoCall = ({ roomId }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isRemoteDescriptionSet, setIsRemoteDescriptionSet] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
const serverURL =
  process.env.NODE_ENV === 'production'
    ? 'https://videocall-server-wk4x.onrender.com' // Production server
    : 'http://localhost:3014'; // Development server

const socket = useRef(io(serverURL, { transports: ['websocket'] }));


  // Initialize WebRTC connection
  useEffect(() => {
    console.log('[WebRTC] Joining room:', roomId);
    socket.current.emit('join', roomId);

    socket.current.on('signal', handleSignalingData);
    socket.current.on('reconnect', () => {
      console.log('[WebRTC] Reconnected to server');
      socket.current.emit('join', roomId);
    });

    return () => {
      endCall();
      socket.current.disconnect();
    };
  }, [roomId]);

  // Handle signaling messages
  const handleSignalingData = async (data) => {
    if (!peerConnectionRef.current) return;
  
    try {
      if (data.type === 'offer' && !isRemoteDescriptionSet) {
        setIsRemoteDescriptionSet(true); // Set flag to true
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.current.emit('signal', { type: 'answer', answer, roomId });
      } else if (data.type === 'answer') {
        if (peerConnectionRef.current.signalingState === 'have-local-offer') {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      } else if (data.type === 'ice') {
        if (peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.ice));
        }
      }
    } catch (error) {
      console.error('[WebRTC] Error handling signaling data:', error);
    }
  };

  // Start call
  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      console.log('[WebRTC] Local stream obtained');

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      // Add tracks
      stream.getTracks().forEach((track) => peerConnectionRef.current.addTrack(track, stream));

      peerConnectionRef.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit('signal', { type: 'ice', ice: event.candidate, roomId });
        }
      };

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.current.emit('signal', { type: 'offer', offer, roomId });
      console.log('[WebRTC] Offer sent');
    } catch (error) {
      console.error('[WebRTC] Error starting call:', error);
    }
  };

  // End call
  const endCall = () => {
    peerConnectionRef.current?.close();
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    peerConnectionRef.current = null;
    console.log('[WebRTC] Call ended');
  };

  // Toggle video/mic
  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev);
    localStream?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  };

  const toggleMic = () => {
    setAudioEnabled((prev) => !prev);
    localStream?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  };

  // Attach streams to video refs
  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  return (
    <div className={`c1-video-container ${isMaximized ? 'c1-maximized' : ''}`}>
      {/* Remote Video */}
      <div className={`c1-remote-video-wrapper ${isMaximized ? 'c1-maximized-remote' : ''}`}>
        <video ref={remoteVideoRef} className="c1-remote-video" autoPlay playsInline></video>
      </div>
  
      {/* Local Video */}
      <div className={`c1-local-video-wrapper ${isMaximized ? 'c1-floating-local-video' : ''}`}>
        <video ref={localVideoRef} className="c1-local-video" autoPlay muted playsInline></video>
      </div>
  
      {/* Controls */}
      <Box className="c1-controls-container">
        <Button
          variant="contained"
          color="primary"
          startIcon={<CallIcon />}
          onClick={startCall}
        >
          Start Call
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CallEndIcon />}
          onClick={endCall}
        >
          End Call
        </Button>
        <IconButton
          onClick={toggleVideo}
          color={videoEnabled ? 'primary' : 'default'}
        >
          {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>
        <IconButton
          onClick={toggleMic}
          color={audioEnabled ? 'primary' : 'default'}
        >
          {audioEnabled ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        <IconButton
          onClick={() => setIsMaximized((prev) => !prev)}
          color={isMaximized ? 'secondary' : 'primary'}
        >
          {isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>
    </div>
  );
};

export default WebRTCVideoCall;