const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Vehicle = require('../../models/vehicle');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register your vehicle.')
    .addStringOption(option =>
      option.setName('vehicle')
        .setDescription('Select your vehicle')
        .setAutocomplete(true) // Enable autocomplete for this option
        .setRequired(true))
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Vehicle Color')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('number-plate')
        .setDescription('Vehicle Number Plate')
        .setRequired(true)),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const vehicle = interaction.options.getString('vehicle');
      const color = interaction.options.getString('color');
      const numberPlate = interaction.options.getString('number-plate');
      const userId = interaction.user.id;

      const member = await interaction.guild.members.fetch(userId);
      const roleLimit5 = '1355437492966391960';
      const roleLimit10 = ['1356155141589569637'];

      let limit = 5;
      if (roleLimit10.some(role => member.roles.cache.has(role))) {
        limit = 10;
      } else if (member.roles.cache.has(roleLimit5)) {
        limit = 5;
      }

      const vehicleCount = await Vehicle.countDocuments({ userId });
      if (vehicleCount >= limit) {
        return interaction.editReply({
          content: `You have reached your vehicle registration limit of ${limit}.`,
          ephemeral: true
        });
      }

      const newVehicle = new Vehicle({
        userId,
        vehicle,  // Add selected vehicle data
        color,
        numberPlate
      });
      await newVehicle.save();

      const embed = new EmbedBuilder()
        .setDescription(`Your vehicle has been successfully registered.`)
        .setColor(`#ab8ff6`);

      await interaction.editReply({
        embeds: [embed],
        ephemeral: false
      });
    } catch (error) {
      console.error('Error processing vehicle registration:', error);
      if (!interaction.replied) {
        await interaction.editReply({
          content: 'An error occurred while processing your request. Please try again later.',
          ephemeral: true
        });
      }
    }
  },
};
