console.log(location.href);
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('pwa_websites_store').then(function(cache) {
            return cache.addAll([
            'websites_pwa.htm',
            '../hard_ln_io/jquery.js',            
            '../hard_ln_io/klbase_css.js',
            '../hard_ln_io/klbase.js',
            '../hard_ln_io/klbase_qr.js',
            '../hard_ln_io/klbase_websites.js',
            '../jsdata/websites_demo_data.js',
            '../module/jeromeetienne_qrcode.min.js',
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open('pwa_websites_store').then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
