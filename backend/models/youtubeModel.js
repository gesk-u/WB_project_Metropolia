require('dotenv').config();
const { google } = require('googleapis');
const { YoutubeTranscript } = require('youtube-transcript');

const apiKey = process.env.API_KEY;
//console.log('API_KEY loaded:', apiKey);
const youtube = google.youtube({ version: 'v3', auth: apiKey});

// Search Finnish videos (region + language filtered)
async function findFinnishVideos(query, maxResults = 50) {
    const res = await youtube.search.list({
        part: 'snippet',
        q: query,
        type: 'video',
        relevanceLanguage: 'fi',
        regionCode: 'FI',
        maxResults,
    });

    console.log('search.list returned:', res.data.items.length);

    const videoIds = res.data.items
        .map(item => item.id.videoId)
        .filter(Boolean);

    console.log('video IDs extracted:', videoIds.length);

    if (videoIds.length === 0) return [];

    const videosRes = await youtube.videos.list({
        part: 'snippet',
        id: videoIds.join(','),
    });

    console.log('videos.list returned:', videosRes.data.items.length);
    console.log('audio languages:', videosRes.data.items.map(v => v.snippet.defaultAudioLanguage));

    const filtered = videosRes.data.items.filter(v => {
        const lang = ( v.snippet.defaultAudioLanguage ?? v.snippet.defaultLanguage ?? '').toLowerCase();
        return lang === 'fi' || lang.startsWith('fi-');
    });

    console.log('after language filter:', filtered.length);

    const results = videosRes.data.items
    .filter(v => {
        const lang = ( v.snippet.defaultAudioLanguage ?? v.snippet.defaultLanguage ?? '').toLowerCase();
        if (!lang) return true;
        return lang === 'fi' || lang.startsWith('fi-');
    })
    .map(v => v.id); 
    
    return results;
}


// Tool function for searchWordInVideo
function containsPhrase(text, phrase) {
    const normalize = s => s.toLowerCase().replace(/[.,!?"()]/g, '');
    const textWords = normalize(text).split(/\s+/);
    const phraseWords = normalize(phrase).split(/\s+/);

    for (let i = 0; i <= textWords.length - phraseWords.length; i++) {
        if (phraseWords.every((w, j) => textWords[i + j] === w)) {
            return true;
        }
    }
    return false; 
}

// Search a single video's transcript for the target word
async function searchWordInVideo(videoId, targetWord) {
    let transcript;
    try {
        transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'fi' });
    } catch (err) {
        const res = await youtube.captions.list({ part: 'snippet', videoId: videoId });
        const tracks = res.data.items.map(i => `${i.snippet.language}/${i.snippet.trackKind}`);
        console.log(`❌ ${videoId}:`, err.message);
        console.log(`   API says: ${tracks.length ? tracks.join(', ') : 'NO TRACKS'}`);
        return [];
    }

    const res = await youtube.captions.list({ part: 'snippet', videoId: videoId });
    console.log(res.data.items.map(i => `${videoId}:` + i.snippet.language + '/' + i.snippet.trackKind ));

    const hits = [];
    for (const entry of transcript) {
        if (containsPhrase(entry.text, targetWord)) {
            hits.push({
                timestamp: entry.offset / 1000,
                context: entry.text,
                url: `https://youtube.com/watch?v=${videoId}&t=${Math.floor(entry.offset / 1000)}s`,
            });
        }
    }
    return hits;
}

async function findWordAcrossFinnishVideos(targetWord, searchQuery = null, maxVideos = 50) {
    const query = searchQuery || targetWord;
    const videoIds = await findFinnishVideos(query, maxVideos);

    const results = [];
    for (const videoId of videoIds) {
        const hits = await searchWordInVideo(videoId, targetWord);
        if (hits.length > 0) {
            results.push({ video_id: videoId, matches: hits });
        }
    }
    return results;
}

function interleaveByVideo(flat) {
    const byVideo = new Map();

    for (const row of flat) {
        if (!byVideo.has(row.videoId)) byVideo.set(row.videoId, []);
        byVideo.get(row.videoId).push(row)
    }

    const queues = [...byVideo.values()]
    const out = []
    let i = 0
    while (out.length < flat.length) {
        const q = queues[i % queues.length]
        if (q.length) out.push(q.shift())
        i++
    }

    return out

}


async function buildResponse(targetWord, page = 1, pageSize = 100) {
    const vids = await findWordAcrossFinnishVideos(targetWord);

    const flat = vids.flatMap( v =>
        v.matches.map(m => ({
            videoId: v.video_id,
            startSec: m.timestamp,
            text: m.context
        }))
    )

    const interleaved = interleaveByVideo(flat);

    const start = (page - 1) * pageSize;
    const results = interleaved.slice(start, start + pageSize).map(r => {
        const seek = Math.max(0, Math.floor(r.startSec - 1.5));
        return {
            ...r,
            startSec: Number(r.startSec.toFixed(2)),
            seekSec: seek,
            url: `https://youtube.com/watch?v=${r.videoId}&t=${seek}s`,
        }
    })

    
    return {
        query: targetWord,
        lemma: "",
        total: flat.length,
        page,
        pageSize,
        results,  
    }

}


// (async () => {
//   const results = await findWordAcrossFinnishVideos('oon');
//   console.log(JSON.stringify(results, null, 25));
// })();

buildResponse('koira').then(r => console.log(JSON.stringify(r, null, 2)));