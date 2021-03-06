$(function() {
	var src = window.parent.$("#mainFrame").attr("src");
	$("#adminid").val(sessionStorage.getItem("adminid"));
	
	var adminname = sessionStorage.getItem("adminname");
	$("#admin_name").html(adminname);
});

function modifyPwd() {
	var fore_adminpwd = $("#fore_adminpwd").val();
	var new_adminpwd = $("#new_adminpwd").val();
	var confirm_adminpwd = $("#confirm_adminpwd").val();
	var adminid = $("#adminid").val();
	
	if(fore_adminpwd == new_adminpwd) {
		alert("新密码不能与旧密码相同！");
		return;
	}
	if(confirm_adminpwd != new_adminpwd) {
		alert("两次密码输入不一致，请重新输入！");
		$("#new_adminpwd").val("");
		$("#confirm_adminpwd").val("");
		return;
	}
	
	var params = {};
	params.fore_adminpwd = fore_adminpwd;
	params.new_adminpwd = new_adminpwd;
	params.confirm_adminpwd = confirm_adminpwd;
	params.adminid = adminid;
	
	$.ajax({
		url: requestUrl + "rest/adminInfo/modifyPwd",
		data: params,
		dataType: "json",
		jsonp: "jsonpCallback",
		success: function(data) {
			var result = data.result;
			switch(result) {
				case 1000:
					alert("修改成功，请重新登录！");
					window.parent.location.href = "../login.html";
					break;
				case 1005: alert("原密码错误！"); break;
				default: break;
			}
		}
	});
}