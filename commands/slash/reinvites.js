const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

let sessionMessage;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reinvites")
    .setDescription("Release's reinvites.")
    .addStringOption(option =>
      option.setName("link")
        .setDescription("Session join link.")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.replied || interaction.deferred) return;

    await interaction.deferReply({ ephemeral: true });

    const requiredRoleId = '1362487987815846040';
    if (!interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.editReply({
        content: "You do not have permission to use this command."
      });
    }

    const sessionLink = interaction.options.getString("link");

    const releaseEmbed = new EmbedBuilder()
      .setTitle("Session Release")
      .setDescription(`Reinvites has been released. To join click the button provided below.
        
        **Note**:
        1.Join on the account you have linked to our discord server. Failing to do so might result in a kick from the session.
        2. Wait for the host to release you, you do not just drive upon joining. Unless they have said you can.`)
      .setColor("#ab8ff6");

    const button = new ButtonBuilder()
      .setLabel("Join Session")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("join_session");

    const row = new ActionRowBuilder().addComponents(button);

    sessionMessage = await interaction.channel.send({
      embeds: [releaseEmbed],
      components: [row],
    });

    await interaction.editReply({
      content: "Reinvites has been released.",  
    });

    const targetChannelId = '1362500753352294614';
    const targetChannel = await interaction.client.channels.fetch(targetChannelId);
    if (!targetChannel) throw new Error("Target channel not found.");

    const embedlog = new EmbedBuilder()
      .setTitle("Command Executed")
      .setDescription(`By <@${interaction.user.id}>
        
        **link**: ${sessionLink}`)
      .setColor("#ab8ff6");

    await targetChannel.send({ embeds: [embedlog] });

    const filter = i => i.customId === "join_session" && i.isButton();
    const collector = sessionMessage.createMessageComponentCollector({ filter });

    collector.on("collect", async i => {
      const allowedRole = "1362489551506899165";
      if (!i.member.roles.cache.has(allowedRole)) {
        const denyEmbed = new EmbedBuilder()
          .setDescription("You do not have permission to join this session!")
          .setColor("#a9f3f3");
        return i.reply({ embeds: [denyEmbed], ephemeral: true });
      }

      const linkEmbed = new EmbedBuilder()
        .setDescription(`Click to join the session: [link](${sessionLink})`)
        .setColor("#a9f3f3");
      await i.reply({ embeds: [linkEmbed], ephemeral: true });
    });
  },
};
