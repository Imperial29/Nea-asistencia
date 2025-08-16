const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const safeExecute = require('../utils/safeExecute');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recargar')
        .setDescription('Recarga todos los comandos del bot'),
    async execute(interaction, client) {
        await safeExecute(interaction, async (interaction) => {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            delete require.cache[require.resolve(`./${file}`)]; // Eliminar el caché de cada comando
            const command = require(`./${file}`);
            interaction.client.commands.set(command.data.name, command);
        }

        await interaction.reply({ content: 'Todos los comandos han sido recargados exitosamente.', ephemeral: true });
    }); // <-- Cierra safeExecute
    }, // <-- Cierra la función execute
}; // <-- Cierra module.exports
