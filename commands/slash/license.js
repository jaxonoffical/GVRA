const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const License = require('../../models/license');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('license-status')
        .setDescription('Update the user\'s license status.')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Select the new license status.')
                .setRequired(true)
                .addChoices(
                    { name: 'Active', value: 'Active' },
                    { name: 'Suspended', value: 'Suspended' }
                )
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user whose license status will be updated.')
        ),

    async execute(interaction) {
        const requiredRoleId = '1362488710532436198';
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            const status = interaction.options.getString('status');
            const user = interaction.options.getUser('user') || interaction.user;
            const userId = user.id;

            let license = await License.findOne({ userId });
            if (!license) {
                license = new License({ userId, status });
            } else {
                license.status = status;
            }

            await license.save();

            const embed = new EmbedBuilder()
                .setTitle('License Status Updated')
                .setDescription(`License status for <@${userId}> has been updated to **${status}**.`)
                .setColor('#ab8ff6')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error updating license status:', error);
            await interaction.reply({ content: 'An error occurred while updating the license status.', ephemeral: true });
        }
    },
};
