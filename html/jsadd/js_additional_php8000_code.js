function data_load_php8000(array_name){
    var blurl='http://'+location.host+':8000/';
    for (let blxl=0,lent=photo_source_global.length;blxl<lent;blxl++){
        photo_source_global[blxl]='<a href="'+blurl+photo_source_global[blxl]+'" target=_blank>'+photo_source_global[blxl]+'</a>';
    }
}
