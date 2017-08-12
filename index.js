/*
  ____  _                       _   _____
 |  _ \(_)___  ___ ___  _ __ __| | |__  /___ _ __ ___
 | | | | / __|/ __/ _ \| '__/ _` |   / // _ \ '__/ _ \
 | |_| | \__ \ (_| (_) | | | (_| |  / /|  __/ | | (_) |
 |____/|_|___/\___\___/|_|  \__,_| /____\___|_|  \___/

   Created by Sam Denty (samdenty99) & Coto (0xCoto)
  		https://github.com/0xCoto/DiscordZero

*/

// You can hardcore your credentials into the script if needed
var apiKey          = ""; // Your hologram API key
var deviceId        = ""; // Your hologram device ID
var discordToken    = ""; // Your discord token
var fromNumber      = "10000000001"; // The number the SMSs should be sent from
var HologramPlusAPI = "http://s.samdd.me/hologram/"; // A live instance of the HologramPlusAPI php script (See https://github.com/samdenty99/HologramPlusAPI)
var SMSonStartup    = true; // Send a status SMS on startup


const Discord = require('discord.js');
const client = new Discord.Client();
const chalk = require('chalk');
const request = require('request');
const prompt = require('prompt');
const net = require('net');
const http = require('http');
const fs = require('fs');
const path = require('path')
var title, body;

http.createServer(function (request, response) {
	console.log('HTTP SERVER STARTED')
}).listen(process.env.PORT || 5000);


console.log(chalk.magenta("\n\n  ____  _                       _  ")+chalk.red(" _____              \n")+chalk.magenta(" |  _ \\(_)___  ___ ___  _ __ __| | ")+chalk.red("|__  /___ _ __ ___  \n")+chalk.magenta(" | | | | / __|/ __/ _ \\| '__/ _` | ")+chalk.red("  / // _ \\ '__/ _ \\ \n")+chalk.magenta(" | |_| | \\__ \\ (_| (_) | | | (_| | ")+chalk.red(" / /|  __/ | | (_) |\n")+chalk.magenta(" |____/|_|___/\\___\\___/|_|  \\__,_|")+chalk.red(" /____\\___|_|  \\___/\n"));
console.log(chalk.blueBright("   Created by ") + chalk.yellowBright("Sam Denty (") + chalk.redBright("samdenty99") + chalk.yellowBright(") & Coto (") + chalk.redBright("0xCoto")+ chalk.yellowBright(")"))

if (apiKey && deviceId && discordToken && fromNumber && HologramPlusAPI) {
	client.login(discordToken);
} else {
	console.log("\n");
	prompt.start();
	prompt.message = '';
	prompt.delimiter = '';
	prompt.get([{name:'discordToken',description: chalk.greenBright("Discord Token: ")}, {name:'apiKey',description: chalk.cyanBright("Hologram.io API Key: ")}, {name:'deviceId',description: chalk.cyanBright("Hologram.io Device ID: ")}, {name:'fromNumber',description: chalk.cyanBright("Sender phone number (leave blank for default: +1-000-000-0001): ")}], function (err, result) {
		if (result.discordToken) discordToken = result.discordToken;
		if (result.deviceId) deviceId = result.deviceId;
		if (result.apiKey) apiKey = result.apiKey;
		if (result.fromNumber) fromNumber = result.fromNumber;
		client.login(discordToken);
	});
}

client.on('ready', () => {
  console.log(chalk.greenBright("\n\nLogged in as: ") + chalk.cyanBright(client.user.username+" ")+chalk.yellowBright("("+client.user.id+")"));
  if (SMSonStartup) request(HologramPlusAPI + '?key='+apiKey+'&id='+deviceId+'&from='+fromNumber+'&title=DiscordZero&body=Client started!{$nl$}Server IP Address: {$ip$}')
});

client.on('message', message => {
	var now=new Date();
	// If message not from self
	if(client.user.tag != message.author.tag) {
		var authorTag = message.author.tag;
		// If Tag is #0000 (Aka a webhook) then remove the tag name
		var realTag = authorTag.slice(-5);
		if (realTag == "#0000") authorTag = authorTag.slice(0, -5);
		if(message.channel.name) {
			// Channel chat
				// Print message and status in terminal (process.stdout.write is used because it doesn't leave a newline)
				process.stdout.write(chalk.yellowBright("[" + now.getHours() + ":"+now.getMinutes()+"] ") + chalk.greenBright(message.guild) + chalk.green("#"+message.channel.name+" ") + chalk.redBright(authorTag + ": ") + chalk.cyanBright(message.cleanContent) + "    ");
				// Set the SMS title (NOTE: This is a HologramPlusAPI feature, https://github.com/samdenty99/HologramPlusAPI)
				title = encodeURIComponent("[" + message.guild + "#" + message.channel.name + "] @" + authorTag + "{$nl$}");
				// Encode the Body into a URL
				body = encodeURIComponent(message.cleanContent);
		} else {
			// Private message
				process.stdout.write(chalk.yellowBright("["+now.getHours()+":"+now.getMinutes()+"] ") + chalk.redBright(authorTag + ": ") + chalk.cyanBright(message.cleanContent) + "    ");
				title = encodeURIComponent("@"+authorTag + "{$nl$}");
				// Encode the Body into a URL
				body = encodeURIComponent(message.cleanContent);
		}
		// Custom numbers for different servers (eg. allowing you to mute them on your phone)
		/*if (message.guild == "samdd" || message.guild == "Notifications") {
			var choosenFromNumber = fromNumber;
		} else if (message.guild == "Seytopia"){
			var choosenFromNumber = "6";
		} else {
			var choosenFromNumber = "7";
		}*/
		request(HologramPlusAPI + '?key='+apiKey+'&id='+deviceId+'&from='+choosenFromNumber+'&title='+title+'&body=' + body, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    var json = JSON.parse(body);
		    if (json.error != 0) {
		    	// If error, output to console
		    	console.log(chalk.redBright("ERROR: "+json.info))
		    } else {
		    	// Output 
		    	console.log(chalk.whiteBright(json.info))
		    }
		  } else {
		  	console.log(chalk.redBright('SMS FAILED TO SEND!'))
		  }
		})
	}
});