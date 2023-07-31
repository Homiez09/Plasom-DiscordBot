import { readdirSync } from 'fs';
import { Bot } from '../index';

module.exports = (client: Bot) => {
    readdirSync(`./src/commands/`).forEach((dir) => {
        readdirSync(`./src/commands/${dir}/`)
          .filter((e) => e.endsWith('ts'))
          .forEach((file) => {
            const pull = require(`../../src/commands/${dir}/${file}`);
            client.slash.set(pull.name, pull);
          });
      });
    console.log('✅', 'Loaded all commands');
}