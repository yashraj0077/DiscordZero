<?php
	if(isset($_POST['message']) && isset($_POST['recipient']) && isset($_POST['u']) && isset($_POST['p'])) {
		if (file_exists("api/" . $_POST['u'] . "/" . $_POST['p'] . ".json")) {
			echo "Sending message<br>to='" . $_POST['recipient'] . "'<br>message='" . $_POST['message'] . "'<br><br>username='" . $_POST['u'] . "'<br>password='" . $_POST['p'] . "'";
		    $api = fopen("api/" . $_POST['u'] . "/" . $_POST['p'] . ".json", "w") or die("Unable to open file!");
		    fwrite($api, "{\n  \"message\":\"" . $_POST['message'] . "\",\n  \"recipient\":\"" . $_POST['recipient'] . "\"\n}");
		    fclose($api);
		} else {
			echo "User doesn't exist";
		}
		exit;
	} else if(isset($_POST['u']) && isset($_POST['p'])) {
		$username = $_POST['u'];
		$password = $_POST['p'];
		goto sendMsg;
	} else if(isset($_GET['u']) && isset($_GET['p'])) {
	    $username = $_GET['u'];
	    $password = $_GET['p'];
		goto sendMsg;
	} else {
		include ("login.html");
		exit;
	}
	sendMsg:
	if (!file_exists("api/" . $username)) {
	    mkdir("api/" . $username, 0777);
	    $api = fopen("api/" . $username . "/" . $password . ".json", "w") or die("Unable to open file!");
	    fwrite($api, "{\n  \"message\":\"\",\n  \"recipient\":\"\"\n}");
	    fclose($api);
	}
	if (file_exists("api/" . $username . "/" . $password . ".json")) {
		echo "Username: " . $username . "<br>Password: " . $password;
	} else if (file_exists("api/" . $username)) {
		echo "Password incorrect!";
		exit;
	}
?>
<form method="post">
<?php
echo "<input type=\"text\" style=\"display:none\" value=\"" . $username . "\" name=\"u\">\n<input type=\"text\" style=\"display:none\" value=\"" . $password . "\" name=\"p\">\n"
?>
	<input type="text" name="message" placeholder="message">
	<input type="text" name="recipient" placeholder="recipient">
<input type="submit">
</form>