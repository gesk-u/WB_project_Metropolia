

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

function VideoInfoBox({currentVideo, word}) {
    const { text, startSec} = currentVideo;
    //idea:
   // some video - https://www.youtube.com/watch?v=z7_pVrIshxA
    // take last part after v= , that is z7_pVrIshxA
    // add it to https://www.youtube.com/embed/ + that last part =
    // embedded player https://www.youtube.com/embed/z7_pVrIshxA

    const timestamp = `${Math.floor(startSec / 60)}:${Math.floor(startSec % 60).toString().padStart(2, '0')}`;
    const parts = text.split(new RegExp(`(${word})`, 'gi'));
    
    return (
        <div className="box-border flex flex-row items-start gap-3 py-5 px-6 w-[720px]
            bg-white border border-[#DDD8D0] rounded-md flex-none order-none self-stretch grow-0 mt-5">

            <div className="order-1 flex flex-col items-start px-[10px] py-1 bg-[#7A9E8E] rounded-sm flex-none">
                <p className="font-['JetBrains_Mono'] font-semibold text-xs leading-[18px] tracking-[0.6px] text-white">
                    ▶ {timestamp}
                </p>
            </div>

            <div className="flex flex-col items-start flex-1">
                <div className="box-border flex flex-col items-start py-[10.4px] px-4 w-full
                    bg-[#F4F1EC] border-l-[3px] border-[#7A9E8E] rounded-r-[3px]">
                    <p className="font-['Outfit'] font-normal text-[20px] leading-[23px] text-[#5A5550]">
                        "{parts.map((part, i) =>
                            part.toLowerCase() === word.toLowerCase() ? (
                                <span
                                    key={i}
                                    className="bg-[rgba(122,158,142,0.145)] rounded-sm font-semibold text-[#5E8272]"
                                >
                                    {part}
                                </span>
                            ) : (
                                <span key={i}>{part}</span>
                            )
                        )}"
                    </p>
                </div>
            </div>
        </div>
    );
}
export {VideoBox, VideoListBox, VideoInfoBox};
//     {
//       videoId: "d8F7SJqH79g",
//       startSec: 16.28,
//       text: "Pääseekö koira tän teipin läpi No pääset",
//       seekSec: 14,
//       url: "https://youtube.com/watch?v=d8F7SJqH79g&t=14s"
//     },