self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('pwa_klsearch_store').then(function(cache) {
            return cache.addAll([
            'klsearch.htm',
            'klsearch_code.js',            
            '../hard_ln_io/klbase.js',            
            '../hard_ln_io/klbase_css.js',
            '../hard_ln_io/klbase_en_de_str.js',
            '../module/gbk.js',
            '../jsdata/search_sites_pb_data.js',
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open('pwa_klsearch_store').then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
