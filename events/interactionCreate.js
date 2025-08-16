module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        // Log simple: usuario y comando
        console.log(`${interaction.user.tag} usó /${interaction.commandName}`);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error al ejecutar /${interaction.commandName}:`,error);
            await interaction.reply({ content: 'Hubo un error al ejecutar este comando!', ephemeral: true });
        }
    },
};
