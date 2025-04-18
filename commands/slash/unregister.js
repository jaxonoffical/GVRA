const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Vehicle = require('../../models/vehicle');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister')
        .setDescription('Unregister a vehicle.'),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const vehicles = await Vehicle.find({ userId });

            if (vehicles.length === 0) {
                return interaction.editReply({
                    content: 'You do not have any registered vehicles.',
                    ephemeral: true
                });
            }

            const options = vehicles.map(vehicle => ({
                label: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.numberPlate})`,
                value: vehicle._id.toString(),
            }));

            const menu = new StringSelectMenuBuilder()
                .setCustomId('unregister_vehicle')
                .setPlaceholder('Select a vehicle to unregister')
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(menu);

            await interaction.editReply({
                content: 'Select the vehicle you want to unregister:',
                components: [row],
                ephemeral: true
            });

        } catch (error) {
            console.error('Error fetching vehicles:', error);
            await interaction.editReply({
                content: 'An error occurred while processing your request. Please try again later.',
                ephemeral: true
            });
        }
    },
};
