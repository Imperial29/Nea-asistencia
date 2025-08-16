const safeExecute = require('../utils/safeExecute');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        // 🔹 Ejecutar safeExecute, defer inmediato dentro de safeExecute
        await safeExecute(interaction, async (i, { reply }) => {
            // Pasamos el reply seguro al comando
            await command.execute(i, { reply });
        });
    },
};
