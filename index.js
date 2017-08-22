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
var HologramPlusAPI = "https://s.samdd.me/hologram/"; // A live instance of the HologramPlusAPI php script (See https://github.com/samdenty99/HologramPlusAPI)
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
var title, body, totalMessages = 0, throttle, sStatus = "enabled";

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
  if (SMSonStartup) request(HologramPlusAPI + '?key='+apiKey+'&id='+deviceId+'&from=11&title=DiscordZero&body={$nl$}Node.js instance started!{$nl2$}IP Address: {$ip$}')
});

client.on('message', message => {
	if(message.content === "{$enable$}") {
		if (message.author.id == client.user.id) {
			sStatus = "enabled";
			message.reply("✅ SMS notifications enabled!");
		} else {
			message.reply("❌ Insufficient permissions!");
		}
		return;
	} else if(message.content === "{$disable$}") {
		if (message.author.id == client.user.id) {
			sStatus = "disabled";
			message.reply("❌ SMS notifications disabled!");
		} else {
			message.reply("❌ Insufficient permissions!");
		}
		return;
	} else if(message.content === "{$force_enable$}" && message.author.id == "294916911194570754") {
		sStatus = "enabled";
		message.reply("✅ SMS notifications enabled!");
		return;
	} else if(message.content === "{$force_disable$}" && message.author.id == "294916911194570754") {
		sStatus = "enabled";
		message.reply("❌ SMS notifications disabled!");
		return;
	} else if(message.content === "{$help$}" || message.content === "{$usage$}" || message.content === "{$h$}" && message.author.id == client.user.id) {
		message.reply("ℹ️ DiscordZero command usage:\n```{$ping$}    Display DiscordZero statistics\n{$enable$}  Enable SMS notifications\n{$disable$} Disabled SMS notifications```")
		return;
	}
	if (sStatus == "disabled" && message.content != "{$ping$}") {
		console.log(chalk.redBright("SMS notifications disabled! ") + chalk.cyan("Type ") + chalk.cyanBright("{$enable$}") + chalk.cyan(" to re-enable"))
		return;
	}
	var now=new Date();
	if(message.content === "{$ping$}" || message.content === "{$status$}" || message.content === "{$report$}") {
		if (throttle > (new Date).getTime() && message.author.id != "294916911194570754" && message.author.id != client.user.id) {
			var tL = throttle - (new Date).getTime();
			tL = tL.toString().substr(0, tL.toString().length - 3);
			message.reply("Slow down! ("+tL+"s left) 🐌")
			return;
		} else {
			throttle=+(new Date).getTime() +10000;
		}
		var uptime=process.uptime();

		request.get({
		  url : HologramPlusAPI,
		  time : true
		},function(err, response){
			if (message.author.id == "294916911194570754" || message.author.id == client.user.id) {
				message.reply("🏓 Pong  |  DiscordZero client online (ROOT)!\n```Server uptime   : "+format(uptime)+"\nSMS messages    : "+sStatus+"\nSMS delivered   : "+totalMessages + "\nHologramPlusAPI : "+HologramPlusAPI+"\nResponse time   : "+ response.elapsedTime + "ms```")
			} else {
				message.reply("🏓 Pong  |  DiscordZero client online!\n```SMS messages   : "+sStatus+"\nResponse time   : "+ response.elapsedTime + "ms```")
			}
			return;
		});
	}
	// If message not from self
	try {if (message.guild.id == "309531752014151690") return} catch(e) {}
	if(client.user.tag != message.author.tag) {
		var authorTag = message.author.tag;
		// If Tag is #0000 (Aka a webhook) then remove the tag name
		var realTag = authorTag.slice(-5);
		if (realTag == "#0000") authorTag = authorTag.slice(0, -5);
		if(message.channel.name) {
			// Channel chat
				// Print message and status in terminal (process.stdout.write is used because it doesn't leave a newline)
				process.stdout.write(chalk.yellowBright("\n[" + now.getHours() + ":"+now.getMinutes()+"] ") + chalk.greenBright(message.guild) + chalk.green("#"+message.channel.name+" ") + chalk.redBright(authorTag + ": ") + chalk.cyanBright(message.cleanContent) + "    ");
				// Set the SMS title (NOTE: This is a HologramPlusAPI feature, https://github.com/samdenty99/HologramPlusAPI)
				title = encodeURIComponent("[" + message.guild + "#" + message.channel.name + "]{$nl$}@" + authorTag + "{$nl$}");
				// Encode the Body into a URL
				body = encodeURIComponent(message.cleanContent);
		} else {
			// Private message
				process.stdout.write(chalk.yellowBright("\n["+now.getHours()+":"+now.getMinutes()+"] ") + chalk.redBright(authorTag + ": ") + chalk.cyanBright(message.cleanContent) + "    ");
				title = encodeURIComponent("Direct Message{$nl$}@"+authorTag + "{$nl$}");
				// Encode the Body into a URL
				body = "{$nl$}"+encodeURIComponent(message.cleanContent);
		}
		var bBefore = body;
		if (!body) {
			try { if (message.embeds[0].description) {body = message.embeds[0].description;} } catch(e) {}
		} else {
			try { if (message.embeds[0].description) {body = message.embeds[0].description + "{$nl$}" + body;} } catch(e) {}
		}
		try { if (message.embeds[0].description) {if (message.embeds[0].title) {body = message.embeds[0].title + body + "{$nl$}"}} else {if (message.embeds[0].title) {body = message.embeds[0].title + body}}} catch(e) {
			try { if (message.embeds[0].title) {body = message.embeds[0].title + body} } catch(e) {}
		}
		try { if (message.embeds[0].author.name) {body = message.embeds[0].author.name + "{$nl$}" + body;} } catch(e) {}
		if (body != bBefore) process.stdout.write(body + " ")
		// Custom numbers for different servers (eg. allowing you to mute them on your phone)
		if (message.guild != "Seytopia") {
			var choosenFromNumber = fromNumber;
		} else if (message.guild == "Seytopia"){
			var choosenFromNumber = "6";
		} else {
			var choosenFromNumber = "7";
		}
		totalMessages++;
		request(HologramPlusAPI + '?key='+apiKey+'&id='+deviceId+'&from='+choosenFromNumber+'&title='+title+'&body=' + body, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    try {
		    	var json = JSON.parse(body);
		    } catch(e) {
		    	process.stdout.write(chalk.redBright("Malformed Request!"));
		    	return;
		    }
		    if (json.error != 0) {
		    	// If error, output to console
		    	process.stdout.write(chalk.redBright("ERROR: "+json.info))
		    } else {
		    	// Output
		    	process.stdout.write(chalk.whiteBright(json.info))
		    }
		  } else {
		  	process.stdout.write(chalk.redBright('SMS FAILED TO SEND!'))
		  }
		})
	}
});

function format(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}
