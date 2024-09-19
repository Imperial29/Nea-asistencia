const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('informacion')
        .setDescription('Muestra la información sobre cómo usar los comandos del bot'),
    async execute(interaction) {
        const helpMessage = `
**¡Bienvenido al sistema de asistencia del bot! Aquí te explico cómo usar los comandos disponibles:**

1. **/Asistencia [Nick]**
   - Inicia un registro de asistencia con un cronómetro.
   - Te pedirá tu nombre o apodo (Nick).
   - Ejemplo: \`/asistencia Leonim2234\`.

2. **/Salida**
   - Termina tu registro de asistencia y muestra el tiempo total moderado.
   - Además, te pedirá la siguiente información adicional:
     - Usuarios: Número de usuarios activos.
     - Chat: Estado del chat (activo, inactivo, etc.).
     - Staffs: Nombre de los staff conectados.
   - Ejemplo: \`/salida 40 Activo PepeJuan,FabianJuan,Tuwo\`.

3. **/Ausente**
   - Pausa el cronómetro de la asistencia.
   - Si dura más de 1 hora en este estado, automáticamente se finalizara tu asistencia
   - Ejemplo: \`/ausente\`.

4. **/Reingreso**
   - Reanuda el cronómetro pausado con el comando /ausente.
   - Ejemplo: \`/reingreso\`.

**Nota:** El bot esta preparado para recibir de manera desordenada los comandos pero Recuerda usar estos comandos en el orden correcto para llevar un registro preciso de tu asistencia.
`;

        await interaction.reply({ content: helpMessage,});
    },
};