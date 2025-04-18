const { Events, EmbedBuilder } = require('discord.js');
const Vehicle = require('../models/vehicle');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'unregister_vehicle') {
            await interaction.deferReply({ ephemeral: true });

            try {
                const selectedVehicleId = interaction.values[0];
                const userId = interaction.user.id;

                const vehicleToRemove = await Vehicle.findOne({ _id: selectedVehicleId, userId });

                if (!vehicleToRemove) {
                    return interaction.editReply({
                        content: 'Invalid vehicle selection or vehicle not found.',
                        ephemeral: true
                    });
                }

                await Vehicle.findByIdAndDelete(selectedVehicleId);

                const embed = new EmbedBuilder()
                    .setDescription(`Your vehicle has been successfully unregistered.`)
                    .setColor(`#ab8ff6`);

                await interaction.editReply({ embeds: [embed], ephemeral: false });

            } catch (error) {
                console.error('Error unregistering vehicle:', error);
                await interaction.editReply({
                    content: 'An error occurred while processing your request. Please try again later.',
                    ephemeral: true
                });
            }
        }
    },
};
