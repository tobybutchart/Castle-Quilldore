const player = document.getElementById('player');

const btnPlay = document.getElementById('onButton');
const btnPause = document.getElementById('noteButton');
const btnVolUp = document.getElementById('upButton');
const btnVolDown = document.getElementById('downButton');

btnPlay.onclick = function() {
    player.play();
}

btnPause.onclick = function() {
    player.pause();
}

btnVolUp.onclick = function() {
    if (player.volume < 1.0) {
        player.volume += 0.1;
    }
}

btnVolDown.onclick = function() {
    if (player.volume > 0.1) {
        player.volume -= 0.1;
    }
}
