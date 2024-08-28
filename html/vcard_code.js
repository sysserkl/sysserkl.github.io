function import_relation_vcard(){
	document.getElementById('textarea_m').value=relation_xm_global;
	document.getElementById('input_m_length').value=1;
}

function string8_vcard(){
	return Math.ceil(Math.random()*9999999).toString().substring(0,4)+' '+Math.ceil(Math.random()*9999999).toString().substring(0,4);
}

function tele_vcard(){
	area_code_xm_global.sort(randomsort_b);
	cellphone_xm_global.sort(randomsort_b);
	var m_len = area_code_xm_global.length;
	var rnd_tmp=Math.min(m_len-1,Math.floor(Math.random()*m_len));
	
	var bljg='';
	if (Math.random()>0.8){
		bljg=bljg+'<br />TEL;TYPE=HOME:'+area_code_xm_global[rnd_tmp]+' '+string8_vcard();
	}
	if (Math.random()>0.6){
		bljg=bljg+'<br />TEL;TYPE=WORK:'+area_code_xm_global[rnd_tmp]+' '+string8_vcard();
	}
	if (Math.random()>0.1){
		
		m_len = cellphone_xm_global.length;
		rnd_tmp=Math.min(m_len-1,Math.floor(Math.random()*m_len));
		bljg=bljg+'<br />TEL;TYPE=CELL:'+cellphone_xm_global[rnd_tmp]+' '+string8_vcard();
	}
	return bljg;
}

function textarea_str_format_vcard(bl_x_str){
	bl_x_str=bl_x_str.replace(new RegExp(" ","g"),',');
	bl_x_str=bl_x_str.replace(new RegExp("，","g"),',');
	bl_x_str=bl_x_str.replace(new RegExp("\n","g"),',');
	return bl_x_str;
}

function surname_vcard(){
	var bl_x_str=document.getElementById('textarea_x').value;
	var bl_x_arr=textarea_str_format_vcard(bl_x_str).split(',');
	bl_x_arr.sort(randomsort_b);
	var x_len=bl_x_arr.length;
	var m_len = hz_3500_global.length;
	var cscount= Math.min(3000,Math.max(parseInt(document.getElementById('input_xm_amount').value.trim()),1));
	var name_length= Math.max(-1,Math.min(2,parseInt(document.getElementById('input_m_length').value)));
	var bljg='';
	for (let blxl=0;blxl<cscount;blxl++){
		bljg=bljg+'<br />BEGIN:VCARD';
		bljg=bljg+'<br />VERSION:3.0';

		var rnd_x_tmp=Math.min(x_len-1,Math.floor(Math.random()*x_len));
		
		var rnd_m_tmp;
		var m_tmp='';
		if (name_length!=0){
			rnd_m_tmp=Math.min(m_len-2,Math.floor(Math.random()*m_len));
			m_tmp=hz_3500_global.slice(rnd_m_tmp,rnd_m_tmp+1);
		}
		if (name_length==-1 && Math.random()>0.4 || name_length==2){
			rnd_m_tmp=Math.min(m_len-2,Math.floor(Math.random()*m_len));
			m_tmp=m_tmp+hz_3500_global.slice(rnd_m_tmp,rnd_m_tmp+1);
		}
		
		if (bl_x_arr[rnd_x_tmp].length>3){
			bljg=bljg+'<br />N:;'+bl_x_arr[rnd_x_tmp]+m_tmp+';;;';
		} else {
			bljg=bljg+'<br />N:'+bl_x_arr[rnd_x_tmp]+';'+m_tmp+';;;';
		}
		bljg=bljg+'<br />FN:'+bl_x_arr[rnd_x_tmp]+m_tmp;
		bljg=bljg+tele_vcard();
		bljg=bljg+'<br />END:VCARD';
	}
	document.getElementById('divhtml').innerHTML=bljg;
}

function just_name_vcard(){
	surname_xm_global.sort(randomsort_b);
	var x_len=surname_xm_global.length;

	var bl_m_str=document.getElementById('textarea_m').value;
	var bl_m_arr=textarea_str_format_vcard(bl_m_str).split(',');
	bl_m_arr.sort(randomsort_b);
	var m_len=bl_m_arr.length;

	var cscount= Math.min(3000,Math.max(parseInt(document.getElementById('input_xm_amount').value.trim()),1));
	
	var name_length= Math.max(-1,Math.min(2,parseInt(document.getElementById('input_m_length').value)));
	
	var bljg='';
	for (let blxl=0;blxl<cscount;blxl++){
		bljg=bljg+'<br />BEGIN:VCARD';
		bljg=bljg+'<br />VERSION:3.0';

		var rnd_x_tmp=Math.min(x_len-1,Math.floor(Math.random()*x_len));

		var rnd_m_tmp;
		var m_tmp='';
		if (name_length!=0){
			rnd_m_tmp=Math.min(m_len-1,Math.floor(Math.random()*m_len));
			m_tmp=bl_m_arr[rnd_m_tmp];
		}
		if (name_length==-1 && Math.random()>0.4 || name_length==2){
			rnd_m_tmp=Math.min(m_len-1,Math.floor(Math.random()*m_len));
			m_tmp=m_tmp+bl_m_arr[rnd_m_tmp];
		}
		bljg=bljg+'<br />N:'+surname_xm_global[rnd_x_tmp]+';'+m_tmp+';;;';
		bljg=bljg+'<br />FN:'+surname_xm_global[rnd_x_tmp]+m_tmp;
		bljg=bljg+tele_vcard();
		bljg=bljg+'<br />END:VCARD';
	}
	document.getElementById('divhtml').innerHTML=bljg;
}

function fullname_vcard(){
	var bl_xm_str=document.getElementById('textarea_xm').value;
	var bl_xm_arr=textarea_str_format_vcard(bl_xm_str).split(',');
	var xm_len=bl_xm_arr.length;
	var bljg='';
	for (let blxl=0;blxl<xm_len;blxl++){
		bljg=bljg+'<br />BEGIN:VCARD';
		bljg=bljg+'<br />VERSION:3.0';
		if (bl_xm_arr[blxl].length==0){continue;}
		var x_tmp=bl_xm_arr[blxl].slice(0,1);
		var m_tmp='';
		if (bl_xm_arr[blxl].length>1){
			m_tmp=bl_xm_arr[blxl].substring(1,);
		}
		bljg=bljg+'<br />N:'+x_tmp+';'+m_tmp+';;;';
		bljg=bljg+'<br />FN:'+bl_xm_arr[blxl];
		bljg=bljg+tele_vcard();
		bljg=bljg+'<br />END:VCARD';
	}
	document.getElementById('divhtml').innerHTML=bljg;
}

function rnd_vcard(){
	surname_xm_global.sort(randomsort_b);
	var x_len=surname_xm_global.length;
	
	var m_len = hz_3500_global.length;
	var cscount= Math.min(3000,Math.max(parseInt(document.getElementById('input_xm_amount').value.trim()),1));
	
	var name_length= Math.max(-1,Math.min(2,parseInt(document.getElementById('input_m_length').value)));
	
	var bljg='';
	for (let blxl=0;blxl<cscount;blxl++){
		bljg=bljg+'<br />BEGIN:VCARD';
		bljg=bljg+'<br />VERSION:3.0';

		var rnd_x_tmp=Math.min(x_len-1,Math.floor(Math.random()*x_len));

		var rnd_m_tmp;
		var m_tmp='';
		if (name_length!=0){
			rnd_m_tmp=Math.min(m_len-2,Math.floor(Math.random()*m_len));
			m_tmp=hz_3500_global.slice(rnd_m_tmp,rnd_m_tmp+1);
		}
		if (name_length==-1 && Math.random()>0.4 || name_length==2){
			rnd_m_tmp=Math.min(m_len-2,Math.floor(Math.random()*m_len));
			m_tmp=m_tmp+hz_3500_global.slice(rnd_m_tmp,rnd_m_tmp+1);
		}
		bljg=bljg+'<br />N:'+surname_xm_global[rnd_x_tmp]+';'+m_tmp+';;;';
		bljg=bljg+'<br />FN:'+surname_xm_global[rnd_x_tmp]+m_tmp;
		bljg=bljg+tele_vcard();
		bljg=bljg+'<br />END:VCARD';
	}
	document.getElementById('divhtml').innerHTML=bljg;
}

function save_vcard(){
    var blstr=document.getElementById('divhtml').innerText.trim();
    if (blstr==''){return;}
    string_2_txt_file_b(blstr,'telephone_book_'+now_time_str_b('-',true)+'.vcf','vcf')
}

function init_vcard(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    var input_list=[
    ['input_xm_amount',3,0.5],
    ['input_m_length',2,0.5],
    ];
    input_size_b(input_list,'id');    
}
