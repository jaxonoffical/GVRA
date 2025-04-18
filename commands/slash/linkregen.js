const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("regenlink")
    .setDescription("Regenerate the link."),
  async execute(interaction) {
    const requiredRoleId = "1362487987815846040";
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true
      });
    }

    try {
      const userid = interaction.user.id;

      const embed = new EmbedBuilder()
        .setTitle("Link Regenerated")
        .setDescription(`The link has been regenerated. Please wait for the next reinvites wave to occur.
            
            > This can take atleast 10 minutes to occur.`)
            .setColor(`#ab8ff6`);

     await interaction.channel.send({ embeds: [embed], fetchReply: true });

      const targetChannelId = "1362500753352294614";    
      const targetChannel = await interaction.client.channels.fetch(targetChannelId);
      if (!targetChannel) throw new Error("Target channel not found.");

      const newEmbed = new EmbedBuilder()
        .setTitle("Command Executed")
        .setDescription(`Setup command has been executed`)
        .setFields([
          { name: "Host", value: `<@${interaction.user.id}>`, inline: true },
          { name: "Channel", value: `<#${interaction.channel.id}>`, inline: true }
        ])
        .setColor(`#ab8ff6`);

        await interaction.editReply({ content: 'Command completed successfully', ephemeral: true });

      await targetChannel.send({ embeds: [newEmbed] });

    } catch (error) {
      console.error("An error occurred: ", error);
      await interaction.reply({
        content: "An error occurred while processing your request.",
        ephemeral: true
      });
    }
  },
};
