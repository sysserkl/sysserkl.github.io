function number_poker24(israndom=true){
    result_poker24_global='';
    calculate_times_poker24_global=0;
    document.getElementById('p_result').innerHTML='&nbsp;';
    for (let blxl=0,lent=poker_24_global.length;blxl<lent;blxl++){
        if (israndom){
            poker_24_global[blxl]=randint_b(1,max_num_poker24_global);
        }
        var bljg=number_poker_b(poker_24_global[blxl],'random')+'&nbsp;';
        document.getElementById('td_24_'+(blxl+1)).innerHTML=bljg;
    }
}

function init_poker24(){    
    var blheight=document_body_offsetHeight_b();
    var bljg=`<table id="table_24" width=100%>
<tr>
<td id="td_24_1" align=center valign=middle></td>
<td id="td_24_2" align=center valign=middle></td>
</tr><tr>
<td id="td_24_3" align=center valign=middle></td>
<td id="td_24_4" align=center valign=middle></td>
</tr>
</table>
<div id="div_content">
<p align=center><span class="aclick" onclick="show_result_poker24();">答案</span>
<span class="aclick" onclick="number_poker24();">New Game</span> 
<select id="select_poker24" style="height:2rem;"><option></option><option>input</option><option>scan all</option><option>result all</option><option>near values</option></select> 
<span class="aclick" onclick="do_select_poker24();">执行</span></p>
<p align=center id="p_result">&nbsp;</p>
</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',bljg);
    number_poker24(true);
    
    var odiv=document.getElementById('div_content');
    var rect = odiv.getBoundingClientRect();
    document.getElementById('table_24').style.height=(blheight-rect.height-10)+'px';
}

function do_select_poker24(){
    var cstype=document.getElementById('select_poker24').value;
    switch (cstype){
        case 'input':
            input_poker24();
            break;
        case 'scan all':
            scan_all_poker24();
            break;
        case 'result all':
            result_all_poker24();
            break;
        case 'near values':
            near_values_poker24();
            break;
    }
}

function near_values_poker24(){
    var result_t=[];
    for (let item of ['1','2','99']){
        var answers=local_storage_get_b('answers_'+item+'_poker24',-1,true);
        for (let one_answer of answers){
            one_answer=one_answer.split(',');
            if (one_answer.length!==5){continue;}
            try {
                let blvalue=eval(one_answer[4]);
                if (blvalue!==calculate_number_global){
                    result_t.push([one_answer].join(',')+'='+blvalue);
                }
            } catch (error){
                console.log(error);
            }            
        }
    }
    
    document.body.innerHTML='<textarea style="margin:0.5rem; height:600px">'+result_t.join('\n')+'</textarea>';    
}

function max_min_sort_poker24(){
    try {    
        var value1=eval(value1);
        var value2=eval(value2);
        if (value1!==parseInt(value1) || value2!==parseInt(value2)){
            return [false,false];
        }
        [value1,value2]=[Math.max(value1,value2),Math.min(value1,value2)];
        if (value1<0){
            return [false,false];
        }
    } catch (error){
        return [false,false];
    }    
    return [value1,value2];
}

function add_type_poker24(value1,value2,do_eval=false){
    if (do_eval){
        [value1,value2]=max_min_sort_poker24(value1,value2);
        if (value1===false || value2===false){return;}
    }

    let blfound=false;
    for (let item of sign_list_poker24_global){
        if (eval_poker24(value1+item+value2)){
            let blkey=value1+'_'+value2;
            combination2_poker24_global[blkey]=item;
            blfound=true;
            switch (item){
                case '+':
                    combination2_poker24_global[value1+'_-'+value2]='-';
                    combination2_poker24_global[value2+'_-'+value1]='-';
                    break;
                case '-':
                    combination2_poker24_global[value1+'_-'+value2]='+';
                    break;                        
                case '*':
                    combination2_poker24_global['-'+value2+'_-'+value1]='*';  //大值在前 - 保留注释
                    break;                        
            }
            break;
        }
    }
    
    if (use_xx_poker24_global && !blfound){
        if (eval_poker24(value2+'**'+value1)){
            let blkey=value2+'_'+value1;  //此时小值在前 - 保留注释
            console.log('reverse',blkey);       //当求值为某些值，如64时，可found - 保留注释
            combination2_poker24_global[blkey]='**';
            blfound=true;
        }
    }
    
    if (!blfound){
        no_result2_poker2_global.add(value1+'_'+value2);    
    }
}

function all_combination2_poker24(){
    function sub_all_results_poker24_one_step(){
        if (blb>bla){   //仅适合于结果>1的情况 - 保留注释
            bla=bla+1;
            blb=0;
        }  
        if (bla>max_num_poker24_global*max_num_poker24_global){ //应该是 max_num_poker24_global*max_num_poker24_global*max_num_poker24_global，但太长 - 保留注释
            console.log('all_combination2_poker24() 费时：'+(performance.now() - t0) + ' milliseconds');
            args_poker24();
            return;
        }
        
        add_type_poker24(bla,blb);
        
        blb=blb+1;
        blxl=blxl+1;                
        if (blxl % 1000 == 0){
            console.log(blxl);
            setTimeout(sub_all_results_poker24_one_step,1);
        } else {
            sub_all_results_poker24_one_step();
        }
    }
    //-----------------------
    var t0 = performance.now();    
    var bla=0, blb=0;
    var blxl=0;
    sub_all_results_poker24_one_step();    
}

function sign_list_get_poker24(){
    if (use_xx_poker24_global){
        sign_list_poker24_global.push('**');
    }
}

function show_result_poker24(){
    function sub_show_result_poker24_generator(){
        var t0 = 0; 
        var t1 = 0;
        if (result_poker24_global==''){
            t0 = performance.now();    
            calculate_poker24(poker_24_global);
            if (result_poker24_global==''){
                result_poker24_global='无结果';
            }
            var t1=performance.now();
        }
        document.getElementById('p_result').innerHTML=result_poker24_global+' 计算次数：'+calculate_times_poker24_global+(t1-t0==0?'':'; 费时：'+(t1 - t0) + ' milliseconds');
    }
    //-----------------------
    document.getElementById('p_result').innerHTML='计算中...';
    setTimeout(sub_show_result_poker24_generator,1);
}

function input_poker24(csnumber=''){
    if (csnumber==''){
        var csnumber=prompt('输入计算的数字，以逗号或空格隔开') || '';
    }
    if (csnumber==''){return;}
    
    csnumber=csnumber.replace(/[,，]/g,' ');
    csnumber=csnumber.replace(/\s+/g,' ');

    var list_t=csnumber.trim().split(' ').slice(0,4);
    if (list_t.length!==4){return;}
    
    poker_24_global=list_t;
    number_poker24(false);
}

function assemble_poker24(cslist){
    if (cslist.length<2){return cslist;}
    let list_t=[];
    let right_part_list=cslist.slice(2,);
    let blleft='(';
    let blright=')';
    if (cslist.length==2){
        blleft='';
        blright='';
    }
    for (let asign of ['+','-','*','/']){
        list_t.push([blleft+cslist[0]+asign+cslist[1]+blright].concat(right_part_list));
    }
    if (use_xx_poker24_global){
        list_t.push([blleft+cslist[0]+'**'+cslist[1]+blright].concat(right_part_list));
    }
    
    return list_t;
}

function eval_poker24(eval_str){
    try {
        let blvalue=eval(eval_str).toFixed(3);
        if (blvalue==calculate_number_global+'.000'){
            return true;
        }
    } catch (error){
        console.log(error);
    }
    return false;
}

function is_in_dict_poker24(cslist){
    function sub_is_in_dict_poker24_one_round(value1,value2,str1,str2){
        let blkey=value1+'_'+value2;
        if (blkey in combination2_poker24_global){
            let blno=(value1>value2?1:2);
            //console.log('found'+blno,str1+combination2_poker24_global[blkey]+str2); - 此行保留
            scan_found_type_poker24_global=blno;
            return str1+combination2_poker24_global[blkey]+str2;
        }    
        return '';
    }
    //-----------------------
    try {    
        var blvalue1=eval(cslist[0]);
        var blvalue2=eval(cslist[1]);
        if (blvalue1!==parseInt(blvalue1) || blvalue2!==parseInt(blvalue2)){
            return '';
        }

        var blvalue=sub_is_in_dict_poker24_one_round(blvalue1,blvalue2,cslist[0],cslist[1]);
        if (blvalue==''){
            blvalue=sub_is_in_dict_poker24_one_round(blvalue2,blvalue1,cslist[1],cslist[0]);
        }
        return blvalue;
    } catch (error){
        console.log(error);
        return '';
    }
    return '';
}

function is_no_result_poker24(cslist){
    var value1,value2;
    [value1,value2]=max_min_sort_poker24(cslist[0],cslist[1]);
    if (value1!==false && value2!==false){
        if (no_result2_poker2_global.has(value1+'_'+value2)){
            result_poker24_global='';
            return true;
        }
    }
    return false;
}

function combination_mode_generate_poker24(){
    let result_t=[];
    let one_group4=['a','b','c','d'];
    let list_t4=permutator_poker24(one_group4);
    for (let item4 of list_t4){
        let groups3=assemble_poker24(item4);
        for (let one_group3 of groups3){
            let list_t3=permutator_poker24(one_group3);
            for (let item3 of list_t3){
                let groups2=assemble_poker24(item3);
                for (let one_group2 of groups2){    
                    result_t.push(one_group2);
                }
            }
        }
    }
    result_t.sort(function (a,b){
        return (a[0]+a[1]).includes('/') || (a[0]+a[1]).includes('**'); //有除法或乘方的放在后面 - 保留注释
    });
    for (let item of result_t){
        combination_mode_poker24_global.add(item);
    }
}

function mode_replace_poker24(csmode,cslist){
    return csmode.replace('a',cslist[0]).replace('b',cslist[1]).replace('c',cslist[2]).replace('d',cslist[3]);
}

function calculate_poker24(one_group4){
    if (combination_mode_poker24_global.size==0){
        combination_mode_generate_poker24();
    }

    let blfound=false;
    for (let one_mode of combination_mode_poker24_global){
        let one_group2=[
        mode_replace_poker24(one_mode[0],one_group4),
        mode_replace_poker24(one_mode[1],one_group4)
        ];
        calculate_times_poker24_global=calculate_times_poker24_global+1;                      
        
        let check_dict=is_in_dict_poker24(one_group2);
        if (check_dict!==''){ 
            result_poker24_global=check_dict;
            return;
        }
        
        if (is_no_result_poker24(one_group2)){continue;}                                
        
        let list_t2=permutator_poker24(one_group2);
        for (let item2 of list_t2){
            let groups1=assemble_poker24(item2);
            for (let one_group1 of groups1){
                calculate_times_poker24_global=calculate_times_poker24_global+1;                      
                if (eval_poker24(one_group1[0])){
                    result_poker24_global=one_group1[0];//+'='+calculate_number_global;
                    scan_found_type_poker24_global=99;
                    blfound=true;
                    break;
                }
            }
            groups1=null;
            if (blfound){break;}
        }
        list_t2=null;
    }
}

function result_all_poker24(){
    var blstr=[];
    for (let item of ['0','1','2','99']){
        var answers=local_storage_get_b('answers_'+item+'_poker24',-1,false);
        var bllen=answers.split('\n').length;
        blstr.push('<td valign=top><textarea style="height:600px">answers_'+item+'('+bllen+')'+'\n'+answers+'</textarea></td>');
    }
    document.body.innerHTML='<table width=90%><tr>'+blstr.join('\n')+'</tr></table>';
}

function scan_all_poker24(){
    function scan_all_poker24_one_round(){        
        if (owindow.closed){
            blno=blno+1;
            if (blno>=bllen){
                document.title=old_title;
                result_all_poker24();
                console.log('scan_all_poker24() 费时：'+(performance.now() - t0) + ' milliseconds');    
                return;
            }
            document.title=(blno+1)+'/'+bllen+' - '+old_title;
            owindow=window.open('?scan='+list_t[blno]);
        }
        setTimeout(scan_all_poker24_one_round,1000);
    }
    //-----------------------
    if (!confirm('是否扫描？')){return;}

    var t0 = performance.now();    
    
    var old_title=document.title;
    
    var list_t=['1,7'];
    for (let blxl=8;blxl<=max_num_poker24_global;blxl++){
        list_t.push(blxl);
    }
    var blno=0;
    var bllen=list_t.length;
    document.title=(blno+1)+'/'+bllen+' - '+old_title;
    var owindow=window.open('?scan='+list_t[blno]);
    scan_all_poker24_one_round();
}

function scan_one_poker24(start_num=1,end_num=-1){    //打开console会导致速度下降 - 保留注释
    function sub_scan_one_poker24_one_step(){
        while (true){
            if (bld>blc){
                blc=blc+1;
                bld=1;
            }
            if (blc>blb){
                blb=blb+1;
                blc=1;
            }
            if (blb>bla){
                bla=bla+1;
                blb=1;
            }
            if (bla>end_num){
                console.log('scan_one_poker24() 费时：'+(performance.now() - t0) + ' milliseconds');    
                console.log(scan_found_list_poker24_global);
                
                for (let item of ['0','1','2','99']){
                    var answer_set_list=local_storage_get_b('answers_'+item+'_poker24',-1,true);
                    for (let an_no=0,lenb=answer_set_list.length;an_no<lenb;an_no++){
                        var part1=parseInt(answer_set_list[an_no].split(',')[0]);
                        if (part1>=start_num && part1<=end_num){
                            answer_set_list[an_no]='';
                        } else if (part1<1 || part1>max_num_poker24_global){
                            answer_set_list[an_no]='';
                        }
                    }
                    answer_set_list=answer_set_list.concat(scan_found_list_poker24_global['found'+item]);
                    answer_set_list.sort();
                    localStorage.setItem('answers_'+item+'_poker24',answer_set_list.join('\n').trim());    
                }
                document.title=old_title;
                window.close();
                return;
            }
            calculate_times_poker24_global=0;
            result_poker24_global='';
            scan_found_type_poker24_global=0;
            
            var in_cache=false;
            for (let item of ['1','2','99']){
                var blkey=[bla,blb,blc,bld].join('_');
                if (blkey in answer_get_list[item]){
                    if (!answer_get_list[item][blkey].includes('**') || use_xx_poker24_global){
                        if (eval_poker24(answer_get_list[item][blkey])){
                            result_poker24_global=answer_get_list[item][blkey];//+'='+calculate_number_global;
                            scan_found_type_poker24_global=item;                    
                            in_cache=true;
                            console.log(blkey,'in cache');
                            break;
                        }
                    }
                }
            }
            
            if (!in_cache){
                calculate_poker24([bla,blb,blc,bld]);
            }
            
            scan_found_list_poker24_global['found'+scan_found_type_poker24_global].push([bla,blb,blc,bld,result_poker24_global].join(','));
            
            console.log(bla,blb,blc,bld,result_poker24_global);
            document.title=(in_cache?'(c) ':'')+[bla,blb,blc,bld,result_poker24_global].join(' ')+' - scan '+start_num+' - '+end_num+' - '+old_title;
            bld=bld+1;
            blxl=blxl+1;
            if (blxl % 5 == 0){break;}
        }
        setTimeout(sub_scan_one_poker24_one_step,1);
    }
    //-----------------------
    if (isNaN(start_num)){return;}
    if (start_num<1 || start_num>max_num_poker24_global){return;}
    if (end_num==-1){
        end_num=start_num;
    }
    end_num=Math.min(max_num_poker24_global,Math.max(start_num,end_num));
    var old_title=document.title;
    document.title='scan '+start_num+' - '+end_num+' - '+old_title;
    var t0 = performance.now();    

    scan_found_list_poker24_global={'found0':[],'found1':[],'found2':[],'found99':[]};
    var bla=start_num,blb=1,blc=1,bld=1;
    var blxl=0;

    var answer_get_list={'1':{},'2':{},'99':{}};
    for (let item of ['1','2','99']){
        var cached_list=local_storage_get_b('answers_'+item+'_poker24',-1,true);
        for (let parts of cached_list){
            parts=parts.split(',');
            if (parts.length!==5){continue;}
            var part1=parseInt(parts[0]);
            if (part1>=start_num && part1<=end_num){
                answer_get_list[item][parts.slice(0,4).join('_')]=parts[4];
            }
        }
    }
    sub_scan_one_poker24_one_step();
}

function args_poker24(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0){
       for (let item of cskeys){
            if (item.substring(0,2)=='c='){
                calculate_number_global=parseInt(item.substring(2,).trim());
            } else if (item.substring(0,2)=='n='){
                input_poker24(item.substring(2,).trim());
            } else if (item.substring(0,5)=='scan='){
                var list_t=item.substring(5,).trim().split(',');
                list_t[0]=parseInt(list_t[0]);
                if (list_t.length==1){
                    scan_one_poker24(list_t[0],list_t[0]);
                } else {
                    scan_one_poker24(list_t[0],parseInt(list_t[1]));
                }
            }
       }
    }
}

function permutator_poker24(inputArr){
    //https://stackoverflow.com/questions/9960908/permutations-in-javascript/37580979#37580979 - 保留注释
    var length = inputArr.length;
    var result = [inputArr.slice()];
    var c = new Array(length).fill(0);
    var i = 1, k, p;

    while (i < length){
        if (c[i] < i){
            k = i % 2 && c[i];
            p = inputArr[i];
            inputArr[i] = inputArr[k];
            inputArr[k] = p;
            ++c[i];
            i = 1;
            result.push(inputArr.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}
