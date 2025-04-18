const { EmbedBuilder } = require('discord.js');
const Vehicle = require('../models/vehicle');
const Trailer = require('../models/trailer');
const Ticket = require('../models/tickets');
const Warrant = require('../models/warrant');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const userId = interaction.customId.split('_')[2];

    // Handle view vehicles interaction
    if (interaction.customId.startsWith('view_vehicles_')) {
      try {
        const vehicles = await Vehicle.find({ userId });
        const vehicleList = vehicles.length > 0
          ? vehicles.map(vehicle => 
              `**${vehicle.vehicle} (${vehicle.numberPlate})** - Color: ${vehicle.color}`).join('\n\n')
          : `*No vehicles found for <@${userId}>.*`;

        const trailers = await Trailer.find({ userId });
        const trailerList = trailers.length > 0
          ? trailers.map(trailer => 
              `**${trailer.trailer} (${trailer.numberPlate})**`).join('\n\n') 
          : `*No trailers found for <@${userId}>.*`;

        const vehicleEmbed = new EmbedBuilder()
          .setTitle(`Registered Assets`)
          .setDescription(`**Vehicles:**
${vehicleList}
          
**Trailers:**
${trailerList}`)
          .setColor(`#ab8ff6`)
          .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

        await interaction.reply({ embeds: [vehicleEmbed], ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error fetching the vehicles. Please try again later.',
          ephemeral: true
        });
      }
    }

    // Handle view tickets interaction
    if (interaction.customId.startsWith('view_tickets_')) {
      try {
        const tickets = await Ticket.find({ userId });
        const ticketList = tickets.length > 0
          ? tickets.map(ticket => 
              `Offense: ${ticket.offense}\nPrice: ${ticket.price}\nCount: ${ticket.count}\nUnit: <@${ticket.officerid}>`).join('\n\n')
          : `*No tickets found for <@${userId}>.*`;

        const warrants = await Warrant.find({ userId });
        const warrantlist = warrants.length > 0
          ? warrants.map(warrant => 
              `Offense: ${warrant.reason}\nCount: ${warrant.count}\nUnit: <@${warrant.officerid}>`).join('\n\n')
          : `*No warrants found for <@${userId}>.*`;

        const ticketEmbed = new EmbedBuilder()
          .setTitle(`Public Service Records`)
          .setDescription(`**Tickets:**
${ticketList}

**Active Warrants:**
${warrantlist}`)
          .setColor(`#ab8ff6`)
          .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

        await interaction.reply({ embeds: [ticketEmbed], ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error fetching the tickets or license status. Please try again later.',
          ephemeral: true
        });
      }
    }
  }
};
