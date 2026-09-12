import { VideoBox, VideoListBox } from './VideoBox.jsx';
import React, { useState } from 'react';
import {videoData} from './videoData.js'; //hardcoded videolist.


function Results() {
// resives api data and gives to its children:
    // VideoListBox - position/count
    //VideoBox - current video data.
    const [currentIndex, setCurrentIndex] = useState(0);

    //finctions to navigate through the video list <= or =>:
    const clickPrev = () => {
        if (currentIndex > 0) {
        setCurrentIndex(prevIndex => prevIndex -1);
        }
    } 

    const clickNext = () => {
        if (currentIndex < videoData.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
        }
    } 

    // console.log(videoData.length);

    return (
        <div className="flex flex-col items-center p-0 w-[65vw] flex-none
            order-1 self-center grow-0 shadow-lg"> {/* shadow-lg -for my visibility. */}
            <p>I am the results container</p>
            <VideoListBox
            currentIndex = {currentIndex}
            totalVideos = {videoData.length}
            clickPrev = {clickPrev}
            clickNext = {clickNext} />

            <VideoBox currentVideo = {videoData[currentIndex]}/>
            
        </div>
    )
} 

export default Results;

