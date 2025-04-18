const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('concluded')
        .setDescription('Ends the session')
        .addStringOption(option =>
            option.setName('totalduration')
                .setDescription('The total duration of the session')
                .setRequired(true)),

    async execute(interaction) {
        const requiredRoleId = '1362487987815846040';
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle('Permission Denied')
                .setDescription('You do not have permission to use this command.')
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
                .setColor('#ab8ff6');

            return await interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const totalduration = interaction.options.getString('totalduration');
            const date2 = new Date().toLocaleDateString();

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Session Concluded`)
                .setDescription(`
> The session has now been concluded. We appreciate everyone who joined us and attended the session! Feel free to give your feedback by clicking the button below.

__**Session Details:**__
**Hosted by:** <@${interaction.user.id}>
**Total Duration:** ${totalduration}
**Date:** ${date2}

**Note:** Keep in mind that, depending on the severity of the situation, asking for a session may result in an infraction, kick, or even a ban.`)
                .setImage("https://i.postimg.cc/NMnfqzcf/GVRA-concluded.png")
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
                .setColor('#ab8ff6');

            const date = new Date().toLocaleDateString();

            const logEmbed = new EmbedBuilder()
                .setTitle('Command Executed')
                .setDescription('A roleplay session has ended. Information will be placed below.')
                .addFields(
                    { name: 'Host', value: `<@${interaction.user.id}>` },
                    { name: 'Date', value: date }
                )
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
                .setColor('#ab8ff6');


            await interaction.channel.send({
                embeds: [embed],
            });

            const logChannel = await interaction.client.channels.fetch('1362500753352294614');
            await logChannel.send({ embeds: [logEmbed] });

            const successEmbed = new EmbedBuilder()
                .setDescription('Command executed successfully!')
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
                .setColor('#ab8ff6');


            await interaction.editReply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            console.error('Error sending messages:', error);

            const errorEmbed = new EmbedBuilder()
                .setDescription('Failed to send messages. Please try again later.')
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
                .setColor('#ab8ff6');


            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
