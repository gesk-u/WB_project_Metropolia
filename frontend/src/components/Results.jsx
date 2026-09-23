import { VideoBox, VideoListBox, VideoInfoBox } from './VideoBox.jsx';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';
import AiButton from './AiButton.jsx'; 
import AiPage from '../pages/AiPage';


function Results() {
// resives api data and gives to its children: VideoListBox - position/count, VideoBox - current video data.
    const { word } = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoData, setVideoData] = useState({ results: [] }); 
    const [loading, setLoading] = useState(true);   // to show loading message while fetching data from API
    const [aiResults, setAiResults] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => { 
            console.log('WORD', word);
            // setLoading(true);
            // if (loading) return <p>Loading...</p>;
            try {
                const responce = await fetch(`http://localhost:4000/api/search?word=${word}`, {
                    method: 'POST',
                });
                
                if (!responce.ok) throw new Error("Could not fetch vidoes from API");
                const data = await responce.json();

                const filteredVideos = data.results.filter((item, index, self) =>
                index === self.findIndex(v => v.videoId === item.videoId)
                );


                setVideoData({ ...data, results: filteredVideos });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching videos:", error);
                setLoading(false);
            };
        };
        fetchVideos();
    }, [word]);

    // Handle AI results button
    const handleAiResultsClick = () => {
        setAiResults((prevAiResults) => !prevAiResults)
    }

    
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

    console.log(videoData.results);
    console.log(videoData.results[currentIndex]);
    // if (loading) return <p>Loading...</p>;
    if (loading) return <p>Loading...</p>;
    if (videoData.results.length === 0) {
        setAiResults(true)
        return (
            <>
                <p>No results found for "{word}"</p>
                <AiButton results={aiResults}/>
            </>
        
    )}
    return ( 
        <div className="flex flex-col items-center p-0 w-[720px] flex-none order-1 self-center grow-0">
            
            <VideoListBox
            currentIndex = {currentIndex}
            totalVideos = {videoData.results.length}
            clickPrev = {clickPrev}
            clickNext = {clickNext} />

            <VideoBox currentVideo = {videoData.results[currentIndex]}/>
            <VideoInfoBox currentVideo = {videoData.results[currentIndex]} word={word}/>
            <p className="w-full h-[24px] font-['Outfit'] font-light not-italic text-base leading-[24px] text-center text-[#8C8680] text-[20px] flex-none order-none grow-0">Search for the next phrase:</p>
            {/* <SearchBox onSearch={handleSearch}/> */}
            <AiButton handler={handleAiResultsClick}/>
            {aiResults && <AiPage word={word}/> }
        </div>
    )
} 

export default Results;

