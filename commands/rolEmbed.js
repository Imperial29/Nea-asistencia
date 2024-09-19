const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolembed')
        .setDescription('Envía un embed para asignar roles.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Reacciona para obtener un rol')
            .setDescription('Reacciona con ✅ para obtener el rol de Miembro.')
            .setColor(0x0099ff);

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        await message.react('✅');

        const filter = (reaction, user) => {
            return reaction.emoji.name === '✅' && !user.bot;
        };

        const collector = message.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', async (reaction, user) => {
            const role = interaction.guild.roles.cache.find(role => role.name === 'Miembro');
            if (role) {
                const member = interaction.guild.members.cache.get(user.id);
                await member.roles.add(role);
                await interaction.followUp(`${user.username} ha recibido el rol de Miembro.`);
            }
        });
    },
};