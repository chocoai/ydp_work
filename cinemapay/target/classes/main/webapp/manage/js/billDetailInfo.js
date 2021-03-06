var url = '';
var sid = '';
var param = {};
var theatertype = localStorage.getItem("theatertype"); //1表示易得票 3表示即影投 

$(document).ready(function() {
	url = window.location.href;
	sid = url.substring(url.lastIndexOf("=") + 1);
	param.sid = sid;
	loadData(param);
	
});


function loadData(param) {
	ajaxRequest("settle/getOneBill", "GET", true, param,
		function(data) {
			var result = parseInt(data.result);
			switch(result) {
				case 1000:
					var resultData = data.data;
					$("#bill_id").html(resultData.statementid);
					$("#theater_name").html(resultData.theatername);
					$("#settle_amount").html(resultData.amount);
					$("#start_time").html(resultData.starttime);
					$("#end_time").html(resultData.endtime);
					$("#float_amount").html(resultData.floatamount);
					if(resultData.type == "0") {
						$("#channel").html("线下消费");
					}else if(resultData.type == "1") {
						$("#channel").html("线上消费");
					}
					if(resultData.status == "-1") {
						$("#pay_status").html("未提交");
					}else if(resultData.status == "0") {
						$("#pay_status").html("未核对");
					}else if(resultData.status == "1") {
						$("#pay_status").html("待支付");
					}else if(resultData.status == "2") {
						$("#pay_status").html("已支付");
						$(".change_div .updateBillStatus").hide();//账单状态为已支付时，不能更改
					}
					$("#pay_status").attr("status", resultData.status);//为账单状态添加status属性
					
					if(resultData.remarks == null || typeof(resultData.remarks) == "undefined" || resultData.remarks == '') {
						$("#remarks").html("无");
					}else {
						$("#remarks").html(resultData.remarks);
					}
					
					$("#create_time").html(resultData.createtime);
					$("#modify_time").html(resultData.modifytime);
					$("#upload_file").html(resultData.filename);
					$("#upload_time").html(resultData.fileuploadtime);
					$("#operate_name").html(resultData.operatorname);
					var sign = (resultData.sign == 1)?"<span style='color:red;'>过期</span>":"<span>正常</span>";
					$("#sign").html(sign);
					$("#summation b").html((parseFloat(resultData.amount) + parseFloat(resultData.floatamount)).toFixed(2));
					
					//为上传附件添加点击事件
					var file_Param = {};
					file_Param.statementid = resultData.statementid;
					file_Param.theatertype = resultData.theatertype;
					$(".change_div .uploadAttachFile").bind("click", function() { new uploadAttachFile(file_Param)});
					
					//为下载附件添加点击事件
					$(".change_div .downloadRes").bind("click", function() { new downloadRes(resultData.attachfileurl)});
					
					//为查看该账单消费明细添加点击事件
					$(".change_div .getBillStream").click({sid: resultData.statementid}, function(event) {
						var sid = event.data.sid;
						window.location.href = "billStreamDetails.html?sid=" + sid;
					});
					
					
					//为修改账单状态修改点击事件
					var updateParams = {};
					updateParams.sid = $("#bill_id").html();
					updateParams.status = $("#pay_status").attr("status");
					updateParams.theatername = resultData.theatername;
					updateParams.theatertype = resultData.theatertype;
					
					$(".change_div .updateBillStatus").bind("click", function() { new updateBillStatus(updateParams)});
					
					//权限控制
					if(resultData.sign == 0) { //账单未过期才有如下权限
							var menu = localStorage.getItem("menuinfo");
							var menuinfo = JSON.parse(menu);
							if(menuinfo != null){
								for(var i=0;i<menuinfo.length;i++){
									var requesturl = menuinfo[i].requesturl;
									if(requesturl == "manager/settleManage.html"){
										var show = menuinfo[i].show;
										if(show != null){
											for(var j=0;j<show.length;j++){
												var label = show[j].requesturl;
												$("button."+label).show();  //上传附件/下载附件/流水明细
												if(label == 'updateBillStatus') { //确定是否有修改账单状态权限
													$(".change_div .updateBillStatus").hide(); //修改账单状态暂时隐藏，权限另行控制，控制代码在下面(authBillStatus)
													authBillStatus(updateParams); //控制修改账单状态权限
												}
											}
										}
										break;
									}
								}
							}
							if(resultData.filename == '') {   //如果文件为空，则隐藏"下载附件"按钮
								$("button.downloadRes").hide()
							}
					}
					
					break;
					
				default:
					errorTip("请求错误", data.msg);
					break;
			}
		},
	null,
	loading(), 
	loadover()
	);
}

/**
 * 修改账单状态的权限控制
 */
function authBillStatus(updateParams) {
	//修改账单状态的权限控制
	if(updateParams.theatertype == 2) { //线下订单
		if(updateParams.status == -1 && (theatertype == 3)) {	//影投管理员或影投业务人员
			$(".change_div .updateBillStatus").html("发送至影院方"); 
			$(".change_div .updateBillStatus").show();
		}else if(updateParams.status == 0 && theatertype == 2) { 	//影城管理员或影城业务人员
			$(".change_div .updateBillStatus").html("修改为待支付");
			$(".change_div .updateBillStatus").show();
		}else if(updateParams.status == 1 && (theatertype == 3)) {	//影投管理员或影投业务人员
			$(".change_div .updateBillStatus").html("修改为已支付");
			$(".change_div .updateBillStatus").show();
		}
	}else { //线上订单
		if(updateParams.status == -1 && (theatertype == 3)) {	//影投管理员或影投业务人员
			$(".change_div .updateBillStatus").html("发送至易得票"); 
			$(".change_div .updateBillStatus").show();
		}else if(updateParams.status == 0 && theatertype == 1) { 	//yidepiao
			$(".change_div .updateBillStatus").html("修改为待支付");
			$(".change_div .updateBillStatus").show();
		}else if(updateParams.status == 1 && (theatertype == 3)) {	//影投管理员或影投业务人员
			$(".change_div .updateBillStatus").html("修改为已支付");
			$(".change_div .updateBillStatus").show();
		}
	}
}



/**
 * 更改账单信息(调整金额及其调整备注)
 */
function changeBillInfo() {
	var msgHtml = '<div class="mask alias" style="display:block;">';
	msgHtml += '<div class="showMess" style="display:block;">';
	msgHtml += '<p class="tip">修改信息</p>';
	msgHtml += '<p class="message"><span type="">请输入调整金额:</span><input type="text" value="0"></p>';
	msgHtml += '<p class="remarks"><span type="">请输入调整备注:</span><textarea rows="4" cols="30"/></p>';
	msgHtml += '<p class="btn-p"><button class="sure">确定</button><button class="deny">取消</button></p>';
	msgHtml += '</div>';
	msgHtml += '</div>';
	
	$("body").append(msgHtml);
	
	
	$(".btn-p .sure").click(function() {
		var param = {};
		param.statementid = $("#bill_id").html();
		param.floatamount = parseFloat($(".message input").val()).toFixed(2);
		param.remarks = $(".remarks textarea").val();
		if(param.floatamount == '' || param.remarks == '') {
			alert('请输入完整信息');
			return;
		}
		$(".mask").remove();
		
		ajaxRequest("settle/changeBillInfo", "POST", true, param,
				function(data) {
					var result = parseInt(data.result);
					var sid = parseInt(data.sid); //生成对账单的主键
					switch(result) {
						case 1000:
							window.location.href = "billDetailInfo.html?sid=" + sid;
							break; 
						default:
							errorTip("请求错误", data.msg);
							break;
					}
			},
				null,
				loading(), 
				loadover())
	});
	
	$(".deny").on("click", function(){ $(".mask").remove(); });
}


/**
 * 上传账单附件
 * @param statementid
 */
function uploadAttachFile(file_Param) {
	if(file_Param.theatertype == 2) { //线下订单
		if(theatertype != 2) { //只有影城及影城业务人员可以上传附件
			errorTip("错误提示", "非影城工作人员");
			return;
		}
	}else if(file_Param.theatertype == 1) { //线上订单
		if(theatertype != 1) { //只有易得票可以上传附件
			errorTip("错误提示", "非易得票工作人员");
			return;
		}
	}
	
	
	var msgHtml  = '<div class="mask" style="display:block;">';
		msgHtml += '<div class="showMess" style="display:block;">';
		msgHtml += '<p class="tip">上传附件</p>';
		msgHtml += '<input type="file" name="uploadfile" id="uploadfile"/>';
		msgHtml += '<p class="btn-p"><button class="sure">确定</button><button class="deny">取消</button></p>';
		msgHtml += '</div>';
		msgHtml += '</div>';
	
	$("body").append(msgHtml);
	
	//给确认按钮添加点击事件
	$(".btn-p .sure").on("click", function(){
		var file_upload = $(".mask input").val();
		if(file_upload == '') {
			alert("请选择您要上传的文件");
			return;
		}else {
			var ext = file_upload.substring(file_upload.lastIndexOf(".") + 1).toUpperCase();
			console.log(ext);
			if(ext!="DOC" && ext!="DOCX" && ext!="PDF" && ext!="DOT" && ext!="DOTX" && ext!="WPS" && ext!="WPT" && ext!="XLS" && ext!="XLSX" && ext!="XLSM" && ext!="XLT") {
				alert("上传的附件仅限于Excel,Word以及Pdf格式！");
				return;
			}
		}
		$.ajaxFileUpload({
                url: service_url + 'rest/file/uploadAttachFile?statementid=' + file_Param.statementid, //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'uploadfile', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                success: function (data, status)  //服务器成功响应处理函数
                {
                	$(".mask").remove();
                	window.location.href = 'billDetailInfo.html?sid=' + file_Param.statementid;
                },
                error: function (data, status, e)//服务器响应失败处理函数
                {
                    alert(e);
                }
		});


	});
	
	$(".btn-p .deny").on("click", function(){ $(".mask").remove(); });
}


/**
 * 修改账单状态
 * @returns {updateBillStatus}
 */
function updateBillStatus(paramsObj) {
	var tip = '';   //提示
	if(parseInt(paramsObj.status) == -1) {
		if(paramsObj.theatertype == 2) {
			tip = "您正在发送账单至<span class='Tip'>【"+ paramsObj.theatername +"】</span>";
		}else{
			tip = "您正在发送账单至<span class='Tip'>【易得票】</span>";
		}
	}else if(parseInt(paramsObj.status) == 0) {
		tip = "您正在修改账单状态为<span class='Tip'>【待支付】</span>";
	}else if(parseInt(paramsObj.status) == 1) {
		tip = "您正在修改账单状态为<span class='Tip'>【已支付】</span>";
	}
	var msgHtml = '<div class="mask" style="display:block;">';
	msgHtml += '<div class="showMess" style="display:block;">';
	msgHtml += '<p class="tip">确认修改</p>';
	msgHtml += '<p class="message">'+ tip +'</p>';
	msgHtml += '<p class="btn-p"><button class="sure">确定</button><button class="deny">取消</button></p>';
	msgHtml += '</div>';
	msgHtml += '</div>';
	$("body").append(msgHtml);
	
	$(".btn-p .sure").click(function() {
		//修改账单状态 ajax
		$.ajax({
			url: service_url + "rest/settle/updateBillStatus",
			type: "POST",
			dataType: "json",
			data: paramsObj,
			success: function(data) {
				window.location.href = 'billDetailInfo.html?sid=' + paramsObj.sid;
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){}
		});
	});
	
	$(".deny").on("click", function(){ $(".mask").remove(); });
}


/**
 * 下载附件
 * @param path
 */
function downloadRes(path) {
	window.location.href = service_url +  "rest/file/downloadRes?path=" + path;
}



