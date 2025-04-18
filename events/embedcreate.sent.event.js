const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate', // Event name
    async execute(interaction) {
        try {
            if (interaction.isModalSubmit() && interaction.customId === 'workembed') {
                await interaction.deferReply({ ephemeral: true });

                const guildName = interaction.guild?.name || "the server";
                const guildIcon = interaction.guild?.iconURL() || null;

                const description = interaction.fields.getTextInputValue('description');
                const thumbnailUrl = interaction.fields.getTextInputValue('thumbnail') || null;
                const imageUrl = interaction.fields.getTextInputValue('image') || null;
                const title = interaction.fields.getTextInputValue('title') || null;

                console.log('Modal Submitted:', { description, thumbnailUrl, imageUrl });

                if (!description) {
                    return interaction.editReply({ content: 'Description is required.' });
                }

                const embed = new EmbedBuilder()
                    .setDescription(description)
                    .setColor('#ab8ff6');

                if (thumbnailUrl) embed.setThumbnail(thumbnailUrl);
                if (imageUrl) embed.setImage(imageUrl);
                if (title) embed.setTitle(title);

                await interaction.channel.send({ embeds: [embed] });

                await interaction.editReply({ content: 'Embed successfully created!' });

                console.log('Embed sent successfully.');
            }
        } catch (error) {
            console.error('Error processing modal submission:', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: 'An error occurred while processing your request.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'An error occurred. Please try again.', ephemeral: true });
            }
        }
    },
};
