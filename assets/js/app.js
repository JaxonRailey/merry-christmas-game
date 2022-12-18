const $one = document.querySelector.bind(document);
const $all = document.querySelectorAll.bind(document);

document.addEventListener('DOMContentLoaded', () => {

    let help      = 0;
    let snowing   = null;
    let startTime = null;
    let endTime   = null;
    let url       = window.location.search;
    let numbers   = $all('[type="number"]');
    let sound     = new Audio('assets/sound/win.mp3');
    let melody    = new Audio('assets/sound/christmas.mp3');
    let params    = new URLSearchParams(url);
    let name      = params.get('u');
    let correct   = correctCode();
    let wrong     = wrongNumbers(correct);
    let pos       = Math.floor(Math.random() * 2);
    let index     = Math.floor(Math.random() * 3);
    let first     = firstHint(correct, wrong, index, pos);
    let second    = secondHint(correct, wrong, index);
    let third     = thirdHint(correct, pos, index, first, second);
    let christmas = bodymovin.loadAnimation({
        container: $one('.christmas'),
        path: 'assets/js/christmas.json',
        renderer: 'svg',
        loop: false,
        name: 'christmas',
        autoplay: false
    });

    // open intro
    $one('.intro').setAttribute('visible', true);

    // close intro
    $one('.intro button').addEventListener('click', () => {
        $one('.intro').classList.add('active');
        $one('.intro.active').addEventListener('animationend', () => {
           startTime = new Date();
        });
    });

    // set name
    if (name) {
        try {
            name = atob(name);
            $one('.gift .numbers span').innerText = name;
            $one('.intro h1').innerText += ' ' + name;
        } catch {}
    }

    // print hints
    [first, second, third, wrong].forEach((array, index) => $one('.hint:nth-child(' + (index + 1) + ') .box').innerText = array.join(' '));

    // check win
    numbers.forEach((el) => {
        el.addEventListener('input', () => {
            if (correct[0] === parseInt(numbers[0].value) && correct[1] === parseInt(numbers[1].value) && correct[2] === parseInt(numbers[2].value)) {
                $one('.gift').classList.add('open');
                numbers.forEach(item => item.disabled = true);
                sound.play();
                endTime = new Date() - startTime;
                let congrats = 'Complimenti';

                if (name) {
                    congrats += ' ' + name.charAt(0).toUpperCase() + name.slice(1);
                }

                congrats += '!!! Hai risolto la combinazione in ' + Math.round(endTime) / 1000 + ' secondi';
                console.warn(congrats);
            }
        });
    })

    // load blank animation
    $one('.gift').addEventListener('animationend', () => {
        $one('.blank').classList.add('active');
        $one('.blank.active:not(.fade)').addEventListener('animationend', () => {
            if (snowing) return;
            $one('.blank').classList.remove('active');
            $one('body').style.backgroundImage = 'url("assets/img/snow.jpg")';
            $one('main .gift').remove();
            $one('main .hints').remove();
            $one('.christmas').classList.remove('hide');
            $one('main').style.padding = 0;
            $one('.blank').classList.add('fade');
            christmas.setSpeed(0.40);
            christmas.play();
            melody.play();
            snowing = setInterval(snowflake, 800);
        });
    });

    // easter egg
    $one('.gift .numbers span').addEventListener('click', (e) => {
        if (e.detail === 3) {
            numbers[help].value    = correct[help];
            numbers[help].disabled = true;
            if (++help === 3) {
                $one('.gift').classList.add('open');
                sound.play();
                console.warn('Sono sicuro che ci riusciresti anche senza aiuto ;)');
            }
        }
    });

    // manage focus on inputs
    numbers.forEach((el, i) => {
        el.addEventListener('focus', () => {
            window.setTimeout(() => {
                let val  = el.value;
                el.value = '';
                el.value = val;
            }, 1);
        });

        el.addEventListener('input', (e) => {
            el.value = e.data;
        });

        el.addEventListener('keyup', (e) => {
            if (el.value.length && e.key !== 'Backspace') {
                if (numbers[i + 1]) {
                    numbers[i + 1].focus();
                }
            }

            if (!el.value.length) {
                if (numbers[i - 1]) {
                    numbers[i - 1].focus();
                }
            }
        });
    });

    // print signature
    christmas.addEventListener('complete', () => {
        clearInterval(snowing);
        let signature = document.createElement('div');
        signature.classList = 'final';
        signature.innerText = 'Buon Natale, da Loris';
        document.body.appendChild(signature);
        console.log("%c\r\n  ____                              _   _           _             _        \r\n |  _ \\                            | \\ | |         | |           | |       \r\n | |_) |  _   _    ___    _ __     |  \\| |   __ _  | |_    __ _  | |   ___ \r\n |  _ <  | | | |  \/ _ \\  | \'_ \\    | . ` |  \/ _` | | __|  \/ _` | | |  \/ _ \\\r\n | |_) | | |_| | | (_) | | | | |   | |\\  | | (_| | | |_  | (_| | | | |  __\/\r\n |____\/   \\__,_|  \\___\/  |_| |_|   |_| \\_|  \\__,_|  \\__|  \\__,_| |_|  \\___|\r\n                                                                           \r\n                                                                           \r\n                _             _                       _                    \r\n               | |           | |                     (_)                   \r\n             __| |   __ _    | |        ___    _ __   _   ___              \r\n            \/ _` |  \/ _` |   | |       \/ _ \\  | \'__| | | \/ __|             \r\n           | (_| | | (_| |   | |____  | (_) | | |    | | \\__ \\             \r\n            \\__,_|  \\__,_|   |______|  \\___\/  |_|    |_| |___\/             \r\n                                                                           \r\n                                                                           \r\n", 'color: #C21010');
        console.warn('Link della repo:', 'https://github.com/JaxonRailey/merry-christmas-game');
    });
});

function correctCode() {

    let code = [];
    while (code.length < 3) {
        let random = Math.floor(Math.random() * 10);
        if (!code.includes(random)) {
            code.push(random);
        }
    }

    return code;
}

function wrongNumbers(correct) {

    let wrong = [];
    while (wrong.length < 3) {
        let random = Math.floor(Math.random() * 10);
        if (!wrong.includes(random) && !correct.includes(random)) {
            wrong.push(random);
        }
    }

    return wrong;
}

function firstHint(correct, wrong, index, pos) {

    let i        = Math.floor(Math.random() * 3);
    let array    = correct.slice(0);
    let shuffled = [];

    array[index] = wrong[i];

    if (pos === 0) {
        if (index === 1) {
            shuffled[0] = array[2];
            shuffled[1] = array[0];
            shuffled[2] = array[1];
        } else {
            shuffled[0] = array[1];
            shuffled[1] = array[2];
            shuffled[2] = array[0];
        }
    } else {
        if (index === 1) {
            shuffled[0] = array[1];
            shuffled[1] = array[2];
            shuffled[2] = array[0];
        } else {
            shuffled[0] = array[2];
            shuffled[1] = array[0];
            shuffled[2] = array[1];
        }
    }

    return shuffled;
}

function secondHint(correct, wrong, index) {

    let code   = [];
    let random = 0;
    while (code.length < 3) {
        random = Math.floor(Math.random() * 10);
        if (!wrong.includes(random) && !correct.includes(random) && !code.includes(random)) {
            code.push(random);
        }
    }

    code[index] = correct[index];

    return code;
}

function thirdHint(correct, pos, index, first, second) {

    let code   = [];
    let random = null;
    let value  = null;
    let newPos = null;

    while (code.length < 3) {
        let random = Math.floor(Math.random() * 10);
        if (!correct.includes(random) && !code.includes(random) && !second.includes(random)) {
            code.push(random);
        }
    }

    if (!pos) {
        random = 2;
        while (random === index) {
            random--;
        }
    } else {
        random = 0;
        while (random === index) {
            random++;
        }
    }

    value = correct[random];

    do {
        newPos = Math.floor(Math.random() * 3);
    } while (newPos === first.indexOf(value) || newPos === correct.indexOf(value));

    code[newPos] = value;

    return code;
}

function snowflake() {
    let snow = document.createElement('div');
    snow.classList.add('snow');
    document.body.appendChild(snow);
    snow.style.left = Math.random() * 100 + 'vw';
    snow.style.animationDuration = Math.random() * 5 + 8 + 's';
}
