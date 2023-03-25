function style_load_catchphrase(){
    var blstr='#divhtml br {margin-bottom:0.5rem;}';
    style_generate_b(blstr,true);
}

function col_rearrange_catchphrase(){
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        list_t.push([arow[0].join('<br />'),arow[1]]);
    }
    return list_t;
}
