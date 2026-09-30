// import { VideoBox, VideoListBox, VideoInfoBox } from './VideoBox.jsx';
import VideoBox from './VideoBox.jsx'; 
import VideoListBox from './VideoListBox.jsx';
import VideoInfoBox from './VideoInfoBox.jsx';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';
import AiButton from './AiButton.jsx'; 
import AiPage from '../pages/AiPage';
import NoResults from './NoResults.jsx';
import Loader from './Loader.jsx';
import SaveButton from './SaveButton.jsx';
import { getSavedWords, saveWord, removeSavedWord } from '../api/savedWords';



function Results({ onSearch }) {
// resives api data and gives to its children: VideoListBox - position/count, VideoBox - current video data.
    const { word } = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoData, setVideoData] = useState({ results: [] }); 
    const [loading, setLoading] = useState(true);   // to show loading message while fetching data from API
    const [aiResults, setAiResults] = useState(false);
    const [savedClip, setSavedClip] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => { 
            console.log('WORD', word);
            setLoading(true);
            try {
                const responce = await fetch(`/api/search?word=${encodeURIComponent(word)}`, {
                    method: 'POST',
                });
                
                if (!responce.ok) {
                    const body = await responce.json().catch(() => ({}));
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
        setCurrentIndex(0);
    }, [word]);

    useEffect(() => {
        let ignore = false;
        getSavedWords()
            .then((list) => {
                if (!ignore) setSavedClip(list.find((w) => w.word === word.toLowerCase()) ?? null);
            })
            .catch(() => {
                if (!ignore) setSavedClip(null);
            });
        return () => { ignore = true; };
    }, [word]);

    const currentVideo = videoData.results[currentIndex];
    const isSaved = Boolean(
        savedClip && currentVideo &&
        savedClip.videoId === currentVideo.videoId &&
        savedClip.start === currentVideo.seekSec
    );

    async function handleSaveClick() {
        if (!currentVideo || saving) return;
        setSaving(true);
        try {
            if (isSaved) {
                await removeSavedWord(savedClip._id);
                setSavedClip(null);
            } else {
                const saved = await saveWord({
                    word,
                    sentence: currentVideo.text,
                    videoId: currentVideo.videoId,
                    start: currentVideo.seekSec,
                });
                setSavedClip(saved);
            }
        } catch (e) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    }

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

                <VideoBox currentVideo={currentVideo} />
                <div className="mt-4 flex w-full justify-end">
                    <SaveButton isSaved={isSaved} disabled={saving} onClick={handleSaveClick} />
                </div>
                <VideoInfoBox currentVideo={currentVideo} word={word} />
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

