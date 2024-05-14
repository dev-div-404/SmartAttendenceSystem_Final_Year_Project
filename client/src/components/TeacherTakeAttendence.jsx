import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const TeacherTakeAttendence = (props) => {

    //getting the props
    const classname = props.classname;
    const t_id = props.t_id;
    const setPresentStudents = props.setPresentStudents;
    const setOption = props.setOption;
    const setSubCode = props.setSubCode;
    const subCode = props.subCode;

    const [takingAttendence, setTakingAttendence] = useState(false)

    const axiosInstance = axios.create({
        withCredentials : true
    })

    //for live video
    const [videoStream, setVideoStream] = useState(null);

    const videoRef = useRef();
    const [videoOn, setVideoOn] = useState(false);

    const toggleVideo = () =>{
        if(videoOn){
            if (videoStream) { 
                videoStream.getTracks().forEach(track => track.stop());
                setVideoStream(null);
                setVideoOn(false);
            }
        }else{
            navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
                .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setVideoStream(stream);
                setVideoOn(true);
            })
            .catch((error) => {
                console.error('Error accessing the camera:', error);
            });
        }
    }

    const captureImage = async () => {
        try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
    
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
            const imageUrl = canvas.toDataURL('image/png');
            return imageUrl
        } catch (error) {
            console.error('Error capturing image:', error); // Log any errors that occur
            return null;
        }
    };
    

    const changeSubjectCodeHandler = (event) => {
        setSubCode(event.target.value);
    }

    const takeAttendance = async () =>{
        const image = await captureImage();
        console.log('attendence is being taken');
        await axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/takeattendence`,{t_id : t_id, classid : classname, image : image, subCode : subCode}).then(res =>{
            const presentRolls = res.data.present;
            setPresentStudents([...presentRolls]);
        }).catch(err => console.log(err))
    }

    useEffect(()=>{
        let intervalId;

        if (takingAttendence) {
            intervalId = setInterval(takeAttendance, 15 * 1000); // Start your function every 20 seconds
        }
        return () =>{
            clearInterval(intervalId); // This will be executed when this component unmount
        };// eslint-disable-next-line react-hooks/exhaustive-deps
    },[takingAttendence])
    

    const startAttendenceHandler = () => {
        toggleVideo();
        setTakingAttendence(true);
    }

    const stopAttendenceHandler = () => {
        toggleVideo();
        setTakingAttendence(false);
        setOption('submit')
    }

    return (
        <div id='teacher-take-attendance'>
            <div id='teacher-attendence-header'>
                <input type='text' placeholder="Subject code"  className='teacher-attendence-header-child' onChange={changeSubjectCodeHandler} disabled = {takingAttendence}/>
                <button className='teacher-attendence-header-child start-attendence-btn' disabled = {subCode === '' || takingAttendence} onClick={startAttendenceHandler}>Start Attendence</button>
                <button className='teacher-attendence-header-child stop-attendence-btn' disabled = {!takingAttendence} onClick={stopAttendenceHandler}>Stop Attendence</button>
            </div>
            <div id='teacher-taking-attencence-video-container'>
                <video ref={videoRef} autoPlay muted className='live-video' id='video-self'></video>
            </div>
        </div>
    )
}

export default TeacherTakeAttendence
