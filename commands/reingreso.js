const { SlashCommandBuilder } = require('discord.js');
const { timers } = require('./asistencia.js'); // Importar desde el archivo asistencia.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reingreso')
        .setDescription('Reanuda el contador de asistencia después de un estado ausente'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // Verificar si el usuario ha iniciado la asistencia
        if (!timers.has(userId)) {
            return interaction.reply('No has iniciado la asistencia.');
        }

        // Verificar si está en estado ausente
        const userTimer = timers.get(userId);
        if (!userTimer.isPaused) {
            return interaction.reply('No estás en estado ausente.');
        }

        // Reanudar el temporizador
        const currentTime = Date.now();
        const pauseTime = currentTime - userTimer.pauseStartTime;

        // Eliminar el temporizador de pausa automática
        clearTimeout(userTimer.timeout);

        userTimer.isPaused = false;
        userTimer.startTime = currentTime; // Reiniciar el tiempo de inicio con el tiempo acumulado en la pausa
        userTimer.pauseTime = pauseTime; // Agregar el tiempo de pausa

        await interaction.reply(`Has reanudado el contador para ${userTimer.nick}.`);
    }
};
