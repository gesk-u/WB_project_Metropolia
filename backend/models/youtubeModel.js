require('dotenv').config();
const { google } = require('googleapis');
const { YoutubeTranscript } = require('youtube-transcript');

const apiKey = process.env.API_KEY;
//console.log('API_KEY loaded:', apiKey);
const youtube = google.youtube({ version: 'v3', auth: apiKey});

// Search Finnish videos (region + language filtered)
async function findFinnishVideos(query, maxResults = 25) {
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
        const lang = v.snippet.defaultAudioLanguage;
        return lang && lang.toLowerCase().startsWith('fi');
    });

    console.log('after language filter:', filtered.length);

    return videosRes.data.items
    .filter(v => {
        const lang = v.snippet.defaultAudioLanguage;
        if (!lang) return true;
        return lang.toLowerCase().startsWith('fi');
    })
    .map(v => v.id); 
}


// Tool function for 
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
        console.log(`❌ ${videoId}:`, err.message);
        return [];
    }

    const hits = [];
    for (const entry of transcript) {
        if (containsPhrase(entry.text, targetWord)) {
            hits.push({
                timestemp: entry.offset / 1000,
                context: entry.text,
                url: `https://youtube.com/watch?v=${videoId}&t=${Math.floor(entry.offset / 1000)}s`,
            });
        }
    }
    return hits;
}

async function findWordAcrossFinnishVideos(targetWord, searchQuery = null, maxVideos = 25) {
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


(async () => {
  const results = await findWordAcrossFinnishVideos('koira');
  console.log(JSON.stringify(results, null, 25));
})();