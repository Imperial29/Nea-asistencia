const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const safeExecute = require('../utils/safeExecute');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('estado')
        .setDescription('Muestra el estado actual del bot'),
    async execute(interaction, client) {
        await safeExecute(interaction, async (interaction) => {
            // Tiempo de actividad (uptime)
            const start = Date.now(); // Para medir latencia
            const uptime = process.uptime(); // El tiempo en segundos desde que el bot fue iniciado
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            // Latencia (ping) aproximada
            const latency = Date.now() - start;

            // Crear un Embed con la información
            const estadoEmbed = new EmbedBuilder()
                .setColor(0x00FF00) // Color verde para indicar que el bot está activo
                .setTitle('Estado del Bot')
                .setDescription('Aquí puedes ver el estado actual del bot:')
                .addFields(
                    { name: 'Tiempo de actividad', value: `${hours} horas, ${minutes} minutos, y ${seconds} segundos` },
                    { name: 'Latencia', value: `${latency} ms` },
                )
                .setTimestamp() // Marca de tiempo actual
                .setFooter({ text: 'Sistema de asistencia', iconURL: interaction.client.user.displayAvatarURL() });

            // Editar la interacción con el embed y el mensaje de verificación
            await interaction.editReply({ content: 'Verificando estado...', embeds: [estadoEmbed] });
        });
    },
};
