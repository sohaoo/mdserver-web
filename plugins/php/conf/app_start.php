<?php

if (isset($_GET['mw_opcache_reset']) && $_GET['mw_opcache_reset'] == 'ok') {
	if (function_exists('opcache_reset')) {
		opcache_reset();
	}
}

define('XHProf_Name', 'mdd');

/**
 * xhprof 配置,便于调试快速找到问题
 */

function app_xhprof_start() {
	$root = '{$ROOT_PATH}';
	$lib  = $root . '/server/xhprof/xhprof_lib/utils/xhprof_lib.php';
	if (file_exists($lib)) {
		include_once $lib;
		include_once $root . '/server/xhprof/xhprof_lib/utils/xhprof_runs.php';
		xhprof_enable();
	}
}

function app_xhprof_end() {

	$root = '{$ROOT_PATH}';
	$lib  = $root . '/server/xhprof';
	if (! file_exists($lib)) {
		return;
	}

	//保存xhprof数据
	$xhprof_data = xhprof_disable();
	$xhprof_runs = new XHProfRuns_Default();

	$run_id = $xhprof_runs->save_run($xhprof_data, 'xhprof_foo');

	$profiler_url = sprintf('http://{$LOCAL_IP}:5858/index.php?run=%s&source=xhprof_foo', $run_id);
	// echo "<script language='javascript'>window.open('{$profiler_url}')</script>";

	$style_css = 'position:fixed;bottom: 0px;right: 0px;z-index: 100000000;color: red;background-color: black;padding: 0px;margin: 0px;';
	echo '<a href="' . $profiler_url . '" target="_blank" style="' . $style_css . '">XHProf分析结果</a>';

}

if (extension_loaded('xhprof')
	&& isset($_GET[XHProf_Name]) && $_GET[XHProf_Name] == 'ok' &&
	(! in_array($_SERVER['SCRIPT_NAME'], array('/xhprof_html/callgraph.php','/xhprof_html/index.php')))) {
	app_xhprof_start();
	register_shutdown_function('app_xhprof_end');
	include_once $_SERVER['SCRIPT_FILENAME'];
	exit;
}

?>
