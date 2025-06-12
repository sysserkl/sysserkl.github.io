self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('pwa_gps_points_store').then(function(cache) {
            return cache.addAll([
            'gps_points.htm',
            'gps_points_code.js',            
            '../module/jquery.js',            
            '../hard_ln_io/klbase.js',            
            '../hard_ln_io/klbase_css.js',
            '../hard_ln_io/klbase_date.js',
            '../hard_ln_io/klbase_en_de_str.js',
            '../hard_ln_io/klbase_flot.js',
            '../hard_ln_io/klbase_leaflet.js',            
            '../hard_ln_io/klbase_idb.js',            
            '../module/flot/jquery.flot.min.js',       
            '../module/flot/jquery.flot.symbol.min.js',
            '../module/flot/jquery.flot.time.min.js',                 
            '../module/leaflet/leaflet.css',
            '../module/leaflet/leaflet.js',
            '../module/leaflet_plugins/leaflet.ChineseTmsProviders.js',
            '../jsdata/gpx_pb_data.js',
            '../hard_ln_io/sound/ding.wav',
            '../hard_ln_io/sound/drop.wav',
            '../hard_ln_io/sound/dududu.wav',
            '../hard_ln_io/sound/elephant.wav',
            '../hard_ln_io/sound/whistle.wav',            
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open('pwa_gps_points_store').then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
