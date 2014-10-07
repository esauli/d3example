<?php
if(empty($_GET['url'])) exit();


if (preg_match('/^(https?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/', $_GET['url'])) {
	$url = $_GET['url'];
} else {
    echo '正しくないURLです。';
}

$url = $_GET['url'];
unset($_GET[url]); 


$data = array(
    "developerkey" => "44aa42551c54",
    "responseformat" => "json"
);

$data = array_merge($data, $_GET);


$data = http_build_query($data, "", "&");

//header
$header = array(
    "Content-Type: application/x-www-form-urlencoded",
    "Content-Length: ".strlen($data)
);

$context = array(
    "http" => array(
        "method"  => "POST",
        "header"  => implode("\r\n", $header),
        "content" => $data
    )
);

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: shimz.me");
echo file_get_contents($url, false, stream_context_create($context));
?>