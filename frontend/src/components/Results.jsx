import { VideoBox, VideoListBox, VideoInfoBox } from './VideoBox.jsx';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';
import AiButton from './AiButton.jsx'; 
import AiPage from '../pages/AiPage';
import NoResults from './NoResults.jsx';
import Loader from './Loader.jsx';



function Results({ onSearch }) {
// resives api data and gives to its children: VideoListBox - position/count, VideoBox - current video data.
    const { word } = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoData, setVideoData] = useState({ results: [] }); 
    const [loading, setLoading] = useState(true);   // to show loading message while fetching data from API
    const [aiResults, setAiResults] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => { 
            console.log('WORD', word);
            setLoading(true);
            try {
                const responce = await fetch(`http://localhost:4000/api/search?word=${word}`, {
                    method: 'POST',
                });
                
                if (!responce.ok) {
                    const body = await response.json().catch(() => ({}));
                    throw new Error(body.error || "Could not fetch videos");
                }
                const data = await responce.json();

                const filteredVideos = data.results.filter((item, index, self) =>
                index === self.findIndex(v => v.videoId === item.videoId)
                );


                setVideoData({ ...data, results: filteredVideos });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching videos:", error);
                setVideoData({ results: [] });
                setLoading(false);
            };
        };
        fetchVideos();
    }, [word]);

    useEffect(() => {
        setAiResults(false);
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

    const noResults = !loading && videoData.results.length === 0;
    const hasResults = !loading && videoData.results.length > 0;
    const showAi = aiResults || noResults;

    return ( 
        <>
        {/* searching in process: */}
        {loading && <Loader word={word} type="videos" />}

        {/* search returns empty list: */}
        {noResults && (
            <>
            <NoResults word={word} onSearch={onSearch} />
            {showAi && <AiPage word={word} />}      
            </>
        )}
        
        {/* search returns video: */}
        {hasResults && (
            <div className="flex flex-col items-center p-0 w-180 flex-none order-1 self-center grow-0 mb-35">
                <VideoListBox 
                    currentIndex = {currentIndex}
                    totalVideos = {videoData.results.length}
                    clickPrev = {clickPrev}
                    clickNext = {clickNext} />

                <VideoBox currentVideo = {videoData.results[currentIndex]}/>
                <VideoInfoBox currentVideo = {videoData.results[currentIndex]} word={word}/>
                <p className="font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5A5550] self-stretch mt-8 p-1">
                    Search for the next word or phrase:</p>
                <SearchBox onSearch={onSearch}/> 
                <AiButton handler={handleAiResultsClick}/>
                {aiResults && <AiPage word={word}/> }
            </div> 
        )}
        </>
    )
} 

export default Results;

