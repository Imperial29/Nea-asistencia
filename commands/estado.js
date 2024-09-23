const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('estado')
        .setDescription('Muestra el estado actual del bot'),
    async execute(interaction) {
        // Tiempo de actividad (uptime)
        const uptime = process.uptime(); // El tiempo en segundos desde que el bot fue iniciado
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // Latencia (ping)
        const sentMessage = await interaction.reply({ content: 'Verificando estado...', fetchReply: true });
        const latency = sentMessage.createdTimestamp - interaction.createdTimestamp;

        // Crear un Embed con la información
        const estadoEmbed = new EmbedBuilder()
            .setColor(0x00FF00) // Color verde para indicar que el bot está activo
            .setTitle('Estado del Bot')
            .setDescription('Aquí puedes ver el estado actual del bot:')
            .addFields(
                { name: 'Tiempo de actividad', value: `${hours} horas, ${minutes} minutos, y ${seconds} segundos` },
                { name: 'Latencia', value: `${latency} ms` },
            )
            .setTimestamp() // Marca de tiempo actual
            .setFooter({ text: 'Sistema de asistencia', iconURL: interaction.client.user.displayAvatarURL() });

        // Editar el mensaje inicial con el embed
        await interaction.editReply({ content: null, embeds: [estadoEmbed] });
    },
};
