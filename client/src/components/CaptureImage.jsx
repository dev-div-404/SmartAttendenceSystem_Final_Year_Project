import React, { useState, useRef } from 'react';
import BinLogo from './bin.svg';

const RecordVideo = (props) => {

  const capturedImages = props.capturedImages;
  const  setCapturedImages = props.setCapturedImages;
  const videoStream = props.videoStream;
  const setVideoStream = props.setVideoStream
  
  const videoRef = useRef();
  const [videoOn, setVideoOn] = useState(false);
  const [videoToggleStatus, setVideoToggleStatus] = useState('Open');
  const [imgCount, setImgCount] = useState(0);

  // Function to start the live video stream

  const toggleVideo = () =>{
    if(videoOn){
      if (videoStream) { 
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
        setVideoOn(false);
        setVideoToggleStatus('Open')
      }
    }else{
      navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setVideoStream(stream);
        setVideoOn(true);
        setVideoToggleStatus('Close')
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
    }
  }

  // Function to capture image from the video stream
  const captureImage = () => {
    if(imgCount === 10){
      alert('Only 10 is required');
      return;
    }
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/png');
    setCapturedImages([...capturedImages, imageUrl]);
    setImgCount(imgCount + 1);
    // console.log(capturedImages);
  };


  // Function to delete captured image
  const deleteImage = (index) => {
    const newImages = [...capturedImages];
    newImages.splice(index, 1);
    setCapturedImages(newImages);
    setImgCount(imgCount - 1);
  };


  return (
    <div>
      <div className='video-status-container'>
          <div>
              <button className='camera-open-close-button' onClick={toggleVideo}>
                  {videoToggleStatus} Camera
              </button>
          </div>
          <div style={{fontWeight : 'bold'}}>
            {imgCount} / 10
          </div>
      </div>
      <div className='video-container'>
          <div className='video-container-content'>
            <div className='live-video-image-capture'>
              <video ref={videoRef} autoPlay muted className='live-video'></video>
            </div>
            <button onClick={captureImage} className='captute-image-btn' disabled = {!videoOn}>
                click
            </button>
          </div>
          <div className='captured-photo-container'>
              <div className="image-list">
                {capturedImages.map((imageUrl, index) => (
                  <div key={index} className="image-item">
                    <div className='indivisual-image-container'>
                      <div className='index-tsxt'>{index + 1}</div>
                      <img src={imageUrl} alt={`Captured ${index}`} className='single-image'/>                      
                          <img src={BinLogo} alt='delete' onClick={() => deleteImage(index)} className='delete-image-btn'/>
                    </div>
                  </div>
                ))}
            </div>
          </div>
      </div>
    </div>
  )
}

export default RecordVideo