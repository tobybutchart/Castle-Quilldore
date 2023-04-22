const healthPointsStr = "healthPoints";
const strengthPointsStr = "strengthPoints";
const activePageStr = "activePage";

const defaultPage = "./pages/page_01.html";

let hp = 20;
let sp = 10;
let activePage = defaultPage;

function load() {
    if ((localStorage.getItem(activePageStr) && localStorage.getItem(activePageStr) != defaultPage  && localStorage.getItem(activePageStr) != './pages/completed.html')
      && localStorage.getItem(healthPointsStr) && localStorage.getItem(strengthPointsStr)) {
        const fnYes = function() {
            hp = localStorage.getItem(healthPointsStr);
            sp = localStorage.getItem(strengthPointsStr);
            activePage = localStorage.getItem(activePageStr);
            loadPage(activePage);
        }
        const fnNo = function() {
            loadPage(activePage);
        }
        showMsg('confirm', 'You have progress saved.<br><br>Would you like to resume your journey?', fnYes, fnNo);
    } else {
        loadPage(activePage);
    }
}

let onResize = null;
let onScroll = null;
let gameplayOnScroll = null;

function clearData() {
    localStorage.clear();
}

function setHP(newHP) {
    hp = Number(newHP);

    if (Number(hp) < 0) {
        hp = 0;
    }
}

function setSP(newSP) {
    sp = Number(newSP);

    if (Number(sp) < 0) {
        sp = 0;
    }
}

/* navigation start */
function navigate(src) {
    window.location.href = src;
}

function goHome() {
    navigate("index.html");
}

function goPlay() {
    navigate("play.html");
}

function goInstruct() {
    navigate("instructions.html");
}

function goDie() {
    clearData();
    navigate("game-over.html");
}

function goCredits() {
    clearData();
    navigate("credits.html");
}
/* navigation end */

function resetGameplayCtrls() {
    const btn = document.getElementById("btn-roll");
    const lblHP = document.getElementById("lbl-stats-health");
    const lblSP = document.getElementById("lbl-stats-strength");

    if (btn) {
        btn.onclick = rollDice;
    }

    if (lblHP) {
        lblHP.innerHTML = hp;
    }

    if (lblSP) {
        lblSP.innerHTML = sp;
    }

    window.removeEventListener('resize', onResize, false);
    window.removeEventListener('scroll', onScroll, false);
    const gameplayArea = document.getElementById("gameplay-area");
    if (gameplayArea) {
        gameplayArea.removeEventListener('scroll', gameplayOnScroll, false);
    }
}

function saveGameDate() {
    localStorage.setItem(healthPointsStr, hp);
    localStorage.setItem(strengthPointsStr, sp);
    localStorage.setItem(activePageStr, activePage);
    localStorage.setItem("lastSaved", Date.now());
}

function loadPage(url) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            activePage = url;

            resetGameplayCtrls();
            saveGameDate();

            document.getElementById("gameplay-container").innerHTML = xhttp.responseText;

            const s = "init" + url.replaceAll("/", "").replaceAll(".", "").replace("pages", "").replace("html", "");
            if (window[s] && typeof window[s] == "function") {
                window[s]();
            } else {
                console.log('no init fn for: ' + s);
            }
        }//TODO - else? loading screen, 404?
    };

    xhttp.onloadstart = function() {
        // console.log("onloadstart");
    };

    xhttp.onloadend = function() {
        // console.log("onloadend");
    };

    xhttp.onerror = function() {
        // console.log("onerror");
    };

    xhttp.onabort = function() {
        // console.log("onabort");
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    // fallbacks for IE and older browsers:
    xhttp.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
    xhttp.setRequestHeader("Pragma", "no-cache");

    try {
        xhttp.send();
    }
    catch(err) {
        console.error(err.message);
    }
}

let isRendering = false;

function overlayImage(imgBackground, imgOverlays) {
    imgBackground.onload = function() {
        if (isRendering) {
            return false;
        }

        isRendering = true;

        let displayHeight = imgBackground.height;
        let displayWidth = imgBackground.width;

        const imgOrig = new Image();
        imgOrig.src = imgBackground.src;

        imgOrig.onload = function() {
            for (let index = 0; index < imgOverlays.length; index++) {
                const imgOverlay = imgOverlays[index];
                imgOverlay.style.display = "none";

                let origHeight = imgOrig.height;
                let origWidth = imgOrig.width;

                const canvas = document.createElement('canvas');
                canvas.width = imgOrig.width;
                canvas.height = imgOrig.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgOrig, 0, 0);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;

                let x = 0;
                let y = 0;
                let count = 0;

                // find pixel to position over
                for(let i = 0; i < data.length; i += 4) {
                    const red = data[i];
                    const green = data[i + 1];
                    const blue = data[i + 2];
                    const alpha = data[i + 3];

                    if (red == 252 && green == 1 && blue == 161) {
                        if (index == count) {
                            x = (i / 4) % imgData.width;
                            y = Math.floor((i / 4) / imgData.width);
                            break;
                        }

                        count++;
                    }
                }

                if (x > 0 && y > 0) {
                    const imgOrigOverlay = new Image();
                    imgOrigOverlay.src = imgOverlay.src;

                    imgOrigOverlay.onload = function(){
                        let rect = imgBackground.getBoundingClientRect();

                        let heightRat = displayHeight / origHeight;
                        let widthRat = displayWidth / origWidth;

                        // position over main image
                        imgOverlay.style.left = (rect.left + (x * widthRat)) + "px";
                        imgOverlay.style.top = (rect.top + (y * heightRat)) + "px";

                        // set relative dimensions
                        imgOverlay.width = (this.width * widthRat);
                        imgOverlay.height = (this.height * heightRat);

                        imgOverlay.style.display = "inline";
                    }
                }
            }
        };

        isRendering = false;
    };

    onResize = function() {
        imgBackground.onload();
    }

    onScroll = function() {
        imgBackground.onload();
    }

    gameplayOnScroll = function() {
        imgBackground.onload();
    }

    window.addEventListener('resize', onResize, false);
    window.addEventListener('scroll', onScroll, false);
    // const gameplayArea = document.getElementById("gameplay-area");
    // if (gameplayArea) {
    //     gameplayArea.addEventListener('scroll', gameplayOnScroll, false);
    // }
}

function diceCallback(result, args, nextPage) {
    const total = (result * sp);
    const index = total == 0 ? 0 : Math.ceil(total / 10) - 1;

    const minHP = args[index][0];
    const minSP = args[index][1];

    setHP(hp - minHP);
    setSP(sp - minSP);

    const fn = function() {
        loadPage(nextPage);
    }

    const attack = `You have rolled a  ${result} giving you ${total} attack point(s)`;
    const summary = (Number(minHP) + Number(minSP)) == 0 ? "<br><br>You have lost no health points or strength points</td></tr></table>" : `<br><br>You have lost:<table><tr><td>Health points:</td><td>${minHP}</td></tr><tr><td>Strength points:</td><td>${minSP}</td></tr></table>`;
    const totals = `<br><br>Remaining:<table><tr><td>Health points:</td><td>${hp}</td></tr><tr><td>Strength points:</td><td>${sp}</td></tr></table>`;

    if (hp <= 0) {
        showMsg('warning', attack + '<br><br>You have run out of health points.<br><br>YOU DIE', goDie);
    } else if (hp <=5) {
        showMsg('info', attack + '<br><br>You have made it through, but only just...' + summary + totals, fn);
    } else {
        showMsg('success', attack + '<br><br>You have made it through!' + summary + totals, fn);
    }
}

function mergeImg() {
    let bool = false;
    let count = 0;

    let int = setInterval(function () {
        bool = !bool;
        let imgSrc = bool ? './img/ouija_bottom.png' : './img/ouija_top.png';
        const img = document.getElementById('gameplay-img');
        img.classList.add("gameplay-img-fadeout");

        let to = setTimeout(function() {
            img.src = imgSrc;
            img.classList.remove("gameplay-img-fadeout");
            count++;

            if (count ==2) {
                clearInterval(int);
                clearTimeout(to);
            }
        }, 250);
    }, 1000);
}

/* page specifics start */
function showKey() {
    const key = document.getElementById("gameplay-img-overlay");

    key.src = "./img/flower_to_key.gif";
    setTimeout(function() {
        key.src = "./img/flower_power.png";
    }, 1000);
}

function findKey() {
    const fn = function() {
        loadPage('./pages/page_07.html');
    };

    showMsg('success', 'You found the key!', fn);
}

function confirmGuard(guardName) {
    const fn = function() {
        if (guardName == 'blue guard') {
            loadPage('./pages/page_09.html');
        } else if (guardName == 'red guard') {
            goDie();
        }
    };

    showMsg('confirm', `Are you sure you want to pick the ${guardName}?`, fn, null);
}

function confirmCandleMace(item) {
    const fn = function() {
        if (item == 'candle') {
            loadPage('./pages/page_10.html');
        } else if (item == 'mace') {
            loadPage('./pages/page_11.html');
        }
    };

    showMsg('confirm', `Are you sure you want to pick the ${item}?`, fn, null);
}

function confirmGhoulName() {
    const fn = function(sender, value) {
        const answer = "Casper";
        if (value.toLowerCase() == answer.toLowerCase()){
            showMsg('success', 'Your guess is correct...');
            loadPage('./pages/page_28.html');
        } else {
            showMsg('warning', 'Your guess is WRONG!');
        }
    }
    showMsg('input', 'What is the name of the sniggering ghoul?<br><br>', fn);
}

function confirmGhoulChoice(goodChoice, goodGhoul) {
    const fn = function(sender, value) {
        if (goodChoice){
            let s = goodGhoul ? "Your were right to trust the ghoul..." : "Your were right to distrust the ghoul...";
            showMsg('success', s);
            loadPage('./pages/page_35.html');
        } else {
            let s = goodGhoul ? "You should ALWAYS trust a ghoul's advice." : "You should NEVER trust a ghoul's advice.";
            showMsg('warning', s, goDie);
        }
    }

    let msg;

    if (goodGhoul) {
        msg = goodChoice ? "Are you sure you want to follow Casper's dastardly advice?" : "Are you sure you want to ignore Casper's sage advice?";
    } else {
        msg = goodChoice ? "Are you sure you want to ignore Casper's sage advice?" : "Are you sure you want to follow Casper's dastardly advice?";
    }

    showMsg('confirm', msg, fn);
}

function drinkPoison() {
    showMsg('warning', 'You drink the potion, and your vision starts to blur...<br><br>You fool! Inside the bottle was poison...<br><br>YOU DIE', goDie);
}

function drinkPotion(page, goodPotion) {
    let msg = goodPotion ? 'You drink the potion, and feel invigorated!<br><br>2 health points have been added to your total' : 'You drink the potion, and feel awful!<br><br>2 health points have been removed from your total';

    const fn = function() {
        if (goodPotion) {
            setHP(Number(hp) + Number(2));
        } else {
            setHP(Number(hp) - Number(2));
        }

        loadPage(page);
    };

    showMsg('info', msg, fn, null);
}

function confirmWeapon(weapon) {
    const msg = `Are you sure you want to choose the ${weapon}?`;

    const fn = function() {
        if (weapon.toLowerCase() == 'sword') {
            loadPage('./pages/page_36.html');
        } else if (weapon.toLowerCase() == 'bomb') {
            loadPage('./pages/page_37.html');
        } else if (weapon.toLowerCase() == 'axe') {
            loadPage('./pages/page_38.html');
        }
    };

    showMsg('confirm', msg, fn);
}

function choseWeapon(score, type) {
    if (type.toLowerCase() == 'hp') {
        setHP(Number(hp) + Number(score));
    } else if (type.toLowerCase() == 'sp') {
        setSP(Number(sp) + Number(score));
    }

    loadPage('./pages/page_39.html');
}

function showSteppingStone() {
    const key = document.getElementById("gameplay-img-overlay");

    key.src = "./img/rock.png";
    setTimeout(function() {
        key.src = "./img/rock_gone.png";
    }, 250);
}

function findSteppingStone() {
    const fn = function() {
        loadPage('./pages/page_40.html');
    };

    showMsg('success', 'You found the stepping stone!', fn);
}
/* page specifics end */

/* page inits start */
function initpage_03() {
    const imgBackground = document.getElementById('gameplay-img');
    const imgOverlay = document.getElementById('gameplay-img-overlay');

    overlayImage(imgBackground, [imgOverlay]);
}

function initpage_04() {
    const fn = function() {
        let args = [[2, 2], [1, 1], [1, 0], [0, 1], [0, 0], [0, 0]];
        rollDice(diceCallback, args, './pages/page_05.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_05() {
    const fn = function() {
        let args = [[2, 2], [2, 2], [2, 2], [2, 2], [1, 1], [0, 0]];
        rollDice(diceCallback, args, './pages/page_08.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_06() {
    const imgBackground = document.getElementById('gameplay-img');
    const imgOverlay = document.getElementById('gameplay-img-overlay');

    overlayImage(imgBackground, [imgOverlay]);
}

function initpage_07() {
    const fn = function() {
        let args = [[2, 2], [1, 1], [1, 0], [0, 1], [0, 0], [0, 0]];
        rollDice(diceCallback, args, './pages/page_08.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_08() {
    const imgBackground = document.getElementById('gameplay-img');
    const blueGuard = document.getElementById('gameplay-img-overlay-blue-guard');
    const redGuard = document.getElementById('gameplay-img-overlay-red-guard');

    overlayImage(imgBackground, [blueGuard, redGuard]);
}

function initpage_09() {
    const imgBackground = document.getElementById('gameplay-img');
    const mace = document.getElementById('gameplay-img-overlay-mace');
    const candle = document.getElementById('gameplay-img-overlay-candle');

    overlayImage(imgBackground, [mace, candle]);
}

function initpage_10() {
    const fn = function() {
        let args = [[2, 2], [2, 2], [0, 0], [0, 0], [0, 0], [0, 0]];
        rollDice(diceCallback, args, './pages/page_12.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_11() {
    const fn = function() {
        let args = [[2, 2], [2, 2], [2, 2], [2, 2], [1, 1], [0, 0]];
        rollDice(diceCallback, args, './pages/page_12.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_13() {
    const fn = function() {
        let args = [[2, 2], [2, 2], [2, 2], [2, 2], [1, 1], [0, 0]];
        rollDice(diceCallback, args, './pages/page_15.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_24() {
    const imgBackground = document.getElementById('gameplay-img');
    const imgOverlay = document.getElementById('gameplay-img-overlay');

    overlayImage(imgBackground, [imgOverlay]);
}

function initpage_25() {
    const imgBackground = document.getElementById('gameplay-img');
    const imgOverlay = document.getElementById('gameplay-img-overlay');

    overlayImage(imgBackground, [imgOverlay]);
}

function initpage_26() {
    const fn = function() {
        let args = [[2, 2], [2, 2], [2, 2], [2, 2], [1, 1], [0, 0]];
        rollDice(diceCallback, args, './pages/page_27.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_29() {
    const fn = function() {
        let args = [[2, 2], [2, 2], [2, 0], [0, 2], [0, 0], [0, 0]];
        rollDice(diceCallback, args, './pages/page_30.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_31() {
    const fn = function() {
        let args = [[3, 0], [3, 0], [2, 0], [1, 0], [0, 0], [0, 0]];
        rollDice(diceCallback, args, './pages/page_32.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_32() {
    const fn = function() {
        let args = [[2, 2], [2, 2], [2, 0], [0, 2], [0, 0], [0, 0]];
        rollDice(diceCallback, args, './pages/page_35.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_33() {
    const imgBackground = document.getElementById('gameplay-img');
    const imgOverlay = document.getElementById('gameplay-img-overlay');

    overlayImage(imgBackground, [imgOverlay]);
}

function initpage_35() {
    const imgBackground = document.getElementById('gameplay-img');
    const sword = document.getElementById('gameplay-img-overlay-sword');
    const bomb = document.getElementById('gameplay-img-overlay-bomb');
    const axe = document.getElementById('gameplay-img-overlay-axe');

    overlayImage(imgBackground, [sword, bomb, axe]);
}

function initpage_39() {
    const imgBackground = document.getElementById('gameplay-img');
    const imgOverlay = document.getElementById('gameplay-img-overlay');

    overlayImage(imgBackground, [imgOverlay]);
}

function initpage_40() {
    const fn = function() {
        let args = [[2, 2], [2, 2], [1, 0], [0, 1], [0, 0], [0, 0]];
        rollDice(diceCallback, args, './pages/page_41.html');
    }
    document.getElementById("btn-roll").onclick = fn;
}

function initpage_42() {
    const rollToWin = function() {
        const fn = function(result, args, nextPage) {
            const total = (Number(result) * Number(sp)) + Number(hp);
            const msg = `Your total score is ${total}<br><br>`;

            if (total >= 30) {
                showMsg('success', msg + 'You have beaten the mighty <i>King Krillarg</i>!<br><br><i>Castle Quilldore</i> is yours once again...', function() {loadPage('./pages/completed.html')});
            } else {
                showMsg('warning', msg + 'You do not have enough attack points to defeat the mighty <i>King Krillarg</i>...<br><br>YOU DIE', goDie);
            }
        }

        rollDice(fn);
    }

    document.getElementById("btn-roll").onclick = rollToWin;
}
/* page inits end */
