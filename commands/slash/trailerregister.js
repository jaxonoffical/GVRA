const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Trailer = require('../../models/trailer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registertrailer')
    .setDescription('Register your trailer.')
    .addStringOption(option =>
      option.setName('trailer')
        .setDescription('Select your trailer')
        .setRequired(true)
        .addChoices(
          { name: "2024 Durable 12' x 6' Enclosed Box Trailer", value: "2024 Durable 12' x 6' Enclosed Box Trailer" },
          { name: "2024 Durable 12' x 6' Off-Road Trailer", value: "2024 Durable 12' x 6' Off-Road Trailer" },
          { name: "2024 Durable 16' X 8' Car Transporter", value: "2024 Durable 16' X 8' Car Transporter" },
          { name: "2024 Durable 16' x 6' Enclosed Box Trailer", value: "2024 Durable 16' x 6' Enclosed Box Trailer" },
          { name: "2024 Durable 16' x 8' Camper", value: "2024 Durable 16' x 8' Camper" },
          { name: "2024 Durable 20' x 8' Dual Axle Camper", value: "2024 Durable 20' x 8' Dual Axle Camper" },
          { name: "2024 Durable 4' x 6' Enclosed Box Trailer", value: "2024 Durable 4' x 6' Enclosed Box Trailer" },
          { name: "2024 Durable 6' x 8' Trailer", value: "2024 Durable 6' x 8' Trailer" },
          { name: "2024 Durable 8' x 24' Car Transporter", value: "2024 Durable 8' x 24' Car Transporter" }
        )
    )
    .addStringOption(option =>
      option.setName('number-plate')
        .setDescription('Trailer Number Plate')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const trailer = interaction.options.getString('trailer');
      const numberPlate = interaction.options.getString('number-plate');
      const userId = interaction.user.id;

      const member = await interaction.guild.members.fetch(userId);
      const roleLimit5 = '1345379393094291466';
      const roleLimit10 = ['1345379396151939092', '1345379394973073521'];

      let limit = 5;
      if (roleLimit10.some(role => member.roles.cache.has(role))) {
        limit = 10;
      } else if (member.roles.cache.has(roleLimit5)) {
        limit = 5;
      }

      // Check current registered trailers
      const trailerCount = await Trailer.countDocuments({ userId });
      if (trailerCount >= limit) {
        return interaction.editReply({
          content: `You have reached your trailer registration limit of ${limit}.`,
          ephemeral: true
        });
      }

      const newTrailer = new Trailer({
        userId,
        trailer,
        numberPlate
      });
      await newTrailer.save();

      const embed = new EmbedBuilder()
        .setDescription(`Your trailer has been successfully registered.`)
        .setColor(`#ab8ff6`);

      await interaction.editReply({
        embeds: [embed],
        ephemeral: false
      });
    } catch (error) {
      console.error('Error processing trailer registration:', error);
      if (!interaction.replied) {
        await interaction.editReply({
          content: 'An error occurred while processing your request. Please try again later.',
          ephemeral: true
        });
      }
    }
  },
};
