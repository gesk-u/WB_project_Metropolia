import { VideoBox, VideoListBox, VideoInfoBox } from './VideoBox.jsx';
import React, { useState } from 'react';
import {videoData} from './videoData.js'; //hardcoded videolist.




//   query: "koira",
//   lemma: "",
//   total: 48,
//   page: 1,
//   pageSize: 100,
//   results: [
//     {
//       videoId: "d8F7SJqH79g",
//       startSec: 16.28,
//       text: "Pääseekö koira tän teipin läpi No pääset",
//       seekSec: 14,
//       url: "https://youtube.com/watch?v=d8F7SJqH79g&t=14s"
//     },

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
        if (currentIndex < videoData.results.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
        }
    } 

    console.log(videoData.results.length);
    console.log(videoData.results[currentIndex]);

    return ( 
        <div className="flex flex-col items-center p-0 w-[720px] flex-none
            order-1 self-center grow-0 shadow-lg"> {/* shadow-lg -for my visibility. */}
            <p>I am the results container</p>
            <VideoListBox
            currentIndex = {currentIndex}
            totalVideos = {videoData.results.length}
            clickPrev = {clickPrev}
            clickNext = {clickNext} />

            <VideoBox currentVideo = {videoData.results[currentIndex]}/>
            <VideoInfoBox currentVideo = {videoData.results[currentIndex]}/>
        </div>
    )
} 

export default Results;

