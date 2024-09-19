const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json'); // No necesitas guildId para comandos globales
const fs = require('fs');

// Verificar si el token se está leyendo correctamente
console.log(`Token: ${token}`);

// Cargar todos los comandos desde la carpeta 'commands'
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Empezando a refrescar los comandos slash globales...');

        // Registrar comandos globales (sin guildId)
        await rest.put(
            Routes.applicationCommands(clientId), // Se eliminó el guildId para registrar globalmente
            { body: commands },
        );

        console.log('Comandos globales registrados exitosamente.');
    } catch (error) {
        console.error(error);
    }
})();