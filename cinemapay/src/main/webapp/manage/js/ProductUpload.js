var productid;

$(function(){
	// 上传图片
	uploadImg();
	
	productid = getPramStr("productid");
	if(productid != null){
		findProductMess();
	}
	
	$(".cancelBn").on("click", function(){ window.location.href = "ProductList.html?status=1" });
});


/**
 * 提交商品
 */
function subProduct(){
	var param = {};
	if(productid != null){
		param.productid = productid
	}
	var productname = $("#productname").val();
	var price = $("#price").val();
	var intro = $("#intro").val();
	var headimg = $("#headimg").val();
	
	if(productname == ""){
		errorTip("参数错误", "商品名称不能为空！"); return;
	}else if(price == ""){
		errorTip("参数错误", "商品价格不能为空！"); return;
	}else if(intro == ""){
		errorTip("参数错误", "商品简介不能为空！"); return;
	}
	//else if(headimg == ""){
	//	errorTip("参数错误", "请先上传商品图片！"); return;
	//}
	
	param.productname = $("#productname").val();
	param.headimg = $("#headimg").val();
	param.online = $("#online").find("option:selected").val();
	param.intro = $("#intro").val();
	param.price = $("#price").val();
	param.rule1 = $("#rule1").is(':checked') ? 1 : 0;
	
	$.ajax({
		url: service_url + "rest/product/subProduct",
		type: "GET",
		data: param,
		dataType: 'json',
		beforeSend: function(request) {},
        complete: function(){},
		success: function(data) {
			var result = data.result;
			switch (result) {
				case 1000:
					window.location.href = "ProductList.html?status=-1";
					break;
				default : 
					$(".error-panel").text(data.msg).fadeIn(200).delay(1500).fadeOut(300);
					break;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if(textStatus == "timeout"){
				$(".error-panel").text("请求超时").fadeIn(200).delay(1500).fadeOut(300);
			}
			console.log(textStatus);
		},
		timeout: 120000
	});
}


/**
 * 查找商品详情
 * @param {Object} side
 */
function findProductMess(){
	var param = {};
	param.productid = productid;
	
	ajaxRequest("product/findProductMess", "GET", false, param, 
		function(data){
			var result = data.result;
			switch (result) {
				case 1000:
					var product = data.data;
					$("#productname").val(product.productname);
					$("#headimg").val(product.headimg);
					$("#status").val(product.status);
					$("#intro").val(product.intro);
					$("#price").val(product.price);
					if(product.rule1 == 1){
						$("#rule1").attr("checked", true);						
					}
					$("#online").val(product.online);
					$("#online").attr("disabled","disabled");
					$(".webuploader-pick").css("background-image", "url('"+ product.showImg +"')");
					break;
				default : 
					$(".error-panel").text(data.msg).fadeIn(200).delay(1500).fadeOut(300);
					break;
			}
		}
	);
}

/**
 * 上传图片
 */
function uploadImg(){
	// 初始化Web Uploader
	var uploader = WebUploader.create({
	    // 选完文件后，是否自动上传。
	    auto: true,
	    // swf文件路径
	    swf: '../js/libs/webuploader/Uploader.swf',
	    // 文件接收服务端。
	    server: service_url + "rest/file/uploadFile",
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: '#filePicker',

	    // 只允许选择图片文件。
	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
	        mimeTypes: 'image/*'
	    }
	});
	
	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {
		uploader.makeThumb(file, function(error, src) {
			$(".webuploader-pick").css("background-image", "url(" + src + ")");
		}, 200, 200);
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file, response ) {
		$("#headimg").val(response.data)
	});

	// 文件上传失败，显示上传出错。
	uploader.on( 'uploadError', function( file ) {
	    var $li = $( '#'+file.id );
	    var $error = $li.find('div.error');
	    // 避免重复创建
	    if ( !$error.length ) {$error = $('<div class="error"></div>').appendTo( $li );}
	    $error.text('上传失败');
	});
}