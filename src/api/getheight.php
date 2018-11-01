<?php

include 'config.php';

$curl = curl_init();

$body = json_encode(array());
curl_setopt_array($curl, array(CURLOPT_RETURNTRANSFER => 1, CURLOPT_URL => 'http://89.42.210.190:'.$rpcPort.'/getheight'));
$resp = curl_exec($curl);
curl_close($curl);
//var_dump($resp);
$array = json_decode($resp, true);
//var_dump($array);
if($array === null)
	http_response_code(400);
else
	echo $array['height'];