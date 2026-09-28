function VideoInfoBox({currentVideo, word}) {
    const { text, startSec} = currentVideo;

    const timestamp = `${Math.floor(startSec / 60)}:${Math.floor(startSec % 60).toString().padStart(2, '0')}`;
    const parts = text.split(new RegExp(`(${word})`, 'gi'));
    
    return (
        <div className="box-border flex flex-row items-start gap-3 py-5 px-6 w-[720px] bg-white border border-[#DDD8D0] rounded-md flex-none order-none self-stretch grow-0 mt-5">

            <div className="order-1 flex flex-col items-start px-[10px] py-1 bg-[#7A9E8E] rounded-sm flex-none">
                <p className="font-['JetBrains_Mono'] font-semibold text-xs leading-[18px] tracking-[0.6px] text-white">
                    ▶ {timestamp}
                </p>
            </div>

            <div className="flex flex-col items-start flex-1">
                <div className="box-border flex flex-col items-start py-[10.4px] px-4 w-full bg-[#F4F1EC] border-l-[3px] border-[#7A9E8E] rounded-r-[3px]">
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
export default VideoInfoBox 
//     {
//       videoId: "d8F7SJqH79g",
//       startSec: 16.28,
//       text: "Pääseekö koira tän teipin läpi No pääset",
//       seekSec: 14,
//       url: "https://youtube.com/watch?v=d8F7SJqH79g&t=14s"
//     },