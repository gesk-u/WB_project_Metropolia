

function VideoBox({ currentVideo }) {
    const { videoId, seekSec} = currentVideo;
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
};

export default VideoBox