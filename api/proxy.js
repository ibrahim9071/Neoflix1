// api/proxy.js (Vercel Serverless Function)

// Logo URL'leri (yedekli sistem)
const LOGO_URLS = [
  'https://i.hizliresim.com/dpftjq3.jpg',
  'https://picsum.photos/140/80', // Yedek logo (silinebilir)
  // Kendi logo URL'lerini buraya ekle
];

// M3U8 kaynak URL
const SOURCE_URL = 'https://dga1op10s1u3leo.450bb93555fef8.click/live/selcukobs1/playlist.m3u8';

// Ana handler
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    // M3U8 playlist isteği
    if (path === '/' || path === '/playlist.m3u8' || path.endsWith('.m3u8')) {
      return await handlePlaylist(req, res, path);
    }

    // Segment isteği (.jpg)
    if (path.startsWith('/seg/') && path.endsWith('.jpg')) {
      return await handleSegment(req, res, path);
    }

    // Logo test endpoint
    if (path === '/test-logo') {
      return await testLogo(req, res);
    }

    // 404
    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// M3U8 playlist handler
async function handlePlaylist(req, res, path) {
  try {
    const response = await fetch(SOURCE_URL);
    
    if (!response.ok) {
      throw new Error(`Kaynak yanıt vermiyor: ${response.status}`);
    }

    let body = await response.text();

    // JPG yollarını düzelt
    body = body.replace(
      /https?:\/\/[^/\s]+\/live\/selcukobs1\/([^ \n]+\.jpg)/g,
      (match, filename) => {
        return `${req.headers.host.startsWith('localhost') ? 'http' : 'https'}://${req.headers.host}/seg/${filename}`;
      }
    );

    // Ek güvenlik: Tüm .jpg yollarını kontrol et
    body = body.replace(/([^\/\s]+\.jpg)/g, (match) => {
      if (match.includes('http')) return match;
      return `/seg/${match}`;
    });

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache, max-age=0');
    res.status(200).send(body);
  } catch (error) {
    console.error('Playlist hatası:', error);
    res.status(502).send('# Kaynak alınamadı\n');
  }
}

// Segment handler (logo ekleme)
async function handleSegment(req, res, path) {
  const filename = path.replace('/seg/', '');
  const segmentUrl = `https://dga1op10s1u3leo.450bb93555fef8.click/live/selcukobs1/${filename}`;

  try {
    // Önce orijinal resmi al
    const imageResponse = await fetch(segmentUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Resim alınamadı: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Logo ekleme işlemi (Base64 ile)
    const finalImage = await addLogoToImage(imageBuffer, contentType);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, max-age=300'); // 5 dakika cache
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(Buffer.from(finalImage));
  } catch (error) {
    console.error('Segment hatası:', error);
    
    // Hata durumunda orijinal resmi dene
    try {
      const fallbackResponse = await fetch(segmentUrl);
      const fallbackBuffer = await fallbackResponse.arrayBuffer();
      
      res.setHeader('Content-Type', fallbackResponse.headers.get('content-type') || 'image/jpeg');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).send(Buffer.from(fallbackBuffer));
    } catch {
      res.status(502).send('Resim alınamadı');
    }
  }
}

// Logoyu resme ekle (Sharp kütüphanesi ile)
async function addLogoToImage(imageBuffer, contentType) {
  try {
    // Dinamik import ile sharp'ı yükle
    const sharp = (await import('sharp')).default;
    
    // Logoyu dene (birden fazla URL dene)
    let logoBuffer = null;
    
    for (const logoUrl of LOGO_URLS) {
      try {
        const logoResponse = await fetch(logoUrl);
        if (logoResponse.ok) {
          logoBuffer = await logoResponse.arrayBuffer();
          break;
        }
      } catch (e) {
        console.log(`Logo alınamadı: ${logoUrl}`);
      }
    }

    if (!logoBuffer) {
      console.log('Logo alınamadı, orijinal resim döndürülüyor');
      return imageBuffer;
    }

    // Resmi işle
    const processedImage = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(logoBuffer),
          gravity: 'northeast', // Sağ üst köşe
          blend: 'over',
          top: 10,
          left: null, // Sağa yaslamak için left'i null yap
        }
      ])
      .toBuffer();

    return processedImage;
  } catch (error) {
    console.error('Logo ekleme hatası:', error);
    return imageBuffer; // Hata durumunda orijinal resim
  }
}

// Logo test endpoint
async function testLogo(req, res) {
  try {
    const sharp = (await import('sharp')).default;
    
    // Test resmi oluştur
    const testImage = await sharp({
      create: {
        width: 640,
        height: 360,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    })
    .composite([
      {
        input: Buffer.from(await (await fetch(LOGO_URLS[0])).arrayBuffer()),
        gravity: 'northeast',
        top: 10,
        left: null,
      }
    ])
    .png()
    .toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(testImage);
  } catch (error) {
    res.status(500).send(`Logo test başarısız: ${error.message}`);
  }
}

// package.json için gerekli bağımlılıklar
/*
{
  "name": "m3u8-proxy",
  "version": "1.0.0",
  "dependencies": {
    "sharp": "^0.33.0"
  }
}
*/

// vercel.json
/*
{
  "functions": {
    "api/proxy.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
*/
