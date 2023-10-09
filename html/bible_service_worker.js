self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('pwa_bible_store').then(function(cache) {
            return cache.addAll([
            'bible.htm',
            'bible_code.js',            
            '../hard_ln_io/klbase.js',            
            '../hard_ln_io/klbase_css.js',
            '../hard_ln_io/klbase_date.js',
            '../hard_ln_io/klbase_en_de_str.js',            
            '../hard_ln_io/klbase_eng.js',
            '../hard_ln_io/klbase_enbook.js',
            '../hard_ln_io/klbase_idb.js',
            
            '../jsdoc3/bible_kjv_890.js',
            '../jsdoc3/sheng_jing_he_he_ben_124338.js',
            '../jsdata/bible_web_sites_data.js',
            '../jsdata/words/enwords_data.js',
            
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open('pwa_bible_store').then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
