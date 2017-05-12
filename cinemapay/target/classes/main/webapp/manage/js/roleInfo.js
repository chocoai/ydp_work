var page = 1;
var pagesize = 10;
var pagingsize = 3;
var currentpage = 1;

var type = "<label>角色类型</label><select id='roletype'><option value='1' selected>业务角色</option><option value='2'>管理角色</option><option value='3'>系统角色</option><option value='100'>影投角色</option></select>";
var areaid = "<label>所属地区</label><select id='areaid'></select>";
var theater = "<label>所属影院</label><select id='theaternum'><option value='"+usertheaternum+"' selected>"+usertheatername+"</option></select>";

$(function() {
	loadData(1);
    $("#addRole").on("click", function(){
    	$("#addInfo").fadeIn(200, "swing");
    	$("#rolename").val("");
		$(".cancel").on("click", function(){ $("#addInfo").fadeOut(300, "swing"); });
		$("#add").on("click",function(){
			var className = $("#add").attr("class");
			if(className == "commit"){
				$("#add").attr("class","commit-temp");
				commit("add","rolename",0);
			}
		});
		$("#rolename").on("blur",function(){checkRepeatRole(0,"rolename");});
		if(usertheaternum == "0"){
			$("#type").html(type);
			$("#roletype").on("change",function(){
				var roletype = $("#roletype").val();
				if(roletype == "100"){
					getYt();
				}else{
					getArea();
				}
			});
			getArea();
		}else{
			type = "<label>角色类型</label><select id='roletype'><option value='1' selected>业务角色</option></select>";
			theater = "<label>所属影院</label><select id='theaternum'><option value='"+usertheaternum+"' selected>"+usertheatername+"</option></select>";
			if(userroletype == "100"){
				type = "<label>角色类型</label><select id='roletype'><option value='100' selected>影投角色</option></select>";
				theater = "<label>所属影投</label><select id='theaternum'><option value='"+usertheaternum+"' selected>"+usertheatername+"</option></select>";
			}
			$("#type").html(type);
			$("#theater").html(theater);
		}
	});
});


function loadData(side){
	page = pageUpDown(side);
	var param = {};
	param.page = page;
	param.pagesize = pagesize;
	param.search = encodeURIComponent($(".filter_input").val());
	ajaxRequest("role/getRoleList", "GET", false, param, 
			function(data) {
			var result = data.result;
			switch (result) {
				case 1000:
					var dataArr = [];
					dataList = data.data;
					var total = data.total;
					var totalpage = parseInt(total % pagesize == 0 ? total / pagesize : total / pagesize + 1);
					if(dataList != null && dataList.length > 0){
						for (var i=0; i<dataList.length; i++) {
							var roleinfo = dataList[i];
							var dataJson = {};
							dataJson.rolename =  roleinfo.rolename;
							dataJson.roletype_name = roleinfo.roletype_name;
							dataJson.theatername = roleinfo.theatername;
							dataJson.status_name = roleinfo.status_name;
							
							var opreator = "";
							if(!(userroletype == 2 && roleinfo.theaternum == 0)){
								if(rolePer.indexOf("roleStatus")>-1){
									if(roleinfo.status == "0"){//激活状态、可锁定
										opreator += "<i class='disable'>禁用</i>";
	    							}else if(roleinfo.status == "1"){//锁定状态、可激活
	    								opreator += "<i class='enable'>启用</i>";
	    							}
								}
								if(rolePer.indexOf("rolePermission")>-1){
									opreator += "<i class='per'>授权</i>";
								}
								opreator += '<i class="edit">修改</i>';
								if(rolePer.indexOf("deleteRole")>-1){
									opreator += '<i class="delete">删除</i>';
								}
							}
							dataJson.opreator = opreator;
							dataArr.push(dataJson);
						}
						$(".data-tab tr").not(":first").remove();
						pushJsonData(".data-tab table", dataArr);
						var pagingstr = loadPaging(totalpage, page, pagingsize, "loadData");
						$(".data-tab-ul").html(pagingstr);
					}
					break;
				case 1204 :
					$(".data-tab tr").not(":first").remove();
					errorTip("提示","查询角色列表失败，请稍后重试");
					break;
				case 1205 :
					$(".data-tab tr").not(":first").remove();
					errorTip("提示","查询角色列表信息不存在，请稍后重试");
					break;
				case 9997 :
					$(".data-tab tr").not(":first").remove();
					errorTip("提示",data.msg);
					break;
				default:
					$(".data-tab tr").not(":first").remove();
					errorTip("提示","请求超时，请稍后重试");
					break;
			}
		}
		, null, null,
		function(){
			$(".disable").on("click",function(){
				var roleid = dataList[$(this).parents("tr").attr("index")].roleid;
				var rolename = dataList[$(this).parents("tr").attr("index")].rolename;
				var roletype = dataList[$(this).parents("tr").attr("index")].roletype;
				var info = "确定设置角色["+rolename+"]为禁用状态？";
				confirmshowMsg(info,3,roleid,1);
			});
			$(".enable").on("click",function(){
				var roleid = dataList[$(this).parents("tr").attr("index")].roleid;
				var rolename = dataList[$(this).parents("tr").attr("index")].rolename;
				var info = "确定设置角色["+rolename+"]为启用状态？";
				confirmshowMsg(info,3,roleid,0);
			});
			$(".per").on("click",function(){
				var roleid = dataList[$(this).parents("tr").attr("index")].roleid;
        		var rolename = dataList[$(this).parents("tr").attr("index")].rolename;
        		rolePermission(roleid,rolename);
			});
			$(".delete").on("click",function(){
				var roleid = dataList[$(this).parents("tr").attr("index")].roleid;
				var rolename = dataList[$(this).parents("tr").attr("index")].rolename;
				delRoleInfo(roleid,rolename);
			});
        	$(".edit").on("click", function(){
        		var roleid = dataList[$(this).parents("tr").attr("index")].roleid;
        		var rolename = dataList[$(this).parents("tr").attr("index")].rolename;
        		updateRoleInfo(roleid,rolename);
        	});
        	
        	currentpage = $(".data-tab-ul li[class='cur']").text();
        	if(currentpage == "" || currentpage == undefined){
        		currentpage = 1;
        	}
        }
		
	);
}


function getYt(){
	$("#area").hide();
	var theatertype = "3";
	var url= service_url + "rest/role/getTheater";
	$.post( url,{theatertype:theatertype},function(data) {
		var retjson = data;
		var result = parseInt(retjson.result);
        if(result == 1000){
        	var resultData = retjson.data;
			if(resultData != null && resultData.length > 0){
				$("#theaternum").empty();
				for (var i=0; i<resultData.length; i++) {
					var theaternum = resultData[i].theaternum;
					var theatername = resultData[i].theatername;
					$("#theaternum").append("<option value='"+theaternum+"'>"+theatername+"</option>");
				}
				$("#theaternum option:first").prop("selected", 'selected'); 
			}else{
				$("#theaternum").empty();
				$("#theaternum").append("<option value='-1' selected>暂无影投信息</option>");
				return;
			}
        }else{
        	$("#theaternum").empty();
			$("#theaternum").append("<option value='-1' selected>暂无影投信息</option>");
        	return;
        }
	});
}


function getArea(){
	var roletype = $("#roletype").val();
	if(roletype == "100"){
		$("#areaid").empty();
		$("#areaid").append("<option value='0' selected>全部</option>");
		$("#theaternum").empty();
		$("#theaternum").append("<option value='0'>全部</option>");
	}else{
		$("#area").show();
		$("#area").html(areaid);
		$("#areaid").on("change",function(){getTheater(0);});
		$("#theater").html(theater);
		
		var url= service_url + "rest/cinema/areaList";
		$.post( url,{},function(data) {
			console.log("data:"+data);
			var retjson = data;
			var result = parseInt(retjson.result);
	        if(result == 1000){
	        	var resultData = retjson.data;
				if(resultData != null && resultData.length > 0){
					$("#areaid").empty();
					for (var i=0; i<resultData.length; i++) {
						var citycode = resultData[i].citycode;
						var name = resultData[i].name;
						$("#areaid").append("<option value='"+citycode+"'>"+name+"</option>");
					}
					$("#areaid option:first").prop("selected", 'selected'); 
					getTheater(0);
				}else{
					$("#areaid").empty();
					$("#theaternum").empty();
					$("#areaid").append("<option selected>暂无地区信息</option>");
					$("#theaternum").append("<option value='-1' selected>暂无影院信息</option>");
					return;
				}
	        }else{
	        	$("#areaid").empty();
	        	$("#theaternum").empty();
				$("#areaid").append("<option selected>暂无地区信息</option>");
				$("#theaternum").append("<option value='-1' selected>暂无影院信息</option>");
	        	return;
	        }
		});
	}
}

function getTheater(type){
	var areaid = $("#areaid").val();
	var url= service_url + "rest/cinema/cinemaList";
	$.post( url,{areaid:areaid},function(data) {
		var retjson=data;
		var result = parseInt(retjson.result);
        if(result == 1000){
        	var resultData = retjson.data;
			if(resultData != null && resultData.length > 0){
				$("#theaternum").empty();
				if(type == 0){$("#theaternum").append("<option value='0'>全部</option>");}
				for (var i=0; i<resultData.length; i++) {
					var theaterid = resultData[i].theaterid;
					var theaternum = resultData[i].theaternum;
					var theatername = resultData[i].theatername;
					$("#theaternum").append("<option value='"+theaterid+"|"+theaternum+"'>"+theatername+"</option>");
				}
				$("#theaternum option:first").prop("selected", 'selected'); 
			}else{
				$("#theaternum").empty();
				if(type == 0){
					$("#theaternum").append("<option value='0'>全部</option>");
				}else{
					$("#theaternum").append("<option value='-1' selected>暂无影院信息</option>");
				}
				return;
			}
        }else{
        	$("#theaternum").empty();
        	if(type == 0){
				$("#theaternum").append("<option value='0'>全部</option>");
			}else{
				$("#theaternum").append("<option value='-1' selected>暂无影院信息</option>");
			}
        	return;
        }
	});
}

//更改角色状态
function roleStatus(roleid,status){
	var url = service_url + "rest/role/updateRoleStatus";
	$.post( url,{roleid : roleid,
				 status : status},function(data) {
		var retjson=$.parseJSON(data);
		var result = parseInt(retjson.result);
        if(result == 1000){
        	loadData(currentpage);
        }else if(result == 1202){
        	errorTip("提示","角色状态更新失败，请稍后重试");
        	return;
        }else if(result == 9997){
        	errorTip("提示",retjson.msg);
        	return;
        }else{
        	errorTip("提示","请求超时，请稍后重试");
        	return;
        }
	});
}

function updateRoleInfo(roleid,rolename){
	$("#updateInfo").fadeIn(200, "swing");
	$(".cancel").on("click", function(){ $("#updateInfo").fadeOut(300, "swing"); });
	$("#update").on("click",function(){
		var className = $("#update").attr("class");
		if(className == "commit"){
			//updateRole();
			$("#update").attr("class","commit-temp");
			commit("update","rolenameupdate",roleid);
		}
	});
	$("#rolenameupdate").on("blur",function(){checkRepeatRole(roleid,"rolenameupdate");});
	$("#roleid").val(roleid);
	$("#rolenameupdate").val(rolename);
}


function rolePermission(roleid,rolename){
	$("#roleper").fadeIn(200, "swing");
	$("#name").html(rolename+"角色授权<img class='cancel' src='../img/close2.png'/>");
	$(".cancel").on("click", function(){ $("#roleper").fadeOut(300, "swing"); });
	$("#per").on("click",function(){
		var className = $("#per").attr("class");
		if(className == "commit"){
			save();
		}
	});
	$("#roleidper").val(roleid);
	getMenuList(roleid);
}

function delRoleInfo(roleid,rolename){
	var url = service_url + "rest/role/checkRoleForUser";
	$.post( url,{roleid : roleid },function(data) {
		var retjson=$.parseJSON(data);
		var result = parseInt(retjson.result);
		if(result == 1000){
			var count = retjson.total;
			if(count == 0){
				var info = "确定删除角色["+rolename+"]？";
				confirmshowMsg(info,4,roleid,0);
				//delRole(roleid);
			}else{
				errorTip("提示","该角色["+rolename+"]已有用户关联，不能删除");
				return;
			}
		}else{
			errorTip("提示","请求超时，请稍后重试");
			return;
		}
	});
}

function delRole(roleid){
	var url = service_url + "rest/role/deleteRole";
	$.post( url,{roleid : roleid },function(data) {
		var retjson=$.parseJSON(data);
		var result = parseInt(retjson.result);
		if(result == 1000){
			loadData(currentpage);
		}else if(result == 1203){
			errorTip("提示","角色信息删除失败，请稍后重试");
        	return;
        }else if(result == 1207){
        	return;
        }else if(result == 9997){
        	errorTip("提示",retjson.msg);
			return;
        }else{
        	errorTip("提示","请求超时，请稍后重试");
			return;
		}
	});
}
