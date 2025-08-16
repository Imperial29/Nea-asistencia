module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        // Crear timestamp legible
        const timestamp = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

        // Log en consola (Render lo captura automáticamente)
        console.log(`[${timestamp}] Comando usado: /${interaction.commandName} | Usuario: ${interaction.user.tag} (${interaction.user.id}) | Guild: ${interaction.guild ? interaction.guild.name : 'DM'}`);

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`[${timestamp}] Error al ejecutar /${interaction.commandName}:`, error);
            await interaction.reply({ content: 'Hubo un error al ejecutar este comando!', ephemeral: true });
        }
    },
};
