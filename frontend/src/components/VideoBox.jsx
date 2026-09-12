

function VideoListBox({ currentIndex, totalVideos, clickPrev, clickNext}) {
    //it is NAVIGATION CONTROL through the video list.
    //shows current index of video and total number of found videos.
    // has buttons to navigate through the list of videos. 

    // RECIVES: 1-current position, 2- total amount of videos
    return (
        <div className="flex flex-row justify-between items-center
         p-0 w-[60vw] h-9 flex-none order-none self-center grow-0 shadow-lg">

            <p className="font-['JetBrains_Mono'] font-normal not-italic text-[11px] 
            leading-[16.5px] tracking-[0.88px] uppercase text-[#8C8680]">
                video {currentIndex+1} of {totalVideos}</p>

            <button onClick={clickPrev} className="box-border flex flex-row justify-center
                items-center p-0 w-9 h-9 bg-[#F4F1EC] border border-[#DDD8D0] rounded-sm 
                flex-none order-none grow-0">←</button>
            <button onClick={clickNext} className="box-border flex flex-row justify-center
                items-center p-0 w-9 h-9 bg-[#F4F1EC] border border-[#DDD8D0] rounded-sm 
                flex-none order-none grow-0">→</button>
          </div>
    ) 
} 

function VideoBox(currentVideo) {
    // is a CONTENT DISPLAY - its main job - to show current video.
    // also it lists info about video: (title, timestamp, transcript quote, iframe)
    // RECIVES: current video data,
    return (
            <div className="flex flex-col items-start pt-5 w-[60vw] h-[370px] 
                flex-none order-1 self-center grow-0 shadow-lg"> 

                    <h1>I am a video box</h1>
            </div>
    )
}


export {VideoBox, VideoListBox};