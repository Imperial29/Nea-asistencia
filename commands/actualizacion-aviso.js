const { SlashCommandBuilder } = require('discord.js');
const { timers } = require('./asistencia.js'); // Asegúrate de ajustar la ruta

module.exports = {
    data: new SlashCommandBuilder()
        .setName('actualizacion-aviso')
        .setDescription('Envía una notificación de actualización y finaliza todas las asistencias activas')
        .addIntegerOption(option => 
            option.setName('tiempo')
                .setDescription('Tiempo en minutos hasta la actualización')
                .setRequired(true)),

    async execute(interaction) {
        const tiempo = interaction.options.getInteger('tiempo'); // Obtener el tiempo en minutos
        const tiempoMs = tiempo * 60000; // Convertir minutos a milisegundos

        // Verificar si hay usuarios con asistencias activas en el Map 'timers'
        if (timers.size === 0) {
            return interaction.reply('No hay usuarios con asistencias activas o ausentes.');
        }

        // Enviar el mensaje de notificación a cada canal donde se inició la asistencia
        for (const [userId, userTimer] of timers) {
            const channel = await interaction.client.channels.fetch(userTimer.channelId);
            if (channel) {
                // Enviar el aviso al canal original de cada usuario con el nick en negritas
                await channel.send(`**Actualización de bot en ${tiempo} minutos**. **${userTimer.nick}**, tu asistencia será finalizada automáticamente para evitar bugs.`);
            }
        }

        // Enviar un mensaje general en el canal donde se ejecuta /actualizacion-aviso
        await interaction.reply('Aviso enviado a los canales correspondientes.');

        // Configurar un temporizador para finalizar las asistencias después del tiempo especificado
        setTimeout(async () => {
            for (const [userId, userTimer] of timers) {
                const currentTime = Date.now();
                const totalElapsedTime = userTimer.isPaused
                    ? userTimer.elapsedTime
                    : (currentTime - userTimer.startTime) + (userTimer.elapsedTime || 0);

                // Convertir el tiempo total en horas, minutos y segundos
                const hours = Math.floor(totalElapsedTime / (1000 * 60 * 60));
                const minutes = Math.floor((totalElapsedTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((totalElapsedTime % (1000 * 60)) / 1000);

                // Obtener el canal donde se inició la asistencia
                const channel = await interaction.client.channels.fetch(userTimer.channelId);

                if (channel) {
                    // Enviar notificación de finalización con el nick en negritas
                    await channel.send(`**Asistencia finalizada automáticamente para **${userTimer.nick}**.**\n\n**Tiempo total**: ${hours} horas, ${minutes} minutos, y ${seconds} segundos.`);
                }

                // Eliminar el temporizador del Map
                timers.delete(userId);
            }
        }, tiempoMs); // Esperar el tiempo especificado antes de finalizar las asistencias
    }
};
