import urllib.request
import discord
import asyncio

#Colors
black = "\033[0;30m"
red = "\033[0;31m"
green = "\033[0;32m"
yellow = "\033[0;33m"
blue = "\033[0;34m"
purple = "\033[0;35m"
cyan = "\033[0;36m"
white = "\033[0;37m"

#Bold Colors
bblack = "\033[1;30m"
bred = "\033[1;31m"
bgreen = "\033[1;32m"
byellow = "\033[1;33m"
bblue = "\033[1;34m"
bpurple = "\033[1;35m"
bcyan = "\033[1;36m"
bwhite = "\033[1;37m"

print(""""""+blue+"""  ____  _                       _  """+red+""" _____              
"""+blue+""" |  _ \(_)___  ___ ___  _ __ __| | """+red+"""|__  /___ _ __ ___  
"""+blue+""" | | | | / __|/ __/ _ \| '__/ _` | """+red+"""  / // _ \ '__/ _ \ 
"""+blue+""" | |_| | \__ \ (_| (_) | | | (_| | """+red+""" / /|  __/ | | (_) |
"""+blue+""" |____/|_|___/\___\___/|_|  \__,_|"""+red+""" /____\___|_|  \___/
""")

yes = ['y','Y','yes','Yes','YES']

email = input(bgreen+'Discord Email Address: '+yellow)
password = input(bgreen+'Discord Password: '+yellow)
hg_api = str(input(bcyan+'Hologram.io API Key: '+yellow))
hg_deviceid = int(input(bcyan+'Hologram.io Device ID: '+yellow))
sender = input(bcyan+'Sender Phone number (leave blank for default: +1-000-000-0001): '+yellow)
if sender == '':
	sender = "+1-000-000-0001"
logs = input(bpurple+'Enable console logs [Y/N]: '+yellow)
print(white)

client = discord.Client()

@client.event
async def on_ready():
	print(green+'Logged in as: '+cyan+client.user.name+white+' '+yellow+'('+client.user.id+')'+white)

@client.event
async def on_message(message):
	author = str(message.author)
	if logs in yes:
		print(yellow+"["+str(message.timestamp)[11:16]+"] "+red+author+": "+cyan+message.content+white)
	if message.author.id != client.user.id:
		body = "["+str(message.timestamp)[11:16]+"] "+author+": "+message.content
		
		values = """
		  {
		    "deviceid": """+hg_deviceid+""",
		    "fromnumber": """+'"'+sender+'"'+""",
		    "body": """+'"'+body+'"'+"""
		  }
		"""
		
		headers = {
		  'Content-Type': 'application/json'
		}
		
		try:
			request = urllib.request.Request('https://dashboard.hologram.io/api/1/sms/incoming?apikey='+hg_api, data=values.encode("utf-8"), headers=headers)
			response_body = urllib.request.urlopen(request).read()
		except:
			print(red+"Failed to login. Message not sent."+white)

client.run(email, password)