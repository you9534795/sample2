<?php
function my_file_get_contents($url)
{
	$cp = curl_init();
	curl_setopt($cp, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($cp, CURLOPT_URL, $url);
	curl_setopt($cp, CURLOPT_TIMEOUT, 30);
	curl_setopt($cp, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
	$data = curl_exec($cp);
	curl_close($cp);
	return $data;
}

$name = htmlspecialchars($_GET['pokemonName'], ENT_QUOTES, "utf-8");
if ($name)
{
	$keyword = "site:zukan.pokemon.co.jp {$name}";
	$keyword = urlencode($keyword);
	$url = "https://www.google.com/search?q={$keyword}&tbm=isch&hl=ja&bih=300&biw=300";
	$content = my_file_get_contents($url);
	// $content = mb_convert_encoding($content, "utf-8", "sjis");
	echo $content;
	
	exit;

}
