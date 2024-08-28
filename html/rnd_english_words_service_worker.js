self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('pwa_rnd_english_words_store').then(function(cache) {
            return cache.addAll([
            'rnd_english_words.htm',
            'rnd_english_words_code.js',
            '../hard_ln_io/enwords_exam.js',            
            '../hard_ln_io/klbase.js',
            '../hard_ln_io/klbase_css.js',
            '../hard_ln_io/klbase_date.js',
            '../hard_ln_io/klbase_en_de_str.js',
            '../hard_ln_io/klbase_eng.js',
            '../hard_ln_io/klbase_enbook.js',            
            '../hard_ln_io/klbase_wiki.js',
            '../jsdata/words/enwords_data.js',
            '../jsdata/words/enwords_sentence_data.js',
            '../recent_info.css',
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open('pwa_rnd_english_words_store').then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
