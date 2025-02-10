/** op **/
// $(".set-submit").click(function(){
// 	var data = $("#set_config").serialize();
// 	layer.msg('正在保存配置...',{icon:16,time:0,shade: [0.3, '#000']});
// 	$.post('/config/set',data,function(rdata){
// 		layer.closeAll();
// 		layer.msg(rdata.msg,{icon:rdata.status?1:2});
// 		if(rdata.status){
// 			setTimeout(function(){
// 				window.location.href = ((window.location.protocol.indexOf('https') != -1)?'https://':'http://') + rdata.data.host + window.location.pathname;
// 			},2500);
// 		}
// 	},'json');
// });

$('input[name="webname"]').change(function(){
	var webname = $(this).val();
	$('.btn_webname').removeAttr('disabled');
	$('.btn_webname').unbind().click(function(){
		$.post('/setting/set_webname','webname='+webname, function(rdata){
			showMsg(rdata.msg,function(){window.location.reload();},{icon:rdata.status?1:2},2000);
		},'json');
	});
});


$('input[name="host_ip"]').change(function(){
	var host_ip = $(this).val();
	$('.btn_host_ip').removeAttr('disabled');
	$('.btn_host_ip').unbind().click(function(){
		$.post('/setting/set_ip','host_ip='+host_ip, function(rdata){
			showMsg(rdata.msg,function(){window.location.reload();},{icon:rdata.status?1:2},2000);
		},'json');
	});
});

$('input[name="port"]').change(function(){
	var port = $(this).val();
	var old_port = $(this).data('port');
	$('.btn_port').removeAttr('disabled');
	$('.btn_port').unbind().click(function(){
		$.post('/setting/set_port','port='+port, function(rdata){
			showMsg(rdata.msg,function(){
				window.location.href = window.location.href.replace(old_port,port);
				// window.location.reload();
			},{icon:rdata.status?1:2},5000);
		},'json');
	});
});

$('input[name="sites_path"]').change(function(){
	var sites_path = $(this).val();
	$('.btn_sites_path').removeAttr('disabled');
	$('.btn_sites_path').unbind().click(function(){
		$.post('/setting/set_www_dir','sites_path='+sites_path, function(rdata){
			showMsg(rdata.msg,function(){window.location.reload();},{icon:rdata.status?1:2},2000);
		},'json');
	});
});


$('input[name="backup_path"]').change(function(){
	var backup_path = $(this).val();
	$('.btn_backup_path').removeAttr('disabled');
	$('.btn_backup_path').unbind().click(function(){
		$.post('/setting/set_backup_dir','backup_path='+backup_path, function(rdata){
			showMsg(rdata.msg,function(){window.location.reload();},{icon:rdata.status?1:2},2000);
		},'json');
	});
});


$('input[name="bind_domain"]').change(function(){
	var domain = $(this).val();
	$('.btn_bind_domain').removeAttr('disabled');
	$('.btn_bind_domain').unbind().click(function(){
		$.post('/setting/set_panel_domain','domain='+domain, function(rdata){
			showMsg(rdata.msg,function(){
				window.location.href = rdata.data;
			},{icon:rdata.status?1:2},5000);
		},'json');
	});
});

$('input[name="bind_ssl"]').click(function(){
	var panel_ssl = $(this).prop("checked");
	$(this).prop("checked",!panel_ssl);

	//开启证书
	if (panel_ssl){
		// <option value="1">ACME</option>
		layer.open({
			type:1,
			closeBtn: 1,
			title:"开启SSL证书",
			area: ['600px','440px'],
			btn: ["开启SSL证书访问"],
			maxmin:false,
			shadeClose: true,
			content: '<div class="bt-form" style="padding: 25px 40px;">\
				<div style="text-align: center;">\
					<h3 style="font-size: 20px;color: #333;margin-left: 5px;">【开启SSL证书】保护面板访问安全</h3>\
				</div>\
				<ul class="help-info-text c7 pd15" style="color: #333;font-size: 14px;background: #F5F7FA;margin-top: 24px;padding: 10px 20px 10px 20px;border-radius: 2px;">\
					<li>自签证书访问步骤：</li>\
					<li>1. 部署SSL证书</li>\
					<li>2. 浏览器地址栏修改为https://访问</li>\
					<li>3. 如提醒风险（正常现象）点击【高级】或【详情】</li>\
					<li>4.【继续访问】或【接收风险并继续】</li>\
				</ul>\
				<div class="pt10" style="margin-top: 20px;">\
					<div class="line" style="font-size: 14px;">\
						<span class="tname" style="width: 78px;">类型</span>\
						<div class="info-r" style="margin-left: 78px;">\
							<select class="bt-input-text mr5" name="cert_type" style="width: 440px;">\
								<option value="0">自签证书 (推荐，浏览器会提示不安全。可忽略，请放心开启)</option>\
							</select>\
						</div>\
					</div>\
					<ul class="help-info-text c7 sslSafeTips">\
						<li><span>开启后导致面板不能访问，可以点击查看</span></li>\
						<li>自签证书不被浏览器信任，显示不安全是正常现象</li>\
					</ul>\
				</div>\
			</div>',
			yes: function(){

				var cert_type = $('select[name=cert_type]').val();
				$.post('/setting/set_panel_local_ssl',{'cert_type':cert_type}, function(rdata){
					// console.log(rdata);
					var to_https = window.location.href.replace('http','https');
					showMsg(rdata.msg,function(){
						if (rdata.status){
							window.location.href = to_https;
						}
					},{icon:rdata.status?1:2},5000);
				},'json');
	
			}
		});
	} else { 
		//关闭SSL
		layer.open({
			type:1,
			closeBtn: 1,
			title:"关闭SSL证书",
			area: ['480px','280px'],
			btn: ["确定","取消"],
			shadeClose: true,
			content: '<div class="bt-form" style="padding: 25px 40px;">\
				<div class="hint_title" style="font-size: 15px;color: #111;text-align:center;">\
					<div class="hint_con">关闭SSL极易被抓包攻击导致账号密码泄露，请勿关闭</div>\
				</div>\
				<div class="confirm-info-box" style="background-color: #f0f0f0;clear: both;font-size: 14px;height: 105px;line-height: 26px;padding: 20px 20px;margin-top: 20px;">\
					<div>请手动输入【<span style="color: #fc6d26;">我要关闭</span>】，完成验证</div>\
					<input onpaste="return false;" id="prompt_input_box" style="height: 30px;line-height: 30px;margin-top: 5px;width: 360px;color: #444;outline: none;border: 1px solid #ccc;padding: 0 5px;" type="text" value="" autocomplete="off">\
				</div>\
			</div>',
			yes: function(index){
				var val = $('#prompt_input_box').val();
				if (val != '我要关闭'){
					layer.msg("关闭SSL失败!");
					return;
				}

				$.post('/setting/close_panel_ssl',{}, function(rdata){
					var to_http = window.location.href.replace('https','http');
					showMsg(rdata.msg,function(){
						if (rdata.status){
							window.location.href = to_http;
						}
					},{icon:rdata.status?1:2},5000);
				},'json');
			}
		});
	}

});

/** op **/


// VIP -- start
function setVipInfo(){
	layer.open({
		type: 1,
		area: "400px",
		title: 'VIP登录',
		closeBtn: 1,
		shift: 5,
		btn:["登录","关闭"],
		shadeClose: false,
		content: "<div class='bt-form pd20'>\
				<div class='line'>\
					<span class='tname'>用户名</span>\
					<div class='info-r'><input class='bt-input-text' type='text' name='username' value='' style='width:85%' autocomplete='off'/></div>\
				</div>\
				<div class='line'>\
					<span class='tname'>密码</span>\
					<div class='info-r'><input class='bt-input-text' type='password' name='password' value='' style='width:85%' autocomplete='off'/></div>\
				</div>\
			</div>",
		yes:function(index){
			var pdata = {};

			pdata['username'] = $('input[name="username"]').val();
			pdata['password'] = $('input[name="password"]').val();

			if (pdata['username'] == ''){
				layer.msg('用户名不能为空!', {icon:2});
				return false;
			}

			if (pdata['password'] == ''){
				layer.msg('密码不能为空!', {icon:2});
				return false;
			}

			$.post('/vip/login',{'username':pdata['username'], 'password':pdata['password']},function(rdata){
				showMsg(rdata.msg, function(){
					if (rdata.status){
						layer.close(index);
					}
				},{icon:rdata.status?1:2},2000);
			},'json');
		},
	});
}
// VIP -- end


//关闭面板
function closePanel(){
	layer.confirm('关闭面板会导致您无法访问面板 ,您真的要关闭Linux面板吗？',{title:'关闭面板',closeBtn:2,icon:13,cancel:function(){
		$("#closePl").prop("checked",false);
	}}, function() {
		$.post('/setting/close_panel','',function(rdata){
			layer.msg(rdata.msg,{icon:rdata.status?1:2});
			setTimeout(function(){
				window.location.reload();
			},1000);
		},'json');
	},function(){
		$("#closePl").prop("checked",false);
	});
}

//开发模式
function debugMode(){
	var loadT = layer.msg('正在发送请求,请稍候...', { icon: 16, time: 0, shade: [0.3, '#000'] });
    $.post('/setting/open_debug', {}, function (rdata) {
        layer.close(loadT);
        showMsg(rdata.msg, function(){
			window.location.reload();
		} ,{icon:rdata.status?1:2}, 1000);
    },'json');
}


function modifyAuthPath() {
    var auth_path = $("#admin_path").val();
    layer.open({
        type: 1,
        area: "500px",
        title: "修改安全入口",
        closeBtn: 1,
        shift: 5,
        btn:['提交','关闭', '随机生成'],
        shadeClose: false,
        content: '<div class="bt-form bt-form pd20">\
            <div class="line ">\
                <span class="tname">入口地址</span>\
                <div class="info-r">\
                    <input name="auth_path_set" class="bt-input-text mr5" type="text" style="width: 311px" value="' + auth_path + '">\
                </div>\
            </div>\
        </div>',
        yes:function(index){
        	var auth_path = $("input[name='auth_path_set']").val();
		    if (auth_path == '/' || auth_path == ''){
		    	layer.confirm('警告，关闭安全入口等于直接暴露你的后台地址在外网，十分危险, 您真的要这样更改吗？',{title:'安全入口修改',closeBtn:1,icon:13,
		    	cancel:function(){
				}}, function() {
					var loadT = layer.msg(lan.config.config_save, { icon: 16, time: 0, shade: [0.3, '#000'] });
				    $.post('/setting/set_admin_path', { admin_path: auth_path }, function (rdata) {
				    	showMsg(rdata.msg, function(){
				    		layer.close(index);
				    		layer.close(loadT);
				    		location.reload();
				    	},{ icon: rdata.status ? 1 : 2 }, 2000);
					},'json');
				});
		    	return;
		    } else {
		    	var loadT = layer.msg(lan.config.config_save, { icon: 16, time: 0, shade: [0.3, '#000'] });
			    $.post('/setting/set_admin_path', { admin_path: auth_path }, function (rdata) {
			    	showMsg(rdata.msg, function(){
			    		layer.close(index);
			    		layer.close(loadT);
			    		location.reload();
			    	},{ icon: rdata.status ? 1 : 2 }, 2000);
			    },'json');
		    }
        },
        btn3:function(){
        	var rand_str = getRandomString(8);
        	$("input[name='auth_path_set']").val('/'+rand_str);
        	return false;
        }
    });
}

function setPassword() {
	layer.open({
		type: 1,
		area: ["350px",'auto'],
		title: '修改密码',
		closeBtn: 1,
		shift: 5,
		shadeClose: false,
		btn:["修改","关闭","随机"],
		content: "<div class='bt-form'>\
				<div class='line'>\
					<span class='tname'>密码</span>\
					<div class='info-r'><input class='bt-input-text' type='text' name='password1' id='p1' value='' placeholder='新的密码' style='width:70%'/></div>\
				</div>\
				<div class='line'>\
					<span class='tname'>重复</span>\
					<div class='info-r'><input class='bt-input-text' type='text' name='password2' id='p2' value='' placeholder='再输一次' style='width:70%' /></div>\
				</div>\
			</div>",
		yes:function(){
			var p1 = $("#p1").val();
			var p2 = $("#p2").val();
			if(p1 == "" || p1.length < 8) {
				layer.msg('面板密码不能少于8位!', {icon: 2});
				return
			}
			
			//准备弱口令匹配元素
			var checks = ['admin888','123123123','12345678','45678910','87654321','asdfghjkl','password','qwerqwer'];
			pchecks = 'abcdefghijklmnopqrstuvwxyz1234567890';
			for(var i=0;i<pchecks.length;i++){
				checks.push(pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]);
			}
			
			//检查弱口令
			cps = p1.toLowerCase();
			var isError = "";
			for(var i=0;i<checks.length;i++){
				if(cps == checks[i]){
					isError += '['+checks[i]+'] ';
				}
			}
			
			if(isError != ""){
				layer.msg('面板密码不能为弱口令'+isError,{icon:5});
				return;
			}
				
			if(p1 != p2) {
				layer.msg('两次输入的密码不一致', {icon: 2});
				return;
			}
			$.post("/setting/set_password", "password1=" + encodeURIComponent(p1) + "&password2=" + encodeURIComponent(p2), function(b) {
				if(b.status) {
					layer.closeAll();
					layer.msg(b.msg, {icon: 1});
				} else {
					layer.msg(b.msg, {icon: 2});
				}
			},'json');
			return;
		},
		btn3: function(){
			var pwd = randomStrPwd(12);
			$("#p1").val(pwd);
			$("#p2").val(pwd);
			layer.msg('请在修改前记录好您的新密码!',{time:2000});
			return false;
		}
	});
}

function setUserName() {
	layer.open({
		type: 1,
		area: ["350px",'auto'],
		title: '修改面板用户名',
		closeBtn: 1,
		shift: 5,
		shadeClose: false,
		btn:["确定","取消","随机"],
		content: "<div class='bt-form pd20'>\
			<div class='line'><span class='tname'>用户名</span>\
				<div class='info-r'><input class='bt-input-text' type='text' name='password1' id='p1' value='' placeholder='新的用户名' style='width:70%'/></div>\
			</div>\
			<div class='line'>\
				<span class='tname'>重复</span>\
				<div class='info-r'><input class='bt-input-text' type='text' name='password2' id='p2' value='' placeholder='再输一次' style='width:70%'/></div>\
			</div>\
		</div>",
		yes: function(){
			p1 = $("#p1").val();
			p2 = $("#p2").val();
			if(p1 == "" || p1.length < 3) {
				layer.msg('用户名长度不能少于3位', {icon: 2});
				return;
			}
			if(p1 != p2) {
				layer.msg('两次输入的用户名不一致', {icon: 2});
				return;
			}
			$.post("/setting/set_name", "name1=" + encodeURIComponent(p1) + "&name2=" + encodeURIComponent(p2), function(b) {
				if(b.status) {
					layer.closeAll();
					layer.msg(b.msg, {icon: 1});
					$("input[name='username_']").val(p1)
				} else {
					layer.msg(b.msg, {icon: 2});
				}
			},'json');
			return
		},
		btn3:function(){
			var pwd = randomStrPwd(12);
			$("#p1").val(pwd);
			$("#p2").val(pwd);
			layer.msg('请在修改前记录好您的用户名!',{time:2000});
			return false;
		}
	})
}

function setTimezone(){
	layer.open({
		type: 1,
		area: ["400px","200px"],
		title: '设置服务器时区',
		closeBtn: 1,
		shift: 5,
		shadeClose: false,
		btn:["确定","取消","同步"],
		content: "<div class='bt-form pd20'>\
			<div class='line'>\
				<span class='tname'>时区</span>\
				<div class='info-r'>\
					<select class='bt-input-text mr5' name='timezone' style='width: 250px;'></select>\
				</div>\
			</div>\
		</div>",
		success:function(){
			var tbody = '';
			$.post('/setting/get_timezone_list', {}, function (data) {
				var rdata = data['data'];
		        for (var i = 0; i < rdata.length; i++) {

		        	if (rdata[i] == 'Asia/Shanghai'){
		        		tbody += '<option value="'+rdata[i]+'" selected="selected">'+rdata[i]+'</option>';
		        	} else {
		        		tbody += '<option value="'+rdata[i]+'">'+rdata[i]+'</option>';
		        	}
		        	
		        }
		        $('select[name="timezone"]').append(tbody);
		    },'json');
	    },
        yes:function(index){
		    var loadT = layer.msg("正在设置时区...", { icon: 16, time: 0, shade: [0.3, '#000'] });
		    var timezone = $('select[name="timezone"]').val();
		    $.post('/setting/set_timezone', { timezone: timezone }, function (rdata) {
		    	showMsg(rdata.msg, function(){
		    		layer.close(index);
		    		layer.close(loadT);
		    		location.reload();
		    	},{ icon: rdata.status ? 1 : 2 }, 2000);
		    },'json');
        },
        btn3:function(){
        	var loadT = layer.msg('正在同步时间...',{icon:16,time:0,shade: [0.3, '#000']});
			$.post('/setting/sync_date','',function(rdata){
				layer.close(loadT);
				layer.msg(rdata.msg,{icon:rdata.status?1:2});
				setTimeout(function(){window.location.reload();},1500);
			},'json');
        }
	})
}


function setIPv6() {
    var loadT = layer.msg('正在配置,请稍候...', { icon: 16, time: 0, shade: [0.3, '#000'] });
    $.post('/setting/set_ipv6_status', {}, function (rdata) {
        layer.close(loadT);
        layer.msg(rdata.msg, {icon:rdata.status?1:2});
        setTimeout(function(){window.location.reload();},5000);
    },'json');
}


//设置面板SSL
function setPanelSSL(){
	var status = $("#sshswitch").prop("checked")==true?1:0;
	var msg = $("#panelSSL").attr('checked')?'关闭SSL后,必需使用http协议访问面板,继续吗?':'<a style="font-weight: bolder;font-size: 16px;">危险！此功能不懂别开启!</a>\
	<li style="margin-top: 12px;color:red;">必须要用到且了解此功能才决定自己是否要开启!</li>\
	<li>面板SSL是自签证书，不被浏览器信任，显示不安全是正常现象</li>\
	<li>开启后导致面板不能访问，可以点击下面链接了解解决方法</li>\
	<p style="margin-top: 10px;">\
		<input type="checkbox" id="checkSSL" /><label style="font-weight: 400;margin: 3px 5px 0px;" for="checkSSL">我已了经解详情,并愿意承担风险</label>\
	</p>';
	layer.confirm(msg,{title:'设置面板SSL',closeBtn:1,icon:3,area:'550px',cancel:function(){
		$("#panelSSL").prop("checked", status == 0?false:true);
	}},function(){
		if(window.location.protocol.indexOf('https') == -1){
			if(!$("#checkSSL").prop('checked')){
				layer.msg(lan.config.ssl_ps,{icon:2});
				return false;
			}
		}
		var loadT = layer.msg('正在安装并设置SSL组件,这需要几分钟时间...',{icon:16,time:0,shade: [0.3, '#000']});
		$.post('/setting/set_panel_ssl','',function(rdata){
			layer.close(loadT);
			layer.msg(rdata.msg,{icon:rdata.status?1:5});
			if(rdata.status === true){
				$.post('/system/restart','',function (rdata) {
                    layer.close(loadT);
                    layer.msg(rdata.msg);
                    setTimeout(function(){
						window.location.href = ((window.location.protocol.indexOf('https') != -1)?'http://':'https://') + window.location.host + window.location.pathname;
					},3000);
                },'json');
			}
		},'json');
	},function(){
		if(status == 0){
			$("#panelSSL").prop("checked",false);
		}else{
			$("#panelSSL").prop("checked",true);
		}
	});
}

function setNotifyTgbot(obj){
	var enable = $(obj).prop("checked");
	$.post('/setting/set_notify_tgbot_enable', {'enable':enable},function(rdata){
		showMsg(rdata.msg, function(){
			if (rdata.status){}
		} ,{icon:rdata.status?1:2}, 1000);
	},'json');
}


function setNotifyEmail(obj){
	var enable = $(obj).prop("checked");
	$.post('/setting/set_notify_email_enable', {'enable':enable},function(rdata){
		showMsg(rdata.msg, function(){
			if (rdata.status){}
		} ,{icon:rdata.status?1:2}, 1000);
	},'json');
}

function getTgbot(){
	var loadT = layer.msg('正在获取TgBot信息...',{icon:16,time:0,shade: [0.3, '#000']});
	$.post('/setting/get_notify_tgbot',{},function(data){
		layer.close(loadT);

		var app_token = '';
		var chat_id = '';

		if (data.status){
			if (data['data']['tgbot'].length != 0){
				app_token = data['data']['tgbot']['app_token'];
				chat_id = data['data']['tgbot']['chat_id'];
			}
		}

		layer.open({
			type: 1,
			area: "500px",
			title: 'TgBot配置',
			closeBtn: 1,
			shift: 5,
			btn:["确定","关闭","验证"],
			shadeClose: false,
			content: "<div class='bt-form pd20'>\
					<div class='line'>\
						<span class='tname'>APP_TOKEN</span>\
						<div class='info-r'><input class='bt-input-text' type='text' name='app_token' value='"+app_token+"' style='width:100%'/></div>\
					</div>\
					<div class='line'>\
						<span class='tname'>CHAT_ID</span>\
						<div class='info-r'><input class='bt-input-text' type='text' name='chat_id' value='"+chat_id+"' style='width:100%' /></div>\
					</div>\
				</div>",
			yes:function(index){
				var pdata = {};
				pdata['app_token'] = $('input[name="app_token"]').val();
				pdata['chat_id'] = $('input[name="chat_id"]').val();

				if (pdata['app_token'] == ''){
					layer.msg('app_token不能为空!', {icon:2});
					return false;
				}

				if (pdata['chat_id'] == ''){
					layer.msg('chat_id不能为空!', {icon:2});
					return false;
				}

				$.post('/setting/set_notify_tgbot',{'tag':'tgbot', 'data':JSON.stringify(pdata)},function(rdata){
					showMsg(rdata.msg, function(){
						if (rdata.status){
							layer.close(index);
						}
					},{icon:rdata.status?1:2},2000);
				});
			},

			btn3:function(index){
				var pdata = {};
				pdata['app_token'] = $('input[name="app_token"]').val();
				pdata['chat_id'] = $('input[name="chat_id"]').val();

				if (pdata['app_token'] == ''){
					layer.msg('app_token不能为空!', {icon:2});
					return false;
				}

				if (pdata['chat_id'] == ''){
					layer.msg('chat_id不能为空!', {icon:2});
					return false;
				}

				$.post('/setting/set_notify_tgbot_test',{'tag':'tgbot', 'data':JSON.stringify(pdata)},function(rdata){
					showMsg(rdata.msg, function(){
						if (rdata.status){
							layer.close(index);
						}
					},{icon:rdata.status?1:2},2000);
				});
				return false;
			}
		});
	});
}

function getEmailCfg(){
	var loadT = layer.msg('正在获取邮件配置信息...',{icon:16,time:0,shade: [0.3, '#000']});
	$.post('/setting/get_notify_email',{},function(data){
		layer.close(loadT);

		var smtp_host = 'smtp.163.com';
		var smtp_port = '25';
		var username = 'admin';
		var password = '';
		var to_mail_addr = '';

		var smtp_ssl_no = 'checked';
		var smtp_ssl_yes = '';

		if (data.status){
			if (typeof(data['data']['email']) !='undefined'){
				smtp_host = data['data']['email']['smtp_host'];
				smtp_port = data['data']['email']['smtp_port'];
				username = data['data']['email']['username'];
				password = data['data']['email']['password'];
				to_mail_addr = data['data']['email']['to_mail_addr'];

				var smtp_ssl = data['data']['email']['smtp_ssl'];
				if (smtp_ssl == 'ssl'){
					smtp_ssl_no = '';
					smtp_ssl_yes = 'checked';
				}
			}
		}

		layer.open({
			type: 1,
			area: "500px",
			title: '邮件配置',
			closeBtn: 1,
			shift: 5,
			btn:["确定","关闭","验证"],
			shadeClose: false,
			content: "<div class='bt-form pd20'>\
					<div class='line'>\
						<span class='tname'>SMTP服务器</span>\
						<div class='info-r'><input class='bt-input-text' type='text' name='smtp_host' value='"+smtp_host+"' style='width:100%'/></div>\
					</div>\
					<div class='line'>\
						<span class='tname'>SMTP安全</span>\
						<div class='info-r checkbox'>\
							<label><input name='smtp_ssl' type='radio' value='' style='margin-right: 4px;' "+smtp_ssl_no+">None</label>\
							<label><input name='smtp_ssl' type='radio' value='ssl' style='margin-right: 4px;' "+smtp_ssl_yes+">SSL</label>\
						</div>\
					</div>\
					<div class='line'>\
						<span class='tname'>SMTP端口</span>\
						<div class='info-r'><input class='bt-input-text' type='text' name='smtp_port' value='"+smtp_port+"' style='width:100%' /></div>\
					</div>\
					<div class='line'>\
						<span class='tname'>用户名</span>\
						<div class='info-r'><input class='bt-input-text' type='text' name='username' value='"+username+"' style='width:100%' autocomplete='off'/></div>\
					</div>\
					<div class='line'>\
						<span class='tname'>授权码</span>\
						<div class='info-r'><input class='bt-input-text' type='password' name='password' value='"+password+"' style='width:100%' autocomplete='off'/></div>\
					</div>\
					<div class='line'>\
						<span class='tname'>发送地址</span>\
						<div class='info-r'><input class='bt-input-text' type='text' name='to_mail_addr' value='"+to_mail_addr+"' style='width:100%' autocomplete='off'/></div>\
					</div>\
					<div class='line'>\
						<span class='tname'>验证测试</span>\
						<div class='info-r'>\
							<textarea class='bt-input-text' name='mail_test' style='width:100%; height: 80px; line-height: 20px; padding: 5px 8px;'>验证测试</textarea></div>\
					</div>\
				</div>",
			yes:function(index){
				var pdata = {};
				pdata['smtp_host'] = $('input[name="smtp_host"]').val();
				pdata['smtp_port'] = $('input[name="smtp_port"]').val();
				pdata['smtp_ssl'] = $('input[name="smtp_ssl"]:checked').val();
				pdata['username'] = $('input[name="username"]').val();
				pdata['password'] = $('input[name="password"]').val();
				pdata['to_mail_addr'] = $('input[name="to_mail_addr"]').val();

				if (pdata['smtp_host'] == ''){
					layer.msg('SMTP服务器不能为空!', {icon:2});
					return false;
				}

				if (pdata['smtp_port'] == ''){
					layer.msg('SMTP端口不能为空!', {icon:2});
					return false;
				}

				if (pdata['username'] == ''){
					layer.msg('用户名不能为空!', {icon:2});
					return false;
				}

				if (pdata['password'] == ''){
					layer.msg('授权码不能为空!', {icon:2});
					return false;
				}

				if (pdata['to_mail_addr'] == ''){
					layer.msg('发送地址不能为空!', {icon:2});
					return false;
				}

				$.post('/setting/set_notify_email',{'tag':'email', 'data':JSON.stringify(pdata)},function(rdata){
					showMsg(rdata.msg, function(){
						if (rdata.status){
							layer.close(index);
						}
					},{icon:rdata.status?1:2},2000);
				},'json');
			},

			btn3:function(index){
				var pdata = {};
				pdata['smtp_host'] = $('input[name="smtp_host"]').val();
				pdata['smtp_port'] = $('input[name="smtp_port"]').val();
				pdata['smtp_ssl'] = $('input[name="smtp_ssl"]:checked').val();
				pdata['username'] = $('input[name="username"]').val();
				pdata['password'] = $('input[name="password"]').val();
				pdata['to_mail_addr'] = $('input[name="to_mail_addr"]').val();
				pdata['mail_test'] = $('textarea[name="mail_test"]').val();


				if (pdata['smtp_host'] == ''){
					layer.msg('SMTP服务器不能为空!', {icon:2});
					return false;
				}

				if (pdata['smtp_port'] == ''){
					layer.msg('SMTP端口不能为空!', {icon:2});
					return false;
				}

				if (pdata['username'] == ''){
					layer.msg('用户名不能为空!', {icon:2});
					return false;
				}

				if (pdata['password'] == ''){
					layer.msg('授权码不能为空!', {icon:2});
					return false;
				}

				if (pdata['to_mail_addr'] == ''){
					layer.msg('发送地址不能为空!', {icon:2});
					return false;
				}

				if (pdata['mail_test'] == ''){
					layer.msg('验证测试不能为空!', {icon:2});
					return false;
				}
				$.post('/setting/set_notify_email_test',{'tag':'email', 'data':JSON.stringify(pdata)},function(rdata){
					showMsg(rdata.msg, function(){
						if (rdata.status){
							layer.close(index);
						}
					},{icon:rdata.status?1:2},2000);
				},'json');
				return false;
			}
		});
	},'json');
}

function getPanelSSL(){
	var loadT = layer.msg('正在获取证书信息...',{icon:16,time:0,shade: [0.3, '#000']});
	$.post('/setting/get_panel_ssl',{},function(cert){
		layer.close(loadT);

		// console.log(cert);
		var choose = cert['choose'];
		var choose_local = '';
		var choose_nginx = '';

		if (choose == 'local'){
			cert = cert['local'];
			choose_local = 'selected="selected"';
		} else if (choose == 'nginx') {
			cert = cert['nginx'];
			choose_nginx = 'selected="selected"';
		} else {
			cert = cert['local'];
		}

		var cert_data = '';

		// <div class='state_item'>\
		// 	<span>强制HTTPS：</span>\
		// 	<span class='switch'>\
		// 		<input class='btswitch btswitch-ios' id='toHttps' type='checkbox' "+cert['is_https']+">\
		// 		<label class='btswitch-btn set_panel_http_to_https' for='toHttps'></label>\
		// 	</span>\
		// </div>\
		if (cert['info']){
			cert_data = "<div class='ssl_state_info'><div class='state_info_flex'>\
				<div class='state_item'><span>证书品牌：</span>\
				<span class='ellipsis_text ssl_issue'>"+cert['info']['issuer']+"</span></div>\
				<div class='state_item'><span>到期时间：</span>\
				<span class='btlink ssl_endtime'>剩余"+cert['info']['endtime']+"天到期</span></div>\
			</div>\
			<div class='state_info_flex'>\
				<div class='state_item'><span>认证域名：</span>\
				<span class='ellipsis_text ssl_subject'>"+cert['info']['subject']+"</span></div>\
			</div></div>";
		}

		// <button class="btn btn-success btn-sm apply-lets-ssl">申请ACME证书</button>\
		// <option value="nginx" '+choose_nginx+'>OpenResty</option>\
		var certBody = '<div class="tab-con">\
			<div class="myKeyCon ptb15">\
				'+cert_data+'\
				<div class="custom_certificate_info">\
					<div class="ssl-con-key pull-left mr20">密钥(KEY)<br>\
						<textarea id="key" class="bt-input-text">'+cert.privateKey+'</textarea>\
					</div>\
					<div class="ssl-con-key pull-left">证书(PEM格式)<br>\
						<textarea id="csr" class="bt-input-text">'+cert.certPem+'</textarea>\
					</div>\
				</div>\
				<div class="ssl-btn pull-left mtb15" style="width:100%">\
					<button class="btn btn-success btn-sm save-panel-ssl">保存</button>\
					<button class="btn btn-success btn-sm del-panel-ssl">删除</button>\
					<select class="bt-input-text" name="choose" style="width:100px;">\
						<option value="local" '+choose_local+'>本地</option>\
					</select>\
				</div>\
			</div>\
			<ul class="help-info-text c7 pull-left">\
				<li>粘贴您的*.key以及*.pem内容，然后保存即可。</li>\
				<li>如果浏览器提示证书链不完整,请检查是否正确拼接PEM证书</li><li>PEM格式证书 = 域名证书.crt + 根证书(root_bundle).crt</li>\
			</ul>\
		</div>'
		layer.open({
			type: 1,
			area: "600px",
			title: '自定义面板证书',
			closeBtn: 1,
			shift: 5,
			shadeClose: false,
			content:certBody,
			success:function(layero, layer_id){


				//保存SSL
				$('.save-panel-ssl').click(function(){
					var data = {
						privateKey:$("#key").val(),
						certPem:$("#csr").val()
					}

					layer.confirm('选择保存面板SSL方式?', 
					{
						title:'提示', 
						shade:0.001,
						btn: ['本地SSL', '取消'],//'OpenResty'
						btn3:function(){
							data['choose'] = 'nginx';
							var loadT = layer.msg('正在安装并设置SSL组件,这需要几分钟时间...',{icon:16,time:0,shade: [0.3, '#000']});
							$.post('/setting/save_panel_ssl',data,function(rdata){
								layer.close(loadT);
								if(rdata.status){
									layer.closeAll();
								}
								layer.msg(rdata.msg,{icon:rdata.status?1:2});
							},'json');
						},
					},
					function(index) {
						data['choose'] = 'local';
				    	var loadT = layer.msg('正在安装并设置SSL组件,这需要几分钟时间...',{icon:16,time:0,shade: [0.3, '#000']});
						$.post('/setting/save_panel_ssl',data,function(rdata){
							layer.close(loadT);
							if(rdata.status){
								layer.closeAll();
							}
							layer.msg(rdata.msg,{icon:rdata.status?1:2});
						},'json');
				    },
				    function(index) {
				        layer.close(index);
				    });
				});

				//删除SSL
				$('.del-panel-ssl').click(function(){

					layer.confirm('选择删除面板SSL方式?', 
					{
						title:'提示', 
						shade:0.001,
						btn: ['本地SSL', '取消'],//, 'OpenResty'
						btn3:function(){
							var data = {};
							data['choose'] = 'nginx';
							var loadT = layer.msg('正在删除面板SSL【nginx】...',{icon:16,time:0,shade: [0.3, '#000']});
							$.post('/setting/del_panel_ssl',data,function(rdata){
								layer.close(loadT);
								if(rdata.status){
									layer.closeAll();
								}
								layer.msg(rdata.msg,{icon:rdata.status?1:2});
							},'json');
						},
					},
					function(index) {
						var data = {};
						data['choose'] = 'local';
						var loadT = layer.msg('正在删除面板SSL【本地】...',{icon:16,time:0,shade: [0.3, '#000']});
						$.post('/setting/del_panel_ssl',data,function(rdata){
							console.log(rdata);
							layer.close(loadT);
							showMsg(rdata.msg, function(){
								if(rdata.status){
									location.href = rdata.data;
								}
							},{icon:rdata.status?1:2},3000);
						},'json');
				    },
				    function(index) {
				        layer.close(index);
				    });

					
				});

				// // 设置面板SSL的Http
				// $('.set_panel_http_to_https').click(function(){
				// 	var https = $('#toHttps').prop('checked');
				// 	$.post('/config/set_panel_http_to_https',{'https':https},function(rdata){
				// 		layer.close(loadT);
				// 		if(rdata.status){
				// 			layer.closeAll();
				// 		}
				// 		layer.msg(rdata.msg,{icon:rdata.status?1:2});
				// 	},'json');
				// });

				// //申请Lets证书
				// $('.apply-lets-ssl').click(function(){
				// 	showSpeedWindow('正在申请...', 'site.get_let_logs', function(layers,index){
				// 		$.post('/config/apply_panel_acme_ssl',{},function(rdata){
				// 			layer.close(loadT);
				// 			if(rdata.status){
				// 				layer.close(index);
				// 				var tdata = rdata['data'];
				// 				$('.ssl_issue').text(tdata['info']['issuer']);
				// 				$('.ssl_endtime').text("剩余"+tdata['info']['endtime']+"天到期");
				// 				$('.ssl_subject').text(tdata['info']['subject']);

				// 				$('textarea[name="key"]').val(tdata['info']['privateKey']);
				// 				$('textarea[name="csr"]').val(tdata['info']['certPem']);
				// 			}
				// 			layer.msg(rdata.msg,{icon:rdata.status?1:2});
				// 		},'json');
				// 	});
				// });
			}
		});
	},'json');
}


function removeTempAccess(id){
	$.post('/setting/remove_temp_login', {id:id}, function(rdata){
		showMsg(rdata.msg, function(){
			setTempAccessReq();
		},{ icon: rdata.status ? 1 : 2 }, 2000);
	},'json');
}

function getTempAccessLogsReq(id){
	$.post('/setting/get_temp_login_logs', {id:id}, function(rdata){			
		var tbody = '';
		for (var i = 0; i < rdata.data.length; i++) {

			tbody += '<tr>';
			tbody += '<td>' + (rdata.data[i]['type']) +'</td>';
			tbody += '<td>' + rdata.data[i]['addtime'] +'</td>';
			tbody += '<td>'+ rdata.data[i]['log'] +'</td>';
			tbody += '</tr>';
		}
		$('#logs_list').html(tbody);

	},'json');
}

function getTempAccessLogs(id){

	layer.open({
		area: ['700px', '250px'],
		title: '临时授权管理',
		closeBtn:1,
		shift: 0,
		type: 1,
		content: "<div class='pd20'>\
					<button class='btn btn-success btn-sm refresh_log'>刷新日志</button>\
					<div class='divtable mt10'>\
						<table class='table table-hover'>\
							<thead>\
								<tr><th>操作类型</th><th>操作时间</th><th>日志</th></tr>\
							</thead>\
							<tbody id='logs_list'></tbody>\
						</table>\
					</div>\
				</div>",
		success:function(){
			getTempAccessLogsReq(id);
			$('.refresh_log').click(function(){
				getTempAccessLogsReq(id);
			});
		}
	});
}

function setTempAccessReq(page){
	if (typeof(page) == 'undefined'){
		page = 1;
	}

	$.post('/setting/get_temp_login', {page:page}, function(rdata){
		console.log(rdata);
		if ( typeof(rdata.status) !='undefined' && !rdata.status){
			showMsg(rdata.msg,function(){
				layer.closeAll();
			},{icon:2}, 2000);
			return;
		}

		var tbody = '';
		for (var i = 0; i < rdata.data.length; i++) {

			tbody += '<tr>';
			tbody += '<td>' + (rdata.data[i]['login_addr']||'未登陆') +'</td>';

			tbody += '<td>';
			switch (parseInt(rdata.data[i]['state'])) {
				case 0:
					tbody += '<a style="color:green;">待使用</a>';
					break;
				case 1:
					tbody += '<a style="color:brown;">已使用</a>';
					break;
				case -1:
					tbody += '<a>已过期</a>';
					break;
			}
			tbody += '</td>';

			tbody += '<td>' + (getLocalTime(rdata.data[i]['login_time'])||'未登陆') +'</td>';
			tbody += '<td>' + getLocalTime(rdata.data[i]['expire']) +'</td>';

			tbody += '<td>';

			if (rdata.data[i]['state'] == '1' ){
				tbody += '<a class="btlink" onclick="getTempAccessLogs(\''+rdata.data[i]['id']+'\')">操作日志</a>';
			} else{
				tbody += '<a class="btlink" onclick="removeTempAccess(\''+rdata.data[i]['id']+'\')">删除</a>';
			}
			
			tbody += '</td>';

			tbody += '</tr>';
		}

		$('#temp_login_view_tbody').html(tbody);
		$('.temp_login_view_page').html(rdata.page);
	},'json');
}

function setStatusCode(o){
	var code = $(o).data('code');
    layer.open({
        type: 1,
        area: ['420px', '220px'],
        title: "设置未认证时的响应状态",
        closeBtn: 1,
        shift: 5,
        btn:['提交','关闭'],
        shadeClose: false,
        content: '<div class="bt-form bt-form pd20">\
                    <div class="line">\
                        <span class="tname">相应状态</span>\
                        <div class="info-r">\
                            <select class="bt-input-text mr5" name="status_code" style="width: 250px;"></select>\
                        </div>\
                    </div>\
                    <ul class="help-info-text c7"><li style="color: red;">用于未登录且未正确输入安全入口时的响应,用于隐藏面板特征</li></ul>\
                </div>',
        success:function(){
        	var msg_list = [
        		{'code':'0','msg':'默认-安全入口错误提示'},
        		{'code':'403','msg':'403-拒绝访问'},
        		{'code':'404','msg':'404-页面不存在'},
        		{'code':'416','msg':'416-无效的请求'},
        		{'code':'408','msg':'408-客户端超时'},
        		{'code':'400','msg':'400-客户端请求错误'},
        		{'code':'401','msg':'401-未授权访问'},
        	];

        	var tbody = '';
        	for(i in msg_list){
        		if (msg_list[i]['code'] == code){
        			tbody += '<option value="'+msg_list[i]['code']+'" selected>'+msg_list[i]['msg']+'</option>';
        		} else{
        			tbody += '<option value="'+msg_list[i]['code']+'">'+msg_list[i]['msg']+'</option>';
        		}
        		
        	}
        	$('select[name="status_code"]').append(tbody);
        },
        yes:function(index){
		    var loadT = layer.msg("正在设置未认证时的响应状态", { icon: 16, time: 0, shade: [0.3, '#000'] });
		    var status_code = $('select[name="status_code"]').val();
		    $.post('/setting/set_status_code', { status_code: status_code }, function (rdata) {
		    	showMsg(rdata.msg, function(){
		    		layer.close(index);
		    		layer.close(loadT);
		    		location.reload();
		    	},{ icon: rdata.status ? 1 : 2 }, 2000);
		    },'json');
        }
    });
}

function setTempAccess(){
	layer.open({
		area: ['700px', '380px'],
		title: '临时授权管理',
		closeBtn:1,
		shift: 0,
		type: 1,
		content: "<div class='login_view_table pd20'>\
					<button class='btn btn-success btn-sm create_temp_login'>临时访问授权</button>\
					<div class='divtable mt10'>\
						<table class='table table-hover'>\
							<thead>\
							<tr>\
								<th>登录IP</th>\
								<th>状态</th><th>登录时间</th>\
								<th>过期时间</th>\
								<th style='text-align:right;'>操作</th>\
							</tr>\
							</thead>\
							<tbody id='temp_login_view_tbody'></tbody>\
						</table>\
						<div class='temp_login_view_page page'></div>\
					</div>\
				</div>",
		success:function(){
			setTempAccessReq();

			$('.create_temp_login').click(function(){
				layer.confirm('<span style="color:red">注意1：滥用临时授权可能导致安全风险。</br>注意2：请勿在公共场合发布临时授权连接</span></br>即将创建临时授权连接，继续吗？',{
					title:'风险提示',
					closeBtn:1,
					icon:13,
				}, function(create_temp_login_layer) {
					$.post('/setting/set_temp_login', {}, function(rdata){
						layer.close(create_temp_login_layer);
						setTempAccessReq();
						layer.open({
							area: '570px',
							title: '创建临时授权',
							shift: 0,
							type: 1,
							content: "<div class='bt-form create_temp_view pd15'>\
									<div class='line'>\
										<span class='tname'>临时授权地址</span>\
										<div>\
											<textarea id='temp_link' class='bt-input-text mr20' style='margin: 0px;width: 500px;height: 50px;line-height: 19px;'></textarea>\
										</div>\
									</div>\
									<div class='line'><button type='submit' class='btn btn-success btn-sm btn-copy-temp-link' data-clipboard-text=''>复制地址</button></div>\
									<ul class='help-info-text c7 ptb15'>\
										<li>临时授权生成后1小时内使用有效，为一次性授权，使用后立即失效</li>\
										<li>使用临时授权登录面板后1小时内拥有面板所有权限，请勿在公共场合发布临时授权连接</li>\
										<li>授权连接信息仅在此处显示一次，若在使用前忘记，请重新生成</li>\
									</ul>\
								</div>",
							success:function(){
								var temp_link = "".concat(location.origin, "/login?tmp_token=").concat(rdata.token);
								$('#temp_link').val(temp_link);

								copyText(temp_link);
								$('.btn-copy-temp-link').click(function(){
									copyText(temp_link);
								});
							}
						});
					},'json');
				});
			});
		}
	});
}

//二步验证
function setAuthBind(){
	$.post('/setting/get_auth_secret', {}, function(rdata){
		console.log(rdata);
		var tip = layer.open({
			area: ['500px', '355px'],
			title: '二步验证设置',
			closeBtn:1,
			shift: 0,
			type: 1,
			content: '<div class="bt-form pd20">\
		<div class="line">\
			<span class="tname">绑定密钥</span>\
			<div class="info-r">\
				<input class="bt-input-text mr5" name="secret" type="text" style="width: 310px;" disabled>\
				<button class="btn btn-success btn-xs reset_secret" style="margin-left: -50px;">重置</button>\
			</div>\
		</div>\
		<div class="line">\
			<span class="tname" style="width: 90px; overflow: initial; height: 20px; line-height: 20px;">二维码</span>\
			<div class="info-r"><div class="qrcode"></div></div>\
		</div>\
		<ul class="help-info-text c7">\
		</ul>\
	</div>',
			success:function(layero,index){

				$('input[name="secret"]').val(rdata.data['secret']);
				$('.qrcode').qrcode({ text: rdata.data['url']});

				$('.reset_secret').click(function(){
					layer.confirm('您确定要重置当前密钥吗？<br/><span style="color: red; ">重置密钥后，已关联密钥产品，将失效，请重新添加新密钥至产品。</span>',{title:'重置密钥',closeBtn:2,icon:13,cancel:function(){
					}}, function() {
						$.post('/setting/get_auth_secret', {'reset':"1"},function(rdata){
							showMsg("接口密钥已生成，重置密钥后，已关联密钥产品，将失效，请重新添加新密钥至产品。", function(){
								$('input[name="secret"]').val(rdata.data['secret']);
								$('.qrcode').html('').qrcode({ text: rdata.data['url']});
							} ,{icon:1}, 2000);
						},'json');
					});
				});
			},
		});

	},'json');
}

function setAuthSecretApi(){
	var cfg_panel_auth = $('#cfg_panel_auth').prop("checked");
	$.post('/setting/set_auth_secret', {'op_type':"2"},function(rdata){
		showMsg(rdata.msg, function(){
			if (rdata.data == 1){
				setAuthBind();
			}
		} ,{icon:rdata.status?1:2}, 1000);
	},'json');
}

function setBasicAuthTip(callback){
	var tip = layer.open({
		area: ['500px', '385px'],
		title: '开启BasicAuth认证提示',
		closeBtn:0,
		shift: 0,
		type: 1,
		content: '<div class="bt-form pd20">\
		<div class="mb15">\
			<h3 class="layer-info-title">风险操作！此功能不懂请勿开启！</h3>\
		</div>\
		<ul class="help-info-text c7 explain-describe-list pd15">\
			<li style="color: red;">必须要用到且了解此功能才决定自己是否要开启!</li>\
			<li>开启后，以任何方式访问面板，将先要求输入BasicAuth用户名和密码</li>\
			<li>开启后，能有效防止面板被扫描发现，但并不能代替面板本身的帐号密码</li>\
			<li>请牢记BasicAuth密码，一但忘记将无法访问面板</li>\
			<li>如忘记密码，可在SSH通过mw命令来关闭BasicAuth验证</li>\
		</ul>\
		<div class="mt10 plr15 agreement-box" id="checkBasicAuth">\
			<input class="bt-input-text mr5" name="agreement" type="checkbox" value="false" id="agreement_more">\
			<label for="agreement_more"><span>我已经了解详情,并愿意承担风险</span></label>\
		</div>\
	</div>',
		btn:["确定","取消"],
		yes:function(l,index){
			is_agree = $('#agreement_more').prop("checked");
			if (is_agree){
				layer.close(tip);
				callback();
			}
			return is_agree;
		},
		btn2: function(index, layero){
		    $('#cfg_basic_auth').prop("checked", false);
		}
	});
}

function setBasicAuth(){

	var basic_auth = $('#cfg_basic_auth').prop("checked");
	if (!basic_auth){
		setBasicAuthTip(function(){
			var tip = layer.open({
				area: ['500px', '385px'],
				title: '配置BasicAuth认证',
				closeBtn:1,
				shift: 0,
				type: 1,
				content: '<div class="bt-form pd20">\
			<div class="line">\
				<span class="tname">用户名</span>\
				<div class="info-r"><input class="bt-input-text mr5" name="basic_user" type="text" placeholder="请设置用户名" style="width: 280px;"></div>\
			</div>\
			<div class="line">\
				<span class="tname">密码</span>\
				<div class="info-r"><input class="bt-input-text mr5" name="basic_pwd" type="text" placeholder="请设置密码" style="width: 280px;"></div>\
			</div>\
			<div class="line">\
				<span class="tname"></span>\
				<div class="info-r"><button class="btn btn-success btn-sm save_auth_cfg">保存配置</button></div>\
			</div>\
			<ul class="help-info-text c7">\
				<li style="color: red;">注意：请不要在这里使用您的常用密码，这可能导致密码泄漏！</li>\
				<li>开启后，以任何方式访问面板，将先要求输入BasicAuth用户名和密码</li>\
				<li>开启后，能有效防止面板被扫描发现，但并不能代替面板本身的帐号密码</li>\
				<li>请牢记BasicAuth密码，一但忘记将无法访问面板</li><li>如忘记密码，可在SSH通过mw命令来关闭BasicAuth验证</li>\
			</ul>\
		</div>',
				success:function(){
					$('.save_auth_cfg').click(function(){
						var basic_user = $('input[name="basic_user"]').val();
						var basic_pwd = $('input[name="basic_pwd"]').val();
						$.post('/setting/set_basic_auth', {'basic_user':basic_user,'basic_pwd':basic_pwd},function(rdata){
							showMsg(rdata.msg, function(){
								window.location.reload();
							} ,{icon:rdata.status?1:2}, 2000);
						},'json');
					});
				},
				cancel:function(){
					$('#cfg_basic_auth').prop("checked", false);
				},
			});
		});
	} else {
	    layer.confirm('关闭BasicAuth认证后，面板登录将不再验证BasicAuth基础认证，这将会导致面板安全性下降，继续操作！', 
	    {btn: ['确定', '取消'], title: "是否关闭BasicAuth认证?", icon:13}, function (index) {
	    	var basic_user = '';
			var basic_pwd = '';
			$.post('/setting/set_basic_auth', {'is_open':'false'},function(rdata){
				showMsg(rdata.msg, function(){
					layer.close(index);
					window.location.reload();
				} ,{icon:rdata.status?1:2}, 2000);
			},'json');
	    },function(){
	    	$('#cfg_basic_auth').prop("checked", true);
	    });
	}
}

function showPanelApi(){
	$.post('/setting/get_panel_token', '', function(rdata){
		var tip = layer.open({
			area: ['500px', '355px'],
			title: '配置面板API',
			closeBtn:1,
			shift: 0,
			type: 1,
			content: '<div class="bt-form pd20">\
		<div class="line">\
			<span class="tname">接口密钥</span>\
			<div class="info-r">\
				<input class="bt-input-text mr5" name="token" type="text" style="width: 310px;" disabled>\
				<button class="btn btn-success btn-xs reset_token" style="margin-left: -50px;">重置</button>\
			</div>\
		</div>\
		<div class="line">\
			<span class="tname" style="width: 90px; overflow: initial; height: 20px; line-height: 20px;">IP白名单<br/>(每行1个)</span>\
			<div class="info-r"><textarea class="bt-input-text" name="api_limit_addr" style="width: 310px; height: 80px; line-height: 20px; padding: 5px 8px;"></textarea></div>\
		</div>\
		<div class="line">\
			<span class="tname"></span>\
			<div class="info-r"><button class="btn btn-success btn-sm save_api">保存配置</button></div>\
		</div>\
		<ul class="help-info-text c7">\
			<li>开启API后，必需在IP白名单列表中的IP才能访问面板API接口</li>\
			<li style="color: red;">请不要在生产环境开启，这可能增加服务器安全风险；</li>\
		</ul>\
	</div>',
			success:function(layero,index){

				$('input[name="token"]').val(rdata.data.token);
				$('textarea[name="api_limit_addr"]').val(rdata.data.limit_addr);


				$('.reset_token').click(function(){
					layer.confirm('您确定要重置当前密钥吗？<br/><span style="color: red; ">重置密钥后，已关联密钥产品，将失效，请重新添加新密钥至产品。</span>',{title:'重置密钥',closeBtn:2,icon:13,cancel:function(){
					}}, function() {
						$.post('/config/set_panel_token', {'op_type':"1"},function(rdata){
							showMsg("接口密钥已生成，重置密钥后，已关联密钥产品，将失效，请重新添加新密钥至产品。", function(){
								$('input[name="token"]').val(rdata.data);
							} ,{icon:1}, 2000);
						},'json');
					});
				});

				$('.save_api').click(function(){
					var limit_addr = $('textarea[name="api_limit_addr"]').val();
					$.post('/config/set_panel_token', {'op_type':"3",'limit_addr':limit_addr},function(rdata){
						showMsg(rdata.msg, function(){
						} ,{icon:rdata.status?1:2}, 2000);
					},'json');
				});
			},
		});
	},'json');	
}


function setPanelApi(){
	var cfg_panel_api = $('#cfg_panel_api').prop("checked");
	$.post('/setting/set_panel_api', {},function(rdata){
		showMsg(rdata.msg, function(){
			if (rdata.status){
				addApp();
			}
		} ,{icon:rdata.status?1:2}, 1000);
	},'json');
}


function deleteApp(id){
	layer.confirm('您确定要删除吗？',{title:'删除应用',closeBtn:2,icon:13,cancel:function(){}}, function() {
		$.post('/setting/delete_app', {'id':id},function(rdata){
			layer.msg(rdata.msg,{icon:rdata.status?1:2});
			if (rdata.status){
				getAppList();
			}
		},'json');
	});
}

function toggleAppstatus(id){
	$.post('/setting/toggle_app_status', {id:id}, function(rdata){
		showMsg(rdata.msg, function(){
			if (rdata.status){
				getAppList();
			}
		} ,{icon:rdata.status?1:2}, 2000);
	},'json');
}

function getAppList(page) {

	if (typeof(page) == 'undefined'){
		page = 1;
	}

	$.post('/setting/get_app_list', {page:page}, function(rdata){
		var tbody = '';
		for (var i = 0; i < rdata.data.length; i++) {
			var row = rdata.data[i];

			tbody += '<tr>';

			tbody += '<td>' + row['app_id'] +'</td>';
			tbody += '<td>' + row['app_secret'] +'</td>';
			tbody += '<td>' + row['white_list'] +'</td>';

			if (row['status'] == 1){
				tbody += '<td><a class="btlink" onclick="toggleAppstatus('+row['id']+');">已开启</a></td>';
			} else {
				tbody += '<td><a style="color:red;" onclick="toggleAppstatus('+row['id']+');">已关闭</a></td>';
			}
			
			tbody += '<td>' + row['add_time'] +'</td>';

			tbody += '<td>';
			tbody += '<a class="btlink" onclick="deleteApp(\''+row['id']+'\')" style="float:right;">删除</a>';
			tbody += '</td>';

			tbody += '</tr>';
		}

		$('#app_list_body tbody').html(tbody);
		$('#app_list_body .page').html(rdata.page);
	},'json');
}

function addApp(){
	layer.open({
		area: '570px',
		title: '添加应用',
		shift: 0,
		type: 1,
		content: '<div class="bt-form pd20">\
	<div class="line">\
		<span class="tname">应用ID</span>\
		<div class="info-r">\
			<input class="bt-input-text mr5" name="app_id" type="text" style="width: 310px;" disabled>\
			<button class="btn btn-success btn-xs app_id" style="margin-left: -50px;">重置</button>\
		</div>\
	</div>\
	<div class="line">\
		<span class="tname">应用密钥</span>\
		<div class="info-r">\
			<input class="bt-input-text mr5" name="app_secret" type="text" style="width: 310px;" disabled>\
			<button class="btn btn-success btn-xs app_secret" style="margin-left: -50px;">重置</button>\
		</div>\
	</div>\
	<div class="line">\
		<span class="tname" style="width: 90px; overflow: initial; height: 20px; line-height: 20px;">IP白名单<br/>(每行1个)</span>\
		<div class="info-r"><textarea class="bt-input-text" name="api_limit_addr" style="width: 310px; height: 80px; line-height: 20px; padding: 5px 8px;"></textarea></div>\
	</div>\
	<div class="line">\
		<span class="tname"></span>\
		<div class="info-r"><button class="btn btn-success btn-sm save_app_data">保存配置</button></div>\
	</div>\
	<ul class="help-info-text c7">\
		<li>开启API后，必需在IP白名单列表中的IP才能访问面板API接口</li>\
		<li style="color: red;">请谨慎在生产环境开启，这可能增加服务器安全风险；</li>\
	</ul>\
</div>',
		success:function(obj,cur_layer){
			$('input[name="app_id"]').val(getRandomString(10));
			$('input[name="app_secret"]').val(getRandomString(20));

			$('.app_id').click(function(){
				$('input[name="app_id"]').val(getRandomString(10));
			});

			$('.app_secret').click(function(){
				$('input[name="app_secret"]').val(getRandomString(20));
			});

			$('.save_app_data').click(function(){
				var app_id = $('input[name="app_id"]').val();
				var app_secret = $('input[name="app_secret"]').val();
				var limit_addr = $('textarea[name="api_limit_addr"]').val();
				$.post('/setting/add_app', {'app_id':app_id,'app_secret':app_secret,'limit_addr':limit_addr},function(rdata){
					showMsg(rdata.msg, function(){
						if (rdata.status){
							getAppList();
							layer.close(cur_layer);
						}
					} ,{icon:rdata.status?1:2}, 2000);
				},'json');
			});

		}
	});
}

function appPage(){
	layer.open({
		area: ['900px', '380px'],
		title: 'APP应用管理',
		closeBtn:1,
		shift: 0,
		type: 1,
		content: "<div class='login_view_table pd20'>\
			<button class='btn btn-success btn-sm app_add'>添加</button>\
			<div class='divtable mt10' id='app_list_body'>\
				<table class='table table-hover'>\
					<thead>\
					<tr>\
						<th>应用ID</th>\
						<th>应用密钥</th>\
						<th>白名单</th>\
						<th>状态</th>\
						<th>添加时间</th>\
						<th style='text-align:right;'>操作</th>\
					</tr>\
					</thead>\
					<tbody></tbody>\
				</table>\
				<div class='page'></div>\
			</div>\
		</div>",
		success:function(){
			getAppList();
			$('.app_add').click(function(){
				addApp();
			});
		}
	});
}
