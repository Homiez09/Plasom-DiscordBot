import { AttachmentBuilder, Message } from 'discord.js';
import { Bot } from '../../index';
import axios from 'axios';
import FormData from 'form-data';
import channelModel from '../../schemas/channelDB';
import rankModel from '../../schemas/rankDB';
import 'dotenv/config'


module.exports = async (client: Bot, msg: Message) => {
  if (msg.content == '!totalguilds') {
    const guilds = client.guilds.cache.map((guild) => guild.name).join('\n');
    msg.author.send(guilds);
  }

  if (!msg.author.bot) {
    await getExp(client, msg);
    await removeBackground(client, msg);
  }
};

const getExp = async (client: Bot, msg: Message) => {
  let lengthMsg = msg.content.length;
  let xpGet = Math.floor(Math.random() * (lengthMsg / 2)) + 1;
  console.log(msg.author.id + ' Got ' + xpGet + ' xp ');
  if (lengthMsg >= 2)
    try {
      let rankData = await rankModel.findOneAndUpdate(
        {
          userID: msg.author.id,
        },
        {
          $inc: { exp: xpGet },
        },
      );
      if (!rankData) {
        rankData = await rankModel.create({
          userID: msg.author.id,
        });
        //await msg.channel.send({

        await msg.author.send({
          content: `${msg.author} เริ่มต้นที่เลเวล 0`,
          embeds: [],
        });
      }

      let lvl = rankData.rank;
      let xpNow = rankData.exp + xpGet;
      let xpNext = 5 * lvl ** 2 + 50 * lvl + 100;

      //When lvl up
      if (xpNext - xpNow <= 0) {
        rankData = await rankModel.findOneAndUpdate(
          {
            userID: msg.author.id,
          },
          {
            $inc: {
              rank: 1,
              exp: -xpNext,
              totalExp: xpNext,
            },
          },
        );
        //await msg.channel.send({
        await msg.author.send({
          content: eval(`${msg.author} เพิ่มระดับเป็นเลเวล ${lvl + 1}`),
        });
      }
    } catch (error) {
      console.log(error);
    }
};

const removeBackground = async (client: Bot, msg: Message) => {
  try {
    let channelData;
    channelData = await channelModel.findOne({
      guild_ID: msg.guild?.id,
    });
 
    const input_image = channelData!.remove_ID;
    const getMember: any = msg.guild?.members
    const bot_id = getMember.cache.get(client.user!.id).id;
    if (msg.channel.id == input_image && msg.author.id != bot_id) {
      msg.attachments.forEach((attachment) => {
        const ImageLink = attachment.proxyURL;
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_url', ImageLink);
        axios({
          method: "post",
          url: 'https://api.remove.bg/v1.0/removebg',
          data: formData,
          responseType: 'arraybuffer',
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': process.env.RMBG_API!,
          },
        })
          .then((response) => {
            if (response.status != 200) console.error('Error:', response.status, response.statusText);
            let attachment1 = new AttachmentBuilder(response.data);
            msg.reply({
              content: `<@${msg.author.id}> ลบพื้นหลังเรียบร้อย`,
              files: [attachment1],
            });
          })
          .catch((error) => {
            if (error.response.status == 402) {
              msg.reply(`CODE:${error.response.status} ไม่มีเครดิตเหลืออยู่`);
            } else if (error.response.status == 400) {
              msg.reply(`CODE:${error.response.status} อัพโหลดไฟล์ไม่ถูกต้อง`);
            } else if ( error.response.status == 401) {
              msg.reply(`CODE:${error.response.status} ไม่พบ Api Key`);
            }
            console.error('Request failed:', error);
          });
      });
    }
  } catch (error) {
    console.log(error);
  }
};