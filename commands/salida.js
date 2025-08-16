const { SlashCommandBuilder } = require('discord.js');
const { timers } = require('./asistencia.js'); // Importar desde el archivo asistencia.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('salida')
        .setDescription('Finaliza el contador de asistencia, solicita información adicional y muestra el Nick')
        .addStringOption(option => 
            option.setName('usuarios')
                .setDescription('Proporciona información sobre los usuarios involucrados')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('chat')
                .setDescription('Proporciona información sobre el chat utilizado')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('staff')
                .setDescription('Proporciona información sobre el staff responsable')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Verificar si el usuario ha iniciado la asistencia
        if (!timers.has(userId)) {
            return interaction.reply('No has iniciado la asistencia.');
        }

        // Obtener los detalles del temporizador
        const { startTime, nick, isPaused, elapsedTime = 0, pauseTime = 0, timeout } = timers.get(userId);
        const endTime = Date.now();
        let totalElapsedTime;

        // Calcular el tiempo total en función del estado del temporizador (pausado o activo)
        if (isPaused) {
            totalElapsedTime = elapsedTime; // Si está pausado, usar el tiempo acumulado antes de la pausa
        } else {
            totalElapsedTime = elapsedTime + (endTime - startTime - pauseTime); // Tiempo transcurrido más el tiempo en pausa
        }

        // Cancelar el timeout de 1 hora configurado en ausente (si existe)
        if (timeout) {
            clearTimeout(timeout);
        }

        // Eliminar el temporizador del mapa
        timers.delete(userId);

        // Convertir el tiempo transcurrido a horas, minutos y segundos
        const hours = Math.floor(totalElapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor((totalElapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((totalElapsedTime % (1000 * 60)) / 1000);

        // Obtener la información proporcionada por el usuario
        const usuarios = interaction.options.getString('usuarios');
        const chat = interaction.options.getString('chat');
        const staff = interaction.options.getString('staff');

        // Responder con el Nick, tiempo y la información extra
        await interaction.reply(`Ha terminado la asistencia para **${nick}**.\n\n**Tiempo total**: ${hours} horas, ${minutes} minutos, y ${seconds} segundos.\n\n**Usuarios**: ${usuarios}\n**Chat**: ${chat}\n**Staffs**: ${staff}`);
    }
};
