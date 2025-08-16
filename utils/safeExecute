module.exports = async function safeExecute(interaction, callback, options = {}) {
    const { ephemeral = false } = options;
    let deferred = false;

    try {
        console.log(`⚡ [Comando] ${interaction.user.tag} (${interaction.user.id}) ejecutó /${interaction.commandName}`);

        // 🔹 Diferir inmediatamente para comandos largos
        try {
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ ephemeral });
                deferred = true;
                console.log('⏳ DeferReply exitoso');
            }
        } catch (deferError) {
            console.warn('⚠️ No se pudo deferir la interacción:', deferError.message);
        }

        // 🔹 Ejecutar la lógica del comando
        await callback(interaction, {
            reply: async (response) => {
                try {
                    // Decide automáticamente cómo responder según estado
                    if (deferred) return await interaction.editReply(response);
                    if (interaction.replied) return await interaction.followUp(response);
                    return await interaction.reply(response);
                } catch (err) {
                    console.error('❌ Error al enviar respuesta segura:', err.message);
                }
            }
        });

        console.log(`✅ [Comando] /${interaction.commandName} ejecutado correctamente por ${interaction.user.tag}`);

    } catch (error) {
        console.error(`❌ Error en /${interaction.commandName}:`, error);

        // 🔹 Notificación segura de error
        try {
            if (deferred) {
                await interaction.editReply({ content: '❌ Hubo un error al ejecutar este comando', ephemeral: true });
            } else if (!interaction.replied) {
                await interaction.reply({ content: '❌ Hubo un error al ejecutar este comando', ephemeral: true });
            }
        } catch (replyError) {
            console.error('❌ No se pudo notificar el error:', replyError.message);
        }
    }
};
