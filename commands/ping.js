const { SlashCommandBuilder } = require('discord.js');
const safeExecute = require('../utils/safeExecute');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con Pong!'),
    async execute(interaction , client) {
        await safeExecute(interaction, async (interaction) => {
        await interaction.reply('Pong!');       
     }); // <-- Cierra safeExecute
    }, // <-- Cierra la función execute
}; // <-- Cierra module.exports
