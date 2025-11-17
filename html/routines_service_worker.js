self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('pwa_routines_store').then(function(cache) {
            return cache.addAll([
            'routines.htm',
            'routines_code.js',
            '../module/jquery.js',
            '../hard_ln_io/klbase.js',
            '../hard_ln_io/klbase_css.js',
            '../hard_ln_io/klbase_date.js',
            '../hard_ln_io/klbase_flot.js',
            '../hard_ln_io/klbase_en_de_str.js',
            '../hard_ln_io/klbase_plan.js',
            '../module/flot/jquery.flot.min.js',       
            '../module/flot/jquery.flot.categories.min.js',
            '../module/flot/jquery.flot.symbol.min.js',
            '../module/flot/jquery.flot.time.min.js',     
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open('pwa_routines_store').then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
