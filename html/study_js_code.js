function objects_from_entries_study_js(){
    const arr1=[ ['foo', 'bar',456], ['baz', [42,99,'dd'] ], ['ddd',{a:34,b:'big'}] ];
    const entries = new Map(arr1);

    var result1_t = Object.fromEntries(arr1);
    var result2_t = Object.fromEntries(entries);
    
    var arr2=[['aaa','789'],['bbb','ews'],['aaa','4s'],['bbb',333],['bbb','www']];
    var result3_t = Object.fromEntries(arr2);
    var entries3 = new Map(arr2);
    var result4_t = Object.fromEntries(entries3);
    
    var bljg=JSON.stringify(result1_t)+'<br />'+JSON.stringify(result2_t)+'<br />'+JSON.stringify(result3_t)+'<br />'+JSON.stringify(result4_t);    
    document.getElementById('td_interactive_info').innerHTML=bljg;
}

function object_entries_study_js(){
    var obj = { foo: 'bar', baz: 42, dog: [22,false,'ee'] };
    var result1_t=Object.entries(obj); // [ ['foo', 'bar'], ['baz', 42],[dog, [22,false,'ee'] ] ]

    // array like object
    var  obj = { 0: 'a', 1: 23.15, 2: ['c',12,true] };
    var result2_t=Object.entries(obj); // [ ['0', 'a'], ['1', 23.15], ['2', ['c',12,true] ] ]

    // array like object with random key ordering
    var obj = { 100: 'a', 2: 'b', 7: -9.9 };
    var result3_t=Object.entries(obj); // [ ['2', 'b'], ['7', -9.9], ['100', 'a'] ]

    // non-object argument will be coerced to an object
    var result4_t=Object.entries('foo'); // [ ['0', 'f'], ['1', 'o'], ['2', 'o'] ]

    // returns an empty array for any primitive type except for strings (see the above example), since primitives have no own properties
    var result5_t=Object.entries(100); // [ ]

    // iterate through key-value gracefully
    var obj = { a: 5, b: 7, c: 9 };
    var bljg1='';
    for (const [key, value] of Object.entries(obj)){
        bljg1=bljg1+'<br />'+key+' --- '+value; // "a 5", "b 7", "c 9"
    }

    // Or, using array extras
    var bljg2='';
    Object.entries(obj).forEach(([key, value]) => {
        bljg2=bljg2+'<br />'+key+' *** '+value; // "a 5", "b 7", "c 9"
    });
    
    console.log(result1_t,result2_t,result3_t,result4_t,result5_t);
    var bljg=JSON.stringify(result1_t)+'<br />'+JSON.stringify(result2_t)+'<br />';
    bljg=bljg+JSON.stringify(result3_t)+'<br />'+JSON.stringify(result4_t)+'<br />';
    bljg=bljg+JSON.stringify(result5_t)+'<br />'+bljg1+'<br />'+bljg2;    
    document.getElementById('td_interactive_info').innerHTML=bljg;
}

function reduce_study_js(){
    function sub_reduce_study_js_max(accumulator, currentValue){
        if (accumulator > currentValue){
            return accumulator;
        } else {
            return currentValue;
        }
    }
    //-----------------------
    const array1 = [1, 2, 3, 4];
    const reducer1 = (accumulator, currentValue) => accumulator + currentValue;
    const reducer2 = (accumulator, currentValue) => accumulator * currentValue;

    // 1 + 2 + 3 + 4
    var result1_t=array1.reduce(reducer1);

    // 5 + 1 + 2 + 3 + 4
    var result2_t=array1.reduce(reducer1, 5);
    
    var result3_t=array1.reduce(reducer2, 10);
    var result4_t=array1.reduce(reducer2, 10,20);
    
    var result5_t=array1.reduce(sub_reduce_study_js_max);
    
    document.getElementById('td_interactive_info').innerHTML=result1_t+'<br />'+result2_t+'<br />'+result3_t+'<br />'+result4_t+'<br />'+result5_t;    
}

function find_study_js(){
    //returns the value of the first element in the provided array that satisfies the provided testing function.
    //If no values satisfy the testing function, undefined is returned.
    function sub_find_study_js_isBigEnough(value){
        return value >= 10;
    }
    //---
    var result1_t = [12, 5, 8, 130, 44].find(sub_find_study_js_isBigEnough);
    var result2_t = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'].find(one_word => one_word.length > 6);
    var result3_t = [12, 5, 8, 130, 44].find( element => element < 0 );
    document.getElementById('td_interactive_info').innerHTML=result1_t+'<br />'+result2_t+'<br />'+result3_t;
}

function filter_study_js(){
    function sub_filter_study_js_isBigEnough(value){
        return value >= 10;
    }
    //---
    var filtered_list = [12, 5, 8, 130, 44].filter(sub_filter_study_js_isBigEnough);
    var long_words_list = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'].filter(one_word => one_word.length > 6);
    var filtered2_list = [12, 5, 8, 130, 44].filter( element => element < 0 );
    
    var bljg=JSON.stringify(filtered_list)+' '+Array.isArray(filtered_list);
    bljg=bljg+'<br />'+JSON.stringify(long_words_list)+' '+Array.isArray(long_words_list);
    bljg=bljg+'<br />'+JSON.stringify(filtered2_list)+' '+Array.isArray(filtered2_list);
    document.getElementById('td_interactive_info').innerHTML=bljg;
}

function map_study_js(){
    var v1=['10','1.1', '2.2e2', '3e300'].map(Number);
    var v2=['10','1.1', '2.2e2', '3e300'].map( str => parseInt(str) );

    var numbers = [1, 4, 9];
    var v3 = numbers.map(function(num){
        return Math.sqrt(num);
    });

    var bljg=JSON.stringify(v1)+' '+Array.isArray(v1)+'<br />'+JSON.stringify(v2)+' '+Array.isArray(v2)+'<br />'+JSON.stringify(v3)+' '+Array.isArray(v3);
    document.getElementById('td_interactive_info').innerHTML=bljg;
}

function flat_study_js(){
    function sub_flat_study_js_elements(csarray){
        return '<tr><td valign="top" style="padding:0rem 5rem;">'+JSON.stringify(csarray)+'</td></tr>';
    }
    //-----------------------
    var v1 = [1, 2, [3, 4]].flat();
    var v2 = [1, 2, [3, 4, [5, 6]]].flat();
    var v3 = [1, 2, [3, 4, [5, 6]]].flat(2);
    var v4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]].flat(Infinity);
    
    var bljg='<table>';
    bljg=bljg+sub_flat_study_js_elements(v1)+sub_flat_study_js_elements(v2)+sub_flat_study_js_elements(v3)+sub_flat_study_js_elements(v4);
    bljg=bljg+'</table>';
    document.getElementById('td_interactive_info').innerHTML=bljg;
}

function new_map_study_js(){
    var list_t=[['phone', true], ['computer', [3,4,'d']], ['television', 'aaa'], ['gameBoy', 3999],];
    var map_t=new Map(list_t);
    var bljg=['gameboy: '+map_t.get('gameboy')];    
    bljg.push('gameBoy: '+map_t.get('gameBoy'));
    bljg.push('television: '+map_t.get('television'));
    bljg.push('computer: '+map_t.get('computer'));
    console.log(map_t.get('computer'));
    document.getElementById('td_interactive_info').innerHTML=bljg.join('<br />');
}

function li_filter_study_js(cskey){
    var olis=document.querySelectorAll('ol#ol_menu li');
    obj_search_show_hide_b(olis,'',cskey,klmenu_check_b('span_reg_study',false),true);
}

function compress01str_study_js(str='0101000111'){
    let compressed = '';
    let count = 1;
    
    for (let blxl = 1,lent=str.length;blxl <= lent; blxl++){
        if (str[blxl] === str[blxl - 1] && count<9){
            count++;
        } else {
            compressed += `${str[blxl - 1]}${count}`;
            count = 1;
        }
    }
    
    var recover_str=recover01str_study_js(compressed);
    var result_t=[str,compressed,recover_str,str==recover_str];
    console.log(result_t);
    document.getElementById('td_interactive_info').innerHTML=result_t.join('<br />');
    return compressed;
}

function recover01str_study_js(compressedStr){
    let decompressed = '';
    for (let blxl = 0,lent=compressedStr.length; blxl<lent; blxl += 2){
        const char = compressedStr[blxl];
        const num = parseInt(compressedStr[blxl + 1], 10);
        decompressed += char.repeat(num);
    }

    return decompressed;
}

function li_show_study_js(){
    study_js_type_dict_global={   //全局变量，*表示显示源代码但不执行 - 保留注释
    //study_dict_start
    'filter':['filter_study_js'],
    'map':['map_study_js'],    
    'flat':['flat_study_js'],
    'find':['find_study_js'],
    'reduce':['reduce_study_js'],    
    'Object.entries':['object_entries_study_js'],
    'Object.fromEntries':['objects_from_entries_study_js'],
    'new Map':['new_map_study_js'],
    '01compress':['compress01str_study_js','*recover01str_study_js'],
    //study_dict_end
    }
        
    var bljg=[];
    for (let blkey in study_js_type_dict_global){
        bljg.push('<li><span class="span_link" onclick="run_source_study_js(\''+blkey+'\');">'+blkey+'</span></li>');
    }
    document.getElementById('ol_menu').innerHTML=bljg.join('\n');
    current_li_value_study_js_global=Object.keys(study_js_type_dict_global)[0];
}

function run_source_study_js(cstype,view_source=true){
    var otd=document.getElementById('td_interactive_info');
    otd.innerHTML='';
    otd.setAttribute('align','');
    document.getElementById('div_interactive_info').style.display='none';
    
    if (! cstype in study_js_type_dict_global){return;}
    current_li_value_study_js_global=cstype;
    var fun_list=study_js_type_dict_global[cstype];

    var otd=document.getElementById('td_study_js');
    run_or_view_source_klh_b(view_source,fun_list,otd);
}

function menu_study_js(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target=_blank>MDN</a>',    
    '<span id="span_reg_study" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'📎','12rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_study',true);
}

function init_study_js(){
    document.getElementById('td_study_js').style.height=body_height_study_js_global*0.9+'px';
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('td#td_study_list span.oblong_box'));    
    input_with_x_b('input_search',8);
    
    li_show_study_js();
    menu_study_js();
}
