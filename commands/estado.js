const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const safeExecute = require('../utils/safeExecute');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('estado')
        .setDescription('Muestra el estado actual del bot'),
    async execute(interaction, client) {
        await safeExecute(interaction, async (interaction) => {
            // Respuesta inicial para medir latencia real
            const sentMessage = await interaction.reply({ content: 'Verificando estado...', fetchReply: true });

            // Latencia 1: Diferencia entre el mensaje enviado y el inicio de la interacción
            const latencyReply = sentMessage.createdTimestamp - interaction.createdTimestamp;

            // Latencia 2: Diferencia usando tiempo inicial en ejecución
            const start = Date.now();
            const latencyProcess = Date.now() - start;

            // Tiempo de actividad (uptime)
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            // Crear embed
            const estadoEmbed = new EmbedBuilder()
                .setColor(0x00FF00) // Verde indica bot activo
                .setTitle('📊 Estado del Bot')
                .setDescription('Aquí puedes ver el estado actual del bot:')
                .addFields(
                    { name: '⏳ Tiempo de actividad', value: `${hours} horas, ${minutes} minutos y ${seconds} segundos` },
                    { name: '📡 Latencia (respuesta)', value: `${latencyReply} ms` },
                    { name: '⚙️ Latencia (proceso)', value: `${latencyProcess} ms` },
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de asistencia', iconURL: interaction.client.user.displayAvatarURL() });

            // Editar la interacción inicial con el embed
            await interaction.editReply({ content: '', embeds: [estadoEmbed] });
        });
    },
};
