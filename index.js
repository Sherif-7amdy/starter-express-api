const axios = require('axios');
const cheerio = require('cheerio');

async function set_all_oneline(data) {
    const oneline_data = data.replace(/[\r\n]*/g, "");
    return oneline_data;
}

async function getDataAxios(url) {
    const headers = {
        "Referer": url,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    };

    const response = await axios.get(`https://api.allorigins.win/raw?url=${url}`, { headers });
    return set_all_oneline(response.data);
}

async function getMatches(data, pattern) {
    const regex = new RegExp(pattern, "gm");
    const matches = [];
    let match;
    while ((match = regex.exec(data)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

async function getVideoLink(type, url) {
    const dataMain = await getDataAxios(url);

    if (type === "vidbom") {
        // VIDBOM
        const matchesVIDBOM = await getMatches(dataMain, /<li style="--color:#E30713;"><btn data-url="(.*?)" class="hoverable activable"><i class="fal fa-play"><\/i><strong>VIDBOM.COM<\/strong><\/btn>/gm);

        if (matchesVIDBOM.length > 0) {
            const VIDBOMData = await getDataAxios(matchesVIDBOM[0]);
            const matchesVIDBOMMediaUrl = await getMatches(VIDBOMData, /sources: .*?{file:"(.*?)"/gm);
            const mp4Url = matchesVIDBOMMediaUrl[0];

            if (mp4Url) {
                return mp4Url;
            } else {
                return "NO";
            }
        } else {
            return "NO";
        }
    } else if (type === "vidshare") {
        // VIDSHARE
        const matchesVIDSHARE = await getMatches(dataMain, /<li style="--color:#ACB953;"><btn data-url="(.*?)" class="hoverable activable"><i class="fal fa-play"><\/i><strong>vidshare.tv<\/strong><\/btn><\/li>/gm);

        if (matchesVIDSHARE.length > 0) {
            const VIDSHAREData = await getDataAxios(matchesVIDSHARE[0]);
            const matchesVIDSHAREMediaUrl = await getMatches(VIDSHAREData, /sources: \[\{file:"(.*?)"/gm);
            let m3u8Url = matchesVIDSHAREMediaUrl[0];

            if (m3u8Url) {
                m3u8Url = m3u8Url.replace('https://', 'http://');
                return m3u8Url;
            } else {
                return "NO";
            }
        } else {
            return "NO";
        }
    } else if (type === "govid") {
        // GOVID
        const matchesGOVID = await getMatches(dataMain, /<li style="--color:#E4E44C;"><btn data-url="(.*?)" class="hoverable activable"><i class="fal fa-play"><\/i><strong>GoViD<\/strong><\/btn><\/li>/gm);

        if (matchesGOVID.length > 0) {
            const GOVIDData = await getDataAxios(matchesGOVID[0]);
            const matchesGOVIDMediaUrl = await getMatches(GOVIDData, /sources: .*?{file:"(.*?)"/gm);
            const mp4Url = matchesGOVIDMediaUrl[0];

            if (mp4Url) {
                return mp4Url;
            } else {
                return "NO";
            }
        } else {
            return "NO";
        }
    }

    return "NO";
}

// Example usage
const type = "vidbom";  // Replace with actual type
const url = "https://example.com";  // Replace with actual URL

getVideoLink(type, url)
    .then(videoLink => {
        console.log("Video Link:", videoLink);
    })
    .catch(error => {
        console.error("An error occurred:", error.message);
    });
