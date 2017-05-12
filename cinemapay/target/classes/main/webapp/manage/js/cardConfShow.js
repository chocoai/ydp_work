$(function() {
	
	$("#starttime").click(function(){
		WdatePicker({minDate:'#F{$dp.$D(\'maxDate\')}',maxDate:'#F{$dp.$D(\'endtime\')}'});
	});
	
	$("#endtime").click(function(){
		WdatePicker({minDate:'#F{$dp.$D(\'starttime\')}',maxDate:''});
	});
	
	$("#cardtype").change(function(){
		var cardtype = $("#cardtype").val();
		if(cardtype == "0"){
			$("#countcard").show();
			$("#storecard").hide();
		}else if(cardtype == "1"){
			$("#storecard").show();
			$("#countcard").hide();
		}
	});
	
	$("#areaid").change(function(){
		getTheater();
	});
	
	$("#count,#quantity,#quantity_store").on("input",function(){
		checkNum(this);
	});
	
	$("#value,#value_store").on("input",function(){
		checkPrice(this);
	});
	
	$(".cancelBn").on("click",function(){
		window.location.href = "cardConfList.html";
	});
});

function getCardConfInfo(cardconfid,type){
	var url = service_url + "rest/cardConf/getCardConf";
	$.post( url,{cardconfid : cardconfid},function(data) {
		var retjson=$.parseJSON(data);
		var result = parseInt(retjson.result);
		if(result == 1000){
        	var resultData = retjson.data;
        	if(type == "show"){
        		cardConfShow(resultData);
        	}else if(type == "edit"){
        		cardConfEdit(resultData);
        	}
        }else if(result == 1205){
        	errorTip("提示","卡券信息不存在");
        	return;
        }else if(result == 1204){
        	errorTip("提示","查询卡券信息失败");
        	return;
        }else{
        	errorTip("提示","请求超时，请稍后重试");
        	return;
        }
	});
}

function cardConfShow(resultData){
	if(resultData.status == "0"){
		if(cardConfPer.indexOf("updateCardConf")>-1){
			$("#toEdit").show();
		}else{
			$("#toEdit").hide();
		}
	}
	$("#cardname").html(resultData.cardname);
	$("#cardtype").html(resultData.cardtype_name);
	$("#status_name").html(resultData.status_name);
	$("#status").val(resultData.status);
	if(resultData.cardtype == "0"){//次卡
		$("#countcard").show();
		$("#storecard").hide();
		$("#count").html(resultData.count);
		$("#value").html(resultData.value);
		$("#quantity").html(resultData.quantity);
	}else if(resultData.cardtype == "1"){
		$("#storecard").show();
		$("#countcard").hide();
		$("#value_store").html(resultData.value);
		$("#quantity_store").html(resultData.quantity);
	}
	$("#starttime").html(resultData.starttime);
	$("#endtime").html(resultData.endtime);
	$("#note").html(resultData.note);
	$("#createtime").html(resultData.createtime);
	$("#modifytime").html(resultData.modifytime);
	$("#operator").html(resultData.operatorid);
	var CINEMA_DATA = resultData.cinemainfo;
	for(i in CINEMA_DATA){
		var settleprice = CINEMA_DATA[i].settlerate;
		if($("#cardtype").html() == '次卡'){
			settleprice = CINEMA_DATA[i].settlevalue;
		}
		
		$('#cinema-table tbody').append(
			'<tr id="' + CINEMA_DATA[i].cinemaid + '">' + 
				'<td>' + CINEMA_DATA[i].cinemaname + '</td>' +
				'<td>' +
					'<label class="cinema-name"><div class="state iradio_minimal-green ' + (CINEMA_DATA[i].consumetype == 'offline' ? 'checked' : '') + '"></div> 线下使用</label>' + 
					'<label class="cinema-name"><div class="state iradio_minimal-green ' + (CINEMA_DATA[i].consumetype == 'online' ? 'checked' : '') + '"></div> 线上使用</label>' +
					'<label class="cinema-name"><div class="state iradio_minimal-green ' + (CINEMA_DATA[i].consumetype == 'all' ? 'checked' : '') + '"></div> 全部</label>' +
				'</td>' +
				'<td><span>' + settleprice + '</span>' +
			'</tr>');
	}
}

function toEditCardConf(){
	var status = $("#status").val();
	var cardconfid = $("#cardconfid").val();
	if(status == "1" || status == "2"){
		errorTip("提示","已生成卡号，不能修改");
		return;
	}else{
		//设置保存按钮不可多次点击
		$("#toEdit").attr("class","submitBn-temp");
		var page = "manager/cardConfEdit.html?cardconfid="+cardconfid;
		window.parent.$("#mainFrame").attr("src",page);
	}
}


function editCardConf(){
	var status = $("#status").val();
	var cardconfid = $("#cardconfid").val();
	if(status == "1" || status == "2"){
		errorTip("提示","已生成卡号，不能修改");
		return;
	}else{
		//设置保存按钮不可多次点击
		$("#edit").attr("class","submitBn-temp");
		
	}
}