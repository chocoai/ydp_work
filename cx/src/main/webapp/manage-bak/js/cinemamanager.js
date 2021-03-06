var pageCount = 0;
var pageSize = 10;
var offsetNum = 0;


$(function() {
    //getNewsInfoCount();
    // 初始化数据(显示第一页)
    InitData(0);
 
    // ★分页主函数(新闻类别ID，排序字段，排序类型，页大小，页索引，总条数)
    function InitData(pageindx) {
    	var url = requestUrl + "rest/join/getJoinCinemaList";
    	var num = 0;
    	var index = pageindx + 1;
    	if(index != 0){
    		num = (index - 1) * pageSize;
    	}
    	// Ajax取出分页列表数据
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json", // 数据格式:JSON
            url: url,
            data : {
    			pageSize : pageSize,
    			offsetNum : num
    		},
    		jsonp : "jsonpCallback",
    		success : function(data) {
    			var result = parseInt(data.result);
    			switch(result){
    				case 1000 :
    					var resultData = data.data;
    					pageCount = data.total;
    					
    					$("#Pagination").pagination(pageCount, {
    			            callback: pageselectCallback,
    			            prev_text: '« 上一页',
    			            next_text: '下一页 »',
    			            items_per_page: pageSize,     // 每页显示条数
    			            current_page: pageindx,  // 当前页索引,这里0为第一页
    			            num_display_entries: 3,  // 前面显示几个按钮
    			            num_edge_entries: 2  // 后面显示几个按钮
    			        });
    			        
    					$("#result tr:gt(0)").remove();
    					if(resultData != null && resultData.length > 0){
    						for (var i=0; i<resultData.length; i++) {
    							var j_number = resultData[i].cinemaNumber;
    							var j_name = resultData[i].cinemaName;
    							var address = resultData[i].address;
    							var linkman = resultData[i].cinemaLinkMan;
    							var contact_phone = resultData[i].cinemaLinkMan_telphone;
    							var author = resultData[i].author;
    							var j_id = resultData[i].j_id;
    							var audit_flag = resultData[i].audit_flag;
    							
    							if(audit_flag == 1){
    								audit_flag = "通过";
    							}else{
    								audit_flag = "未通过";
    							}
    			
    							var row = i + 1;
    							var content = "<tr id='row_"+row+"'>";
    							content += "<td><input type='checkbox'  name='check_j_id'  id='check_"+ j_id +"' value='"+j_id+"' datavalue='"+j_id+"'/>";
    							content += "<td>"+j_name+"</td><td>"+j_number+"</td><td>"+address+"</td>";
    							content += "<td>"+linkman+"</td><td>"+contact_phone+"</td><td>"+author+"</td>";
    							content += "<td>" + audit_flag + "</td>";
    							content += "<td><a href='javascript:void(0);' onclick='showCinemaInfo("+j_id+");'>查看</a>&nbsp;&nbsp;";
    							content += "<a href='javascript:void(0);' onclick='updateNewsInfo("+j_id+");'>修改</a>&nbsp;&nbsp;";
    							content += "<a href='javascript:void(0);' onclick='delCinema("+j_id+");'>删除</a></td><tr>";
    							content += "</td><tr>";
    							if(i == 0){
    								$("#row_title").after(content);
    							}else{
    								$("#row_"+i).after(content);
    							}
    						}
    					}
    					break;
    				case 1001 :
    					break;
    				default:
    					break;
    			}
    		},
        });
 
      //处理翻页,page_id为当前页索引(0为第一页)
        function pageselectCallback(page_id, jq) {
            InitData(page_id);
        }
        
        if(pageCount != 0){
        	// 加入分页插件的绑定，第一个参数pageCount为总共多少条数据
            $("#Pagination").pagination(3, {
                callback: pageselectCallback,
                prev_text: '« 上一页',
                next_text: '下一页 »',
                items_per_page: pageSize,     // 每页显示条数
                current_page: pageindx,  // 当前页索引,这里0为第一页
                num_display_entries: 3,  // 前面显示几个按钮
                num_edge_entries: 2  // 后面显示几个按钮
            });
        }
        
    } 
    
    
    $(".add").on("click", function(){
		var page = "manager/cinemaInfoAdd.html";
		window.parent.$("#mainFrame").attr("src",page);
	});
	
	//删除选中
	$(".delSelect").on("click",function(){
		
		if(window.confirm('你确定要删除选中的影院信息吗？')){
			var j_id = document.getElementsByName("check_j_id");
			var j_ids = "";
			if(j_id.length == 0){
				alert("请至少选中一条影院信息进行删除!");return;
			}else{
				var count=0;
				for(var i=0;i<j_id.length; i++){              
					if(j_id[i].checked){
						j_ids = j_ids + j_id[i].value+",";
						count++;
					}                                
				}
				if(count==0){       
					alert("请至少选中一条影院信息进行删除!!");return;
				}else{
					//执行删除操作
					delCinemaInfo(j_ids,1);
				}
			}
			
	    }else{
	       return false;
	    }
	});
 
});

function getNewsInfoCount(){
	var url = requestUrl + "rest/newsinfo/getNewsInfoCount";
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json", // 数据格式:JSON
        url: url,
        data : {},
		jsonp : "jsonpCallback",
		success : function(data) {
			var result = parseInt(data.result);
			switch(result){
				case 1000 :
					var resultData = data.data;
					pageCount = data.total;
					break;
				default:
					break;
			}
		},

    });
}


function delCinema(j_id){
	if(window.confirm('你确定要删除此院线信息吗？')){
		delCinemaInfo(j_id,0);
    }else{
       return false;
    }
}

function delCinemaInfo(j_id,type){
	var url = "";
	if(type == 0){
		url = requestUrl + "rest/join/deleteJoinCinema";
	}else{
		url = requestUrl + "rest/join/deleteJoinCinemas";
	}
	
	$.ajax({
		url : url,
		type : 'post',
		dataType : 'jsonp',
		data : {
			j_id : j_id
		},
		jsonp : "jsonpCallback",
		success : function(data) {
			var result = parseInt(data.result);
			switch(result){
				case 1000 :
					var resultData = data.data;
					alert("删除成功");
					var page = "manager/cinemamanagerList.html";
					window.parent.$("#mainFrame").attr("src",page);
					break;
				case 1001 :
					break;
				default:
					break;
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
		},
		timeout : 32000
	});
}


function showCinemaInfo(j_id){
// 下面这个被注释是因为checkbox 被废弃了，如果要启用checkbox复选按钮，那么下面这个注释要重新生效	
	var checked_j_id = $("#check_"+ j_id +"").val();
//	var checkedCinemaId = j_id;
	var page = "manager/cinemaInfo_Show.html?checked_j_id="+checked_j_id;
	window.parent.$("#mainFrame").attr("src",page);

	
	
}

function updateNewsInfo(j_id){
	var page = "manager/cinemaInfoUpdate.html?checked_j_id="+ j_id;
	window.parent.$("#mainFrame").attr("src",page);
	
}
