const { SlashCommandBuilder } = require('discord.js');
const { timers } = require('./asistencia.js'); // Asegúrate de ajustar la ruta

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reingreso')
        .setDescription('Reanuda el contador de asistencia tras el estado ausente'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // Verificar si el usuario ha iniciado la asistencia y está en estado ausente
        if (!timers.has(userId)) {
            return interaction.reply('No tienes una asistencia en curso.');
        }

        const userTimer = timers.get(userId);

        if (!userTimer.isPaused) {
            return interaction.reply('No estás en estado ausente.');
        }

        // Reanudar el temporizador
        const currentTime = Date.now();
        const pauseDuration = currentTime - userTimer.pauseStartTime;

        userTimer.isPaused = false;
        userTimer.startTime = currentTime; // Reiniciar desde el momento actual
        userTimer.elapsedTime = (userTimer.elapsedTime || 0) + pauseDuration; // Continuar sumando al tiempo anterior

        // Cancelar el timeout de 1 hora si se reingresó antes de tiempo
        clearTimeout(userTimer.timeout);

        await interaction.reply(`Has reanudado el contador de asistencia para ${userTimer.nick}.`);
    }
};
