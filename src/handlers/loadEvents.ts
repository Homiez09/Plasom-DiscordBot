import { readdirSync } from 'fs';
import { Bot } from '../index';

module.exports = (client : Bot) => {
    readdirSync('./src/events').forEach((dir) => {
        readdirSync(`./src/events/${dir}`).filter((e) => e.endsWith('.ts')).forEach((file) => {
            const event = require(`../../src/events/${dir}/${file}`);
            const eventName = file.split('.')[0];
            client.on(eventName, event.bind(null, client))
            console.log('✅', `Loaded event '${eventName}'`)
        });
    });
    console.log('✅', 'Loaded all events');
}