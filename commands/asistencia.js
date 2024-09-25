const { SlashCommandBuilder } = require('discord.js');

// Mapa para guardar los tiempos de inicio, nicks, y el canal por usuario
const timers = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asistencia')
        .setDescription('Inicia el contador de asistencia y solicita un Nick')
        .addStringOption(option => 
            option.setName('nick')
                .setDescription('Proporciona tu Nick')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const nick = interaction.options.getString('nick'); // Obtener el Nick del usuario
        const channelId = interaction.channel.id; // Guardar el canal donde se ejecuta el comando

        // Comprobar si ya hay un temporizador corriendo para el usuario
        if (timers.has(userId)) {
            return interaction.reply('Ya has iniciado la asistencia.');
        }

        // Guardar la hora de inicio, el Nick y el Canal
        const startTime = Date.now();
        timers.set(userId, { startTime, nick, channelId });

        await interaction.reply(`¡Asistencia iniciada! El contador ha comenzado para el Staff: **${nick}**.`);
    },
};

// Exportar el objeto timers para usar en otros comandos
module.exports.timers = timers;
