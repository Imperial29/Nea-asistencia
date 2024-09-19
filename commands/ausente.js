const { SlashCommandBuilder } = require('discord.js');
const { timers } = require('./asistencia.js'); // Importar desde el archivo asistencia.js

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

        // Verificar si ya está en estado ausente
        const userTimer = timers.get(userId);
        if (userTimer.isPaused) {
            return interaction.reply('Ya estás en estado ausente.');
        }

        // Pausar el temporizador
        const currentTime = Date.now();
        const elapsedTime = currentTime - userTimer.startTime;

        userTimer.isPaused = true;
        userTimer.elapsedTime = elapsedTime; // Guardar el tiempo transcurrido
        userTimer.pauseStartTime = currentTime; // Guardar el tiempo de inicio de la pausa

        // Configurar un temporizador para forzar la salida después de 1 hora (3600000 ms)
        userTimer.timeout = setTimeout(() => {
            // Si todavía está pausado después de 1 hora, hacer una salida automática
            if (userTimer.isPaused) {
                timers.delete(userId);
                interaction.followUp(`**El staff ya no volvió.** Asistencia terminada para ${userTimer.nick}.\n\n**Tiempo total**: ${formatTime(userTimer.elapsedTime)}\n\nUsuarios: N/A\nChat: N/A\nStaff: N/A`);
            }
        }, 3600000);

        await interaction.reply(`Has activado el estado ausente. El contador ha sido pausado para ${userTimer.nick}.`);
    }
};