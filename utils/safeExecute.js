module.exports = async function safeExecute(interaction, callback, options = {}) {
    const { ephemeral = false, defer = true } = options;

    try {
        console.log(`⚡ [Comando] ${interaction.user.tag} (${interaction.user.id}) ejecutó /${interaction.commandName}`);

        // Diferimos la respuesta si es necesario
        let deferred = false;
        if (defer) {
            try {
                await interaction.deferReply({ ephemeral });
                deferred = true;
            } catch (deferError) {
                console.warn('⚠️ No se pudo diferir la interacción, probablemente ya fue respondida.');
            }
        }

        // Ejecutamos la lógica principal del comando
        await callback(interaction);

        console.log(`✅ [Comando] /${interaction.commandName} ejecutado correctamente por ${interaction.user.tag}`);
    } catch (error) {
        console.error(`❌ [Comando] Error en /${interaction.commandName} ejecutado por ${interaction.user.tag}:`, error);

        // Intentamos responder de manera segura al error
        try {
            if (interaction.deferred || interaction.replied || deferred) {
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
        } catch (replyError) {
            // ⚠️ Ignoramos el error si la interacción ya expiró
            console.error('❌ Error al intentar notificar el fallo de la interacción:', replyError);
        }
    }
};
