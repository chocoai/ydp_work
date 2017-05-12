$(function() {
	// Logo，地区，主菜单
	LogoMenuTextLoad(1);

	// 底部导航
	bottomTextLoad();

	var href = window.location.href;
	var acti_id = "";
	var index = href.lastIndexOf("=");
	if(index != -1) {
		acti_id = href.substring(index+1);
	}else {
		alert("acti_id错误");
	}

	//左侧页面
	$.ajax({
		url: service_url + "activity/getActivity",
		type: "POST",
		data: {
			acti_id: acti_id,
			updateFlag : true //(更新点击量标记)
		},
		dataType: "jsonp",
		jsonp: "jsonpCallback",
		success: function(data) {
			var resultData = data.data;
			//截断time的年份（只要月/日）
			var timeContent = "活动时间：" + resultData.start_time.substring(5) + "-" + resultData.end_time.substring(5);
			var acti_content = resultData.acti_content;

			$(".time").html(timeContent);
			$(".see").html(resultData.brows_times);
			$(".content h2").html(resultData.acti_title);
			$(".content").append(acti_content);
		}
	});

	//右侧页面
/*	$.ajax({
		url: service_url + "activity/getHotActivity",
		type: "POST",
		dataType: "jsonp",
		jsonp: "jsonpCallback",
		success: function(data) {
			switch(data.result) {
				case 1000:
					var resultData = data.data;
					if(resultData != null && resultData.length > 0) {
						for(var i = 0; i < resultData.length; i++) {
							var content = "<li><span>"+eval(i+1)+" </span><span onclick='showActivityDetail("+resultData[i].acti_id+")'>"+resultData[i].acti_title+"</span></li>";
							$(".other_activity ul").append(content);
							if(i < 3) {
								//设置成红色;
								$(".other_activity ul li:last span:eq(0)").addClass("hot");
							}
						}
					}
					break;
				default:
					break;
			}
		}
	});*/
});

function showActivityDetail(acti_id) {
	window.location.href = "activity_detail.html?acti_id="+acti_id;
}