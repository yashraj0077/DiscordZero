<?php
	if(isset($_POST['u']) && isset($_POST['p'])) {
		echo $_POST['u'];
	} else if(isset($_GET['u']) && isset($_GET['p'])) {
	    echo $_GET['u'];
	} else {
		include ("login.html");
	} 
?>