// VideoRecorder.js
import React, { useState } from 'react';
import { MediaRecorder } from 'react-media-recorder';
import { useMediaRecorder } from 'react-media-recorder'

const RecordVideo = ({ onVideoRecorded }) => {
  const [recordedVideo, setRecordedVideo] = useState(null);
  const { startRecording, stopRecording, mediaBlob } = useMediaRecorder({ video: true });

  const handleRecordingStop = () => {
    setRecordedVideo(mediaBlob);
  };

  const handleSaveVideo = () => {
    // You can perform additional logic here before sending the video to the server
    onVideoRecorded(recordedVideo);
  };

  return (
    <div>
      <MediaRecorder onRecordingComplete={handleRecordingStop} />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {recordedVideo && <video src={recordedVideo.blobURL} controls />}
      <button onClick={handleSaveVideo}>Save Video</button>
    </div>
  );
};

export default RecordVideo;
