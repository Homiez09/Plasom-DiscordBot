import channelModel from '../../schemas/channelDB';
import voiceCollectModel from '../../schemas/voiceCollectDB';

import { Bot } from '../../index';
import { ChannelType, VoiceState } from 'discord.js';

import 'dotenv/config';

module.exports = async (client: Bot, oldState: VoiceState, newState: VoiceState) => {
  const user = await client.users.fetch(newState.id);
  const member = await newState.guild.members.fetch(user.id);
  const channelData = await channelModel.findOne({
    guild_ID: newState.guild.id,
  }) as { voice_ID: string };

  try {
    if (!oldState.channel && newState.channel?.id === channelData.voice_ID) {
      const channel = await newState.guild.channels.create({
        name: `${user.username}'s Channel`,
        type: ChannelType.GuildVoice,
        parent: newState.channel?.parent!,
      });
      channel.permissionOverwrites.create(user.id, {
        ManageChannels: true,
        MuteMembers: true,
        DeafenMembers: true,
        MoveMembers: true,
      });

      member.voice.setChannel(channel);

      await voiceCollectModel.create({
        user_ID: user.id,
        channel_ID: channel.id,
      });
    } else if (!newState.channel) {
      try {
        let voiceCollect;
        voiceCollect = await voiceCollectModel.findOne({
          channel_ID: oldState.channel!.id,
        });
        if (!voiceCollect) return;
        if (voiceCollect)
          if (oldState.channel!.id === voiceCollect.channel_ID) {
            if (oldState.channel!.members.size < 1) {
              oldState.channel!.delete();
              return await voiceCollectModel.deleteOne({
                channel_ID: oldState.channel!.id,
              });
            }
          }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
