function VideoListBox({ currentIndex, totalVideos, clickPrev, clickNext}) {
    //it is NAVIGATION CONTROL through the video list.
    //shows current index of video and total number of found videos.
    // has buttons to navigate through the list of videos. 

    // RECIVES: 1-current position, 2- total amount of videos

    return (
        <div className="flex flex-row justify-between items-center p-0 w-[720px] h-9 flex-none order-none self-center grow-0 mt-2">

            <p className="font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16.5px] tracking-[0.88px] uppercase text-[#5A5550]">
                video {currentIndex+1} of {totalVideos}</p>

            <div className="flex flex-row items-center gap-2">
                <button onClick={clickPrev} className="box-border flex flex-row justify-center items-center p-0 w-11 h-11 bg-[#F4F1EC] border-2 border-[#C4BFB8] rounded-sm flex-none order-none grow-0 hover:bg-[#DDD8D0] hover:border-[#8C8680] transition-colors">
                    ←</button>
                <button onClick={clickNext} className="box-border flex flex-row justify-center items-center p-0 w-11 h-11 bg-[#F4F1EC] border-2 border-[#C4BFB8] rounded-sm flex-none order-none grow-0 hover:bg-[#DDD8D0] hover:border-[#8C8680] transition-colors">
                    →</button>
            </div>
          </div>
    ) 
}

export default VideoListBox;