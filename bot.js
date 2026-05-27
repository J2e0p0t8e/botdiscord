require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const ROLES = [
  { id: '1508840086119120938', label: 'Dev Web',        emoji: '💻', style: ButtonStyle.Primary   },
  { id: '1508840301270405223', label: 'Dev Mobile',     emoji: '📱', style: ButtonStyle.Secondary  },
  { id: '1508841127355355206', label: 'IA & Data',      emoji: '🤖', style: ButtonStyle.Danger     },
  { id: '1508962926235619388', label: 'Python',         emoji: '🐍', style: ButtonStyle.Success    },
  { id: '1508841340211953888', label: 'CyberSécurité',  emoji: '🔒', style: ButtonStyle.Secondary  },
];

async function sendRoleMenu(channel) {
  const embed = new EmbedBuilder()
    .setTitle('Choisis tes rôles')
    .setDescription('Clique sur les boutons pour te donner ou retirer un rôle.\nTu peux en avoir **plusieurs**.')
    .setColor(0x5865F2);

  const rows = [];
  for (let i = 0; i < ROLES.length; i += 5) {
    const row = new ActionRowBuilder();
    ROLES.slice(i, i + 5).forEach(r => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`role_${r.id}`)
          .setLabel(r.label)
          .setEmoji(r.emoji)
          .setStyle(r.style)
      );
    });
    rows.push(row);
  }

  await channel.send({ embeds: [embed], components: rows });
}

client.once('ready', async () => {
  console.log(`✅ Bot connecté : ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName('roles')
      .setDescription('Affiche le menu de sélection des rôles')
      .toJSON()
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );
  console.log('✅ Commande /roles enregistrée');
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === 'roles') {
    await sendRoleMenu(interaction.channel);
    await interaction.reply({ content: '✅ Menu envoyé !', ephemeral: true });
    return;
  }

  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith('role_')) return;

  const roleId = interaction.customId.replace('role_', '');
  const member = interaction.member;
  const role   = interaction.guild.roles.cache.get(roleId);

  if (!role) return interaction.reply({ content: '❌ Rôle introuvable.', ephemeral: true });

  if (member.roles.cache.has(roleId)) {
    await member.roles.remove(role);
    await interaction.reply({ content: `❌ Rôle **${role.name}** retiré.`, ephemeral: true });
  } else {
    await member.roles.add(role);
    await interaction.reply({ content: `✅ Rôle **${role.name}** ajouté !`, ephemeral: true });
  }
});

client.login(process.env.TOKEN);