// ==UserScript==
// @name		ZROJ Better!
// @namespace	http://tampermonkey.net/
// @version		0.5.0
// @description	++RP
// @author		PHX
// @match		http://zhengruioi.com/*
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

// 配置区，控制是否开启某些功能。具体的美化 css 可以去代码最后面自行修改，部分 css 的选项也可在此处更改。

let whetherCopyPreCodeDefaultValue = true; // 是否添加复制代码框的按钮（默认值）
let whetherHighlightStandingsPageSelfLineDefaultValue = true; // 是否将比赛排行榜界面自己的那一行高亮并添加“只显示关注的人”按钮（默认值）

let whetherMagnifyLaTexDefaultValue = true; // 是否放大 LaTex 公式（默认值），不太稳定，该功能也可以在菜单项中关闭
let LaTexMagnificationDefaultValue = 1.25; // LaTex 公式的放大倍数（默认值）

let whetherChangeContestPageButtonIconDefaultValue = true; // 是否给比赛界面的部分按钮添加图标（默认值）
let whetherAddMySubmissionsAndAllSubmissionsButtonsDefaultValue = true; // 是否在题目界面添加“我的提交”“所有提交”按钮，并给“返回比赛”按钮添加图标（默认值）
let whetherFakeZAC2010ColorAndProfileDefaultValue = false; // 是否更改 zac2010 的用户名颜色和主页（默认值）

let whetherAddGoToProblemAndGoToUserProfileInputLabelsDefaultValue = true; // 是否在导航栏添加跳转到题目和跳转到用户主页的输入框
let whetherAddOpenIframeInNewTabButtonDefaultValue = true; // 是否添加在新标签页中打开 pdf 题面的按钮
let whetherChangeIconDefaultValue = true; // 更改网页图标的功能（修复了 download.php 没有图标的特性）

let whetherChangeWebsiteCSSDefaultValue = true; // 是否美化样式
let whetherAnimationTransitionEnabledDefaultValue = true; // 是否添加动画渐变效果
let whetherUnderlineAHoverEnabledDefaultValue = true; // 是否在鼠标悬浮在链接上时给链接添加下划线（如为 false 则会添加淡蓝色背景

// 关注的用户列表（默认值）
let starredUserNameListDefault =
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
	Removed Features:
		- Tampermonkey 菜单栏中关于 LaTex 公式的设置项（移动到了 GUI 的设置界面）
	Fixed bugs:
		- 修复了在 download.php 里后续脚本仍会运行的 bug
	`;

// 将 GM 的所有变量重设为初始值
function clear_GM_Values() {
	GM_setValue('whetherCopyPreCode', whetherCopyPreCodeDefaultValue);
	GM_setValue('whetherHighlightStandingsPageSelfLine', whetherCopyPreCodeDefaultValue);

	GM_setValue('whetherMagnifyLaTex', whetherMagnifyLaTexDefaultValue);
	GM_setValue("LaTexMagnification", LaTexMagnificationDefaultValue);
	GM_setValue("starredUserNameList", starredUserNameListDefault);

	GM_setValue("whetherChangeContestPageButtonIcon", whetherChangeContestPageButtonIconDefaultValue);
	GM_setValue("whetherAddMySubmissionsAndAllSubmissionsButtons", whetherAddMySubmissionsAndAllSubmissionsButtonsDefaultValue);
	GM_setValue("whetherFakeZAC2010ColorAndProfile", whetherFakeZAC2010ColorAndProfileDefaultValue);

	GM_setValue("whetherAddGoToProblemAndGoToUserProfileInputLabels", whetherAddGoToProblemAndGoToUserProfileInputLabelsDefaultValue);
	GM_setValue("whetherAddOpenIframeInNewTabButton", whetherAddOpenIframeInNewTabButtonDefaultValue);
	GM_setValue("whetherChangeIcon", whetherChangeIconDefaultValue);

	GM_setValue("whetherChangeWebsiteCSS", whetherChangeWebsiteCSSDefaultValue);
	GM_setValue("whetherAnimationTransitionEnabled", whetherAnimationTransitionEnabledDefaultValue);
	GM_setValue("whetherUnderlineAHoverEnabled", whetherUnderlineAHoverEnabledDefaultValue);
}
// clear_GM_Values();

(function() {
	'use strict';

	let whetherCopyPreCodeActualValue = GM_getValue("whetherCopyPreCode", whetherCopyPreCodeDefaultValue);
	let whetherHighlightStandingsPageSelfLineActualValue = GM_getValue("whetherHighlightStandingsPageSelfLine", whetherHighlightStandingsPageSelfLineDefaultValue);

	let whetherMagnifyLaTexActualValue = GM_getValue("whetherMagnifyLaTex", whetherMagnifyLaTexDefaultValue);
	let LaTexMagnificationActualValue = GM_getValue("LaTexMagnification", LaTexMagnificationDefaultValue);
	let starredUserNameListActual = GM_getValue("starredUserNameList", starredUserNameListDefault);

	let whetherChangeContestPageButtonIconActualValue = GM_getValue("whetherChangeContestPageButtonIcon", whetherChangeContestPageButtonIconDefaultValue);
	let whetherAddMySubmissionsAndAllSubmissionsButtonsActualValue = GM_getValue("whetherAddMySubmissionsAndAllSubmissionsButtons", whetherAddMySubmissionsAndAllSubmissionsButtonsDefaultValue);
	let whetherFakeZAC2010ColorAndProfileActualValue = GM_getValue("whetherFakeZAC2010ColorAndProfile", whetherFakeZAC2010ColorAndProfileDefaultValue);

	let whetherAddGoToProblemAndGoToUserProfileInputLabelsActualValue = GM_getValue("whetherAddGoToProblemAndGoToUserProfileInputLabels", whetherAddGoToProblemAndGoToUserProfileInputLabelsDefaultValue);
	let whetherAddOpenIframeInNewTabButtonActualValue = GM_getValue("whetherAddOpenIframeInNewTabButton", whetherAddOpenIframeInNewTabButtonDefaultValue);
	let whetherChangeIconActualValue = GM_getValue("whetherChangeIcon", whetherChangeIconDefaultValue);

	let whetherChangeWebsiteCSSActualValue = GM_getValue("whetherChangeWebsiteCSS", whetherChangeWebsiteCSSDefaultValue); // 是否美化样式
	let whetherAnimationTransitionEnabledActualValue = GM_getValue("whetherAnimationTransitionEnabled", whetherAnimationTransitionEnabledDefaultValue); // 是否添加动画渐变效果
	let whetherUnderlineAHoverEnabledActualValue = GM_getValue("whetherUnderlineAHoverEnabled", whetherUnderlineAHoverEnabledDefaultValue); // 是否在鼠标悬浮在链接上时给链接添加下划线（如为 false 则会添加淡蓝色背景

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

	// 将 GM 系列函数封装到 window 里面
	unsafeWindow.GM_setValue = GM_setValue;
	unsafeWindow.GM_getValue = GM_getValue;

	unsafeWindow.whetherMagnifyLaTexDefaultValue = whetherMagnifyLaTexDefaultValue;

	// 更改网页图标的功能（修复了 download.php 没有图标的特性）
	(function changeIconFeature(){
		if (!whetherChangeIconActualValue) {
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
		#settings-button{
			display: block;
			padding: 10px 15px;
		}

		#pluginSettingsGUIDiv{
			background-color: grey;
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
			font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman";
		}
		.settingsGUIDiv input[type="checkbox"]{
			margin-right: 0.8em;
			position: relative;
			bottom: 0.05em;
			height: 20px;
			width: 20px;
		}
		.settingsGUIDiv label{
			font-weight: normal;
		}

		.settingsGUIH3{
			margin-left: 10px;
		}
		.settingsGUIp{
		    white-space: pre-wrap;
		}

		/* 隐藏原生的checkbox */
		.settingsGUICheckboxLabel input[type="checkbox"] {
			display: none;
		}

		/* 创建自定义样式的label */
		.settingsGUICheckboxLabel {
			display: inline-block;
			position: relative;
			padding-left: 95px;
			left: 0px;
			cursor: pointer;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}

		/* 创建自定义的checkbox样式 */
		.settingsGUICheckboxLabel .settingsGUICheckboxSpan {
			position: absolute;
			left: 0;
			top: -3px;
			width: 85px;
			height: 31px;
			border-radius: 5px;
		}

		/* 当checkbox未被选中时改变样式 */
		.settingsGUICheckboxLabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan {
			background-image: -webkit-linear-gradient(top, #d9534f 0, #c12e2a 100%);
			background-image: -o-linear-gradient(top, #d9534f 0, #c12e2a 100%);
			background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #d9534f), to(#c12e2a));
			background-image: linear-gradient(to bottom, #d9534f 0, #c12e2a 100%);
			filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffd9534f', endColorstr='#ffc12e2a', GradientType=0);
			filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
			background-repeat: repeat-x;
			border-color: #b92c28
		}

		.settingsGUICheckboxLabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan:hover, .settingsGUICheckboxLabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan:focus {
			background-color: #c12e2a;
			background-position: 0 -15px
		}

		.settingsGUICheckboxLabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan:active {
			background-color: #c12e2a;
			border-color: #b92c28
		}

		.settingsGUICheckboxLabel input[type="checkbox"]:not(:checked) ~ .settingsGUICheckboxSpan::after {
			content: "Disabled";
			position: relative;
			left: 9px;
			top: 4px;
			color: white;
		}

		/* 当checkbox被选中时改变样式 */
		.settingsGUICheckboxLabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan {
			background-image: -webkit-linear-gradient(top, #5cb85c 0, #419641 100%);
			background-image: -o-linear-gradient(top, #5cb85c 0, #419641 100%);
			background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #5cb85c), to(#419641));
			background-image: linear-gradient(to bottom, #5cb85c 0, #419641 100%);
			filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff5cb85c', endColorstr='#ff419641', GradientType=0);
			filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
			background-repeat: repeat-x;
			border-color: #3e8f3e
		}

		.settingsGUICheckboxLabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan:hover, .settingsGUICheckboxLabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan:focus {
			background-color: #419641;
			background-position: 0 -15px
		}

		.settingsGUICheckboxLabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan:active{
			background-color: #419641;
			border-color: #3e8f3e
		}

		/* 创建选中后的对勾 */
		.settingsGUICheckboxLabel input[type="checkbox"]:checked ~ .settingsGUICheckboxSpan::after{
			content: "Enabled";
			position: relative;
			left: 12px;
			top: 4px;
			color: white;
		}
		`);
		let GUIDiv = document.createElement('div');
		GUIDiv.innerHTML = `
		<div class="modal fade in" id="pluginSettingsGUIDiv" tabindex="-1" aria-labelledby="pluginSettingsGUISwitchModalLabel" aria-hidden="true" style="display: none;">
			<div class="modal-dialog" style="width: 1000px;">
				<div class="modal-content" id="pluginSettingsGUIDiv-modal-content">
					<div class="modal-header" style="height: 51px;">
						<h4 class="modal-title" id="pluginSettingsGUISwitchModalLabel" style='float:left; font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman"'><span class="glyphicon glyphicon-cog"></span> ZROJ Better! 设置</h4>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close" style="float:right" onclick="closePluginSettingsGUIDiv();">
						<span aria-hidden="true">×</span>
						</button>
					</div>
					<form name="pluginSettingsGUIDivForm" id="pluginSettingsGUIDivForm" class="embedded-scrollbar" style="position:relative; margin:10px; height: 500px; overflow-y: auto;">

						<h3 class="settingsGUIH3">LaTex 公式设置</h3>

						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherMagnifyLaTexInPluginSettingsGUI" id="whetherMagnifyLaTexInPluginSettingsGUI"`
								+ (whetherMagnifyLaTexActualValue ? "checked" : "") + `> 放大 LaTex 公式（不太稳定）
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							LaTex 公式的放大倍数（不太稳定）：<input type="text" class="form-control" name="LaTexMagnificationInPluginSettingsGUI" id="LaTexMagnificationInPluginSettingsGUI" style = "width: 100px;" value=`
							+ LaTexMagnificationActualValue + `>
						</div>

						<h3 class="settingsGUIH3">题目界面设置</h3>

						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherAddMySubmissionsAndAllSubmissionsButtonsInPluginSettingsGUI" id="whetherAddMySubmissionsAndAllSubmissionsButtonsInPluginSettingsGUI"`
								+ (whetherAddMySubmissionsAndAllSubmissionsButtonsActualValue ? "checked" : "") + `> 在题目界面添加“我的提交”“所有提交”按钮，并给“返回比赛”按钮添加图标
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherAddOpenIframeInNewTabButtonInPluginSettingsGUI" id="whetherAddOpenIframeInNewTabButtonInPluginSettingsGUI"`
								+ (whetherAddOpenIframeInNewTabButtonActualValue ? "checked" : "") + `> 添加在新标签页中打开 pdf 题面的按钮
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>

						<h3 class="settingsGUIH3">比赛界面设置</h3>

						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherChangeContestPageButtonIconInPluginSettingsGUI" id="whetherChangeContestPageButtonIconInPluginSettingsGUI"`
								+ (whetherChangeContestPageButtonIconActualValue ? "checked" : "") + `> 给比赛界面的部分按钮添加图标
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherHighlightStandingsPageSelfLineInPluginSettingsGUI" id="whetherHighlightStandingsPageSelfLineInPluginSettingsGUI"`
								+ (whetherHighlightStandingsPageSelfLineActualValue ? "checked" : "") + `> 将比赛排行榜界面自己的那一行高亮并添加“只显示关注的人”按钮
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							关注用户列表（用英文逗号分隔，忽略所有空格）：<input type="text" class="form-control" name="starredUserNameListInPluginSettingsGUI" id="starredUserNameListInPluginSettingsGUI" style = "width: 500px;" value=`
							+ starredUserNameListActual.toString() + `>
						</div>

						<h3 class="settingsGUIH3">其他设置</h3>

						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherCopyPreCodeInPluginSettingsGUI" id="whetherCopyPreCodeInPluginSettingsGUI"`
								+ (whetherCopyPreCodeActualValue ? "checked" : "") + `> 添加复制代码框的按钮
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherAddGoToProblemAndGoToUserProfileInputLabelsInPluginSettingsGUI" id="whetherAddGoToProblemAndGoToUserProfileInputLabelsInPluginSettingsGUI"`
								+ (whetherAddGoToProblemAndGoToUserProfileInputLabelsActualValue ? "checked" : "") + `> 在导航栏添加跳转到题目和跳转到用户主页的输入框
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherChangeIconInPluginSettingsGUI" id="whetherChangeIconInPluginSettingsGUI"`
								+ (whetherChangeIconActualValue ? "checked" : "") + `> 更改网页图标（修复了 download.php 没有图标的特性）
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherFakeZAC2010ColorAndProfileInPluginSettingsGUI" id="whetherFakeZAC2010ColorAndProfileInPluginSettingsGUI"`
								+ (whetherFakeZAC2010ColorAndProfileActualValue ? "checked" : "") + `> 更改 <span class="uoj-username" style="color: red;">zac2010<sup>ℵℵℵ</sup></span> 的用户名颜色和主页
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>

						<h3 class="settingsGUIH3">样式设置</h3>

						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherChangeWebsiteCSSInPluginSettingsGUI" id="whetherChangeWebsiteCSSInPluginSettingsGUI"`
								+ (whetherChangeWebsiteCSSActualValue ? "checked" : "") + `> 美化样式
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherAnimationTransitionEnabledInPluginSettingsGUI" id="whetherAnimationTransitionEnabledInPluginSettingsGUI"`
								+ (whetherAnimationTransitionEnabledActualValue ? "checked" : "") + `> 添加动画渐变效果
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>
						<div class="settingsGUIDiv">
							<label class="settingsGUICheckboxLabel form-check-label">
								<input type="checkbox" class="form-check-input" name="whetherUnderlineAHoverEnabledInPluginSettingsGUI" id="whetherUnderlineAHoverEnabledInPluginSettingsGUI"`
								+ (whetherUnderlineAHoverEnabledActualValue ? "checked" : "") + `> 是否在鼠标悬浮在链接上时给链接添加下划线（如关闭则会添加淡蓝色背景）
								<span class="settingsGUICheckboxSpan"></span>
							</label>
						</div>

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
						<button type="button" class="btn btn-default" data-dismiss="modal" onclick="closePluginSettingsGUIDiv();">取消</button>
						<button type="submit" class="btn btn-primary" onclick="submitPluginSettingsGUIDiv();">确认</button>
					</div>
				</div>
			</div>
		</div>
		`;
		document.body.appendChild(GUIDiv);

		injectScript(`
		function openPluginSettingsGUIDiv() {
			document.querySelector('#pluginSettingsGUIDiv').style = "display: block;";
			document.body.style.overflow = "hidden";
		}
		function closePluginSettingsGUIDiv() {
			document.querySelector('#pluginSettingsGUIDiv').style = "display: none;";
			document.body.style.overflow = "auto";
		}
		function submitPluginSettingsGUIDiv() {
			GM_setValue('whetherCopyPreCode', document.querySelector('#whetherCopyPreCodeInPluginSettingsGUI').checked);
			GM_setValue('whetherHighlightStandingsPageSelfLine', document.querySelector('#whetherHighlightStandingsPageSelfLineInPluginSettingsGUI').checked);

			GM_setValue('whetherMagnifyLaTex', document.querySelector('#whetherMagnifyLaTexInPluginSettingsGUI').checked);
			GM_setValue('LaTexMagnification', document.querySelector('#LaTexMagnificationInPluginSettingsGUI').value);
			GM_setValue('starredUserNameList', document.querySelector('#starredUserNameListInPluginSettingsGUI').value.toString().replaceAll(' ', '').split(/[,;]/));

			GM_setValue('whetherChangeContestPageButtonIcon', document.querySelector('#whetherChangeContestPageButtonIconInPluginSettingsGUI').checked);
			GM_setValue('whetherAddMySubmissionsAndAllSubmissionsButtons', document.querySelector('#whetherAddMySubmissionsAndAllSubmissionsButtonsInPluginSettingsGUI').checked);
			GM_setValue('whetherFakeZAC2010ColorAndProfile', document.querySelector('#whetherFakeZAC2010ColorAndProfileInPluginSettingsGUI').checked);

			GM_setValue("whetherAddGoToProblemAndGoToUserProfileInputLabels", document.querySelector('#whetherAddGoToProblemAndGoToUserProfileInputLabelsInPluginSettingsGUI').checked);
			GM_setValue("whetherAddOpenIframeInNewTabButton", document.querySelector('#whetherAddOpenIframeInNewTabButtonInPluginSettingsGUI').checked);
			GM_setValue("whetherChangeIcon", document.querySelector('#whetherChangeIconInPluginSettingsGUI').checked);

			GM_setValue("whetherChangeWebsiteCSS", document.querySelector('#whetherChangeWebsiteCSSInPluginSettingsGUI').checked);
			GM_setValue("whetherAnimationTransitionEnabled", document.querySelector('#whetherAnimationTransitionEnabledInPluginSettingsGUI').checked);
			GM_setValue("whetherUnderlineAHoverEnabled", document.querySelector('#whetherUnderlineAHoverEnabledInPluginSettingsGUI').checked);

			window.location.reload();
		}
		document.querySelector('#pluginSettingsGUIDivForm').addEventListener('submit', function(event) {
			event.preventDefault();
		});
		`);

		let div = document.querySelector('.nav.nav-pills.pull-right');
		let showGUIDivButtonLi = document.createElement('li');
		showGUIDivButtonLi.innerHTML = `
		<button class="btn btn-info btn-block btn-always-bold" onclick="openPluginSettingsGUIDiv();" id="settings-button">
			<span class="glyphicon glyphicon-cog"></span> ZROJ Better! 设置
		</button>
		`;
		div?.insertBefore(showGUIDivButtonLi, div.firstChild);
	})();

	let selfUserName = document.querySelector("a[data-toggle='dropdown']")?.querySelector("span")?.innerText;
	function isContestPage() {
		return /^\/contest\/\d/.test(location.pathname);
	}

	// 设置 LaTex 公式是否放大的菜单栏
	function enableLaTexMagnify() {
		GM_setValue('whetherMagnifyLaTex', true);
		window.location.reload();
	}

	function disableLaTexMagnify() {
		GM_setValue('whetherMagnifyLaTex', false);
		window.location.reload();
	}

	if (whetherMagnifyLaTexActualValue) {
		GM_registerMenuCommand("关闭 LaTex 公式放大功能", disableLaTexMagnify);
	}
	else {
		GM_registerMenuCommand("开启 LaTex 公式放大功能", enableLaTexMagnify);
	}

	// 比赛排行榜界面自己的那一行高亮
	(function highlightStandingsPageSelfLineFeature() {
		if (!whetherHighlightStandingsPageSelfLineActualValue) {
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
					showStarredUserNameInStandings(starredUserNameListActual);
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
		if (!whetherCopyPreCodeActualValue) {
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
	(function changeLaTexMagnificationFeature() {
		if (!whetherMagnifyLaTexActualValue) {
			return;
		}
		function queryLaTexMagnification(){
			alert("当前 LaTex 公式放大倍数为 " + GM_getValue("LaTexMagnification", 1.25) + "。");
		}
		function changeLaTexMagnificationTo_1(){
			GM_setValue("LaTexMagnification", 1);
			window.location.reload();
		}
		function changeLaTexMagnificationTo_1_25(){
			GM_setValue("LaTexMagnification", 1.25);
			window.location.reload();
		}
		function changeLaTexMagnificationTo_1_5(){
			GM_setValue("LaTexMagnification", 1.5);
			window.location.reload();
		}
		function changeLaTexMagnificationTo_1_75(){
			GM_setValue("LaTexMagnification", 1.75);
			window.location.reload();
		}
		function changeLaTexMagnificationTo_2(){
			GM_setValue("LaTexMagnification", 2);
			window.location.reload();
		}
		function addLaTeXScaleBy_0_25(){
			GM_setValue("LaTexMagnification", +GM_getValue("LaTexMagnification", 1.25) + 0.25);
			window.location.reload();
		}
		function subLaTeXScaleBy_0_25(){
			GM_setValue("LaTexMagnification", +GM_getValue("LaTexMagnification", 1.25) - 0.25);
			window.location.reload();
		}
		GM_registerMenuCommand("当前 LaTex 公式缩放倍数为 " + GM_getValue("LaTexMagnification", 1.25) + "。", queryLaTexMagnification);
		GM_registerMenuCommand("减少 LaTex 公式缩放倍数 0.25", subLaTeXScaleBy_0_25);
		GM_registerMenuCommand("增加 LaTex 公式缩放倍数 0.25", addLaTeXScaleBy_0_25);
		GM_registerMenuCommand("将 LaTex 公式缩放倍数设置为 1", changeLaTexMagnificationTo_1);
	})();

	// 放大 LaTex 公式并添加“我的提交”“所有提交”按钮
	(function magnifyLaTexFormulaFeature() {
		if (!whetherMagnifyLaTexActualValue) {
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
		if (!whetherAddMySubmissionsAndAllSubmissionsButtonsActualValue) {
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
		if (!whetherFakeZAC2010ColorAndProfileActualValue) {
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
		if (!whetherAddGoToProblemAndGoToUserProfileInputLabelsActualValue) {
			return;
		}

			// let div = document.querySelector('.nav.nav-pills.pull-right');
			// let navbarUl = document.querySelector('.navbar-collapse')?.querySelector('ul');
			// document.querySelector('.navbar-header').remove();
			// let navbarHeaderZROILink = document.createElement('li');
			// navbarHeaderZROILink.innerHTML = `
			// <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
			// <span class="icon-bar"></span>
			// <span class="icon-bar"></span>
			// <span class="icon-bar"></span>
			// </button>
			// <a class="navbar-brand" href="http://zhengruioi.com">ZROI</a>
			// `;
			// navbarUl.insertBefore(navbarHeaderZROILink, navbarUl.firstChild);

		// 跳转到题目
		let goToProblemForm = document.createElement('li');
		goToProblemForm.setAttribute('class', 'col-sm-2');
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
		document.querySelector('.navbar-collapse')?.querySelector('ul')?.appendChild(goToProblemForm);
		// div?.insertBefore(goToProblemForm, div.firstChild);

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
		`);

		// 跳转到用户主页
		let goToUserProfileForm = document.createElement('li');
		// goToUserProfileForm.setAttribute('class', 'col-sm-3');
		goToUserProfileForm.innerHTML = `
		<form class="input-group form-group" id="goToUserProfileFormUserNameForm" style="position:relative; top:8px; width: 200px;">
			<input class="form-control" type="text" id="goToUserProfileFormUserNameInputLabel" placeholder="跳转到用户主页"
			onkeydown="if (event.key === 'Enter') goToUserProfile();">
			<span class="input-group-btn">
				<button class="btn btn-search btn-primary" onclick="goToUserProfile()">
					<span class='glyphicon glyphicon-new-window'></span>
				</button>
			</span>
		</form>
		`;
		document.querySelector('.navbar-collapse')?.querySelector('ul')?.appendChild(goToUserProfileForm);

		injectCSS(`
		#goToProblemFormProblemIdInputLabel::placeholder, #goToUserProfileFormUserNameInputLabel::placeholder{
			font-weight: 300;
			color: silver;
		}
		`);
		injectScript(`
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
		if (!whetherChangeContestPageButtonIconActualValue) {
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
		if (!whetherAddOpenIframeInNewTabButtonActualValue) {
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
		if (!whetherChangeWebsiteCSSActualValue) {
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
			font-family: "Latin Modern Roman 10", "宋体-简", "Fira Code", "Times New Roman";
			// font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman";
			font-size: 160%;
		`
		+ (whetherAnimationTransitionEnabledActualValue ? `transition: all 0.15s;` : '') +
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
			font-family: "Latin Modern Sans 10", "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman";
			color: black;
			font-size: 110%;
		}
		/* 页面最上方导航栏字体改为阿里巴巴普惠体 2.0，鼠标悬浮时变为粗体 */
		.container-fluid a{
			font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman";
			font-size: 115%;
		}
		.container-fluid a:hover{
			font-weight: bold;
		}
		/* 题目界面“描述”“提交”等按钮字体改为阿里巴巴普惠体 2.0，鼠标悬浮时变为粗体 */
		.nav-tabs a{
			font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman";
		}
		.nav-tabs a:hover{
			font-weight: bold;
		}
		/* 按钮字体改为阿里巴巴普惠体 2.0，鼠标悬浮时变为粗体 */
		.btn{
			font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman";
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
		/* 更改用户名字体为 Latin Modern Sans 10 */
		.uoj-username{
			font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman";
		}
		.uoj-honor{
			font-family: "阿里巴巴普惠体 2.0", "Fira Code", "Times New Roman";
		}
		/* 更改链接颜色 */
		a{
			color: #5e72e4;
			transition: all 0.15s;
		}
		a:hover{
			color: #0056b3;
			` + (whetherUnderlineAHoverEnabledActualValue ? '' : `background-color: #e5f3f8;`) + `
			text-decoration: ` + (whetherUnderlineAHoverEnabledActualValue ? `underline` : `none`) + `
		}
		/* 更改 ZROJ Faker 中用户主页的比赛信息表的字体 */
		#rating-chart{
			font-family: "Latin Modern Roman 10", "宋体-简", "Fira Code", "Times New Roman";
		}
		/* 更改代码框的字体为 Fira Code，略粗 */
		pre{
			font-family: "Fira Code", "Consolas";
			font-weight: 500;
			font-size: 15px;
			overflow: visible;
			// margin-left: 5.5em;
		}
		pre code{
			font-family: "Fira Code", "Consolas";
			font-weight: 500;
			font-size: 15px;
		}
		/* 更改输入框的字体为 Fira Code, 略粗*/
		input[type="text"]{
			font-family: "Fira Code", "阿里巴巴普惠体 2.0", "Consolas";
			font-weight: 500;
			transition: 0.1s ease-in-out;
		}
		`);
	})();
})();