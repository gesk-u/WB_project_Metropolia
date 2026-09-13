

function VideoListBox({ currentIndex, totalVideos, clickPrev, clickNext}) {
    //it is NAVIGATION CONTROL through the video list.
    //shows current index of video and total number of found videos.
    // has buttons to navigate through the list of videos. 

    // RECIVES: 1-current position, 2- total amount of videos

    return (
        <div className="flex flex-row justify-between items-center
         p-0 w-[720px] h-9 flex-none order-none self-center grow-0 shadow-lg">

            <p className="font-['JetBrains_Mono'] font-normal not-italic text-[15px] 
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

function VideoBox({ currentVideo }) {
    const { videoId, startSec, text, seekSec, url } = currentVideo;
    // is a CONTENT DISPLAY - its main job - to show current video.
    // also it lists info about video: (title, timestamp, transcript quote, iframe)
    // RECIVES: current video data,
    return (
        <div className="w-[720px] h-[350px] bg-black flex-none 
        order-none self-center grow-0 mt-5">  

        <iframe
            width="720"
            height="350"
            src={`https://www.youtube.com/embed/${videoId}?start=${seekSec}`} 
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        ></iframe>

        </div>
    ) 
}

function VideoInfoBox({currentVideo}) {
    const { videoId, startSec, text, seekSec, url } = currentVideo;
    //idea:
   // some video - https://www.youtube.com/watch?v=z7_pVrIshxA
    // take last part after v= , that is z7_pVrIshxA
    // add it to https://www.youtube.com/embed/ + that last part =
    // embedded player https://www.youtube.com/embed/z7_pVrIshxA

    return (
        <div className="box-border flex flex-col items-start py-5 px-6 w-[720px] h-[146.63px]
         bg-white border border-[#DDD8D0] rounded-md flex-none order-none self-stretch grow-0 mt-5"> 
 
                    <p className="w-[342px] h-[23px] font-['Outfit'] font-medium not-italic 
                    text-xl leading-[22.4px] tracking-[0px] text-[#2E2B27] flex-none 
                    order-none grow-0">{text}</p>
                    <p>{`${Math.floor(startSec / 60)}:${Math.floor(startSec % 60).toString().padStart(2, '0')}`}</p>

            </div>
    )
}
export {VideoBox, VideoListBox, VideoInfoBox};
//     {
//       videoId: "d8F7SJqH79g",
//       startSec: 16.28,
//       text: "Pääseekö koira tän teipin läpi No pääset",
//       seekSec: 14,
//       url: "https://youtube.com/watch?v=d8F7SJqH79g&t=14s"
//     },