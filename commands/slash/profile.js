const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Vehicle = require('../../models/vehicle');
const Ticket = require('../../models/tickets');
const License = require('../../models/license');
const trailer = require('../../models/trailer');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rpprofile')
    .setDescription('Displays the roleplay profile of a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select a user to view their profile. If not selected, shows your profile.')
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: false });

      const selectedUser = interaction.options.getUser('user') || interaction.user;
      if (!selectedUser || !selectedUser.username) {
        return interaction.reply({ content: 'Invalid user selected.', ephemeral: true });
      }

      const apikey = "45ab9213-1f35-46b0-8d68-b02b82ba35ef";
      const userId = selectedUser.id;
      const guild = interaction.guild;
      const license = await License.findOne({ userId }).catch(() => null);
      const licenseStatus = license?.status || 'Active';
      const vehicleCount = await Vehicle.countDocuments({ userId }).catch(() => 0);
      const trailerCount = await trailer.countDocuments({ userId }).catch(() => 0);

      const bloxlinkUrl = `https://api.blox.link/v4/public/guilds/${guild.id}/discord-to-roblox/${userId}`;
      const bloxlinkResponse = await axios.get(bloxlinkUrl, {
        headers: {
          'Authorization': apikey
        }
      }).catch(() => null);

      let robloxID, robloxUsername, robloxProfileLink, robloxThumbnail;

      if (bloxlinkResponse && bloxlinkResponse.status === 200 && bloxlinkResponse.data.robloxID) {
        robloxID = bloxlinkResponse.data.robloxID;
        robloxProfileLink = `https://www.roblox.com/users/${robloxID}/profile`;
      }

      if (robloxID) {
        const [robloxResponse, headshotResponse] = await Promise.all([
          axios.get(`https://users.roblox.com/v1/users/${robloxID}`).catch(() => null),
          axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxID}&size=150x150&format=Png`).catch(() => null),
        ]);

        if (robloxResponse?.status === 200) robloxUsername = robloxResponse.data.name;
        if (headshotResponse?.status === 200 && headshotResponse.data.data.length > 0) {
          robloxThumbnail = headshotResponse.data.data[0].imageUrl;
        }
      }
      

      const profileEmbed = new EmbedBuilder()
        .setTitle('<:image28:1362499511276015777> Roleplay Profile <:image28:1362499511276015777>')
        .setDescription(`All information about the user's profile is contained in this message.

<:arrow14:1362495164740010234> **Roblox Username:** ${robloxUsername || 'N/A'}
<:arrow14:1362495164740010234> **Registred Vehicles:** ${vehicleCount} Vehicle(s)
<:arrow14:1362495164740010234> **Registered Trailers:** ${trailerCount} Trailer(s)

**License Status:**
<:arrow14:1362495164740010234> ${licenseStatus}`)
        .setThumbnail(robloxThumbnail || selectedUser.displayAvatarURL({ dynamic: true }) || '')
        .setColor(`#ab8ff6`)
        .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) || '' });

      const buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`view_vehicles_${userId}`)
            .setLabel('Registered Assets')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`view_tickets_${userId}`)
            .setLabel('Public Service Records')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`view_balance_${userId}`)
            .setLabel('Account Balance')
            .setStyle(ButtonStyle.Secondary),
        );

      await interaction.editReply({ embeds: [profileEmbed], components: [buttons] });

    } catch (error) {
      console.error('Error executing rpprofile command:', error);
      await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
  },
};
