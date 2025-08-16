module.exports = async function safeExecute(interaction, callback) {
    try {
        await callback(interaction);
    } catch (error) {
        console.error('❌ Error en comando:', error);

        try {
            if (interaction.deferred || interaction.replied) {
                // Si ya hubo deferReply o reply, usamos editReply
                await interaction.editReply({
                    content: '⚠️ Ocurrió un error al ejecutar este comando.',
                    ephemeral: true,
                });
            } else {
                // Si no hubo respuesta previa, usamos reply normal
                await interaction.reply({
                    content: '⚠️ Ocurrió un error al ejecutar este comando.',
                    ephemeral: true,
                });
            }
        } catch (err) {
            console.error('❌ Error al responder en safeExecute:', err);
        }
    }
};
