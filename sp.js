console.log('lets write javascript');

let currentSong = new Audio();
let songs = [];
let currFolder;
let albumInfo = {};

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getAlbumInfo(folder) {
    currFolder = folder;
    try {
        let res = await fetch(`${folder}/info.json`);
        albumInfo = await res.json();
        songs = albumInfo.songs;
        displaySongList();
    } catch (error) {
        console.error("Error fetching album info:", error);
        songs = [];
    }
    return songs;
}

function displaySongList() {
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";
    songs.forEach(song => {
        songUL.innerHTML += `
            <li>
                <img class="invert" src="assets/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>VARAD</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="assets/play.svg" alt="">
                </div>
            </li>`;
    });

    Array.from(songUL.getElementsByTagName("li")).forEach((e, idx) => {
        e.addEventListener("click", () => {
            playMusic(songs[idx]);
        });
    });
}

function playMusic(track, pause = false) {
    currentSong.src = `${currFolder}/${track}`;
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "assets/pause.svg";
    }
}

async function displayAlbums() {
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";
    // For demo, if you know the album folders:
    const albums = ["Pritam", "AnotherAlbum"];
    for (const album of albums) {
        try {
            let res = await fetch(`/songs/${album}/info.json`);
            let info = await res.json();
            cardContainer.innerHTML += `
                <div data-folder="/songs/${album}" class="card">
                    <div class="play">
                        <svg ...><!-- Play icon SVG --></svg>
                    </div>
                    <img src="/songs/${album}/${info.cover}" alt="">
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                </div>
            `;
        } catch (err) {
            console.error(`Error loading album ${album}:`, err);
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getAlbumInfo(item.currentTarget.dataset.folder);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    try {
        await getAlbumInfo("/songs/Pritam");
        playMusic(songs[0], true);
        displayAlbums();
    } catch (error) {
        console.error("Error in main function:", error);
    }

    // Rest of your event listeners...
    // Play/pause, next/previous, volume, seekbar, etc.
    // (Copy from your original code)
}

main();