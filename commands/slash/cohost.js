const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cohost')
        .setDescription('Sends a cohost message'),
        
    async execute(interaction) {
        const requiredRoleId = '1362487987815846040';
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: false });
        
        const guild = interaction.guild;  // Correctly reference the guild here
        const embed = new EmbedBuilder()
            .setDescription(`<@${interaction.user.id}> is cohosting the session!`)
            .setFooter({ text: `${guild.name}`, iconURL: `${guild.iconURL()}` })
            .setColor(`#ab8ff6`);

        await interaction.editReply({ embeds: [embed], ephemeral: false });
    }
};
