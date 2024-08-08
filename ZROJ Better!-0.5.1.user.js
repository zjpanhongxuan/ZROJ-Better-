// ==UserScript==
// @name		ZROJ Better!
// @namespace	http://tampermonkey.net/
// @version		0.5.1
// @description	++RP
// @author		PHX
// @match		http://zhengruioi.com/*
// @match		http://www.zhengruioi.com/*
// @icon		http://zhengruioi.com/pictures/UOJ_small.png
// @grant		GM_log
// @grant		GM_openInTab
// @grant		GM_registerMenuCommand
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_listValues
// @grant		GM_deleteValue
// @grant		GM_xmlhttpRequest
// ==/UserScript==

// GM 变量列表

let GMVariableList =
[
	{
		textBefore: "LaTex 公式设置",
		name: "whetherMagnifyLaTex",
		type: "bool",
		defaultValue: true,
		description: "放大 LaTex 公式（不太稳定）",
	},
	{
		name: "LaTexMagnification",
		type: "number",
		step: 0.05,
		defaultValue: 1.25,
		description: "LaTex 公式的放大倍数",
		style: "width: 120px",
	},

	{
		textBefore: "题目界面设置",
		name: "whetherCopyPreCode",
		type: "bool",
		defaultValue: true,
		description: "添加复制代码框的按钮",
	},
	{
		name: "whetherAddMySubmissionsAndAllSubmissionsButtons",
		type: "bool",
		defaultValue: true,
		description: "在题目界面添加“我的提交”“所有提交”按钮，并给“返回比赛”按钮添加图标",
	},
	{
		name: "whetherAddOpenIframeInNewTabButton",
		type: "bool",
		defaultValue: true,
		description: "添加在新标签页中打开 pdf 题面的按钮",
	},

	{
		textBefore: "比赛界面设置",
		name: "whetherHighlightStandingsPageSelfLine",
		type: "bool",
		defaultValue: true,
		description: "将比赛排行榜界面自己的那一行高亮并添加“只显示关注的人”按钮",
	},
	{
		name: "starredUserNameList",
		type: "list",
		defaultValue:
		[
			"zac2010",
			"PPPxvchongyv",
			"cjr2010",
			"yangshuyu",
			"Xiang_Haoyang",
			"swt2009",
			"sl2022phx",
			"wangzhiyuan12345",
			"lrher",
			"songziyan",
			"Z_301",
			"huangjianheng",
			"maoyiting",
			"Meko",
			"Caijh"
		],
		description: "关注的用户列表（用英文逗号分隔，忽略所有空格）",
		filledValueProcessFunction: (s => s.toString()),
		returnedValueProcessFunction: (s => s.value.toString().replaceAll(' ', '').split(/[,;]/)),
		style: "width: 500px",
	},
	{
		name: "whetherChangeContestPageButtonIcon",
		type: "bool",
		defaultValue: true,
		description: "给比赛界面的部分按钮添加图标",
	},

	{
		textBefore: "其他设置",
		name: "whetherAddGoToProblemAndGoToUserProfileInputLabels",
		type: "bool",
		defaultValue: true,
		description: "在导航栏添加跳转到题目和跳转到用户主页的输入框",
	},
	{
		name: "whetherChangeIcon",
		type: "bool",
		defaultValue: true,
		description: "更改网页图标（修复了 download.php 没有图标的特性）",
	},

	{
		name: "whetherFakeZAC2010ColorAndProfile",
		type: "bool",
		defaultValue: false,
		description: "更改 <span class='uoj-username' style='color: red;'>zac2010<sup>ℵℵℵ</sup></span> 的用户名颜色和主页",
	},

	{
		textBefore: "样式设置",
		name: "whetherChangeWebsiteCSS",
		type: "bool",
		defaultValue: true,
		description: "美化样式（需要预先安装一些字体，否则效果不佳）",
	},
	{
		name: "whetherAnimationTransitionEnabled",
		type: "bool",
		defaultValue: true,
		description: "添加动画渐变效果",
	},
	{
		name: "whetherUnderlineAHoverEnabled",
		type: "bool",
		defaultValue: true,
		description: "在鼠标悬浮在链接上时给链接添加下划线（如关闭则会添加淡蓝色背景）",
	},
];

let changeLog =
`upd 0.1.0(2024.7.21):
	Description: 初始脚本。
	Added Features:
		- 代码框全选功能
		- 修改 zac2010 的名字颜色、用户主页的功能
		- 更改 LaTex 公式放大倍数的功能
		- 放大 LaTex 公式的功能（不太稳定）
		- 添加“我的提交”“所有提交”按钮的功能
		- 将比赛排行榜界面自己的那一行高亮的功能

upd 0.2.0(2024.7.22):
	Description: 小更新，主要是将代码框全选功能更新为代码框复制功能，并更改默认字体为 Latin Modern Roman 10（对于英文） 和 宋体-简（对于中文）。
	Added Features:
		- 代码框复制功能
		- 更改默认字体为 Latin Modern Roman 10（对于英文） 和 宋体-简（对于中文）
		- 现在可以通过在脚本中开头处设置布尔变量的值自行开启或关闭功能
		- 优化了部分代码架构
	Removed Feature:
		- 代码框全选功能（更新为了代码框复制功能）

upd 0.3.0(2024.7.24):
	Description: 样式美化更新，对界面进行了较多的美化。
	Added Features:
		- 更改按钮等的字体为 Latin Modern Sans 10（对于英文）和 阿里巴巴普惠体 2.0（对于中文），鼠标悬浮时会加粗
		- 更改 ZROJ Faker 中用户主页的比赛信息表的字体为 Latin Modern Roman 10 和 宋体-简
		- 给滚动条添加圆角
		- 美化复制按钮的样式
		- 更改代码框的字体为 Fira Code，略加粗
		- 更改选中区域的背景颜色为浅蓝色
		- 将鼠标悬浮时的链接颜色变得更蓝一点
		- 略放大题目界面显示时间限制等题目基本信息的条，并将其字体改为 Latin Modern Sans 10（对于英文）和 阿里巴巴普惠体 2.0（对于中文）
		- 更改用户名的字体 Latin Modern Sans 10（对于英文）和 阿里巴巴普惠体 2.0（对于中文）
		- 更改题解按钮为弹出新页面而不是用新页面替换当前页面
		- 优化了部分代码架构

upd 0.4.0(2024.8.5):
	Description: 小更新，添加了 pdf 题面的“在新标签页中打开”按钮，添加了“跳转到题目”和“跳转到用户主页”输入框，添加了渐变效果
	Added Features:
		- 添加了 pdf 题面的“在新标签页中打开”按钮
		- 添加了“跳转到题目”和“跳转到用户主页”输入框
		- 添加了渐变效果
		- 更改了链接的样式
		- 修复了 download.php 没有图标的特性
		- 给比赛界面和题目界面的部分按钮添加或修改了图标

upd 0.5.0(2024.8.7):
	Description: 设置界面更新，添加了 GUI 的设置界面，添加了在比赛排行榜只查看关注的人的功能
	Added Features:
		- 添加了 GUI 的设置界面，可以通过右上角用户名左边的按钮进入
		- 添加了在比赛排行榜只查看关注的人的功能（关注的人的列表可以在设置界面设置）
		- 将比赛排行榜的搜索框更改为只要按下字符就会重新渲染排行榜（原先为要点击“搜索”按钮才会重新渲染排行榜）
		- 添加了部分样式的设置
	Fixed bugs:
		- 修复了在 download.php 里后续脚本仍会运行的 bug

upd 0.5.1(2024.8.8):
	Description: 对设置部分的代码架构进行了重写和优化，优化了设置的 GUI 界面
	Added Features:
		- 对设置部分的代码架构进行了重写和优化
		- 优化了设置的 GUI 界面
		- 将“跳转到题目”“跳转到用户主页”设置为靠右
	Removed Features:
		- Tampermonkey 菜单栏中关于 LaTex 公式的设置项（移动到了 GUI 的设置界面）
	`;



// 将 GM 的所有变量重设为初始值
function clearGMVariable() {
	for (let x of GMVariableList) {
		GM_setValue(x.name, x.defaultValue);
	}
}
// clearGMVariable();

(function() {
	'use strict';

	// 获取 GM 变量的实际值
	for (let x of GMVariableList) {
		x.actualValue = GM_getValue(x.name, x.defaultValue);
		// console.log(x.name, x.actualValue);
	}

	function injectCSS(css) {
		let styleTag = document.createElement('style');
		styleTag.type = 'text/css';
		styleTag.innerHTML = css;
		document.head.appendChild(styleTag);
	}
	function injectScript(script) {
		let scriptTag = document.createElement('script');
		scriptTag.innerHTML = script;
		document.body.appendChild(scriptTag);
	}
	function getQueryParam(param) {
		let urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(param);
	}
	function getUpdatedQueryParamString(list) {
		let urlObject = new URL(window.location.href);
		let urlParams = new URLSearchParams(window.location.search);
		for(let [key, value] of list) {
			urlParams.set(key, value);
		}
		urlObject.search = urlParams.toString();
		return urlObject.toString();
		// var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		// var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		// if (uri.match(re)) {
		// 	return uri.replace(re, '$1' + key + "=" + value + '$2');
		// }
		// else {
		// 	return uri + separator + key + "=" + value;
		// }
	}
	function updateQueryParamAndRefresh(list) {
		window.location.href = getUpdatedQueryParamString(list);
	}
	function updateQueryParamWithoutRefresh(list) {
		let urlParams = new URLSearchParams(window.location.search);
		for(let [key, value] of list) {
			urlParams.set(key, value);
		}
		window.history.pushState({ search: urlParams.search }, '', urlParams.href);
	}
	injectScript(`
	function injectCSS(css) {
		let styleTag = document.createElement('style');
		styleTag.type = 'text/css';
		styleTag.innerHTML = css;
		document.head.appendChild(styleTag);
	}
	function injectScript(script) {
		let scriptTag = document.createElement('script');
		scriptTag.innerHTML = script;
		document.body.appendChild(scriptTag);
	}
	function getQueryParam(param) {
		let urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(param);
	}
	function getUpdatedQueryParamString(list) {
		let urlObject = new URL(window.location.href);
		let urlParams = new URLSearchParams(window.location.search);
		for(let [key, value] of list) {
			urlParams.set(key, value);
		}
		urlObject.search = urlParams.toString();
		return urlObject.toString();
		// var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		// var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		// if (uri.match(re)) {
		// 	return uri.replace(re, '$1' + key + "=" + value + '$2');
		// }
		// else {
		// 	return uri + separator + key + "=" + value;
		// }
	}
	function updateQueryParamAndRefresh(list) {
		window.location.href = getUpdatedQueryParamString(list);
	}
	function updateQueryParamWithoutRefresh(list) {
		let urlParams = new URLSearchParams(window.location.search);
		for(let [key, value] of list) {
			urlParams.set(key, value);
		}
		window.history.pushState({ search: urlParams.search }, '', getUpdatedQueryParamString(list));
	}
	`);

	function getGMVariable(variableName) {
		for (let x of GMVariableList) {
			if (x.name == variableName) {
				return x;
			}
		}
		console.log("getGMVariable(): cannot get GM variable! variableName: ", variableName);
		return undefined;
	}

	injectCSS(`
	:root {
		--main-font-serif: "Latin Modern Roman 10", "宋体-简", "Times New Roman", "宋体";
		--main-font-sans: "阿里巴巴普惠体 2.0", "Fira Code", "Consolas", "微软雅黑";
		--main-font-monospace: "Fira Code", "Consolas", monospace;
	}
	`);

	// 将 GM 系列函数封装到 window 里面
	unsafeWindow.GM_setValue = GM_setValue;
	unsafeWindow.GM_getValue = GM_getValue;

	// unsafeWindow.whetherMagnifyLaTexDefaultValue = whetherMagnifyLaTexDefaultValue;

	// 更改网页图标的功能（修复了 download.php 没有图标的特性）
	(function changeIconFeature(){
		if (!getGMVariable("whetherChangeIcon").actualValue) {
			return;
		}
		let setIconLink = document.createElement('link');
		setIconLink.setAttribute('rel', "icon");
		setIconLink.setAttribute('href', "http://zhengruioi.com/pictures/UOJ.ico");
		setIconLink.setAttribute('type', "image/x-icon");
		document.head.appendChild(setIconLink);
	}());

	if (location.pathname === '/download.php') {
		return;
	}

	(function addGUIFeature() {
		injectCSS(`
		#openPluginSettingsButton{
			display: block;
			padding: 10px 15px;
		}

		#pluginSettingsGUIDiv-modal{
 			background-color: rgba(75, 75, 75, 0.5);
		}
		#pluginSettingsGUIDiv-modal-content{
			background-color: #f0f4f9;
		}

		.settingsGUIDiv{
			display: flex;
			align-items: center;
			min-height: 50px;
			background-color: #ffffff;
			border-color: black;
			border-radius: 10px;
			margin: 10px;
			padding: 1em 1em;
			font-family: var(--main-font-sans);
		}

		.settingsGUIH3{
			margin-left: 10px;
		}
		.settingsGUIp{
		    white-space: pre-wrap;
		}

		/* 创建自定义样式的label */
		.settingsGUILabel {
			display: inline-flex;
			position: relative;
			right: 0px;
			height: 20px;
			width: 100%;
			align-items: center;
			justify-content: stretch;

			cursor: pointer;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			margin-right: 0;
			margin-bottom: 2px;

			font-weight: normal;
			pointer-events: none;
		}
		.settingsGUILabelText {
			margin-right: auto;
			pointer-events: none;
		}

		/* 隐藏原生的checkbox */
		.settingsGUILabel input[type="checkbox"] {
			display: none;
		}
		/* 创建自定义的checkbox样式 */
		.settingsGUILabel .settingsGUICheckboxSpan {
			margin-left: auto;
			width: 85px;
			height: 31px;
			border-radius: 5px;
			pointer-events: auto;
		}

		/* 当checkbox未被选中时改变样式 */
		.settingsGUILabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan {
			background-image: -webkit-linear-gradient(top, #d9534f 0, #c12e2a 100%);
			background-image: -o-linear-gradient(top, #d9534f 0, #c12e2a 100%);
			background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #d9534f), to(#c12e2a));
			background-image: linear-gradient(to bottom, #d9534f 0, #c12e2a 100%);
			filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffd9534f', endColorstr='#ffc12e2a', GradientType=0);
			filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
			background-repeat: repeat-x;
			border-color: #b92c28;
		}
		.settingsGUILabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan:hover, .settingsGUILabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan:focus {
			background-color: #c12e2a;
			background-position: 0 -15px;
		}
		.settingsGUILabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan:active {
			background-color: #c12e2a;
			border-color: #b92c28;
		}
		.settingsGUILabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan::after {
			content: "Disabled";
			position: relative;
			left: 9px;
			top: 4px;
			color: white;
		}

		/* 当checkbox被选中时改变样式 */
		.settingsGUILabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan {
			background-image: -webkit-linear-gradient(top, #5cb85c 0, #419641 100%);
			background-image: -o-linear-gradient(top, #5cb85c 0, #419641 100%);
			background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #5cb85c), to(#419641));
			background-image: linear-gradient(to bottom, #5cb85c 0, #419641 100%);
			filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff5cb85c', endColorstr='#ff419641', GradientType=0);
			filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
			background-repeat: repeat-x;
			border-color: #3e8f3e;
		}
		.settingsGUILabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan:hover, .settingsGUILabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan:focus {
			background-color: #419641;
			background-position: 0 -15px;
		}
		.settingsGUILabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan:active{
			background-color: #419641;
			border-color: #3e8f3e;
		}
		/* 创建选中后的对勾 */
		.settingsGUILabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan::after{
			content: "Enabled";
			position: relative;
			left: 12px;
			top: 4px;
			color: white;
		}

		.settingsGUILabel input[type="text"] {
			margin-left: auto;
			pointer-events: auto;
		}
		`);

		// 添加 GUI 界面
		let GUIDiv = document.createElement('div');
		let GUIDivInnerHTMLString = `
		<div class="modal fade in" id="pluginSettingsGUIDiv-modal" tabindex="-1" aria-labelledby="pluginSettingsGUISwitchModalLabel" aria-hidden="true" style="display: none;">
			<div class="modal-dialog" style="width: 1000px; max-width: 80%;">
				<div class="modal-content" id="pluginSettingsGUIDiv-modal-content">
					<div class="modal-header" style="height: 51px;">
						<h4 class="modal-title" id="pluginSettingsGUISwitchModalLabel" style='float:left; font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman"'><span class="glyphicon glyphicon-cog"></span> ZROJ Better! 设置</h4>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close" style="float:right" id="closePluginSettingsGUIDivButtonUpperRight">
						<span aria-hidden="true">×</span>
						</button>
					</div>
					<form name="pluginSettingsGUIDivForm" id="pluginSettingsGUIDivForm" class="embedded-scrollbar" style="position:relative; margin:10px; height: 500px; overflow-y: auto;">
		`;
		for (let x of GMVariableList) {
			if ('textBefore' in x) {
				GUIDivInnerHTMLString += `
						<h3 class="settingsGUIH3">` + x.textBefore + `</h3>`;
			}
			GUIDivInnerHTMLString += `
						<div class="settingsGUIDiv">
							<label class="settingsGUILabel form-check-label">
								` +
								(
								x.type == "bool" ?
								`<input type="checkbox" class="form-check-input" name="` + x.name + `InPluginSettingsGUI" id="` + x.name + `InPluginSettingsGUI" ` + ('style' in x ? `style="` + x.style + `" ` : "")
								+ ('filledValueProcessFunction' in x ? x.filledValueProcessFunction(x.actualValue) : (x.actualValue ? "checked" : "")) + `>
								<span class="settingsGUILabelText">` + x.description + `</span>
								<span class="settingsGUICheckboxSpan"></span>` :
								x.description + `<input type="text" class="form-control" name="` + x.name + `InPluginSettingsGUI" id="` + x.name + `InPluginSettingsGUI" ` + ('style' in x ? `style="` + x.style + `" ` : "") + `value=`
								+ ('filledValueProcessFunction' in x ? x.filledValueProcessFunction(x.actualValue) : x.actualValue) + `>`
								) + `
							</label>
						</div>`;
		}
		GUIDivInnerHTMLString += `
						<h3 class="settingsGUIH3">关于</h3>

						<div class="settingsGUIDiv">
<p class="settingsGUIp">ZROJ Better! 是由菜鸡 panhongxuan 制作的插件。
感谢 PPPxvchongyv 提供的帮助！
插件目前仍为测试版，如发现 bug 请联系 panhongxuan，谢谢！
版本号：0.5.0
发布时间：2024.8.7</p>
						</div>

						<h3 class="settingsGUIH3">更新日志</h3>

						<div class="settingsGUIDiv">
<p class="settingsGUIp">` + changeLog + `</p>
						</div>

					</form>
					<div class="modal-footer">
						<button type="button" class="btn btn-warning" data-dismiss="modal" id="closePluginSettingsGUIDivButtonBottom">放弃更改</button>
						<button type="submit" class="btn btn-primary" id="submitPluginSettingsGUIDivButton">保存</button>
					</div>
				</div>
			</div>
		</div>`;
		GUIDiv.innerHTML = GUIDivInnerHTMLString;
		document.body.appendChild(GUIDiv);

		// 添加设置按钮
		let div = document.querySelector('.nav.nav-pills.pull-right');
		let showGUIDivButtonLi = document.createElement('li');
		showGUIDivButtonLi.innerHTML = `
		<button class="btn btn-info btn-block btn-always-bold" id="openPluginSettingsButton">
			<span class="glyphicon glyphicon-cog"></span> ZROJ Better! 设置
		</button>
		`;
		div?.insertBefore(showGUIDivButtonLi, div.firstChild);

		// 添加处理保存设置的函数
		let submitPluginSettingsGUIDivFunctionString = `
		function submitPluginSettingsGUIDiv() {`;
		for (let x of GMVariableList) {
			submitPluginSettingsGUIDivFunctionString += `
			GM_setValue('` + x.name + `', ` + ('returnedValueProcessFunction' in x ? `(` + x.returnedValueProcessFunction.toString() + `)(document.querySelector('#` + x.name + `InPluginSettingsGUI'))` : (x.type == "bool" ? `document.querySelector('#` + x.name + `InPluginSettingsGUI').checked` : `document.querySelector('#` + x.name + `InPluginSettingsGUI').value`)) + `);`;
		}
		submitPluginSettingsGUIDivFunctionString += `
			window.location.reload();
		};`;
		injectScript(submitPluginSettingsGUIDivFunctionString);

		injectScript(`
		function openPluginSettingsGUIDiv() {
			document.querySelector('#pluginSettingsGUIDiv-modal').style = "display: block;";
			document.body.style.overflow = "hidden";
		}
		function closePluginSettingsGUIDiv() {
			// document.querySelector('#pluginSettingsGUIDiv-modal').style = "display: none;";
			// document.body.style.overflow = "auto";
			window.location.reload();
		}
		document.querySelector('#pluginSettingsGUIDivForm').addEventListener('submit', function(event) {
			event.preventDefault();
		});
		document.querySelector('#openPluginSettingsButton').addEventListener('click', openPluginSettingsGUIDiv);
		document.querySelector('#closePluginSettingsGUIDivButtonUpperRight').addEventListener('click', closePluginSettingsGUIDiv);
		document.querySelector('#closePluginSettingsGUIDivButtonBottom').addEventListener('click', closePluginSettingsGUIDiv);
		document.querySelector('#submitPluginSettingsGUIDivButton').addEventListener('click', submitPluginSettingsGUIDiv);
		`);
	})();

	let selfUserName = document.querySelector("a[data-toggle='dropdown']")?.querySelector("span")?.innerText;
	function isContestPage() {
		return /^\/contest\/\d/.test(location.pathname);
	}

	// 设置 LaTex 公式是否放大的菜单栏
// 	function enableLaTexMagnify() {
// 		GM_setValue('whetherMagnifyLaTex', true);
// 		window.location.reload();
// 	}

// 	function disableLaTexMagnify() {
// 		GM_setValue('whetherMagnifyLaTex', false);
// 		window.location.reload();
// 	}

	// if (getGMVariable("whetherMagnifyLaTex").actualValue) {
	// 	GM_registerMenuCommand("关闭 LaTex 公式放大功能", disableLaTexMagnify);
	// }
	// else {
	// 	GM_registerMenuCommand("开启 LaTex 公式放大功能", enableLaTexMagnify);
	// }

	// 比赛排行榜界面自己的那一行高亮
	(function highlightStandingsPageSelfLineFeature() {
		if (!getGMVariable("whetherHighlightStandingsPageSelfLine").actualValue) {
			return;
		}
		function isContestStandingsPage() {
			return /^\/contest\/\d+\/standings$/.test(location.pathname);
		}

		if (isContestStandingsPage()) {
			// if (document.querySelectorAll('table').length <= 1) {
			//	 return;
			// }
			if (typeof(standings) == 'undefined') {
				return;
			}

			// 只显示关注的人，去除掉排行榜中未关注的人
			function showStarredUserNameInStandings(starredUserNameListShowedInStandings) {
				[...document.querySelector('#standings')?.querySelector('tbody')?.querySelectorAll('tr')].map(e => {
					let userNameString = e.querySelector('.uoj-username')?.innerHTML;
					if (userNameString != undefined) {
						if (userNameString.indexOf("<sup>") != -1) {
							userNameString = userNameString.slice(0, userNameString.indexOf("<sup>"));
						}
						if (!starredUserNameListShowedInStandings.includes(userNameString)) {
							e.remove();
						}
					}
				});
			}

			let showStarredUserNameForm = document.createElement('form');
			showStarredUserNameForm.id = "showStarredUserNameForm";
			showStarredUserNameForm.innerHTML = `
			<label class="form-check-label" style="margin-bottom: 0px;margin-top: 10px;">
				<input type="checkbox" class="form-check-input" name="showStarredUserName" id="showStarredUserName"> 只显示关注的人
			</label>
			`;
			document.querySelector('.div-search')?.appendChild(showStarredUserNameForm);

			// 包装内置的显示排行榜的函数
			function whenStandingsShowed() {
				let selfUserName_a_Arr = document.querySelector("#standings a[href='http://zhengruioi.com/user/profile/" + selfUserName + "']")?.parentNode?.parentNode;
				if(selfUserName_a_Arr) {
					selfUserName_a_Arr.style.backgroundColor = '#dcf2f9';
				}
				if (document.querySelector('#showStarredUserName')?.checked) {
					showStarredUserNameInStandings(getGMVariable("starredUserName").actualValue);
				}
			}

			let showStandingsBackup = unsafeWindow.showStandings;
			unsafeWindow.showStandings = function(...args) {
				showStandingsBackup(...args);
				whenStandingsShowed();
			}
			// unsafeWindow.showStandings();

			// 设置搜索输入框每次改变都会刷新排行榜
			document.querySelector('#input-name')?.setAttribute('oninput', "showStandings();");

			injectScript(`
			let showStarredUserNameCheckbox = document.querySelector('#showStarredUserName');
			if (getQueryParam('showFavs') == 'on') {
				showStarredUserNameCheckbox.checked = true;
			}
			else {
				showStarredUserNameCheckbox.checked = false;
			}
			showStandings();

			showStarredUserNameCheckbox.addEventListener('input', function() {
				// console.log(getUpdatedQueryParamString([['showFavs', (showStarredUserNameCheckbox.checked ? 'on' : 'off')]]));
				updateQueryParamWithoutRefresh([['showFavs', (showStarredUserNameCheckbox.checked ? 'on' : 'off')]]);
				showStandings();
			});
			`);
		}
	})();

	// 代码框复制功能
	(function copyPreCodeFeature() {
		if (!getGMVariable("whetherCopyPreCode").actualValue) {
			return;
		}

		injectCSS(`
		/* 复制按钮的样式 */
		.btn.myCopyButton{
			font-size: 1em;
			position: absolute;
			user-select: none;
		}
		.btn.myCopyButton::after{
			content: ' Copy';
		}
		.btn.myCopyButton:hover{
			font-weight: normal;
		}
		.btn.myCopyButtonLeft{
			top: 0;
			left: -5.5em;
		}
		.btn.myCopyButtonRight{
			top: 0.25em;
			right: 0.25em;
		}
		.btn.myCopyButton:active{
			color: #11cd11;
		}
		`);

		let importClipboardJSScript = document.createElement('script');
		importClipboardJSScript.src = "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js";
		document.head.appendChild(importClipboardJSScript);
		importClipboardJSScript.addEventListener('load', function(event) {
			new unsafeWindow.ClipboardJS('.btn.myCopyButton[data-clipboard-target]');
		});

		let preIdCount = 0;

		[...document.querySelectorAll('pre')].map(e => {
		//  e.innerHTML = e.innerHTML.trimEnd();

			e.style.position = 'relative';

			++preIdCount;
			let btnRandomIdString = "PreCodeRandomIdString" + Math.floor(Math.random() * 4294967296).toString(16) + "Number" + preIdCount.toString();
			e.id = btnRandomIdString;

			{
				let btn = document.createElement('a');
				btn.role = 'button';
				btn.setAttribute('class', 'myCopyButton myCopyButtonLeft btn btn-default btn-sm');
				btn.innerHTML = "<span class='glyphicon glyphicon-copy'></span>";
				btn.setAttribute('data-clipboard-target', '#' + btnRandomIdString);
				e.append(btn);
			}

			{
				let btn = document.createElement('a');
				btn.role = 'button';
				btn.setAttribute('class', 'myCopyButton myCopyButtonRight btn btn-default btn-sm');
				btn.innerHTML = "<span class='glyphicon glyphicon-copy'></span>";
				btn.setAttribute('data-clipboard-target', '#' + btnRandomIdString);
				e.append(btn);
			}

			// let btn = $('<button type="button" style="position: absolute; top: .25em; right: .25em; user-select: none;">Select All</button>');
			// // if(e.classList.length === 0)
			// //	 e.style.userSelect = 'all', btn.text('Original');
			// btn.bind('click', function () {
			//	 if(e.style.userSelect === 'all')
			//		 e.style.userSelect = 'initial', btn.text('Select All');
			//	 else
			//		 e.style.userSelect = 'all', btn.text('Original');
			// });
			// document.body.appendChild(btn);
			// $(e).append(btn);
		});
	})();

	// 更改 LaTex 公式放大倍数
	// (function changeLaTexMagnificationFeature() {
	// 	if (!getGMVariable("whetherMagnifyLaTex").actualValue) {
	// 		return;
	// 	}
	// 	function queryLaTexMagnification(){
	// 		alert("当前 LaTex 公式放大倍数为 " + GM_getValue("LaTexMagnification", 1.25) + "。");
	// 	}
	// 	function changeLaTexMagnificationTo_1(){
	// 		GM_setValue("LaTexMagnification", 1);
	// 		window.location.reload();
	// 	}
	// 	function changeLaTexMagnificationTo_1_25(){
	// 		GM_setValue("LaTexMagnification", 1.25);
	// 		window.location.reload();
	// 	}
	// 	function changeLaTexMagnificationTo_1_5(){
	// 		GM_setValue("LaTexMagnification", 1.5);
	// 		window.location.reload();
	// 	}
	// 	function changeLaTexMagnificationTo_1_75(){
	// 		GM_setValue("LaTexMagnification", 1.75);
	// 		window.location.reload();
	// 	}
	// 	function changeLaTexMagnificationTo_2(){
	// 		GM_setValue("LaTexMagnification", 2);
	// 		window.location.reload();
	// 	}
	// 	function addLaTeXScaleBy_0_25(){
	// 		GM_setValue("LaTexMagnification", +GM_getValue("LaTexMagnification", 1.25) + 0.25);
	// 		window.location.reload();
	// 	}
	// 	function subLaTeXScaleBy_0_25(){
	// 		GM_setValue("LaTexMagnification", +GM_getValue("LaTexMagnification", 1.25) - 0.25);
	// 		window.location.reload();
	// 	}
	// 	GM_registerMenuCommand("当前 LaTex 公式缩放倍数为 " + GM_getValue("LaTexMagnification", 1.25) + "。", queryLaTexMagnification);
	// 	GM_registerMenuCommand("减少 LaTex 公式缩放倍数 0.25", subLaTeXScaleBy_0_25);
	// 	GM_registerMenuCommand("增加 LaTex 公式缩放倍数 0.25", addLaTeXScaleBy_0_25);
	// 	GM_registerMenuCommand("将 LaTex 公式缩放倍数设置为 1", changeLaTexMagnificationTo_1);
	// })();

	// 放大 LaTex 公式并添加“我的提交”“所有提交”按钮
	(function magnifyLaTexFormulaFeature() {
		if (!getGMVariable("whetherMagnifyLaTex").actualValue) {
			return;
		}
		let div2 = document.querySelector('body');

		// let div1 = document.createElement('style');
		// div1.innerHTML = `.MathJax { font-size: ${GM_getValue("LaTexScale", 1.25)}em; }`;

		let div1 = document.createElement('script');
		div1.innerHTML = "window.MathJax = { tex: { inlineMath: [['\$', '\$']/*, ['\\(', '\\)']*/], }, chtml: { scale: " + GM_getValue("LaTexMagnification", 1.25) + " }};";
		let div3 = document.createElement('script');
		div3.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js';
		div2.appendChild(div1);
		div2.appendChild(div3);
	})();

	// 在题目界面添加“我的提交”“所有提交”按钮，并给“返回比赛”按钮添加图标
	(function addMySubmissionsAndAllSubmissionsButtonsFeature() {
		if (!getGMVariable("whetherAddMySubmissionsAndAllSubmissionsButtons").actualValue) {
			return;
		}
		let hrefString = window.location.href;
		let hrefString_Problem_Index = hrefString.indexOf("problem/");
		if (hrefString_Problem_Index != -1) {
			let problemId = hrefString.substring(hrefString_Problem_Index + 8, hrefString.length);

			let navTabs = document.querySelector('.nav.nav-tabs');
			if (navTabs != undefined) {
				[...navTabs.querySelectorAll('li')].map(e => {
					if (e?.innerHTML?.indexOf('返回比赛') != -1) {
						e.querySelector('a').innerHTML = `
						<span class="glyphicon glyphicon-home"></span> 返回比赛
						`;
					}
				});
			}

			let satisticsButton = document.querySelector('.btn.btn-info.pull-right');
			if (satisticsButton != undefined) {
				// 更改题解按钮为弹出新页面而不是用新页面替换当前页面
				let buttonList = document.querySelectorAll('.btn.btn-info.pull-right');
				if (buttonList.length >= 2) {
					let tutorialButton = buttonList[1];
					if (tutorialButton != undefined) {
						tutorialButton.target = "_blank";
					}
				}
				// 更改状态按钮为弹出新页面而不是替换当前页面
				satisticsButton.target = "_blank";
				// 更改状态按钮的样式
				satisticsButton.style = 'filter: hue-rotate(0.5turn);';

				// 添加“我的提交”按钮
				let mySubmissionsButton = '<a role="button" class="btn btn-info pull-right" href = "http://zhengruioi.com/submissions?problem_id=' + problemId + '&submitter=' + selfUserName + '" style="margin-left: 0.2em; margin-right: 0.3em; filter: hue-rotate(0.8turn);" target="_blank"><span class="glyphicon glyphicon-list-alt"></span> <span>我的提交</span> </a>';
				satisticsButton.insertAdjacentHTML("afterend", mySubmissionsButton);
				// 添加“所有提交”按钮
				let AllSubmissionsButton = '<a role="button" class="btn btn-info pull-right" href = "http://zhengruioi.com/submissions?problem_id=' + problemId + '" style="margin-left: 0.2em; margin-right: 0.5em; filter: hue-rotate(0.15turn);" target="_blank"><span class="glyphicon glyphicon-time"></span> <span>所有提交</span> </a>';
				satisticsButton.insertAdjacentHTML("afterend", AllSubmissionsButton);
			}
		}
	})();

	// 更改 zac2010 的用户名颜色和用户主页
	(function fakeZAC2010ColorAndProfileFeature() {
		if (!getGMVariable("whetherFakeZAC2010ColorAndProfile").actualValue) {
			return;
		}
		setInterval(function() {
			$('.uoj-username').filter(function() { return this.innerText === 'zac2010'; }).css('color', 'red').html(`zac2010<sup>ℵℵℵ</sup>`);
		}, 100);
		let div = document.querySelector('.uoj-honor');
		if (div != null) {
			console.log(div);
			if (div.innerText == 'zac2010') {
				console.log(div);
				div.style = 'color:rgb(255,0,0)'
				div.innerHTML = `\$\\text{zac2010}\$<sup>${''.padEnd(3, 'ℵ')}</sup>`
				let arr1 = document.querySelectorAll('.list-group-item-text');
				for (let elem of arr1) {
					if (elem.innerHTML.substring(0, 26) == '<strong style="color:red">') {
						elem.innerHTML = '<strong style="color:red">\$3000\$</strong>';
					}
				}
				let arr2 = document.querySelectorAll('.list-group-item-heading');
				for (let elem of arr2) {
					console.log(elem.outerHTML);
					if (elem.outerHTML.substring(0, 46) == '<h4 class="list-group-item-heading">AC 过的题目：共 ') {
						elem.outerHTML = '<h4 class="list-group-item-heading">AC 过的题目：共 \$10000\$ 道题 </h4>';
					}
				}
				/*			 rating_data[0].unshift([
					new Date('2023/5/15').valueOf(),
					1500,
					1296,
					"IOI 模拟赛",
					1,
					1500
				]);
				rating_data[0].forEach(e => e[1] += 300); */
			}
		}
	})();

	// 增加“跳转到题目”和“跳转到用户主页”输入框
	(function addGoToUserProfileFormFeature(){
		if (!getGMVariable("whetherAddGoToProblemAndGoToUserProfileInputLabels").actualValue) {
			return;
		}

		injectCSS(`
		#goToProblemFormProblemIdInputLabel::placeholder, #goToUserProfileFormUserNameInputLabel::placeholder{
			font-weight: 300;
			color: silver;
		}
		`);

		// 跳转到题目
		let goToProblemForm = document.createElement('li');
		goToProblemForm.style = 'position: relative; float: right; margin-left: 10px;';
		goToProblemForm.innerHTML = `
		<form class="input-group form-group" id="goToProblemFormProblemIdForm" style="position:relative; top:8px; width:140px;">
			<input class="form-control" type="text" id="goToProblemFormProblemIdInputLabel" placeholder="跳转到题目"
			onkeydown="if (event.key === 'Enter') goToProblem();">
			<span class="input-group-btn">
				<button class="btn btn-search btn-primary" onclick="goToProblem();">
					<span class='glyphicon glyphicon-new-window'></span>
				</button>
			</span>
		</form>
		`;

		// 跳转到用户主页
		let goToUserProfileForm = document.createElement('li');
		goToUserProfileForm.style = 'position: relative; float: right; margin-left: 10px;';
		goToUserProfileForm.innerHTML = `
		<form class="input-group form-group" id="goToUserProfileFormUserNameForm" style="position:relative; top: 8px; width: 200px;">
			<input class="form-control" type="text" id="goToUserProfileFormUserNameInputLabel" placeholder="跳转到用户主页"
			onkeydown="if (event.key === 'Enter') goToUserProfile();">
			<span class="input-group-btn">
				<button class="btn btn-search btn-primary" onclick="goToUserProfile()">
					<span class='glyphicon glyphicon-new-window'></span>
				</button>
			</span>
		</form>
		`;

		document.querySelector('.navbar-header').parentNode.style.position = 'relative';
		document.querySelector('.navbar-header').parentNode.style.justifyContent = 'stretch';
		document.querySelector('.navbar-header').parentNode.style.display = 'flex';

		document.querySelector('.navbar-header').style.position = 'relative';

		document.querySelector('.navbar-collapse').style.position = 'relative';
		document.querySelector('.navbar-collapse').style.flexGrow = '1';
		document.querySelector('.navbar-collapse').style.paddingLeft = '0';
		document.querySelector('.navbar-collapse').style.display = 'flex';
		// let bar = document.querySelector('.navbar-collapse');
		// bar.innerHTML = bar.innerHTML.replaceAll(/<(\/?)ul>/g, '<$1div>').replaceAll(/<(\/?)li>/g, '<$1div>');
		// document.querySelector('.navbar-collapse').querySelector('ul').style.display = 'flex';
		// document.querySelector('.navbar-collapse').querySelector('ul').style.flexWrap = 'wrap';
		document.querySelector('.navbar-collapse').querySelector('ul').style.width = '100%';

		document.querySelector('.navbar-collapse')?.querySelector('ul')?.appendChild(goToUserProfileForm);
		document.querySelector('.navbar-collapse')?.querySelector('ul')?.appendChild(goToProblemForm);

		injectScript(`
		function goToProblem() {
			if (document.querySelector('#goToProblemFormProblemIdInputLabel').value == "") {
				return;
			}
			window.location.href = "http://zhengruioi.com/problem/" + document.querySelector('#goToProblemFormProblemIdInputLabel').value;
		}
		document.querySelector('#goToProblemFormProblemIdForm').addEventListener('submit', function(event) {
			event.preventDefault();
		});

		function goToUserProfile() {
			if (document.querySelector('#goToUserProfileFormUserNameInputLabel').value == "") {
				return;
			}
			window.location.href = "http://zhengruioi.com/user/profile/" + document.querySelector('#goToUserProfileFormUserNameInputLabel').value;
		}
		document.querySelector('#goToUserProfileFormUserNameForm').addEventListener('submit', function(event) {
			event.preventDefault();
		});
		`);
	})();

	// 给比赛界面的部分按钮添加图标
	(function changeContestPageButtonIconFeature() {
		if (!getGMVariable("whetherChangeContestPageButtonIcon").actualValue) {
			return;
		}
		let hrefString = window.location.href;
		let hrefString_Problem_Index = hrefString.indexOf("contest/");
		if (hrefString_Problem_Index != -1) {
			let navTabs = document.querySelector('.nav.nav-tabs');
			if (navTabs != undefined) {
				[...navTabs.querySelectorAll('li')].map(e => {
					if (e?.innerHTML?.indexOf('比赛主页') != -1) {
						e.querySelector('a').innerHTML = `
						<span class="glyphicon glyphicon-tasks"></span> 比赛主页
						`;
					}
					if (e?.innerHTML?.indexOf('提交记录') != -1) {
						e.querySelector('a').innerHTML = `
						<span class="glyphicon glyphicon-list"></span> 提交记录
						`;
					}
					if (e?.innerHTML?.indexOf('排行榜') != -1) {
						e.querySelector('a').innerHTML = `
						<span class="glyphicon glyphicon-stats"></span> 排行榜
						`;
					}
				});
			}
		}
	}());

	// 添加在新标签页中打开 pdf 题面的按钮
	(function addOpenIframeInNewTabButtonFeature() {
		if (!getGMVariable("whetherAddOpenIframeInNewTabButton").actualValue) {
			return;
		}
		injectCSS(`
		/* 复制按钮的样式 */
		.btn.openIframeInNewTabButton{
			font-size: 1em;
			position: absolute;
			user-select: none;
			top: 0;
			left: -11em;
		}
		.btn.openIframeInNewTabButton::after{
			content: ' 在新标签页中打开';
		}
		`);
		[...document.querySelectorAll('iframe')].map(e => {
			let div = document.createElement('div');
			div.style.position = 'relative';
			e.parentNode.appendChild(div);
			div.appendChild(e);

			console.log(e);
			e.style.position = 'relative';

			let btn = document.createElement('a');
			btn.role = 'button';
			btn.setAttribute('class', 'openIframeInNewTabButton btn btn-primary btn-sm');
			btn.innerHTML = "<span class='glyphicon glyphicon-resize-full'></span>";
			btn.setAttribute('href', e.getAttribute('src'));
			btn.target = "_blank";
			div.append(btn);
			console.log(btn);
		});
	})();

	// 更改网页 CSS 样式
	(function changeWebsiteCSSFeature() {
		if (!getGMVariable("whetherChangeWebsiteCSS").actualValue) {
			return;
		}

		let userProfileLegendLabel = document.querySelector('.legendLabel');
		if (userProfileLegendLabel != undefined) {
			let userProfileLegendLabelNameText = userProfileLegendLabel.querySelector('a');
			userProfileLegendLabelNameText.style = userProfileLegendLabelNameText.getAttribute('style') + "; font-size:94%";
		}

		injectCSS(`
		/* 更改几乎所有内容的字体为 Latin Modern Roman 10（对于英文） 和 宋体-简（对于中文），并相应地放大字号使得更为清晰 */
		body {
			font-family: var(--main-font-serif);
			// font-family: var(--main-font-sans);
			font-size: 160%;
		`
		+ (getGMVariable("whetherAnimationTransitionEnabled").actualValue ? `transition: all 0.15s;` : '') +
		`
		}

		/* 更改选中区域的背景颜色 */
		::selection {
			background: #aeeeee;
		}

		/* 自定义整个滚动条 */
		::-webkit-scrollbar {
		   width: 12px; /* 设置滚动条的宽度 */
		}
		/* 自定义滚动条轨道 */
		::-webkit-scrollbar-track {
			background: #dedede; /* 设置轨道的背景颜色 */
		}
		/* 自定义滚动条的滑块（thumb） */
		::-webkit-scrollbar-thumb {
			border-radius: 5px;
			background: #aaaaaa; /* 设置滑块的背景颜色 */
		}
		/* 当 hover 或 active 状态时，自定义滚动条滑块的颜色 */
		::-webkit-scrollbar-thumb:hover {
			background: #888888;
		}
		/* 当active状态时，自定义滚动条滑块的颜色 */
		::-webkit-scrollbar-thumb:active {
			background: #666666;
		}

		.embedded-scrollbar::-webkit-scrollbar-track{
			border-radius: 5px;
		}
		/* 略放大题目界面显示时间限制等题目基本信息的条 */
		button.uoj-tag{
			font-family: "Latin Modern Sans 10", "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman", "宋体";
			color: black;
			font-size: 110%;
		}
		/* 页面最上方导航栏字体改为阿里巴巴普惠体 2.0，鼠标悬浮时变为粗体 */
		.container-fluid a{
			font-family: var(--main-font-sans);
			font-size: 115%;
		}
		.container-fluid a:hover{
			font-weight: bold;
		}
		/* 题目界面“描述”“提交”等按钮字体改为阿里巴巴普惠体 2.0，鼠标悬浮时变为粗体 */
		.nav-tabs a{
			font-family: var(--main-font-sans);
		}
		.nav-tabs a:hover{
			font-weight: bold;
		}
		/* 按钮字体改为阿里巴巴普惠体 2.0，鼠标悬浮时变为粗体 */
		.btn{
			font-family: var(--main-font-sans);
			transition: all 0.15s;
			user-select: none;
		}
		.btn:hover{
			font-weight: bold;
		}
		.btn-never-bold{
			font-weight: normal;
		}
		.btn-never-bold:hover{
			font-weight: normal;
		}
		.btn-always-bold{
			font-weight: bold;
		}
		.btn-always-bold:hover{
			font-weight: bold;
		}
		/* 更改用户名字体 */
		.uoj-username{
			font-family: var(--main-font-sans);
		}
		.uoj-honor{
			font-family: var(--main-font-sans);
		}
		/* 更改链接颜色 */
		a{
			color: #5e72e4;
			transition: all 0.15s;
		}
		a:hover{
			color: #0056b3;
			` + (getGMVariable("whetherUnderlineAHoverEnabled").actualValue ? '' : `background-color: #e5f3f8;`) + `
			text-decoration: ` + (getGMVariable("whetherUnderlineAHoverEnabled").actualValue ? `underline` : `none`) + `
		}
		/* 更改 ZROJ Faker 中用户主页的比赛信息表的字体 */
		#rating-chart{
			font-family: var(--main-font-serif);
		}
		/* 更改代码框的字体为 Fira Code，略粗 */
		pre{
			font-family: var(--main-font-monospace);
			font-weight: 500;
			font-size: 15px;
			overflow: visible;
			// margin-left: 5.5em;
			// overflow: auto;
			white-space: pre;
		}
		pre code{
			font-family: var(--main-font-monospace);
			font-weight: 500;
			font-size: 15px;
			// overflow: auto;
			white-space: pre;
		}
		/* 更改输入框的字体为 Fira Code, 略粗*/
		input[type="text"]{
			font-family: "Fira Code", "阿里巴巴普惠体 2.0", "Consolas", "微软雅黑";
			font-weight: 500;
			transition: 0.1s ease-in-out;
		}
		`);
	})();
})();