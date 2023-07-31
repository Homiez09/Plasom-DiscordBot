import { EmbedBuilder, CommandInteraction, SelectMenuInteraction } from 'discord.js';
import { Bot } from '../../index';

module.exports = async (client: Bot, interaction: CommandInteraction | SelectMenuInteraction | any) => {
    const RED = 0xAD3E26;
    const BLUE = 0x0099ff;
    const GREEN = 0x7cdc62;
    if (interaction.isCommand()) {
        if (!client.slash.has(interaction.commandName)) return;
        if (!interaction.guild) return;
        const command = client.slash.get(interaction.commandName);

        try {
            if (command.userPerms) {
                if (!interaction.member.permissions.has(command.userPerms)) {
                    const embed = new EmbedBuilder()
                        .setColor(RED)
                        .setTitle("ปฎิเสธการใช้งาน")
                        .setDescription("คุณไม่มีสิทธิ์ในการใช้งานคำสั่งนี้!")
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL(),
                        });

                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }

            if (command.botPerms) {
                if (!interaction.guild.me.permissions.has(command.botPerms)) {
                    const embed = new EmbedBuilder()
                        .setColor(RED)
                        .setTitle("ปฎิเสธการใช้งาน")
                        .setDescription(`ฉันต้องการสิทธิ์ ${command.botPerms}!`)
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL(),
                        });

                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }

            command.run(interaction, client);
        } catch (e) {
            console.log(e);
            await interaction.reply({
                content: 'Something went wrong!',
                ephemeral: true,
            });
        }
    }


    if (interaction.isStringSelectMenu()) {
        if (interaction.customId !== 'member') return;

        let role_ID = interaction.values[0];
        const role = interaction.guild!.roles.cache.get(role_ID);
        const embed = new EmbedBuilder()
            .setColor(0x6AA84F)
            .setTitle("ยืนยันตัวตนสำเร็จแล้ว")
            .setDescription(`✅ ยืนยันตัวตนสำเร็จแล้ว. ยินดีตอนรับเข้าสู่ ${interaction.guild!.name}!`);
        const embed2 = new EmbedBuilder()
            .setColor(0x6AA84F)
            .setTitle("ก่อนหน้านี้ คุณได้ทำการยืนยันตัวตนไปแล้ว")

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member!.roles.cache.has(role_ID)) {
            await interaction.member!.roles.add(role);
            interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
            interaction.followUp({ embeds: [embed2], ephemeral: true });
        }
    }
}
