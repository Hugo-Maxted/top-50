const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus } = require("@discordjs/voice");

const client = new Client({
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
  ],
});

client.login("no");

client.once("ready", () => {
  console.log("Ready!");
});

client.on("error", console.error);
client.on("warn", console.warn);

const player = createAudioPlayer();

client.on("messageCreate", async function (message) {
  console.log(message.author.username + " said: " + message.content);

  if (message.content.startsWith("&play")) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.reply("You must be in a voice channel to be a miner.");

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);

    player.play(
      createAudioResource("./bop.mp3", {
        inputType: StreamType.Arbitrary,
      })
    );

    entersState(player, AudioPlayerStatus.Playing, 5e3);

    connection.on(VoiceConnectionStatus.Ready, () => {
      message.reply("ok boss");
      console.log("Starting Bopping");
    });
  }
});
