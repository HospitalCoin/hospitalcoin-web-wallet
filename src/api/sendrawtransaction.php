<?php


include 'config.php';

$curl = curl_init();

$body = file_get_contents('php://input');

curl_setopt_array($curl, array(CURLOPT_RETURNTRANSFER => 1, CURLOPT_URL => 'http://localhost:'.$rpcPort.'/sendrawtransaction', CURLOPT_POST => 1, CURLOPT_POSTFIELDS => $body));

$resp = curl_exec($curl);
curl_close($curl);

header('Content-Type: application/json');
echo $resp;