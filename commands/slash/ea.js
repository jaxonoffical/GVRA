const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('earlyaccess')
    .setDescription('Grant early access to a user with a link')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('The link for early access')
        .setRequired(true)),
  
  async execute(interaction) {
    try {
      const staffRoleId = '1362487987815846040';
      const earlyAccessRoleIds = [
        '1362488710532436198',
        '1362487987815846040',
        '1362488623978643688',
        '1362489676409081876',
        '1362488397909856441',
      ];

      if (!interaction.member.roles.cache.has(staffRoleId)) {
        const noPermissionEmbed = new EmbedBuilder()
          .setDescription('You do not have permission to execute this command.')
          .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
          .setColor('#ab8ff6');
        return await interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
      }

      const successEmbed = new EmbedBuilder()
        .setDescription('Early access has been successfully released!')
        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
.setColor('#ab8ff6');
      await interaction.reply({ embeds: [successEmbed], ephemeral: true });

      const link = interaction.options.getString('link');

      const embed = new EmbedBuilder()
        .setTitle(`Early Access`)
        .setDescription(`
> Early Access has now been released. Nitro Boosters, Emergency Services & Content Creators may start joining now by clicking the button below! It's important to note that leaking the Session Link is strictly prohibited and can result in a severe punishment.

> Please wait at least 5 minutes for the host to release the session link.`)
.setImage("https://i.postimg.cc/h4HTVCdB/GVRA-Early-Access.png")
.setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
.setColor('#ab8ff6');

      const button = new ButtonBuilder()
        .setLabel('Early Access Link')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('early_access_link');

      const row = new ActionRowBuilder().addComponents(button);

      const message = await interaction.channel.send({
        embeds: [embed],
        content: '<@&1362488623978643688>, <@&1362489676409081876>',
        components: [row]
      });

      const logChannelId = '1362500753352294614';
      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('Command Executed')
          .setDescription('Command was executed. Information provided below.')
          .addFields(
            { name: 'User', value: `${interaction.user}`, inline: true },
            { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true },
            { name: 'Link Provided', value: `${link}`, inline: false }
          )
          .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
          .setColor('#ab8ff6');
        await logChannel.send({ embeds: [logEmbed] });
      }

      const filter = i => i.customId === 'early_access_link' && i.isButton();
      const collector = message.createMessageComponentCollector({ filter });

      collector.on('collect', async i => {
        const hasPermission = earlyAccessRoleIds.some(roleId => i.member.roles.cache.has(roleId));

        if (!hasPermission) {
          const denyEmbed = new EmbedBuilder()
            .setDescription('You do not have permission to access this link!')
            .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
            .setColor('#ab8ff6');
          await i.reply({ embeds: [denyEmbed], ephemeral: true });
        } else {
          const linkEmbed = new EmbedBuilder()
            .setDescription(`Leaking this [link](${link}) would result in a infraction.`)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
.setColor('#ab8ff6');
          await i.reply({ embeds: [linkEmbed], ephemeral: true });
        }
      });
    } catch (error) {
      console.error('Error executing command:', error);
      if (!interaction.replied) {
        const errorEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('There was an error while executing this command!')
          .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
          .setColor('#ab8ff6');
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  }
};