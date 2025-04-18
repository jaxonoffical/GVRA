const { Events, EmbedBuilder } = require('discord.js');
const Trailer = require('../models/trailer');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'unregister_trailer') {
            await interaction.deferReply({ ephemeral: true });

            try {
                const selectedTrailerId = interaction.values[0];
                const userId = interaction.user.id;

                const trailerToRemove = await Trailer.findOne({ _id: selectedTrailerId, userId });

                if (!trailerToRemove) {
                    return interaction.editReply({
                        content: 'Invalid trailer selection or trailer not found.',
                        ephemeral: true
                    });
                }

                await Trailer.findByIdAndDelete(selectedTrailerId);

                const embed = new EmbedBuilder()
                    .setDescription(`**Your trailer has been successfully unregistered.**`)
                    .setColor(`#ab8ff6`);
                    
                await interaction.editReply({ embeds: [embed], ephemeral: false });

            } catch (error) {
                console.error('Error unregistering trailer:', error);
                await interaction.editReply({
                    content: 'An error occurred while processing your request. Please try again later.',
                    ephemeral: true
                });
            }
        }
    },
};
