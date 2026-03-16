addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  if (path.endsWith('.m3u8')  path === '/'  path === '/playlist.m3u8') {
    const target = 'https://dga1op10s1u3leo.450bb93555fef8.click/live/selcukobs1/playlist.m3u8'

    let res = await fetch(target)
    if (!res.ok) return new Response('Orijinal m3u8 öldü: ' + res.status, {status: 500})

    let body = await res.text()

    body = body.replace(
      /https?:\/\/[^/\s]+\/live\/selcukobs1\/([^ \n]+\.jpg)/g,
      https://${url.host}/seg/$1
    )

    return new Response(body, {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    })
  }

  if (path.startsWith('/seg/') && path.endsWith('.jpg')) {
    const segFile = path.slice(5)
    const original = 'https://dga1op10s1u3leo.450bb93555fef8.click/live/selcukobs1/' + segFile

    return fetch(original, {
      cf: {
        image: {
          draw: [{
            url: 'https://i.hizliresim.com/dpftjq3.jpg',
            right: 10,
            top: 10,
            opacity: 1,
            fit: 'contain',
            width: 140,
            height: 80
          }]
        }
      }
    }).then(r => {
      const resp = new Response(r.body, r)
      resp.headers.set('Access-Control-Allow-Origin', '*')
      resp.headers.set('Cache-Control', 'no-cache')
      return resp
    }).catch(() => fetch(original))  // draw patlarsa logo olmadan dön
  }

  return new Response('Yol yok', {status: 404})
}
