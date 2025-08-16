const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const safeExecute = require('../utils/safeExecute');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('estado')
        .setDescription('Muestra el estado actual del bot'),
    async execute(interaction, { reply }) {
        await safeExecute(interaction, async (i, { reply }) => {
            // 🔹 Usamos reply seguro para mensaje inicial
            await reply({ content: 'Verificando estado...' });

            // Latencia 1: diferencia entre mensaje enviado y creación de interacción
            const latencyReply = i.createdTimestamp ? Date.now() - i.createdTimestamp : 0;

            // Latencia 2: tiempo de proceso
            const start = Date.now();
            const latencyProcess = Date.now() - start;

            // Tiempo de actividad
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            // Crear embed
            const estadoEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('📊 Estado del Bot')
                .setDescription('Aquí puedes ver el estado actual del bot:')
                .addFields(
                    { name: '⏳ Tiempo de actividad', value: `${hours} horas, ${minutes} minutos y ${seconds} segundos` },
                    { name: '📡 Latencia (respuesta)', value: `${latencyReply} ms` },
                    { name: '⚙️ Latencia (proceso)', value: `${latencyProcess} ms` },
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de asistencia', iconURL: i.client.user.displayAvatarURL() });

            // Editar la interacción inicial con el embed
            await reply({ content: '', embeds: [estadoEmbed] });
        });
    },
};
