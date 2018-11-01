<?php

include 'config.php';

$curl = curl_init();

curl_setopt_array($curl, array(CURLOPT_RETURNTRANSFER => 1, CURLOPT_URL => 'http://localhost:'.$rpcPort.'/get_transaction_pool', CURLOPT_POST => 1, CURLOPT_POSTFIELDS => ''));

$resp = curl_exec($curl);
curl_close($curl);

$blobString1 = '"tx_blob": "';
$blobString2 = '"tx_blob":"';
$posTxBlob = 0;
$searchTxBlock1 = 0;
$searchTxBlock2 = 0;
while(($searchTxBlock1 = strpos($resp,$blobString1)) !== false || ($searchTxBlock2 = strpos($resp,$blobString2)) !== false ){
//	var_dump($searchTxBlock1.' '.$searchTxBlock2);
	if($searchTxBlock1 !== false){
		$posTxBlob = $searchTxBlock1;
		$posEndTxBlock = $posTxBlob + strlen($blobString1);
	}
	else if($searchTxBlock2 !== false){
		$posTxBlob = $searchTxBlock2;
		$posEndTxBlock = $posTxBlob + strlen($blobString2);
	}
	
	$i = 0;
	do{
		++$posEndTxBlock;
		$posEndTxBlock = strpos($resp, '"', $posEndTxBlock);
		++$i;
	}while($posEndTxBlock !== false && $resp[$posEndTxBlock-1] === '\\');
	
	$resp = substr($resp, 0, $posTxBlob).substr($resp, $posEndTxBlock+2);
}

$jsonMempool = json_decode($resp, true);
if(isset($jsonMempool['transactions'])){
//	var_dump('isset');
	foreach($jsonMempool['transactions'] as $key=>$tx){
		unset($tx['tx_blob']);
		$tx['tx_json'] = json_decode($tx['tx_json']);
		$jsonMempool['transactions'][$key] = $tx;
	}
}

header('Content-Type: application/json');
echo json_encode($jsonMempool);

