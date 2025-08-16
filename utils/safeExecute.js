module.exports = async function safeExecute(interaction, callback, options = {}) {
    const { ephemeral = false, defer = true } = options;
    let deferred = false;

    try {
        console.log(`⚡ [Comando] ${interaction.user.tag} (${interaction.user.id}) ejecutó /${interaction.commandName}`);

        // Diferir la interacción si es necesario
        if (defer) {
            try {
                await interaction.deferReply({ ephemeral });
                deferred = true;
                console.log('⏳ DeferReply exitoso');
            } catch (deferError) {
                console.warn('⚠️ No se pudo diferir la interacción:', deferError.message);
            }
        }

        // Ejecutamos la lógica principal del comando
        try {
            // Pasamos al callback un objeto con funciones seguras para responder
            await callback(interaction, {
                reply: async (content) => {
                    try {
                        if (deferred) {
                            return await interaction.editReply(content);
                        } else if (interaction.replied || interaction.deferred) {
                            return await interaction.followUp(content);
                        } else {
                            return await interaction.reply(content);
                        }
                    } catch (replyError) {
                        console.error('❌ Error al enviar respuesta segura:', replyError.message);
                    }
                }
            });

            console.log(`✅ [Comando] /${interaction.commandName} ejecutado correctamente por ${interaction.user.tag}`);

        } catch (callbackError) {
            console.error(`❌ Error en callback de /${interaction.commandName}:`, callbackError);

            // Notificamos el error de forma segura
            try {
                if (deferred || interaction.replied) {
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
                console.error('❌ Error al notificar el fallo de la interacción:', replyError.message);
            }
        }

    } catch (error) {
        console.error(`❌ Error inesperado en safeExecute para /${interaction.commandName}:`, error.message);
    }
};
