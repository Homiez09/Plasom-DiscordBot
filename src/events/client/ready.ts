import { ActivityType, BaseFetchOptions, UserResolvable } from 'discord.js'
import { Bot } from '../../index';
import 'dotenv/config'

module.exports = async (client: Bot) => {
    console.log(client.user!.tag + ' is online!');
  
    client.users.fetch(process.env.OWNER_ID as UserResolvable, false as unknown as BaseFetchOptions).then((user) => {
      user.send(String(new Date()).split(' ', 5).join(' '));
    });
  
    let i = 0;
    setInterval(() => {
      if (i > 2) i = 0;
  
      let Act = [
        `${client.guilds.cache.map((guild) => guild.memberCount).reduce((a, b) => a + b, 0)} users`,
        `${client.guilds.cache.size} servers`,
        '/setup',
      ];
  
      client.user!.setPresence({
        activities: [
            {
                name: Act[i],
                type: ActivityType.Watching,
            },
        ],
        status: 'online',
      });
  
      i++;
    }, 5000);
  };
  