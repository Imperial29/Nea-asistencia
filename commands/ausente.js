const { SlashCommandBuilder } = require('discord.js');
const { timers } = require('./asistencia.js'); // Importar el temporizador global

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
        userTimer.elapsedTime = elapsedTime; // Guardar el tiempo transcurrido antes de la pausa
        userTimer.pauseStartTime = currentTime; // Guardar el tiempo de inicio de la pausa

        // Configurar un temporizador para forzar la salida después de 1 hora (3600000 ms)
        userTimer.timeout = setTimeout(async () => {
            if (userTimer.isPaused) {
                // Finalizar la asistencia automáticamente después de 1 hora de ausencia
                timers.delete(userId);

                const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
                const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

                // Enviar el mensaje indicando que el staff no volvió
                await interaction.followUp(`**El staff ya no volvió.** Asistencia terminada para ${userTimer.nick}.\n\n**Tiempo total**: ${hours} horas, ${minutes} minutos, y ${seconds} segundos.\n\nUsuarios: N/A\nChat: N/A\nStaff: N/A`);
            }
        }, 3600000);

        await interaction.reply(`Has activado el estado ausente. El contador ha sido pausado para ${userTimer.nick}.`);
    }
};
