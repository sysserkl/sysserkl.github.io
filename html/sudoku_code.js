function td_background_sd(csid,cstype='samenum'){
    //恢复原背景色
    var list_t=current_sd_global.split("");
    for (var blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var otd=document.getElementById('input_'+blxl);
        if (list_t[blxl]=='0'){
            otd.style.backgroundColor='';
        } else {
            otd.style.backgroundColor='#e0e0e0';
        }
    }
    
    if (td_no_sd_global!==''){
        //以下4行暂时保存 - 保留注释
        //var otd=document.getElementById(td_no_sd_global);
        //if (otd){
            //otd.style.backgroundColor='white';
        //}
        
        //取消选中 - 保留注释
        if (csid==td_no_sd_global){
            td_no_sd_global='';
            return;
        }
    }
    
    var otd=document.getElementById(csid);
    if (otd){
        var list_t=related_tds_sd(parseInt(csid.split('_')[1]),cstype);
        for (let item of list_t){
            var otemp=document.getElementById('input_'+item);
            otemp.style.backgroundColor='#FFFF66';
        }
        otd.style.backgroundColor='lime';
        td_no_sd_global=csid;
    }
}

function inputvalue_sd(csvalue){
    if (td_no_sd_global!==''){
        var otd=document.getElementById(td_no_sd_global);
        if (otd){
            otd.innerHTML=csvalue;
        }
    }
    inputvalue_color_sd();
}
function inputvalue_color_sd(){
    var otds=document.getElementsByClassName('td_sudoku');
    var bljg='';
    for (let item of otds){
        if (item.innerHTML==empty_sd_global){continue;}
        bljg=bljg+item.innerHTML;
    }
    var list_count=[];
    for (let blxl=0;blxl<9;blxl++){
        list_count.push(0);
    }
    var list_t=bljg.split('');
    for (let item of list_t){
        list_count[parseInt(item)-1]=list_count[parseInt(item)-1]+1;
    }
    
    for (let blxl=0;blxl<9;blxl++){
        var otd=document.getElementById('td_inputvalue_sd'+(blxl+1));
        if (list_count[blxl]==9){
            otd.style.color='green';
        } else if (list_count[blxl]>9){
            otd.style.color='grey';
        } else {
            otd.style.color='';
        }
    }
}

function getvalue_sd(){
    var list_t=current_sd_global.split('');
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        if (list_t[blxl]=='0'){
            var oinput=document.getElementById('input_'+blxl);
            if (oinput && oinput.innerHTML.trim()!==empty_sd_global){
                list_t[blxl]=oinput.innerHTML;
            }
        }
    }
    return list_t;
}

function select_value_sd(csstr,csno,csvalue){
    var list_t=csstr.split(",");
    list_t[csno]=csvalue;
    var bljg=branchs_sd(list_t.toString(),false);
    return bljg[0];
}

function one_result_sd(csstr,csno,csvalue){
    var list_t=csstr.split(",");
    list_t[csno]=csvalue;
    var blvalue=check_sd(list_t);
    if (blvalue[0]==false){return false;}
    
    var bljg=[];

    while (true){
        var result_t=possible_values_sd(list_t);
        var found=false;
        if (result_t.length==0){return false;}
        
        for (let item of result_t){
            if (item[2].length==1){
                list_t[item[0]*9+item[1]*1]=item[2][0];
                bljg.push([item[0]*9+item[1]*1,item[2][0]]);
                found=true;
            }
        }

        var blvalue=check_sd(list_t);
        if (blvalue[0]==false){return false;}
        
        if (found==false){break;}
    }
    return bljg;
}

function fill_sd(){
    state_count_sd_global=0;
    var list_t=getvalue_sd();
    var tmp_t=branchs_sd(list_t.toString());

    var testfound=true;
    while (testfound){
        //结果判断 - 保留注释
        if (tmp_t[0]==false){
            return tmp_t;
        }
        
        if (tmp_t[2].length==0){break;}
        
        //空白单元格 - 可选值猜测 - 保留注释
        for (let item of tmp_t[2]){
            var foundtrue=0;
            var thevalue='';
            for (let avalue of item[2]){
                tmp_t[1][item[0]*3+item[1]]=avalue;
                if (branchs_sd(tmp_t[1].toString())[0]){
                    foundtrue=foundtrue+1;
                    thevalue=avalue;
                }
            }
            if (foundtrue==1){
                console.log(state_count_sd_global,'fill',item[0],item[1],thevalue);
                tmp_t[1][item[0]*3+item[1]]=thevalue;
                //重定义 tmp_t - 保留注释
                tmp_t=branchs_sd(tmp_t[1].toString());
                testfound=true;
                break;
            } else {
                tmp_t[1][item[0]*3+item[1]]="0";
                testfound=false;
            }
        }
    }
    //确定的结果 - 保留注释
    for (let blxl=0;blxl<81;blxl++){
        if (tmp_t[1][blxl]=="0"){continue;}
        var oinput=document.getElementById('input_'+blxl);
        if (oinput){
            if (oinput.innerHTML==empty_sd_global){
                oinput.innerHTML=tmp_t[1][blxl];
                oinput.style.color="red";
            }
        }
    }

    document.getElementById('span_state').innerHTML='调用 branchs_sd(): '+state_count_sd_global+' 次';
}

function possible_values_sd(list_t){
    //不改变list_t值，直接传递list_t - 保留注释
    var result_t=[];
    for (let blxl=0;blxl<81;blxl++){
        var item=list_t[blxl];
        if (item!=='0'){continue;}
        
        var blrow=Math.ceil((blxl+1)/9)-1;
        var blcol=(blxl+1)%9;
        if (blcol==0){blcol=9;}
        blcol=blcol-1;
        //横向 - 保留注释
        var arow=[];
        for (let blc=0;blc<9;blc++){
            if (list_t[blrow*9+blc]=='0'){continue;}
            arow.push(list_t[blrow*9+blc]);
        }
        //纵向 - 保留注释
        var acol=[];
        for (let blr=0;blr<9;blr++){
            if (list_t[blcol+blr*9]=='0'){continue;}
            acol.push(list_t[blcol+blr*9]);
        }
        if (blrow<3){
            var blockx=0;
        } else if (blrow<6){
            var blockx=3;
        } else {
            var blockx=6;
        }
        
        if (blcol<3){
            var blocky=0;
        } else if (blcol<6){
            var blocky=3;
        } else {
            var blocky=6;
        }
        var blocks=[];
        for (let blx=0;blx<3;blx++){
            for (let bly=0;bly<3;bly++){
                if (list_t[bly*9+blx+blockx*9+blocky]=='0'){continue;}
                blocks.push(list_t[bly*9+blx+blockx*9+blocky]);
            }
        }
        result_t.push([blrow,blcol,array_difference_b(["1","2","3","4","5","6","7","8","9"],array_unique_b(arow.concat(acol).concat(blocks)))]);
    }
    return result_t;
}

function branchs_sd(csstr,do_select_value_sd=true){
    state_count_sd_global=state_count_sd_global+1;
    var list_t=csstr.split(",");

    while (true){
        var blvalue=check_sd(list_t);
        if (blvalue[0]==false){
            console.log(state_count_sd_global,'0',blvalue);
            document.getElementById('span_state').innerHTML='<font color="red">✘</font>: '+blvalue[1];
            return blvalue;
        }
        
        var result_t=possible_values_sd(list_t);
        var found=false;

        //row 唯一 - 保留注释
        console.log(state_count_sd_global,'1.row');
        for (let blr=0;blr<9;blr++){
            var tmp_t=[];
            for (var blxl=0;blxl<=9;blxl++){
                tmp_t[blxl]=0;
            }
            for (let item of result_t){
                if (item[0]==blr){
                    for (let blnum of item[2]){
                        tmp_t[parseInt(blnum)]= tmp_t[parseInt(blnum)]+1;
                    }
                }
            }
            for (let blxl=0;blxl<=9;blxl++){
                if (tmp_t[blxl]==1){
                    for (let item of result_t){
                        if (item[0]==blr && item[2].includes(blxl.toString())){
                            list_t[item[0]*9+item[1]]=blxl.toString();
                            found=true;
                        }
                    }
                }
            }            
        }
        
        //以下各个 found continue 必须保留，否则可能无法求解 - 保留注释
        if (found){continue;}
        
        //col 唯一 - 保留注释
        console.log(state_count_sd_global,'1.col');        
        for (let blc=0;blc<9;blc++){
            var tmp_t=[];
            for (let blxl=0;blxl<=9;blxl++){
                tmp_t[blxl]=0;
            }
            for (let item of result_t){
                if (item[1]==blc){
                    for (let blnum of item[2]){
                        tmp_t[parseInt(blnum)]= tmp_t[parseInt(blnum)]+1;
                    }
                }
            }
            for (let blxl=0;blxl<=9;blxl++){
                if (tmp_t[blxl]==1){
                    for (let item of result_t){
                        if (item[1]==blc && item[2].includes(blxl.toString())){
                            list_t[item[0]*9+item[1]]=blxl.toString();
                            found=true;
                        }
                    }
                }
            }            
        }       

        if (found){continue;}
        
        //block 唯一 - 保留注释
        console.log(state_count_sd_global,'1.block');        
        for (let blr=0;blr<3;blr++){
            for (let blc=0;blc<3;blc++){
                var tmp_t=[];
                for (let blxl=0;blxl<=9;blxl++){
                    tmp_t[blxl]=0;
                }          
                  
                for (let item of result_t){
                    if (item[0]>=blr*3 && item[0]<(blr+1)*3 && item[1]>=blc*3 && item[1]<(blc+1)*3){
                        for (let blnum of item[2]){
                            tmp_t[parseInt(blnum)]= tmp_t[parseInt(blnum)]+1;
                        }
                    }
                }
                for (let blxl=0;blxl<=9;blxl++){
                    if (tmp_t[blxl]==1){
                        for (let item of result_t){
                            if (item[0]>=blr*3 && item[0]<(blr+1)*3 && item[1]>=blc*3 && item[1]<(blc+1)*3 && item[2].includes(blxl.toString())){
                                list_t[item[0]*9+item[1]]=blxl.toString();
                                found=true;
                            }
                        }
                    }
                }      
            }      
        }        
        
        if (found){continue;}
        
        console.log(state_count_sd_global,'2.1');
        
        for (let item of result_t){
            if (item[2].length==1){
                list_t[item[0]*9+item[1]*1]=item[2][0];
                found=true;
            }
        }

        if (found){continue;}
        
        console.log(state_count_sd_global,'2.2');
        for (let item of result_t){
            if (item[2].length!==2){continue;}
            
            var value1=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][0]);
            var value2=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][1]);
            
            if (value1==false || value2==false){continue;}
            if (value1.length<1 || value2.length<1){continue;}

            for (let array1 of value1){
                for (let array2 of value2){
                    if (array1[0]==array2[0] && array1[1]==array2[1]){
                        list_t[array1[0]]=array1[1];
                        found=true;
                    }
                }
            }            
        }
        
        if (found){continue;}
        
        console.log(state_count_sd_global,'2.3');
        for (let item of result_t){
            if (item[2].length!==3){continue;}
            
            var value1=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][0]);
            var value2=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][1]);
            var value3=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][2]);
            
            if (value1==false || value2==false || value3==false){continue;}
            if (value1.length<1 || value2.length<1 || value3.length<1){continue;}

            for (let array1 of value1){
                for (let array2 of value2){
                    for (let array3 of value3){
                        if (array1[0]==array2[0] && array1[0]==array3[0] && array1[1]==array2[1] && array1[1]==array3[1]){
                            list_t[array1[0]]=array1[1];
                            found=true;
                        }
                    }
                }
            }            
        }
        
        if (found){continue;}
        
        console.log(state_count_sd_global,'2.4');
        for (let item of result_t){
            if (item[2].length!==4){continue;}
            
            var value1=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][0]);
            var value2=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][1]);
            var value3=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][2]);
            var value4=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][3]);

            if (value1==false || value2==false || value3==false || value4==false){continue;}
            if (value1.length<1 || value2.length<1 || value3.length<1 || value4.length<1){continue;}

            for (let array1 of value1){
                for (let array2 of value2){
                    for (let array3 of value3){
                        for (let array4 of value4){
                            if (array1[0]==array2[0] && array1[0]==array3[0] && array1[0]==array4[0] && array1[1]==array2[1] && array1[1]==array3[1] && array1[1]==array4[1]){
                                list_t[array1[0]]=array1[1];
                                found=true;
                            }
                        }
                    }
                }
            }
        }

        if (found){continue;}

        console.log(state_count_sd_global,'2.5');
        for (let item of result_t){
            if (item[2].length!==5){continue;}
            
            var value1=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][0]);
            var value2=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][1]);
            var value3=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][2]);
            var value4=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][3]);
            var value5=one_result_sd(list_t.toString(),item[0]*9+item[1],item[2][4]);

            if (value1==false || value2==false || value3==false || value4==false || value5==false){continue;}
            if (value1.length<1 || value2.length<1 || value3.length<1 || value4.length<1 || value5.length<1){continue;}

            for (let array1 of value1){
                for (let array2 of value2){
                    for (let array3 of value3){
                        for (let array4 of value4){
                            for (let array5 of value5){
                                if (array1[0]==array2[0] && array1[0]==array3[0] && array1[0]==array4[0] && array1[0]==array5[0] && array1[1]==array2[1] && array1[1]==array3[1] && array1[1]==array4[1] && array1[1]==array5[1]){
                                    list_t[array1[0]]=array1[1];
                                    found=true;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (found){continue;}
        
        //select_value_sd
        if (do_select_value_sd){
            console.log(state_count_sd_global,'3.2');
            for (var item of result_t){
                if (item[2].length==2){
                    var value1=select_value_sd(list_t.toString(),item[0]*9+item[1],item[2][0]);
                    var value2=select_value_sd(list_t.toString(),item[0]*9+item[1],item[2][1]);
                    if (value1==true && value2==false){
                        list_t[item[0]*9+item[1]]=item[2][0];
                        found=true;
                    } else if (value1==false && value2==true){
                        list_t[item[0]*9+item[1]]=item[2][1];
                        found=true;
                    } else if (value1==false && value2==false){
                        return [false,item.toString()];
                    }                    
                }
            }
            
            if (found){continue;}
            
            console.log(state_count_sd_global,'3.3');
            
            for (let item of result_t){
                if (item[2].length==3){
                    var value1=select_value_sd(list_t.toString(),item[0]*9+item[1],item[2][0]);
                    var value2=select_value_sd(list_t.toString(),item[0]*9+item[1],item[2][1]);
                    var value3=select_value_sd(list_t.toString(),item[0]*9+item[1],item[2][2]);
                    if (value1==true && value2==false && value3==false){
                        list_t[item[0]*9+item[1]]=item[2][0];
                        found=true;
                    } else if (value1==false && value2==true && value3==false){
                        list_t[item[0]*9+item[1]]=item[2][1];
                        found=true;
                    } else if (value1==false && value2==false && value3==true){
                        list_t[item[0]*9+item[1]]=item[2][2];
                        found=true;
                    } else if (value1==false && value2==false && value3==false){
                        return [false,item.toString()];
                    }                     
                }
            }
        }
        
        if (found==false){break;}
    }

    return [true,list_t,result_t];
}

function getvalue_check_sd(){
    var list_t=getvalue_sd();
    var bljg=check_sd(list_t);
    if (bljg[0]){
        document.getElementById('span_state').innerHTML='<font color="blue">✔</font>';
    } else {
        document.getElementById('span_state').innerHTML='<font color="red">✘</font>: '+bljg[1];
    }
}

function related_tds_sd(csnumber,cstype=''){
    //cstype samenum onlysamenum
    var list_t=[];
    if (cstype!=='onlysamenum'){
        var blrow=Math.ceil((csnumber+1)/9)-1;
        var blcol=(csnumber+1)%9;
        if (blcol==0){
            blcol=9;
        }
        blcol=blcol-1;
        
        
        for (let blxl=0;blxl<9;blxl++){
            list_t.push(blrow*9+blxl);
            list_t.push(blcol+blxl*9);
        }
       
        if (blrow<3){
            var blockx=0;
        } else if (blrow<6){
            var blockx=3;
        } else {
            var blockx=6;
        }
        
        if (blcol<3){
            var blocky=0;
        } else if (blcol<6){
            var blocky=3;
        } else {
            var blocky=6;
        }
        
        var blocks=[];
        for (let blx=0;blx<3;blx++){
            for (let bly=0;bly<3;bly++){
                list_t.push(bly*9+blx+blockx*9+blocky);
            }
        }
    }

    if (cstype=='samenum' || cstype=='onlysamenum'){
        var blvalue=document.getElementById('input_'+csnumber).innerHTML;
        if (blvalue!==empty_sd_global){
            var otds=document.getElementsByClassName('td_sudoku');
            for (let item of otds){
                if (item.innerHTML==blvalue){
                    list_t.push(parseInt(item.id.split('_')[1]));
                }
            }
        }
    }
    
    list_t.sort(function (a,b){return a>b ? 1 : -1;});
    return array_unique_b(list_t);
}

function check_sd(list_t){
    if (list_t.length<81){return [false,'81'];}
    //横向 - 保留注释
    for (let blrow=0;blrow<9;blrow++){
        var arow=[];
        for (let blcol=0;blcol<9;blcol++){
            if (list_t[blrow*9+blcol]=='0'){continue;}
            arow.push(list_t[blrow*9+blcol]);
        }
        var arowlen=arow.length;
        arow=array_unique_b(arow);
        if (arow.length<arowlen){
            return [false,'row'+(blrow+1)];
        }
        arow=array_unique_b(array_union_b(arow,['1','2','3','4','5','6','7','8','9']));
        if (arow.length>9){
            return [false,'row'+(blrow+1)];
        }
    }
    //纵向 - 保留注释
    for (let blcol=0;blcol<9;blcol++){
        var acol=[];
        for (let blrow=0;blrow<9;blrow++){
            if (list_t[blcol+blrow*9]=='0'){continue;}
            acol.push(list_t[blcol+blrow*9]);
        }
        var acollen=acol.length;
        acol=array_unique_b(acol);
        if (acol.length<acollen){
            return [false,'col'+(blcol+1)];
        }
        acol=array_unique_b(array_union_b(acol,['1','2','3','4','5','6','7','8','9']));
        if (acol.length>9){
            return [false,'col'+(blcol+1)];
        }
    }
    //block - 保留注释
    for (let blx=0;blx<3;blx++){
        for (let bly=0;bly<3;bly++){
            var arow=[];
            for (let blrow=0;blrow<3;blrow++){
                for (let blcol=0;blcol<3;blcol++){
                    if (list_t[bly*3*9+blx*3+blrow*9+blcol]=='0'){continue;}
                    arow.push(list_t[bly*3*9+blx*3+blrow*9+blcol]);
                }
            }
            var arowlen=arow.length;
            arow=array_unique_b(arow);
            if (arow.length<arowlen){
                return [false,'xy,'+(blx+1)+','+(bly+1)];
            }
            arow=array_unique_b(array_union_b(arow,['1','2','3','4','5','6','7','8','9']));
            if (arow.length>9){
                return [false,'xy,'+(blx+1)+','+(bly+1)];
            }
        }
    }
    return [true,''];
}

function input_range_sd(){
    var bljg='';
    bljg='<input type="range" min=1 max='+(sudoku_data_global.length+1)+' value=1 id="sudoku_range" style="width:20rem;" oninput="document.getElementById(\'span_no_sudoku\').innerHTML=\'第 \'+this.value+\' 题\';" onchange="show_sd(this.value-1);"> ';
    bljg=bljg+'<span class="span_box" id="span_no_sudoku" onclick="show_sd(parseInt(this.innerText.split(\' \')[1])-1);">第 1 题</span>';

    document.getElementById('klsudokuno').innerHTML = '<p align=center>'+bljg+'</p>';
}

function random_sd(){
    var rndnumber=randint_b(0,sudoku_data_global.length-1);
    document.getElementById('sudoku_range').value=rndnumber+1;
    document.getElementById('span_no_sudoku').innerHTML='第 '+(rndnumber+1)+' 题';
    show_sd(rndnumber);
}

function console_sd(cslist){
    var bljg='';
    console.log('=====================');
    for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
        bljg=bljg+cslist[blxl]+' ';
        if ((blxl+1)%3==0 && (blxl+1)%9 !== 0){
            bljg=bljg+'| ';
        }
        
        if (blxl==27 || blxl==54){
            console.log('---------------------');
        }        
        
        if ((blxl+1) % 9 ==0){
            console.log(bljg);
            bljg='';
        }
    }
    if (bljg!==''){
        console.log(bljg);
    }
    console.log('=====================');
}

function reform_sd(csstr=''){
    function sub_reform_sd_block(blarray){
        //block - 从左侧从上到下纵向顺序 - 保留注释
        var block_list=[];
        for (let blx=0;blx<3;blx++){
            for (let bly=0;bly<3;bly++){
                var arow=[];
                for (let blrow=0;blrow<3;blrow++){
                    for (let blcol=0;blcol<3;blcol++){
                        arow.push(blarray[bly*3*9+blx*3+blrow*9+blcol]);
                    }
                }
                block_list.push(arow);
            }
        }
        return block_list;
    }
    //-----------------------
    
    var blarray = csstr.split('');
    //以下console.log 都保留 - 保留注释
    console.log(0);
    console_sd(blarray);    
    //row - 保留注释
    var row_list=[];
    for (let blr=0;blr<9;blr++){
        var arow=[];
        for (let blc=0;blc<9;blc++){
            arow.push(blarray[blr*9+blc]);
        }
        row_list.push(arow);
    }

    var row_blocks=[row_list.slice(0,3).sort(randomsort_b),row_list.slice(3,6).sort(randomsort_b),row_list.slice(6,9).sort(randomsort_b)];
    blarray=[];
    for (let arowblock of row_blocks){
        for (let arow of arowblock){
            for (let anumber of arow){
                blarray.push(anumber);
            }
        }
    }
    console_sd(blarray);

    //column - 保留注释
    var col_list=[];
    for (let blc=0;blc<9;blc++){
        var acol=[];
        for (let blr=0;blr<9;blr++){
            acol.push(blarray[blc+blr*9]);
        }
        col_list.push(acol);
    }

    var col_blocks=[col_list.slice(0,3).sort(randomsort_b),col_list.slice(3,6).sort(randomsort_b),col_list.slice(6,9).sort(randomsort_b)];
    blarray=[];
    for (let blr=0;blr<9;blr++){
        for (let acol3 of col_blocks){
            for (let acol of acol3){
                blarray.push(acol[blr]);
            }
        }
    }
    console_sd(blarray);
    
    //block
    block_list=sub_reform_sd_block(blarray);

    var col3_blocks=[block_list.slice(0,3),block_list.slice(3,6),block_list.slice(6,9)].sort(randomsort_b);    
    blarray=[];
    for (let blr3=0;blr3<3;blr3++){
        for (let arow=0;arow<3;arow++){
            for (let acol3 of col3_blocks){
                for (let blc=arow*3;blc<(arow+1)*3;blc++){
                    blarray.push(acol3[blr3][blc]);
                }
            }
        }
    }
    
    console_sd(blarray);
    
    block_list=sub_reform_sd_block(blarray);
    
    var row3_blocks=[
    [block_list[0],block_list[3],block_list[6]],
    [block_list[1],block_list[4],block_list[7]],
    [block_list[2],block_list[5],block_list[8]],
    ].sort(randomsort_b);    
    blarray=[];
    for (let arow3 of row3_blocks){
        for (let blx=0;blx<3;blx++){
            for (let ablock of arow3){
                for (let blc=blx*3;blc<(blx+1)*3;blc++){
                    blarray.push(ablock[blc]);
                }
            }
        }
    }

    console_sd(blarray);
    return blarray;
}

function show_sd(csnumber,csreform=false){
	if (csnumber < 0 || csnumber > sudoku_data_global.length){return;}
    if (csnumber == sudoku_data_global.length){
        var blys='';
        for (let blxl=1;blxl<=81;blxl++){
            blys=blys+"0";
        }
    } else {
        var blys = sudoku_data_global[csnumber];
    }

    td_no_sd_global='';
    if (csreform){
       var blarray=reform_sd(blys); 
       current_sd_global='';
       for (let item of blarray){
            current_sd_global=current_sd_global+item;
        }
    } else {
	    var blarray = blys.split('');
        current_sd_global=blys;
    }
	var blstr = '<table class="table_sudoku" align=center width=1 border=0 cellspacing="0" cellpadding="0">';
	var bltmp;
	var blstyle;
    var border_style="0.1rem black solid;";
    
    //初始化背景色数组 - 保留注释
    
	for (let blxl in blarray){
		if (blxl%9 == 0){
            blstr = blstr + '<tr>';
        }
		bltmp = blarray[blxl];
		if (bltmp == "0"){
            bltmp = empty_sd_global;
        }
        blstyle='';
		if (blxl >= 27 && blxl <= 35 || blxl == 3 || blxl == 4 || blxl == 5){
			blstyle = blstyle + "border-top:"+border_style;
		}
		if (blxl >= 45 && blxl <= 53 || blxl == 75 || blxl == 76 || blxl == 77){
			blstyle = blstyle + "border-bottom:"+border_style;
		}
		if ((blxl+1-4)%9 == 0 || blxl == 27 || blxl == 36 || blxl == 45){
			blstyle = blstyle + "border-left:"+border_style;
		}		
		if ((blxl+1-6)%9 == 0 || blxl == 35 || blxl == 44 || blxl == 53){
			blstyle = blstyle + "border-right:"+border_style;
		}
        if (blarray[blxl]!=="0"){
            blstr = blstr + '<td class="td_sudoku" width=1 id="input_'+blxl+'" nowrap align=center style="'+blstyle+'background-color:#e0e0e0;" onclick="td_background_sd(this.id,\'onlysamenum\');">'+bltmp+'</td>';
        } else {
		    blstr = blstr + '<td class="td_sudoku"  width=1 id="input_'+blxl+'" nowrap align=center style="'+blstyle+'color:blue;" onclick="td_background_sd(this.id);">'+bltmp+'</td>';
        }
		if (blxl%9 == 8){
            blstr = blstr + '</tr>';
        }
	}
    blstr=blstr+'<tr><td colspan=9 align=center style="border:0;font-size:'+(font_size_sd_global-0.5)+'rem;">';
    blstr=blstr + "<span class=\"span_box\" onclick=\"getvalue_check_sd()\">检查</span> ";
    blstr=blstr + "<span class=\"span_box\" onclick=\"show_sd("+csnumber+",true)\">题目变形</span> ";
    blstr=blstr + "<span class=\"span_box\" onclick=\"fill_sd()\">答案</span>";
    blstr=blstr+'</td></tr>';
    
    blstr=blstr+'<tr><td colspan=9 style="border:0;">';
    blstr=blstr+'<table width=100% border=0 cellspacing="0" cellpadding="0" class="table_select"><tr>';
    
    //录入条 - 保留注释
    blstr=blstr+'<td align=center onclick="inputvalue_sd(empty_sd_global);">↪️</td>';
    for (let blxl=1;blxl<=9;blxl++){
        blstr=blstr+'<td align=center onclick="inputvalue_sd(this.innerHTML);" id="td_inputvalue_sd'+blxl+'">'+blxl+'</td>';
    }
    blstr=blstr+'</tr></table>';    
    blstr=blstr+'</td></tr>';
    
    blstr = blstr + '</table>';

	var bldiv = document.getElementById('klsudoku');
	bldiv.innerHTML = blstr;
    document.getElementById('span_state').innerHTML='';
    inputvalue_color_sd();
}

function style_sd(){
    var style_list=[
    '.table_sudoku td{font-weight:600;border:0.1rem #e0e0e0 solid;padding:0rem 0.95rem;font-size:'+font_size_sd_global+'rem;cursor:pointer;}',
    '.table_select td{font-weight:600;border:0;padding:0rem 0.5rem;font-size:'+(font_size_sd_global+0.3)+'rem;color:tomato;background-color:pink;cursor:pointer;}',
    '#span_no_sudoku{font-size:'+(font_size_sd_global-0.5)+'rem;border:0.2rem solid #c0c0c0;border-radius: 1rem; padding:0.1rem 0.5rem;margin:0rem 0.1rem;}',
    ];
    style_generate_b(style_list,true);
}
