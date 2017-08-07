![image.png](http://i.imgur.com/52TwIUT.png)

<p align="center">
    <a href="https://github.com/0xCoto/DiscordZero/releases/latest"><img src="https://img.shields.io/github/downloads/0xCoto/DiscordZero/total.svg?style=flat-square&amp;colorA=191919&amp;colorB=6641E5" alt="Github All Releases" /></a>
    <a href="https://samdenty99.github.io/r?https://discord.gg/JB2tDGz"><img src="https://img.shields.io/discord/335836376031428618.svg?label=Discord&amp;style=flat-square&amp;colorA=191919&amp;colorB=A72F21" alt="Discord" /></a>
    <a href="https://github.com/0xCoto/DiscordZero/subscription"><img src="https://img.shields.io/github/watchers/0xCoto/DiscordZero.svg?label=Watch&amp;style=flat-square&amp;colorA=191919&amp;colorB=6641E5" alt="GitHub Watchers" /></a>
    <a href="https://github.com/0xCoto/DiscordZero"><img src="https://img.shields.io/github/stars/0xCoto/DiscordZero.svg?label=Star&amp;style=flat-square&amp;colorA=191919&amp;colorB=6641E5" alt="GitHub stars" /></a>
    <a href="https://github.com/0xCoto/DiscordZero/fork"><img src="https://img.shields.io/github/forks/0xCoto/DiscordZero.svg?label=Fork&amp;style=flat-square&amp;colorA=191919&amp;colorB=6641E5" alt="GitHub forks" /></a>
</p>

# DiscordZero

DiscordZero is a lightweight program that allows you to Discord SMS notifications on your phone, free of charge anywhere in the world!

# Getting started
#### Installation
```git clone https://github.com/0xCoto/DiscordZero```

#### Usage

```
cd DiscordZero
python DiscordZero.py
```


# Mechanism
DiscordZero uses the [`Discord.py`](https://github.com/Rapptz/discord.py) library to hook on to account notifications. Once a message has been received, a SMS is sent through the Hologram.io [Web API](https://hologram.io/docs/reference/cloud/http/#/reference/hologram-cloud/sms/send-sms-to-a-device) which is received in less than 10 seconds after being sent.

# Credits
DiscordZero was created by [@0xCoto](https://github.com/0xCoto) and [@samdenty99](https://github.com/samdenty99).
