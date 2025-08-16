module.exports = async function safeExecute(interaction, callback, options = {}) {
    const { ephemeral = false, defer = true } = options;

    try {
        // 📌 Log inicial: quién ejecuta el comando
        console.log(`⚡ [Comando] ${interaction.user.tag} (${interaction.user.id}) ejecutó /${interaction.commandName}`);

        // Diferimos la respuesta para evitar timeout (si está habilitado)
        if (defer) {
            await interaction.deferReply({ ephemeral });
        }

        // Ejecutamos la lógica del comando
        await callback(interaction);

        // 📌 Log de éxito
        console.log(`✅ [Comando] /${interaction.commandName} ejecutado correctamente por ${interaction.user.tag}`);
    } catch (error) {
        // 📌 Log de error
        console.error(`❌ [Comando] Error en /${interaction.commandName} ejecutado por ${interaction.user.tag}:`, error);

        // Manejo seguro del error en Discord
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ 
                content: '❌ Hubo un error al ejecutar este comando.', 
                ephemeral: true 
            });
        } else {
            await interaction.reply({ 
                content: '❌ Hubo un error al ejecutar este comando.', 
                ephemeral: true 
            });
        }
    }
};
