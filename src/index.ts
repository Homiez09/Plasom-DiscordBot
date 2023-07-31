import { Client, Collection, IntentsBitField, Partials, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import 'dotenv/config'

export class Bot extends Client {
  slash: Collection<string, any> = new Collection();

  constructor() {
    super({
      shards: 'auto',
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
      ],
      partials: [Partials.Message, Partials.Reaction],
    });
  }
}

const client = new Bot();

readdirSync('./src/handlers/').forEach((dir) => {
  const fileName = dir.split('.')[0];
  require(`./handlers/${fileName}`)(client);
});

void (async () => {
  const TOKEN = process.env.DISCORD_TOKEN || ``;

  if (TOKEN) {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || ''), { body: client.slash });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.log(error);
    }
    await client.login(TOKEN);
  } else {
    console.log(`Can't found bot token :C`);

    process.exit(1);
  }
})();

/* process.on('unhandledRejection', (reason, p) => {
  console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err, origin);
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log(type, promise, reason);
}); */