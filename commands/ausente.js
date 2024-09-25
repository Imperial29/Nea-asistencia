const { SlashCommandBuilder } = require('discord.js');
const { timers } = require('./asistencia.js'); // Asegúrate de ajustar la ruta según tu estructura

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ausente')
        .setDescription('Pone en pausa el contador de asistencia'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // Verificar si el usuario ha iniciado la asistencia
        if (!timers.has(userId)) {
            return interaction.reply('No has iniciado la asistencia.');
        }

        const userTimer = timers.get(userId);

        // Verificar si ya está en estado ausente
        if (userTimer.isPaused) {
            return interaction.reply('Ya estás en estado ausente.');
        }

        // Pausar el temporizador
        const currentTime = Date.now();
        const elapsedTime = currentTime - userTimer.startTime;

        userTimer.isPaused = true;
        userTimer.elapsedTime = (userTimer.elapsedTime || 0) + elapsedTime; // Guardar el tiempo transcurrido antes de la pausa
        userTimer.pauseStartTime = currentTime; // Guardar el tiempo de inicio de la pausa

        // Enviar confirmación de que el temporizador se ha pausado
        await interaction.reply(`Has activado el estado ausente. El contador ha sido pausado para ${userTimer.nick}.`);

        // Configurar un temporizador para forzar la salida después de 1 hora (3600000 ms)
        userTimer.timeout = setTimeout(async () => {
            if (userTimer.isPaused) {
                // Finalizar la asistencia automáticamente después de 1 hora de ausencia
                const totalElapsedTime = userTimer.elapsedTime;

                const hours = Math.floor(totalElapsedTime / (1000 * 60 * 60));
                const minutes = Math.floor((totalElapsedTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((totalElapsedTime % (1000 * 60)) / 1000);

                // Obtener el canal donde se inició la asistencia
                const channel = await interaction.client.channels.fetch(userTimer.channelId);

                if (channel) {
                    // Enviar notificación automática al canal de la asistencia
                    await channel.send(`**El staff ya no volvió. Asistencia finalizada automáticamente para ${userTimer.nick}.**\n\n**Tiempo total**: ${hours} horas, ${minutes} minutos, y ${seconds} segundos.`);
                }

                // Eliminar el temporizador del Map
                timers.delete(userId);
            }
        }, 3600000); // Esperar 1 hora (3600000 ms) antes de finalizar la asistencia
    }
};
