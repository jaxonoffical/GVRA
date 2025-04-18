const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Warrant = require('../../models/warrant');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removewarrant')
    .setDescription('Remove a warrant')
    .addUserOption(option => option.setName('user').setDescription('The user to remove the warrant for').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has('1362488710532436198') && !interaction.member.roles.cache.has('1362488710532436198')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const userId = interaction.options.getUser('user').id;

    try {
      const warrant = await Warrant.findOne({ userId });
      if (!warrant) {
        return interaction.reply({ content: `No warrant found for <@${userId}>.`, ephemeral: true });
      }

      await Warrant.deleteOne({ userId });

      const logChannel = await interaction.guild.channels.fetch('1362500753352294614');
      const embed = new EmbedBuilder()
        .setTitle('Warrant Removed')
        .setDescription(`The warrant for <@${userId}> has been removed.`)
        .addFields(
          { name: 'Issued By', value: `<@${warrant.officerid}>` },
          { name: 'Reason', value: warrant.reason },
          { name: 'Offenses', value: warrant.count.toString() }
        )
        .setColor('#ab8ff6')
        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

      await logChannel.send({ embeds: [embed] });
      await interaction.reply({ content: `Warrant removed for <@${userId}>.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error removing the warrant. Please try again later.', ephemeral: true });
    }
  }
};
