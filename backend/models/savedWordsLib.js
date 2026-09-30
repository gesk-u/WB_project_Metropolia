
async function getVideoTitle(videoId) {
    try {
        const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) return '';
        return (await res.json()).title || '';
    } catch {
        return '';
    }
}

module.exports = { getVideoTitle };