const { EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const userId = interaction.customId.split('_')[2];

    if (interaction.customId.startsWith('view_balance_')) {
      try {
        const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzYyNTAyNDAyNTEwNTU0NDk2IiwiaWF0IjoxNzQ0OTE2Mjg2fQ.IMyPLKjCNEQWkEg4erBee-k_utYEmwq3Mx4Oi8w02E0');
        const guildID = interaction.guild.id;

        const userBalance = await unbClient.getUserBalance(guildID, userId);

        const balanceEmbed = new EmbedBuilder()
          .setTitle('Account Balance')
          .setDescription(
            `💰 **Balance for <@${userId}>**:\n**Cash**: ${userBalance.cash}\n**Bank**: ${userBalance.bank}`
          )
          .setColor("#ab8ff6")  
          .setFooter({ text: `${interaction.guild.name}`,
            iconURL:  `${interaction.guild.iconURL()}` });
        await interaction.reply({ embeds: [balanceEmbed], ephemeral: true });
      } catch (error) {
        console.error('Error fetching balance:', error);
        await interaction.reply({
          content: 'Failed to fetch balance. Please try again later.',
          ephemeral: true,
        });
      }
    }
  },
};
