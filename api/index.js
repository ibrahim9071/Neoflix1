const express = require('express');
const fetch = require('node-fetch').default;

const app = express();

const channels = {
  bein1:    "https://dga1op10s1u3leo.450bb93555fef8.click/live/selcukobs1/playlist.m3u8",
  bein2:    "https://zeustv432423.info/b2/tracks-v1a1/mono.ts.m3u8", 
  bein3:    "https://zeustv432423.info/b3/tracks-v1a1/mono.ts.m3u8",
  bein4:    "https://zeustv432423.info/b4/tracks-v1a1/mono.ts.m3u8",
  bein01:   "https://zeustv432423.info/b1/tracks-v1a1/mono.ts.m3u8",
  atv:      "https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8",
  star:     "http://dygvideo.dygdigital.com/live/hls/stardai?m3u8",
  now:      "http://116.202.238.88/FOXTV_TR/index.m3u8",
  trt1:     "https://streams.uzunmuhalefet.com/stream/535f4f5a-3ffa-4919-bb5d-5d31024c9237.m3u8",
  kanalD:   "https://demiroren.daioncdn.net/kanald/kanald.m3u8?app=kanald_web",
  show:     "https://ciner.daioncdn.net/showtv/showtv_1080p.m3u8?app=showtv_web",
  tv8:      "https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8.m3u8",
  minikago: "https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago_720p.m3u8",
  minikacocuk: "https://streams.uzunmuhalefet.com/stream/507ebfe3-0c78-4804-b3be-637e9b45f5a0.m3u8",
  cartoon:  "https://streams.uzunmuhalefet.com/stream/9d940976-31c8-4570-92e6-a684e49bea46.m3u8"
};

app.get('/', (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const playlistUrl = `${protocol}://${host}/playlist.m3u8`;
  const count = Object.keys(channels).length;

  res.send(`
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MutluTV Proxy  - Canl TV Keyfi</title>
  <style>
    :root { --neon: #ff00aa; --dark: #0a0015; --bg: linear-gradient(135deg, #0a0015, #1a0033, #2a004d); }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: #eee; min-height:100vh; display:flex; flex-direction:column; }
    header { background: rgba(0,0,0,0.8); padding: 2rem 1rem; text-align:center; border-bottom: 2px solid var(--neon); box-shadow: 0 0 30px rgba(255,0,170,0.3); }
    h1 { font-size: 3.5rem; color: var(--neon); text-shadow: 0 0 20px var(--neon), 0 0 40px #000; letter-spacing: 2px; animation: glitch 4s infinite; }
    @keyframes glitch { 0%,100% { text-shadow: 0 0 10px var(--neon); } 2% { transform: translate(-2px,2px); } 4% { transform: translate(2px,-2px); } }
    .container { flex:1; padding: 3rem 1rem; text-align:center; max-width: 1000px; margin: auto; }
    .btn { background: var(--neon); color: white; padding: 1.5rem 4rem; font-size: 1.8rem; border: none; border-radius: 999px; text-decoration:none; display:inline-block; margin: 2.5rem 0; cursor:pointer; box-shadow: 0 0 40px rgba(255,0,170,0.6); transition: all .4s; }
    .btn:hover { transform: scale(1.08); box-shadow: 0 0 80px rgba(255,0,170,0.9); }
    .info { background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); padding: 2rem; border-radius: 20px; margin: 3rem 0; font-size: 1.3rem; border: 1px solid rgba(255,0,170,0.2); }
    footer { background: rgba(0,0,0,0.9); padding: 2rem; text-align:center; font-size: 1.1rem; border-top: 1px solid var(--neon); }
    footer a { color: var(--neon); margin: 0 1.5rem; text-decoration:none; }
    footer a:hover { text-shadow: 0 0 10px var(--neon); }
    @media (max-width: 600px) { h1 {font-size:2.5rem;} .btn {font-size:1.4rem; padding:1.2rem 3rem;} .info {font-size:1.1rem;} }
  </style>
</head>
<body>
  <header><h1>MUTLUTV PROXY </h1></header>
  <div class="container">
    <h2 style="font-size:2.2rem; margin-bottom:1.5rem;">${count} KANAL CANLI PATLIYOR</h2>
    <div class="info">
      BeIN'den Minika'ya, Cartoon'dan Show'a kadar her bok burada.<br>
      Reklamsz, bedava, sadece zevk i�in toplanm yaynlar.<br>
      IPTV'n a�, linki at, keyfine bak.
    </div>
    <a href="${playlistUrl}" class="btn">T�M KANALLARI A�</a>
    <p style="margin-top:3rem; opacity:0.8; font-size:1.2rem;">
      VLC, GSE Smart IPTV, IPTV Smarters veya Tivimate'e bu playlist linkini yaptr.<br>
      Bazlar direkt a�lr, bazlar i�in user-agent deitir.
    </p>
  </div>
  <footer>
    <p>� 2025 MutluTV Proxy - Sikeyim telif iini</p>
    <div>
      <a href="#">Gizlilik Politikas</a> � 
      <a href="#">Hakkmzda</a> � 
      <a href="mailto:mutlutvproxy@proton.me">Bize Ula</a>
    </div>
  </footer>
</body>
</html>
  `);
});

app.get('/playlist.m3u8', (req, res) => {
  const ids = Object.keys(channels);
  let m3u = `#EXTM3U\n#PLAYLIST: MutluTV - ${ids.length} kanal\n`;

  ids.forEach(id => {
    const name = id.toUpperCase().replace(/(\d+)$/, ' $1');
    m3u += `#EXTINF:-1 tvg-id="${id}" tvg-name="${name}" group-title="TV",${name}\n`;
    m3u += `${req.protocol}://${req.get('host')}/${id}/playlist.m3u8\n`;
  });

  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(m3u);
});

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  res.status(204).end();
});

app.get('/:channelId/playlist.m3u8', async (req, res) => {
  const { channelId } = req.params;
  const target = channels[channelId];

  if (!target) return res.status(404).send(`Kanal ${channelId} yok amk`);

  try {
    console.log(`Fetching: ${target}`);
    
    const response = await fetch(target, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.turknet.ercdn.net/',
        'Origin': 'https://www.turknet.ercdn.net',
        'Connection': 'keep-alive'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      console.log(`Response not OK: ${response.status}`);
      return res.status(502).send(`Yayn patlad: ${response.status}`);
    }

    let body = await response.text();
    console.log(`Body length: ${body.length}`);

    // �ZEL D�ZELTME: Turknet CDN i�in segment yollarn d�zelt
    const baseUrl = new URL(target);
    const basePath = target.substring(0, target.lastIndexOf('/') + 1);
    
    // Farkl segment formatlarn yakala
    body = body.replace(
      /([^"\n\r\s]+\.(?:ts|m3u8|m4s|key|vtt))/gi,
      (match) => {
        // Eer zaten full URL ise dokunma
        if (match.startsWith('http://') || match.startsWith('https://')) {
          return match;
        }
        
        // Eer relative path ise proxyle
        const cleanMatch = match.startsWith('/') ? match.substring(1) : match;
        console.log(`Replacing segment: ${match} -> ${req.protocol}://${req.get('host')}/${channelId}/seg/${cleanMatch}`);
        return `${req.protocol}://${req.get('host')}/${channelId}/seg/${cleanMatch}`;
      }
    );

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(body);
  } catch (err) {
    console.error('m3u8 hatas:', err);
    res.status(500).send('m3u8 hatas: ' + err.message);
  }
});

app.get('/:channelId/seg/*', async (req, res) => {
  const channelId = req.params.channelId;
  const filename = req.params[0];
  const base = channels[channelId];

  if (!base) return res.status(404).send('Kanal yok amk');

  // Base URL'i al
  const baseUrl = base.substring(0, base.lastIndexOf('/') + 1);
  
  // Segment URL'ini olutur
  let originalUrl;
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    originalUrl = filename;
  } else if (filename.startsWith('/')) {
    // Absolute path ise domain ekle
    const urlParts = new URL(base);
    originalUrl = `${urlParts.protocol}//${urlParts.host}${filename}`;
  } else {
    // Relative path ise base ile birletir
    originalUrl = baseUrl + filename;
  }

  console.log(`Fetching segment: ${originalUrl}`);

  try {
    const segRes = await fetch(originalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': baseUrl,
        'Origin': new URL(baseUrl).origin,
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      },
      redirect: 'follow'
    });

    if (!segRes.ok) {
      console.log(`Segment error: ${segRes.status} - ${originalUrl}`);
      return res.status(segRes.status).send(`Segment �ld�: ${segRes.status}`);
    }

    const buffer = Buffer.from(await segRes.arrayBuffer());
    const contentType = segRes.headers.get('content-type') || 
                       (originalUrl.endsWith('.ts') ? 'video/mp2t' : 
                        originalUrl.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 
                        'application/octet-stream');

    // �zellikle TS segmentleri i�in doru content-type
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

    // Range isteklerini destekle
    const range = req.headers.range;
    if (range && contentType.includes('video')) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1;
      const chunksize = (end - start) + 1;
      
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${buffer.length}`);
      res.setHeader('Content-Length', chunksize);
      res.send(buffer.slice(start, end + 1));
    } else {
      res.send(buffer);
    }
  } catch (err) {
    console.error('Seg hatas:', err.message, originalUrl);
    res.status(500).send('Segment sikintisi: ' + err.message);
  }
});

module.exports = app;
