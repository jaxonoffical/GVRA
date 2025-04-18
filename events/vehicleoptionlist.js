const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isAutocomplete()) {
      const focused = interaction.options.getFocused();
      const filePath = path.join(__dirname, '../vehiclelist.json');  // Adjust path if necessary

      try {
        // Ensure the file is being read correctly
        const rawData = fs.readFileSync(filePath, 'utf8');
        const vehicleList = JSON.parse(rawData);

        // Ensure vehicleList has data
        if (!Array.isArray(vehicleList) || vehicleList.length === 0) {
          console.error('vehiclelist.json is empty or malformed');
          return interaction.respond([]);
        }

        // Format each vehicle into a string like "1955 Stuttgart Munster 300"
        const formatted = vehicleList.map(v => `${v.year} ${v.brand} ${v.model}`);

        // Filter based on the user's input
        const filtered = formatted
          .filter(v => v.toLowerCase().includes(focused.toLowerCase()))
          .slice(0, 25);

        if (filtered.length === 0) {
          console.log('No matching vehicles found.');
        }

        // Respond with matching results
        await interaction.respond(
          filtered.map(v => ({ name: v, value: v }))
        );
      } catch (err) {
        console.error('Failed to load or parse vehiclelist.json:', err);
        await interaction.respond([]);
      }
    }
  }
};
