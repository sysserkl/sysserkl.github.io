function menu_more_meishichina_recipe(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'statistics_ingredient_meishichina_recipe();">原料统计</span>',   
    '<span class="span_menu" onclick="'+str_t+'same_ingredient_meishichina_recipe();">相同原料的菜谱</span>',   

    ];
    return klmenu_b(klmenu1,'🧮','11rem','1rem','1rem','30rem');
}

function ingredient_unique_meishichina_recipe(csingredient,return_set=false){
    if (return_set){
        return new Set(csingredient.trim().split(' '));
    }
    else {
        return array_unique_b(csingredient.trim().split(' '));
    }
}

function statistics_ingredient_meishichina_recipe(){
    var ingredient_d={};
    for (let arow of js_data_current_common_search_global){
        var list_t=ingredient_unique_meishichina_recipe(arow[0][1],true);
        for (let item of list_t){
            var blkey='k_'+item;
            if (ingredient_d[blkey]==undefined){
                ingredient_d[blkey]=0;
            }
            ingredient_d[blkey]=ingredient_d[blkey]+1;
        }
    }
    ingredient_d=object2array_b(ingredient_d,true,2);
    ingredient_d.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    ingredient_d.sort(function (a,b){return a[1]<b[1];});
    
    var bllen=js_data_current_common_search_global.length;
    for (let blxl=0;blxl<ingredient_d.length;blxl++){
        ingredient_d[blxl].push((ingredient_d[blxl][1]*100/bllen).toFixed(2)+'%');
    }
    document.getElementById('divhtml').innerHTML='<div style="column-count:'+(ismobile_b()?2:4)+';">'+array_2_li_b(ingredient_d)+'</div>';
}

function same_ingredient_meishichina_recipe(){
    var ingredient_d={};
    var found_same_record=false;
    for (let arow of js_data_current_common_search_global){
        var list_t=ingredient_unique_meishichina_recipe(arow[0][1],false);
        list_t.sort();
        var blkey='k_'+list_t.join('_');
        if (ingredient_d[blkey]==undefined){
            ingredient_d[blkey]=[];
        }
        
        if (ingredient_d[blkey].includes(arow[0][0])){
            document.getElementById('divhtml').innerHTML='发现重复记录：'+arow[0][0]+' '+ingredient_d[blkey];
            found_same_record=true;
            break;
        }
        ingredient_d[blkey].push(arow[0][0]);
    }
    
    if (found_same_record){return;}
    
    ingredient_d=object2array_b(ingredient_d,true,2);
    ingredient_d.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    ingredient_d.sort(function (a,b){return a.length<b.length;});
    
    for (let blxl=0;blxl<ingredient_d.length;blxl++){
        if (ingredient_d[blxl].length==2){
            ingredient_d=ingredient_d.slice(0,blxl);
            break;
        }
    }
    
    document.getElementById('divhtml').innerHTML='<div style="column-count:'+(ismobile_b()?2:4)+';">'+array_2_li_b(ingredient_d)+'</div>';
}
