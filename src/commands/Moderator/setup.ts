import { 
    ActionRowBuilder,
    AttachmentBuilder, 
    CacheType, 
    ChannelType, 
    CommandInteraction, 
    EmbedBuilder, 
    GuildBasedChannel, 
    Role, 
    StringSelectMenuBuilder, 
    TextChannel, 
    VoiceChannel,
} from "discord.js";

import { Bot } from '../../index'

import channelModel from "../../schemas/channelDB";

module.exports = {
    name: 'setup',
    description: 'ตั้งค่าความปลอดภัย',
    forAdmin: true,
    options: [
        {
            name: 'auth',
            description: 'set server auth.',
            type: 1,
            options: [
                {
                    name: 'options',
                    description: 'confirm?',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'about',
                            value: 'about',
                        },
                        {
                            name: 'confirm',
                            value: 'confirm',
                        },
                    ],
                },
            ],
        },
        {
            name: 'create-voice',
            description: 'Join to create voice channel.',
            type: 1,
            options: [
                {
                    name: 'options',
                    description: 'confirm?',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'about',
                            value: 'about',
                        },
                        {
                            name: 'confirm',
                            value: 'confirm',
                        },
                    ],
                },
            ],
        },
        {
            name: 'remove-background',
            description: 'Remove background.',
            type: 1,
            options: [
                {
                    name: 'options',
                    description: 'confirm?',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'about',
                            value: 'about',
                        },
                        {
                            name: 'confirm',
                            value: 'confirm',
                        },
                    ],
                },
            ],
        },
    ],
    run: async (interaction: CommandInteraction<CacheType>, client: Bot) => {
        const { options } = interaction as any;
        const Sub = options.getSubcommand();
        const RED = 0xAD3E26;
        const BLUE = 0x0099ff;
        const GREEN = 0x7cdc62;

        switch (Sub) {
            case 'remove-background':
                {
                    const choice = options.getString('options');

                    switch (choice) {
                        case 'about':
                            {
                                const embed = await new EmbedBuilder()
                                    .setColor(RED)
                                    .setTitle("เกี่ยวกับ")
                                    .setDescription(
                                        `ระบบจะสร้างแชแนลขี้นมา(สามารถเปลี่ยนชื่อแชแนลได้) เมื่อส่งรูปจะทำการลบพื้นหลังให้ (จำนวนจำกัด)\nใช้คำสั่ง /setup remove-background confirm เพื่อติดตั้งได้เลย`
                                    )
                                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                                
                                const attachment = new AttachmentBuilder(
                                    './src/assets/images/about.rebg.png',
                                );
                                interaction.reply({ files: [attachment], embeds: [embed] });
                            }
                            break;
                        case 'confirm':
                            {
                                let channelData;
                                await interaction.deferReply();

                                try {
                                    channelData = await channelModel.findOne({
                                        guild_ID: interaction.guild?.id,
                                    });

                                    if (!channelData) {
                                        channelData = await channelModel.create({
                                            guild_ID: interaction.guild?.id,
                                        });
                                    }
                                } catch (e) {
                                    console.log(e);
                                }

                                const category = await interaction.guild?.channels.create({
                                    name: "rebg by " + client.user?.tag,
                                    type: ChannelType.GuildCategory,
                                });

                                const channel = await interaction.guild?.channels.create({
                                    name: "removebg",
                                    type: ChannelType.GuildText,
                                    parent: category,
                                }) as TextChannel;

                                channelData = await channelModel.findOneAndUpdate(
                                    { guild_ID: interaction.guild?.id },
                                    { remove_ID: channel?.id },
                                );

                                await interaction.editReply({
                                    embeds: [
                                        await new EmbedBuilder()
                                            .setTitle("ติดตั้งแล้ว")
                                            .addFields({
                                                name: 'Remove Background',
                                                value: `ใช้งานได้ที่ <#${channel.id}>`
                                            })
                                            .setColor(BLUE)
                                            .setFooter({
                                                text: `Requested by ${interaction.user.tag}`,
                                                iconURL: interaction.user.displayAvatarURL(),
                                            }),
                                    ],
                                });
                            }
                            break;
                    }
                }
                break;
            case 'create-voice':
                {
                    const choice = options.getString('options');

                    switch (choice) {
                        case 'about':
                            {
                                const embed = await new EmbedBuilder()
                                    .setColor(RED)
                                    .setTitle("เกี่ยวกับ")
                                    .setDescription(
                                        `ระบบจะสร้างแชแนวเสียงขึ้นมา(สามารถเปลี่ยนชื่อแชแนวได้) พอกดแล้วจะทำการสร้างแชแนวส่วนตัว\nใช้คำสั่ง /setup create-voice confirm เพื่อติดตั้งได้เลย`
                                    )
                                    .setFooter({
                                        text: `Requested by ${interaction.user.tag}`,
                                        iconURL: interaction.user.displayAvatarURL(),
                                    });
                                const attachment = new AttachmentBuilder(
                                    './src/assets/images/about.voice.png',
                                );
                                interaction.reply({ files: [attachment], embeds: [embed] });
                            }
                            break;
                        case 'confirm':
                            {
                                await interaction.deferReply();
                                let channelData;
                                try {
                                    channelData = await channelModel.findOne({
                                        guild_ID: interaction.guild?.id,
                                    });
                                    if (!channelData) {
                                        channelData = await channelModel.create({
                                            guild_ID: interaction.guild?.id,
                                        });
                                    }
                                } catch (e) {
                                    console.log(e);
                                }

                                const category = await interaction.guild?.channels.create({
                                    name: "voice by " + client.user!.tag,
                                    type: ChannelType.GuildCategory,     
                                });
                                
                                const channel = await interaction.guild?.channels.create({
                                    name: "Join To Create",
                                    type: ChannelType.GuildVoice,
                                    parent: category
                                }) as VoiceChannel;

                                channelData = await channelModel.findOneAndUpdate(
                                    { guild_ID: interaction.guild?.id },
                                    { voice_ID: channel?.id },
                                );
                                await interaction.editReply({
                                    embeds: [
                                        await new EmbedBuilder()
                                            .setTitle(
                                                "ติดตั้งแล้ว",
                                            )
                                            .addFields({
                                                name: 'create-voice',
                                                value: `คลิก <#${channel.id}> เพื่อสร้างแชแนวเสียงของตัวเอง`
                                            })
                                    ],
                                });
                            }
                            break;
                    }
                }
                break;
            case 'auth':
                {
                    const choice = options.getString('options');
                    const everyoneRole = interaction.guild?.roles.everyone as any;

                    switch (choice) {
                        case 'confirm':
                            {
                                await interaction.deferReply();

                                const role = await interaction.guild?.roles.create({
                                    name: 'verify',
                                    color: GREEN,
                                }) as Role;

                                interaction.guild?.channels.cache.forEach((channel : GuildBasedChannel) => {
                                    /* channel.permissionOverwrites.edit(everyoneRole, {
                                        ViewChannel: false,
                                    }) as any;    */   
                                    channel.permissionsFor(everyoneRole).remove("ViewChannel");                  
                                });

                                interaction.guild?.channels.cache.forEach((channel: GuildBasedChannel) => {
                                    /* channel.permissionOverwrites.edit(role, {
                                        ViewChannel: true,
                                    }); */
                                    channel.permissionsFor(role).add("ViewChannel");
                                });

                                const channel= await interaction.guild?.channels.create({
                                    name: "auth",
                                    type: ChannelType.GuildText
                                }) as TextChannel;

                                channel.permissionsFor(role).remove("ViewChannel");
                                /* channel.permissionOverwrites.edit(role, {
                                    ViewChannel: false,
                                }); */

                                interaction.editReply({
                                    embeds: [
                                        await new EmbedBuilder()
                                            .setTitle("สำเร็จแล้ว")
                                            .addFields({
                                                name: 'Auth',
                                                value: `สามารถยืนยันตัวตนได้ที่ <#${channel.id}>`,
                                            })
                                            .setColor(BLUE)
                                            .setFooter({
                                                text: `Requested by ${interaction.user.tag}`,
                                                iconURL: interaction.user.displayAvatarURL(),
                                            }),
                                    ],
                                });

                                const row = new ActionRowBuilder().addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId('member')
                                        .setMaxValues(1)
                                        .setPlaceholder('เลือกเมนู')
                                        .addOptions([
                                            {
                                                label: '🔐| Verify',
                                                description: 'กดที่นี่เพื่อยื่นยันตัวตน',
                                                value: role.id,
                                            },
                                        ]),
                                ) as any;

                                const embed = new EmbedBuilder()
                                    .setTitle("ยืนยันตัวตน")
                                    .setDescription(`ยินดีต้อนรับเข้าสู่ ${interaction.guild!.name}! 🎈\nเลือกเมนูข้างล่างเพื่อยืนยันตัวตน 🔐`)
                                    .setColor(GREEN);

                                await channel.send({
                                    embeds: [embed],
                                    components: [row],
                                });

                                let channelData;
                                try {
                                    channelData = await channelModel.findOne({
                                        guild_ID: interaction.guild?.id,
                                    });
                                    if (!channelData) {
                                        channelData = await channelModel.create({
                                            guild_ID: interaction.guild?.id,
                                        });
                                    }
                                } catch (err) {
                                    console.log(err);
                                }

                                // Add to database
                                channelData = await channelModel.findOneAndUpdate(
                                    { guild_ID: interaction.guild?.id },
                                    {
                                        auth_role_ID: role.id,
                                    },
                                );
                            }
                            break;
                        case 'about':
                            {
                                const embed = await new EmbedBuilder()
                                    .setColor(RED)
                                    .setTitle("เกี่ยวกับ")
                                    .setDescription(`ระบบจะสร้าง role verify ขึ้นมา และสร้างแชแนวสำหรับการยืนยันตัวตน(เปลี่ยนชื่อแชแนวได้)\nใช้คำสั่ง /setup auth confirm เพื่อติดตั้งได้เลย`)
                                    .setFooter({
                                        text: `Requested by ${interaction.user.tag}`,
                                        iconURL: interaction.user.displayAvatarURL(),
                                    });
                                const attachment = new AttachmentBuilder(
                                    './src/assets/images/about.auth.png',
                                );
                                interaction.reply({ files: [attachment], embeds: [embed] });
                            }
                            break;
                    }
                }
                break;
        }
    },
};