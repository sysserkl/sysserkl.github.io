
function search_emoji(){
    var cskey=document.getElementById('input_emoji_search').value;
    if (cskey.trim()==''){
        cskey='.*(:r)';
    }
    var isreg=false;
    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    var bljg='';
    var blcount=0;
    for (var blxl=0;blxl<emoji_global.length;blxl++){
        var item=emoji_global[blxl];
        if (!item.includes('=>')){continue;}
        var blfound=str_reg_search_b(item,cskey,isreg);
        if (blfound==-1){
            break;
        }
        if (blfound){
            bljg=bljg+'<p><span class="span_no">'+(blcount+1)+'. </span>'+item+'</p>';
            blcount=blcount+1;
            if (blcount>=20000){
                break;
            }
        }
    }
    document.getElementById('divhtml').innerHTML=bljg;
    document.getElementById('select_chapter').value='-1';
    document.getElementById('select_sub').innerHTML='';
}

function main_options_emoji(){
    var bljg='<option value=-1></option>';
    var blselected=false;
    for (let blxl=0;blxl<emoji_global.length;blxl++){
        var item=emoji_global[blxl];
        if (item.substring(0,3)=='== ' && item.slice(-3,)==' =='){
            if (blselected==false){
                bljg=bljg+'<option value='+blxl+' selected>';
                blselected=true;
            }
            else {
                bljg=bljg+'<option value='+blxl+'>';
            }
            bljg=bljg+item.substring(3,item.length-3)+'</option>\n';
        }
    }
    document.getElementById('select_chapter').innerHTML=bljg;
    minor_options_emoji();
}

function minor_options_emoji(csno=0,csrnd=false){
    if (csno==-1){
        document.getElementById('divhtml').innerHTML='';
        return;
    }
    var item=emoji_global[csno];
    if (item.substring(0,3)!=='== ' || item.slice(-3,)!==' =='){
        return;
    }
    var enname=item.substring(3,item.length-3);
    var bljg='';
    var list_t=[];
    for (var blxl=parseInt(csno)+1;blxl<emoji_global.length;blxl++){
        if (emoji_global[blxl].substring(0,4)=='=== ' && emoji_global[blxl].slice(-4,)==' ==='){
            bljg=bljg+'<option value='+blxl+'>'+emoji_global[blxl].substring(4,emoji_global[blxl].length-4).replace(enname,'')+'</option>\n';
            list_t.push(blxl);
            continue;
        }
        if (emoji_global[blxl].substring(0,3)=='== ' && emoji_global[blxl].slice(-3,)==' =='){
            break;
        }
    }
    document.getElementById('select_sub').innerHTML=bljg;
    if (list_t.length>0){
        if (csrnd){
            list_t.sort(randomsort_b);
        }
        document.getElementById('select_sub').value=list_t[0];
        one_chapter_emoji(list_t[0]);
    }
}

function one_chapter_emoji(startno=0){
    if (startno==-1){
        document.getElementById('divhtml').innerHTML='';
        document.getElementById('select_sub').innerHTML='';
        return;
    }
    var found2=false;
    var found3=false;
    var bljg='';
    var blno=1;
    for (let blxl=startno;blxl<emoji_global.length;blxl++){
        if (blxl==0 || found2==false && emoji_global[blxl].substring(0,3)=='== ' && emoji_global[blxl].slice(-3,)==' =='){
            continue;
        }
        if (found2 && emoji_global[blxl].substring(0,3)=='== ' && emoji_global[blxl].slice(-3,)==' ==' || found3 && emoji_global[blxl].substring(0,4)=='=== ' && emoji_global[blxl].slice(-4,)==' ==='){
            break;
        }

        if (emoji_global[blxl].substring(0,4)=='=== ' && emoji_global[blxl].slice(-4,)==' ==='){
            found3=true;
            //bljg=bljg+'<h3>'+emoji_global[blxl].substring(4,emoji_global[blxl].length-4)+'</h3>';
        }
        else {
            var tdnum=emoji_global[blxl].trim().split(' ')[0];
            bljg=bljg+'<p><span class="span_no">'+blno+'. </span>'+emoji_global[blxl]+'</p>\n';
            blno=blno+1;
        }

        if (emoji_global[blxl].substring(0,3)=='== ' && emoji_global[blxl].slice(-3,)==' =='){
            found2=true;
        }
    }
    document.getElementById('divhtml').innerHTML=bljg;
}
