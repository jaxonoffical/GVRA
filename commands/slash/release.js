const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");

const gameID = "891852901";
let sessionMessage;
let previousPlayerCount = 0;

async function getInstances() {
  try {
    const baseURL = "https://games.roblox.com/v1/games";
    const response = await axios.get(`${baseURL}/${gameID}/private-servers?limit=25`, {
      headers: { Cookie: `.ROBLOSECURITY=${process.env.ROBLOSECURITY}` }
    });

    if (!response.data || response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0];  // Return the first instance
  } catch (error) {
    console.error("Error fetching private server instances:", error);
    return null;
  }
}

async function updateEmbed(interaction) {
  if (!sessionMessage) return;
  const instance = await getInstances();  // Fetch instance data here
  if (!instance) return;

  if (instance.playing !== previousPlayerCount) {
    previousPlayerCount = instance.playing;

    const updatedEmbed = new EmbedBuilder()
      .setTitle(`Session Release`)
      .setDescription(`The session has been successfully released by <@${interaction.user.id}>. Ensure to read the information about the server provided below before joining. Make sure to register your vehicle before joining the session.
        
        **Session Information:**
        **Host:** <@${interaction.user.id}>
        **FRP Speed:** ${interaction.options.getString("frp-speed")}
        **Peacetime Status:** ${interaction.options.getString("peacetime-status")}
        **Leo Status:** ${interaction.options.getString("leo-status")}
        
        **Membercount:** ${instance.playing}/25`)
        .setImage("https://i.postimg.cc/MZc1MkX5/GVRA-Early-Access-1.png")
        .setColor(`#ab8ff6`);

    await sessionMessage.edit({ embeds: [updatedEmbed] });
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("release")
    .setDescription("Release a session with details and a join button.")
    .addStringOption((option) =>
      option.setName("link").setDescription("Session join link.").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("peacetime-status")
        .setDescription("Current peacetime status.")
        .addChoices(
          { name: "Strict Peacetime", value: "Strict" },
          { name: "Normal Peacetime", value: "Normal" },
          { name: "Disabled Peacetime", value: "Off" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("frp-speed")
        .setDescription("FRP speed limits.")
        .addChoices(
          { name: "75", value: "75" },
          { name: "80", value: "80" },
          { name: "85 (use sparingly)", value: "85" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("leo-status")
        .setDescription("LEO status.")
        .addChoices(
          { name: "Active", value: "Active" },
          { name: "Not Active", value: "Inactive" }
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.replied || interaction.deferred) return; // Prevent multiple replies

    await interaction.deferReply({ flags: 64 });  // Use flags instead of ephemeral


    try {
      const sessionLink = interaction.options.getString("link");

      const requiredRoleId = '1362487987815846040';
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });
        }

      const instance = await getInstances();  // Fetch the instance here
      if (!instance) {
        return interaction.editReply({
          content: "Failed to fetch session instance details.",
        });
      }


      const releaseEmbed = new EmbedBuilder()
        .setTitle(`Session Release`)
        .setDescription(`The session has been successfully released by <@${interaction.user.id}>. Ensure to read the information about the server provided below before joining. Make sure to register your vehicle before joining the session.
      
        **Session Information:**
        **Host:** <@${interaction.user.id}>
        **FRP Speed:** ${interaction.options.getString("frp-speed")}
        **Peacetime Status:** ${interaction.options.getString("peacetime-status")}
        **Leo Status:** ${interaction.options.getString("leo-status")}
        
        **Membercount:** ${instance.playing}/25`)
        .setImage("https://i.postimg.cc/MZc1MkX5/GVRA-Early-Access-1.png")
        .setColor(`#ab8ff6`);


      const button = new ButtonBuilder()
        .setLabel("Join Session")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("join_session");

      const row = new ActionRowBuilder().addComponents(button);

      sessionMessage = await interaction.channel.send({
        content: "(test",
        embeds: [releaseEmbed],
        components: [row],
      });

      await interaction.editReply({
        content: "Session released successfully!",
      });

      

      const filter = (i) => i.customId === 'join_session' && i.isButton();
      const collector = sessionMessage.createMessageComponentCollector({ filter });

      const targetChannelId = '1362500753352294614';
            const targetChannel = await interaction.client.channels.fetch(targetChannelId);
            if (!targetChannel) throw new Error("Target channel not found.");
      const logembed= new EmbedBuilder()
        .setTitle("Session Released")
        .setDescription(`The session has been released by <@${interaction.user.id}>.
          
          **Info**
          **FRP Speed:** ${interaction.options.getString("frp-speed")}  
          **Peacetime Status:** ${interaction.options.getString("peacetime-status")}
          **Leo Status:** ${interaction.options.getString("leo-status")}
          **Membercount:** ${instance.playing}/25`)
        .setColor('#a9f3f3');
      await targetChannel.send({ embeds: [logembed] });

      collector.on('collect', async (i) => {
        const hasPermission = i.member.roles.cache.has("1362489551506899165");

        if (!hasPermission) {
          const denyEmbed = new EmbedBuilder()
            .setDescription('You do not have permission to join this session!')
            .setColor('#a9f3f3');
          await i.reply({ embeds: [denyEmbed], ephemeral: true });
        } else {
          const linkEmbed = new EmbedBuilder()
            .setColor('#a9f3f3')
            .setDescription(`Click to join the session: [link](${sessionLink})`);
          await i.reply({ embeds: [linkEmbed], ephemeral: true });
        }
      });

    } catch (error) {
      console.error('Error executing command:', error);
      if (!interaction.replied) {
        const errorEmbed = new EmbedBuilder()
          .setColor('#a9f3f3')
          .setTitle('Error')
          .setDescription('There was an error while executing this command!');
        await interaction.editReply({ embeds: [errorEmbed] });
      }
    }

    setInterval(() => updateEmbed(interaction), 60000);
  },
};
