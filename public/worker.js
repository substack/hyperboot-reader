self.addEventListener('install', function (ev) {
  console.log('installed', ev)
})
self.addEventListener('activate', function (ev) {
  console.log('activated', ev)
})

self.addEventListener('fetch', function (ev) {
  console.log(ev.request.method, ev.request.url)
})
