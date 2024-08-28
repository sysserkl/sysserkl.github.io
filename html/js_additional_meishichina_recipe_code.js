function menu_more_meishichina_recipe(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'statistics_ingredient_meishichina_recipe();">不同原料菜谱的原料使用统计</span>',   
    '<span class="span_menu" onclick="'+str_t+'same_ingredient_meishichina_recipe();">相同原料的菜谱</span>',   
    '<span class="span_menu" onclick="'+str_t+'random_recipe_meishichina_recipe();">随机菜谱</span>',   
    '<span class="span_menu" onclick="'+str_t+'random_ingredient_meishichina_recipe();">随机原料</span>',   
    ];
    return klmenu_b(klmenu1,'🧮','16rem','1rem','1rem','30rem');
}

function random_recipe_meishichina_recipe(){
    if (meishichina_recipe_global.length==0){return;}
    meishichina_recipe_global.sort(randomsort_b);
    document.getElementById('input_result_max').value=1000;
    search_common('.');
}

function random_ingredient_meishichina_recipe(){
    meishichina_recipe_global.sort(randomsort_b);
    var ingredient_t=new Set();
    for (let arow of meishichina_recipe_global){
        var list_t=arow[1].split(' ');
        ingredient_t=array_union_b(ingredient_t,new Set(list_t),true);
        if (ingredient_t.size>=1000){break;}
    }
    
    ingredient_t=Array.from(ingredient_t);
    ingredient_t.sort(randomsort_b);    
    ingredient_t=ingredient_t.slice(0,150);
    ingredient_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    
    document.getElementById('divhtml').innerHTML='<div style="column-count:'+(ismobile_b()?4:9)+';">'+array_2_li_b(ingredient_t)+'</div>';
}

function statistics_ingredient_meishichina_recipe(){
    var ingredient_d=same_ingredient_meishichina_recipe(true);
    var count_d={};
    
    for (let arow of ingredient_d){
        var list_t=arow[0].split('_');
        for (let item of list_t){
            var blkey='k_'+item;
            if (count_d[blkey]==undefined){
                count_d[blkey]=0;
            }
            count_d[blkey]=count_d[blkey]+1;
        }
    }
    count_d=object2array_b(count_d,true,2);
    count_d.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    count_d.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    
    var bllen=ingredient_d.length;
    for (let blxl=0,lent=count_d.length;blxl<lent;blxl++){
        count_d[blxl].push((count_d[blxl][1]*100/bllen).toFixed(2)+'%');
    }
    document.getElementById('divhtml').innerHTML='<h3>不重复原料菜谱数：'+bllen+'</h3><div style="column-count:'+(ismobile_b()?2:4)+';">'+array_2_li_b(count_d)+'</div>';
}

function same_ingredient_meishichina_recipe(return_list=false){
    var ingredient_d={};
    for (let arow of js_data_current_common_search_global){
        var list_t=arow[0][1].replace(/\([^\(\)]+\)/g,'').replace(/（[^（）]+）/g,'').replace(/或者?/g,' ').split(' ');
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            list_t[blxl]=list_t[blxl].replace(/\(.+/g,'').replace(/（.+/g,'');
        }
        list_t=array_unique_b(list_t);
        list_t.sort();
        var blat=list_t.indexOf('无');
        if (blat>=0){
            list_t.splice(blat,1);
        }
        var blkey='k_'+list_t.join('_');
        if (ingredient_d[blkey]==undefined){
            ingredient_d[blkey]=[];
        }
        
        if (ingredient_d[blkey].includes(arow[0][0])){
            console.log('发现重复记录：'+arow[0][0]+'：'+arow[0][1]+' /// '+blkey);
            continue;
        }
        ingredient_d[blkey].push(arow[0][0]);
    }

    ingredient_d=object2array_b(ingredient_d,true,2);
    if (return_list){
        return ingredient_d;
    }
    
    ingredient_d.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    ingredient_d.sort(function (a,b){return a.length<b.length ? 1 : -1;});
    
    for (let blxl=0,lent=ingredient_d.length;blxl<lent;blxl++){
        if (ingredient_d[blxl].length==2){
            ingredient_d=ingredient_d.slice(0,blxl);
            break;
        }
    }

    for (let blxl=0,lent=ingredient_d.length;blxl<lent;blxl++){
        ingredient_d[blxl][0]=ingredient_d[blxl][0].replace(/_/g,' ');
        ingredient_d[blxl]=ingredient_d[blxl][0]+'：'+ingredient_d[blxl].slice(1,).join(' /// ');
    }
    document.getElementById('divhtml').innerHTML='<div style="column-count:'+(ismobile_b()?2:4)+';">'+array_2_li_b(ingredient_d)+'</div>';
}
