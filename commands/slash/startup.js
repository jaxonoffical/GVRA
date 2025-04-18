const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    
    async execute(interaction) {
        const requiredRoleId = '1362487987815846040';
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });
        }

        try {
            await interaction.deferReply({ ephemeral: true });
            const reactions = interaction.options.getInteger('reactions');
            const userid = interaction.user.id;

            const embed = new EmbedBuilder()
                .setTitle(`Session Startup`)
                .setDescription(`A new session has been started by <@${userid}>. Please be sure to read the rules below before the session commence.
                    
**Rules:**  
Always follow the server rules before joining a session to avoid getting into trouble.

**Verification:**  
Besure you are joining the session on the account you are linked on in this server. Failing to do so would result in a kick from the session.

**Vehicle Registration:**  
Go to <#1362459123911884894> and use the /register command to register your vehicle.

For the session to commence, this message needs **${reactions}+** reactions.`)
.setImage("https://i.postimg.cc/sD7SmpYZ/GVRA-Server-Startup-1.png")
.setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
.setColor('#ab8ff6');
        
            const sentMessage = await interaction.channel.send({ content: '(@everyone)', embeds: [embed] });
            await sentMessage.react('✅');

            const targetChannelId = '1362500753352294614';
            const targetChannel = await interaction.client.channels.fetch(targetChannelId);
            if (!targetChannel) throw new Error("Target channel not found.");

            const newEmbed = new EmbedBuilder()
                .setTitle("Command Executed")
                .setDescription(`A roleplay session has been initiated. Information will be placed below.`)
                .setFields([
                    { name: 'Host', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Reactions', value: `${reactions}`, inline: true },
                    { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true }
                ])
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
                .setColor('#ab8ff6');

            await targetChannel.send({ embeds: [newEmbed] });
            
            await interaction.editReply({ content: 'Command completed successfully', ephemeral: true });

        } catch (error) {
            console.error("An error occurred: ", error);
            await interaction.followUp({
                content: "An error occurred while processing your request.",
                ephemeral: true
            });
        }
    },
};
