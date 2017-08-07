<?php
	if(isset($_POST['u']) && isset($_POST['p'])) {
		$username = $_POST['u'];
		$password = $_POST['p'];
		goto token;
	} else if(isset($_GET['u']) && isset($_GET['p'])) {
	    $username = $_GET['u'];
	    $password = $_GET['p'];
	    goto token;
	} else {
		include ("login.html");
		exit;
	}
	token:
	echo $username . " " . $password;
	if (!file_exists("api/" . $username)) {
	    mkdir("api/" . $username, 0777);
	    $api = fopen("api/" . $username . "/" . $password . ".json", "w") or die("Unable to open file!");
	    fwrite($api, "message");
	    fclose($api);
	}
?>