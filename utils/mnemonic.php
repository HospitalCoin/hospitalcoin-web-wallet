<?php


$original = '';

$dest = '';
$c = 0;
for($i = 0; $i < strlen($original); ++$i){
	if($original[$i] === ',' && $c == 9){
		$dest .= ','."\r\n";
		$c = 0;
	}else{
		$dest .= $original[$i];
		if($original[$i] === ',')
			++$c;
	}
}

echo $dest;