const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Warrant = require('../../models/warrant');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warrant')
    .setDescription('Issue a warrant')
    .addUserOption(option => option.setName('user').setDescription('The user to issue a warrant for').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the warrant').setRequired(true))
    .addIntegerOption(option => option.setName('count').setDescription('Offense count').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has('1362488710532436198') && !interaction.member.roles.cache.has('1362488710532436198')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const userId = interaction.options.getUser('user').id;
    const officerid = interaction.user.id;
    const reason = interaction.options.getString('reason');
    const count = interaction.options.getInteger('count');
    const time = Date.now();

    try {
      const warrant = new Warrant({ userId, officerid, reason, time, count });
      await warrant.save();

      const logChannel = await interaction.guild.channels.fetch('1362500753352294614');
      const embed = new EmbedBuilder()
        .setTitle('Warrant Issued')
        .setDescription(`A warrant has been issued for <@${userId}>.`)
        .addFields(
          { name: 'Reason', value: reason },
          { name: 'Offenses', value: count.toString() },
          { name: 'Removed By', value: `<@${officerid}>` }
        )
        .setColor('#ab8ff6')
        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

      await logChannel.send({ embeds: [embed] });
      await interaction.reply({ content: `Warrant issued for <@${userId}>.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error issuing the warrant. Please try again later.', ephemeral: true });
    }
  }
};
