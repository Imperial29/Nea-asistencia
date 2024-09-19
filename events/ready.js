module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`¡Listo! Conectado como ${client.user.tag}`);
        client.user.setPresence({ activities: [{ name: 'A Ser Sobreexplotado Por Leon' }], status: 'online' });
    },
};