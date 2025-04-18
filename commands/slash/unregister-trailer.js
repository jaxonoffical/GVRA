const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Trailer = require('../../models/trailer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister-trailer')
        .setDescription('Unregister a trailer.'),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const trailers = await Trailer.find({ userId });

            if (trailers.length === 0) {
                return interaction.editReply({
                    content: 'You do not have any registered trailers.',
                    ephemeral: true
                });
            }

            const options = trailers.map(trailer => {
                // Construct the label
                let label = `${trailer.trailer} (${trailer.numberPlate})`;

                // Ensure the label length is within the 100 character limit
                if (label.length > 100) {
                    label = label.slice(0, 97) + '...'; // Truncate and add ellipsis
                }

                return {
                    label,
                    value: trailer._id.toString(),
                };
            });

            const menu = new StringSelectMenuBuilder()
                .setCustomId('unregister_trailer')
                .setPlaceholder('Select a trailer to unregister')
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(menu);

            await interaction.editReply({
                content: 'Select the trailer you want to unregister:',
                components: [row],
                ephemeral: true
            });

        } catch (error) {
            console.error('Error fetching trailers:', error);
            await interaction.editReply({
                content: 'An error occurred while processing your request. Please try again later.',
                ephemeral: true
            });
        }
    },
};
