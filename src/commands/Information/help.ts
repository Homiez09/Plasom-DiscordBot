import { Bot } from '../../index';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { readdirSync } from 'fs';

module.exports = {
    name: 'help',
    description: 'ช่วยเหลือ',
    forAdmin: false,
    run: async(interaction: CommandInteraction, client: Bot) => {
        const RED = 0xAD3E26;
        const BLUE = 0x0099ff;
        const GREEN = 0x7cdc62;

        let category: String[] = [];

        await interaction.deferReply();
        
        readdirSync('./src/commands').forEach((dir) => {
            category.push(dir);  
        });

        const embed = new EmbedBuilder()
        .setColor(GREEN)
        .setTitle('ช่วยเหลือ');

        category.forEach((ele: String) => {
            client.slash.forEach((cmd) => {
                embed.addFields({
                    name: cmd.name
                    value: cmd.description
                })

            })
        })
        
    }
}