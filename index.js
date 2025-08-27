const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const LASTFM_USER = process.env.LASTFM_USER;
const LASTFM_APIKEY = process.env.LASTFM_APIKEY;

app.get("/sarki", async (req, res) => {
  try {
    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_APIKEY}&format=json&limit=1`;
    
    const response = await fetch(url); // Node.js 18+ global fetch
    const data = await response.json();

    if (!data.recenttracks || !data.recenttracks.track || data.recenttracks.track.length === 0) {
      return res.send("Şu anda şarkı çalmıyor.");
    }

    const track = data.recenttracks.track[0];
    const artist = track.artist["#text"];
    const song = track.name;
    const nowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";

    const message = nowPlaying
      ? `Şu an çalan şarkı: ${song} - ${artist}`
      : `Son çalan şarkı: ${song} - ${artist}`;

    res.send(message);
  } catch (error) {
    console.error(error);
    res.send("Şarkı bilgisi alınamadı.");
  }
});

app.listen(port, () => {
  console.log(`Bot sunucusu port ${port} üzerinde dinleniyor.`);
});
