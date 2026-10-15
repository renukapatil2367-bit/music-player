
const songs = [
  {
    title: "Dreamy Nights",
    artist: "Melody Artist",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "🌙"
  },
  {
    title: "Ocean Breeze",
    artist: "Chill Waves",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "🌊"
  },
  {
    title: "Golden Memories",
    artist: "Sunny Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "✨"
  }
];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const autoplay = document.getElementById("autoplay");
const status = document.getElementById("status");

let songIndex = 0;

// Convert seconds into minutes:seconds
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

// Display playlist
function renderPlaylist() {
  playlist.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <div class="song-name">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <span class="song-number">${String(index + 1).padStart(2, "0")}</span>
    `;

    li.classList.toggle("active", index === songIndex);

    li.addEventListener("click", () => {
      loadSong(index);
      playSong();
    });

    playlist.appendChild(li);
  });
}

// Load selected song
function loadSong(index) {
  songIndex = (index + songs.length) % songs.length;

  const song = songs[songIndex];

  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.textContent = song.cover;

  progress.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";

  renderPlaylist();
  status.textContent = "Song selected";
}

// Play song
async function playSong() {
  try {
    await audio.play();
    playBtn.textContent = "⏸";
    playBtn.setAttribute("aria-label", "Pause song");
    status.textContent = "Now playing";
  } catch (error) {
    playBtn.textContent = "▶";
    status.textContent = "Unable to play. Check your internet.";
  }
}

// Pause song
function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
  playBtn.setAttribute("aria-label", "Play song");
  status.textContent = "Paused";
}

// Play/Pause button
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Next song
nextBtn.addEventListener("click", () => {
  loadSong(songIndex + 1);
  playSong();
});

// Previous song
prevBtn.addEventListener("click", () => {
  // Restart current song if it has played for more than 3 seconds
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  loadSong(songIndex - 1);
  playSong();
});

// Update progress bar
audio.addEventListener("timeupdate", () => {
  if (audio.duration && Number.isFinite(audio.duration)) {
    progress.value =
      (audio.currentTime / audio.duration) * 100;

    currentTime.textContent = formatTime(audio.currentTime);
  }
});

// Show song duration when audio loads
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

// Seek to a position using the progress bar
progress.addEventListener("input", () => {
  if (audio.duration && Number.isFinite(audio.duration)) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

// Volume control
volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

// Automatically play next song when current song ends
audio.addEventListener("ended", () => {
  if (autoplay.checked) {
    loadSong(songIndex + 1);
    playSong();
  } else {
    playBtn.textContent = "▶";
    status.textContent = "Song ended";
  }
});

// Update button if playback is stopped by the browser
audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
});

audio.addEventListener("play", () => {
  playBtn.textContent = "⏸";
});

// Initial setup
audio.volume = Number(volume.value);
loadSong(0);
