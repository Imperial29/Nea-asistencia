client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // 1️⃣ Diferir inmediatamente
    try {
        await interaction.deferReply({ ephemeral: false });
    } catch(err) {
        console.warn('No se pudo deferir la interacción:', err.message);
    }

    // 2️⃣ Ejecutar safeExecute
    try {
        await safeExecute(interaction, async (i, { reply }) => {
            await command.execute(i, { reply });
        }, { defer: false }); // defer ya hicimos arriba
    } catch (error) {
        console.error('Error en safeExecute:', error);
    }
});
