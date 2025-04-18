const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Displays the member count of the server'),
  async execute(interaction) {
    const memberCount = interaction.guild.memberCount;
    const embed = new EmbedBuilder()
      .setColor('#ab8ff6')
      .setTitle('Member Count')
      .setDescription(`There are ${memberCount} members in this server.`);
    await interaction.reply({ embeds: [embed] });
  }
};