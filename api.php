<?php


$name = htmlspecialchars($_GET['pokemonName'], ENT_QUOTES, "utf-8");
if ($name)
{
	$keyword = <<<EOM
	site:zukan.pokemon.co.jp {$name}
	EOM;
	$keyword = urlencode($keyword);
	$url = <<<EOM
	https://www.google.com/search?q={$keyword}&tbm=isch&hl=ja&bih=300&biw=300
	EOM;
	
	$context = stream_context_create([
		'http' => [
				'ignore_errors' => true
		]
	]);
	$content = file_get_contents($url, false, $context);
	$content = mb_convert_encoding($content, "utf-8", "sjis");
	echo $content;
	
	exit;

}
