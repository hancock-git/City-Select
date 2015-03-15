$(function(){

	//初始化
	var _province = $('#prov-area'),
		_city = $('#city-area'),
		_provDate = json,
		_custom = customSelector;
		_html = '',
		index = '';

	//弹窗时移除外围删除CLASS,关闭时添加外围class

	$('.sele-layer').click(function(){

		layerId = $.layer({			
			shade: [0.5, '#000'],
			type : 1,
			title : '城市选择器',						//获取标题字符串
			border : [6 , 0.3 , '#000', true],
			area: ['auto','600px'],
			offset : ['50px' , '50%'],
			page : {dom : '.place-con'}			  
		});		

		$('.selector').removeClass('result-list');
		_reView = $('.selector').find('span');

		clearAll();

		$.each(_reView,function(i){			
			var _did = $(this).attr('did');
			_that = $('input[data-id='+ _did +']');		
			if(_custom[_did] != undefined){		//调用自定义
				customSelect(_that);
			} else{
							
				cancelSelect(_that);
			}
		});

		$('.result-list').html($('.selector').html());

	});

	

	//移除外围删除
	$('.selector').removeClass('result-list');

	initCitySelector();

	function initCitySelector(){
		//初始化省，市	110000北京市,自定义
		initProvince();		
		initCity(110000);
		initCustom();
	}

	//初始化自定义区域
	function initCustom(){
		var _cNode = $('.custom-dd'),
			_ctext = '';

		$.each(_custom,function(i){				
			_ctext += "<label><input type='checkbox' data-name='"+ _custom[i].name +"' data-pid='" + i + "' data-id='" +  i + "' name='city_checkbox' value='" +  _custom[i].name+ "' />" +  _custom[i].name + "</label>";
		});

		_cNode.append(_ctext);			

	};

	//初始化省
	function initProvince(){
		$.each(_provDate, function(i) {
        	_html += "<p data-id='" + i + "'>" + this.title + "</p>";
    	});					
		_province.append(_html);
	};
		
	//初始化市
	function initCity(province_id){
		_city.find('dl').hide();
		//判断是否存在
		var _flag = $('#'+province_id);
		if(_flag[0]){
			_flag.show();
		} else{				
			var citys = (_provDate[province_id].child),
			city_html = '<dl id="'+province_id+'"><dt>';
			city_html += "<p><label><input type='checkbox' data-name='"+ _provDate[province_id].title +"' data-pid='" + _provDate[province_id].id + "' data-id='" +  _provDate[province_id].id + "' name='city_checkbox' value='" +  _provDate[province_id].title + "' />" +  _provDate[province_id].title + "</label></p></dt><dd>";				
			$.each(citys, function(i) {				
				city_html += "<p><label><input type='checkbox' data-name='"+this.title+"' data-pid='" + province_id + "' data-id='" + i + "' name='city_checkbox' value='" + i + "' />" + this.title + "</label></p>";
			});
			city_html +='</dd></dl>';
			_city.append(city_html);
		}			
	};

	//点击省份加载 市
	_province.on('click','p',function(){			
		initCity($(this).attr('data-id'));
	});

	//获取checkbox
	_city.on('click','input',function(){			
		cancelSelect($(this));			
	});

	//自定义点击
	$('.custom-dd').on('click','input',function(){
		customSelect($(this));	
	});

	
	//自定义
	function customSelect(that){
		var _this = that;
			_pid = _this.attr('data-id'),
			_cid = _custom[_pid].ragions,
			_hover = _this.parent(),
			_that = '';
			
		$.each(_cid,function(i){
			initCity(_cid[i]);				
		});

		
		if(_this.attr('checked') == undefined){													//选中
			_this.attr({'checked':true});
			_this.prop('checked','true');
			_hover.addClass('hover');

			$.each(_cid,function(i){
				//生成
				initCity(_cid[i]);
				_that = $('input[data-id='+_cid[i]+']');

				if(_that.attr('checked') != 'checked'){
					cancelSelect(_that);
					_that.prop({'checked':'checked'});
				}
				_that.prop('disabled','disabled');
			});
			$('.result-list').append("<span did="+ _pid +">"+ _this.val() +"<em>×</em></span>");	
								
		} else{																				//未选中
			_this.removeAttr('checked');
			_hover.removeClass('hover');

			$.each(_cid,function(i){
				_that = $('input[data-id='+_cid[i]+']');
				cancelSelect(_that);
				_that.removeAttr('disabled');
			});	

			$('.result-list').find('span[did='+ _pid +']').remove();
			//$('.result-list').append("<em did="+ _pid +">"+ _this.val() +"<i>×</i></em>");	
		}

		$.each(_cid,function(i){
			$('.result-list').find('span[did='+ _cid[i] +']').remove();
		});
	};


	//取消选中
	function cancelSelect(_this){
		var _flag = _this.attr('checked'),
			_pNode = $('.result-list'),				
			_name = _this.attr('data-name'),
			_id = _this.attr('data-id');
			
		if(_flag == undefined){													//选中
			_this.attr('checked','checked');
			_pNode.append("<span did="+ _id +">"+ _name +"<i>×</i></span>");							
		} else{																				//未选中
			_this.removeAttr('checked');				
			_pNode.find('span[did='+_id+']').remove();								
		}

		if(_id == _this.attr('data-pid')){
			//先遍历之前市是否选中
			var _list = _this.parents('dt').next().find('input'),
				_hover = _province.find('p[data-id='+_id+']');

			_pNode.find('span').each(function(){
				var _did = $(this).attr('did');
				if(_provDate[_id].child[_did]){
					$(this).remove();
				}											
			});

			if(_flag == undefined){
				_list.prop({'checked':'checked','disabled':'disabled'});
				_hover.addClass('hover');
			} else{
				_list.removeAttr('checked').removeAttr('disabled');
				_hover.removeClass('hover');
			}
		}
	};

	$('.place-clear').click(function(){
		clearAll();
	});

	//清空
	function clearAll(){
		//清空结果
		$('.result-list').find('span').remove();
		//清空hover效果
		$('.custom-dd').find('label').removeClass('hover');
		_province.find('p').removeClass('hover');
		//清空checkbox
		$('.place-con').find('input').removeAttr('checked').removeAttr('disabled');
	};

	$('.place-submit').click(function(){
		showResult();
	});

	//确定
	function showResult(){
		var _resu = $('.result-list').html();
		$('.selector').addClass('result-list').html(_resu);
		
		layer.close(layerId);
	};

	//自定义区域删除
	$(document).on('click','.result-list em, .result-list i',function(){
		var _id = $(this).parent().attr('did');

		if(this.tagName == 'I'){
			cancelSelect($('input[data-id='+_id+']'));
		} else if( this.tagName == 'EM'){
			$('.custom-dd').find('input[data-pid='+ _id +']').click();	
		}
		
	});

});