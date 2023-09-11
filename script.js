/* ---------------------------  By: Pawan Jain  -------------------------------- */

// add green borders of different widths
// 4 levels
// 1. Just move car
// 2. 1 car
// 3. 2 cars
// 4. 3 cars
// 1 * 2 switch, tap, hold, crash sound, high score, mute, speed
var canvas;
var splash;
var button;
var button1;
var button2;
var button3;
var inMenu = true;
var panel;
var panelvisible = false;
var settings;
var home;
var game_over;
var move_right = false;
var move_left = false;
var car;
var container_left;
var container_width;
var car_width;
var car_height;
var container_height;
var anim_id;
var move_up;
var move_down;
var crashSound;
var car_count = 4;
var is_key_down = false;

var car_1 = $('#car_1');
var car_2 = $('#car_2');
var car_3 = $('#car_3');
var car_4 = $('#car_4');
var line_1 = $('#line_1');
var line_2 = $('#line_2');
var line_3 = $('#line_3');

var score_counter = 1;

var SpeedSld;
var s1;
var s2;
var s3;
var s4;
var speed = 2;
var mute;
var line_speed = speed * 2.5;


var firsttime = true;
window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
    home = document.querySelector('home');
    home.style.left = "8vw";
    home.hidden = true;
    splash = document.querySelector('splash');
    canvas = document.getElementById('game');
    panel = document.querySelector('panel');
    settings = document.querySelector('settings');
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');
    home.onmousedown = function (e) {
        event.preventDefault();
        showMenu();
        stop_the_game(false);
    }

    button.onmousedown = function (e) {
        event.preventDefault();
        Start(0);
    }
    button1.onmousedown = function (e) {
        event.preventDefault();
        Start(1);
    }
    button2.onmousedown = function (e) {
        event.preventDefault();
        Start(2);
    }
    button3.onmousedown = function (e) {
        event.preventDefault();
        Start(3);
    }
    setUpPanel();
}

function setUpPanel() {
    panel.style.left = "130vw";
    slideTo(panel, 130);
    mute = document.createElement("INPUT");
    mute.style.position = "absolute";
    mute.style.height = "3vh";
    mute.style.width = "3vw";
    mute.style.left = "16vw";
    mute.style.top = "3vh";
    mute.checked = false;
    mute.setAttribute("type", "checkbox");
    mute.checked = false;
    SpeedSld = document.createElement("INPUT");
    SpeedSld.setAttribute("type", "range");
    SpeedSld.style.position = "absolute";
    SpeedSld.style.height = "2vh";
    SpeedSld.style.width = "15vw";
    SpeedSld.style.left = "4.3vw";
    SpeedSld.style.top = "12vh";
    SpeedSld.style.color = 'green';
    SpeedSld.value = 3;
    SpeedSld.min = 1;
    SpeedSld.max = 7;

    s1 = document.createElement("INPUT");
    s1.style.position = "absolute";
    s1.style.height = "3vh";
    s1.style.width = "3vw";
    s1.style.left = "1.1vw";
    s1.style.top = "19.6vh";
    s2 = document.createElement("INPUT");
    s2.style.position = "absolute";
    s2.style.height = "3vh";
    s2.style.width = "3vw";
    s2.style.left = "1.1vw";
    s2.style.top = "24.6vh";
    s3 = document.createElement("INPUT");
    s3.style.position = "absolute";
    s3.style.height = "3vh";
    s3.style.width = "3vw";
    s3.style.left = "13vw";
    s3.style.top = "19.6vh";
    s4 = document.createElement("INPUT");
    s4.style.position = "absolute";
    s4.style.height = "3vh";
    s4.style.width = "3vw";
    s4.style.left = "13vw";
    s4.style.top = "24.6vh";
    s1.setAttribute("type", "radio");
    s2.setAttribute("type", "radio");
    s3.setAttribute("type", "radio");
    s4.setAttribute("type", "radio");

    s2.checked = true;
    s4.checked = true;


    function switchOption(i) {
        switch (i) {
            case 1:
                s1.checked = true;
                s2.checked = false;
                localStorage.setItem("Racer.oneSwitch", 1);
                break;
            case 2:
                s2.checked = true;
                s1.checked = false;
                localStorage.setItem("Racer.oneSwitch", 0);
                break;
            case 3:
                s3.checked = true;
                s4.checked = false;
                localStorage.setItem("Racer.holdSwitch", 1);
                break;
            case 4:
                s4.checked = true;
                s3.checked = false;
                localStorage.setItem("Racer.holdSwitch", 0);
                break;
        }
    }

    s1.onclick = function (e) {
        switchOption(1);
    }
    s2.onclick = function (e) {
        switchOption(2);
    }
    s3.onclick = function (e) {
        switchOption(3);
    }
    s4.onclick = function (e) {
        switchOption(4);
    }

    panel.appendChild(mute);
    panel.appendChild(SpeedSld);
    panel.appendChild(s1);
    panel.appendChild(s2);
    panel.appendChild(s3);
    panel.appendChild(s4);

    settings.style.left = "92vw";
    // Retrieve settings
    var s = localStorage.getItem("Racer.mute");
    mute.checked = (s == "true");
    s = parseInt(localStorage.getItem("Racer.speed"));
    if (s < 1 || s > 7)
        s = 3;
    SpeedSld.value = s.toString();
    speed = parseInt(SpeedSld.value);
    line_speed = speed * 2.5;
    s = localStorage.getItem("Racer.oneSwitch");
    if (s == 1)
        switchOption(1);
    else
        switchOption(2);
    s = localStorage.getItem("Racer.holdSwitch");
    if (s == 1)
        switchOption(3);
    else
        switchOption(4);

    mute.onclick = function (e) {
        localStorage.setItem("Racer.mute", mute.checked);
    }
    SpeedSld.onclick = function (e) {
        localStorage.setItem("Racer.speed", SpeedSld.value);
        speed = parseInt(SpeedSld.value);
        line_speed = speed * 2.5;
    }

    panel.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
    }

    settings.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
        if (panelvisible) { // save stored values
            slideTo(panel, 130);
            slideTo(settings, 92);
        } else {
            slideTo(panel, 75);
            slideTo(settings, 78);
        }
        panelvisible = !panelvisible;
    }

    function slideTo(el, left) {
        var steps = 5;
        var timer = 50;
        var elLeft = parseInt(el.style.left) || 0;
        var diff = left - elLeft;
        var stepSize = diff / steps;
        console.log(stepSize, ", ", steps);

        function step() {
            elLeft += stepSize;
            el.style.left = elLeft + "vw";
            if (--steps) {
                setTimeout(step, timer);
            }
        }
        step();
    }
}


function Start(i) {
    car_count = i + 1;
    InitSounds();
    doStart();
    hideMenu();
    is_key_down = false;
}


function PlaySound(s) {
    if (mute.checked)
        return;
    try {
        switch (s) {
            case 'crash.mp3':
                crashSound.play();
                break;
        }
    } catch (e) {};
}


function hideMenu() {
    splash.hidden = true;
    button.hidden = true;
    button1.hidden = true;
    button2.hidden = true;
    button3.hidden = true;
    settings.hidden = true;
    panel.hidden = true;
    inMenu = false;
    home.hidden = false;
}

function showMenu() {
    splash.hidden = false;
    button.hidden = false;
    button1.hidden = false;
    button2.hidden = false;
    button3.hidden = false;
    settings.hidden = false;
    panel.hidden = false;
    home.hidden = true;
    inMenu = true;
}

function InitSounds() {
    if (firsttime) {
        crashSound = new Audio('crash.mp3');
        crashSound.volume = 0;
        crashSound.play();

        setTimeout(function () {
            crashSound.pause();
            crashSound.volume = 1;
        }, 50);

        firsttime = false;
    }
}

var score;
var container;

document.onmousedown = function (e) {
    if (game_over)
        return;
    if (e.x < window.innerWidth / 2)
        turnCar(-1);
    else
        turnCar(1);
}
document.onmouseup = function (e) {
    if (game_over)
        return;
    turnCar(0);
    cancelAnimationFrame(move_left);
    move_left = false;
    cancelAnimationFrame(move_right);
    move_right = false;
}
document.ontouchstart = function (e) {
    if (game_over)
        return;
    if (e.touches[0].clientX < window.innerWidth / 2)
        turnCar(-1);
    else
        turnCar(1);
}
document.ontouchend = function (e) {
    if (game_over)
        return;
    turnCar(0);
    cancelAnimationFrame(move_left);
    move_left = false;
    cancelAnimationFrame(move_right);
    move_right = false;
}

/* Move the cars */
$(document).on('keydown', function (e) {
    if (is_key_down)
        return;
    is_key_down = true;
    var key = e.keyCode;
    if (game_over === false) {

        if (key === 37 && move_left === false) {
            turnCar(-1);
            return $(this);
        } else if (key === 39 && move_right === false) {
            turnCar(1);
            return $(this);
        } else if (key === 38 && move_up === false) {
            //                move_up = requestAnimationFrame(up);
        } else if (key === 40 && move_down === false) {
            //                move_down = requestAnimationFrame(down);
        } else switch (key) {
            case 37:
            case 32:
            case 49:
                SwitchOneDown();
                break;
            case 39:
            case 13:
            case 50:
            case 51:
            case 52:
                SwitchTwoDown();
                break;
        }
    }
});


$(document).on('keyup', function (e) {
    var key = e.keyCode;
    is_key_down = false;
    if (game_over === false) {
        turnCar(0);
        if (key === 37) {
            cancelAnimationFrame(move_left);
            move_left = false;
        } else if (key === 39) {
            cancelAnimationFrame(move_right);
            move_right = false;
        } else if (key === 38) {
            //                cancelAnimationFrame(move_up);
            //                move_up = false;
        } else if (key === 40) {
            //                cancelAnimationFrame(move_down);
            //                move_down = false;
        } else switch (key) {
            case 37:
            case 32:
            case 49:
                SwitchOneUp();
                break;
            case 39:
            case 13:
            case 50:
            case 51:
            case 52:
                SwitchTwoUp();
                break;
        }
    } else {}
});

function doStart() {

    //saving dom objects to variables
    container = $('#container');
    car = $('#car');

    //    var restart_div = $('#restart_div');
    //    var restart_btn = $('#restart');
    score = $('#score');
    // var highscore = $('#highscore');    


    //saving some initial setup
    container_left = parseInt(container.css('left'));
    container_width = parseInt(container.width());
    container_height = parseInt(container.height());
    car_width = parseInt(car.width());
    car_height = parseInt(car.height());

    //some other declarations
    game_over = false;

    move_right = false;
    move_left = false;
    move_up = false;
    move_down = false;
    car.css('left', "45%");

    /* ------------------------------GAME CODE STARTS HERE------------------------------------------- */
    resetCars();

    function up() {
        if (game_over === false && parseInt(car.css('top')) > 0) {
            car.css('top', parseInt(car.css('top')) - 3);
            move_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(car.css('top')) < container_height - car_height) {
            car.css('top', parseInt(car.css('top')) + 3);
            move_down = requestAnimationFrame(down);
        }
    }

    /* Move the cars and lines */
    if (!game_over)
        anim_id = requestAnimationFrame(repeat);

    function repeat() {
        if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3) || collision(car, car_4)) {
            stop_the_game(true);
            return;
        }

        score_counter++;

        if (score_counter % 50 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (score_counter % 500 == 0) {
            //speed = speed + 1.1; // PB 1.5
            //line_speed++; // PB
            //line_speed = speed * 2.5;
        }


        // PB set number of cars here
        car_down(car_1);
        if (car_count > 1)
            car_down(car_2);
        if (car_count > 2)
            car_down(car_3);
        if (car_count > 3)
            car_down(car_4);

        line_down(line_1);
        line_down(line_2);
        line_down(line_3);

        if (game_over)
            return;
        else
            anim_id = requestAnimationFrame(repeat);
    }

    function resetCars() {
        car_1.css('top', "-720px");
        car_2.css('top', "-650px");
        car_3.css('top', "-550px");
        car_4.css('top', "-450px");
        line_1.css('top', "-250px");
        line_2.css('top', "150px");
        line_3.css('top', "550px");

        $('#car').css({
            'transform': 'rotate(0deg)'
        });
        score.text("0");
    }

    function car_down(car) {
        var car_current_top = parseInt(car.css('top'));
        if (car_current_top > container_height) {
            car_current_top = -200;
            var car_left = parseInt(Math.random() * (container_width - car_width));
            car.css('left', car_left);
        }
        car.css('top', car_current_top + speed);
    }

    function line_down(line) {
        var line_current_top = parseInt(line.css('top'));
        if (line_current_top > container_height) {
            line_current_top = -300;
        }
        line.css('top', line_current_top + line_speed);
    }


    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }
}

function stop_the_game(doPause) {
    // if(parseInt(highscore.text) < parseInt(score.text))           // not working 
    // {
    //     highscore.text(parseInt(score.text));
    // }
    game_over = true;
    cancelAnimationFrame(anim_id);
    cancelAnimationFrame(move_right);
    cancelAnimationFrame(move_left);
    cancelAnimationFrame(move_up);
    cancelAnimationFrame(move_down);
    if (doPause)
        setTimeout(function () { // restart in 3 seconds
            end();
        }, 3000);
}

function end() {
    doStart();
}

function left() {
    if (game_over === false && parseInt(car.css('left')) > 0) {
        $('#car').css({
            'transform': 'rotate(-5deg)'
        });
        car.css('left', parseInt(car.css('left')) - (2 + speed) / 2); // speed was 5
        move_left = requestAnimationFrame(left);
    }
}

function right() {
    if (game_over === false && parseInt(car.css('left')) < container_width - car_width) {
        $('#car').css({
            'transform': 'rotate(5deg)'
        });
        car.css('left', parseInt(car.css('left')) + (2 + speed) / 2);
        move_right = requestAnimationFrame(right);
    }
    //    if (parseInt(car.css('left ')) >= container_width - car_width)
    //        stop_the_game();
}

var keyTop = false,
    keyDown = false,
    keyLeft = false,
    keyRight = false;
var mouseDn = false;

function turnCar(i) {
    switch (i) {
        case -1: // left
            $('#car').css({
                'transform': 'rotate(-5deg)'
            });
            move_left = requestAnimationFrame(left);
            break;
        case 0: // straight
            $('#car ').css({
                'transform': 'rotate(0deg)'
            });
            break;
        case 1: //right
            $('#car').css({
                'transform': 'rotate(5deg)'
            });
            move_right = requestAnimationFrame(right);
            break;
    }
}
var lastDirectionLeft = false;
// handle different switch options
function SwitchOneDown() {
    if (s1.checked) {
        if (lastDirectionLeft) {
            cancelAnimationFrame(move_left);
            move_right = true;
            move_left = false;
            turnCar(1);
        } else {
            cancelAnimationFrame(move_right);
            move_right = false;
            move_left = true;
            turnCar(-1);
        }
        lastDirectionLeft = !lastDirectionLeft;
    } else {
        if (move_left === false) {
            cancelAnimationFrame(move_right);
            move_right = false;
            move_left = true;
            turnCar(-1);
        }
    }
}

function SwitchTwoDown() {
    if (s1.checked) {
        if (lastDirectionLeft) {
            cancelAnimationFrame(move_left);
            move_right = true;
            move_left = false;
            turnCar(1);
        } else {
            cancelAnimationFrame(move_right);
            move_right = false;
            move_left = true;
            turnCar(-1);
        }
        lastDirectionLeft = !lastDirectionLeft;
    } else {
        if (move_right === false) {
            cancelAnimationFrame(move_left);
            move_right = true;
            move_left = false;
            turnCar(1);
        }
    }
}

function SwitchOneUp() {
    if (s3.checked)
        return;
    turnCar(0);
    cancelAnimationFrame(move_left);
    move_left = false;
    cancelAnimationFrame(move_right);
    move_right = false;
}

function SwitchTwoUp() {
    if (s3.checked)
        return;
    turnCar(0);
    cancelAnimationFrame(move_left);
    move_left = false;
    cancelAnimationFrame(move_right);
    move_right = false;
}

function Highlight() {
    button.style.opacity = .7;
    button1.style.opacity = .7;
    button2.style.opacity = .7;
    button3.style.opacity = .7;

    switch (menuItem) {
        case 0:
            button.style.opacity = 1.;
            break;
        case 1:
            button1.style.opacity = 1.;
            break;
        case 2:
            button2.style.opacity = 1.;
            break;
        case 3:
            button3.style.opacity = 1.;
            break;
    }
}

var menuItem = 0;

function showPressedButton(index) {
    console.log("Press: ", index);
    if (!splash.hidden) {
        switch (index) {
            case 0: // A
            case 1: // B
            case 2: // X
            case 3: // Y
                Start(menuItem);
                break;
            case 12: // dup
                if (menuItem >= 2)
                    menuItem -= 2;
                Highlight();
                break;
            case 13: // ddown
                if (menuItem < 3)
                    menuItem += 2;
                Highlight();
                break;
            case 14: // dleft
                if (menuItem > 0)
                    menuItem--;
                Highlight();
                break;
            case 15: // dright
                if (menuItem < 4)
                    menuItem++;
                Highlight();
                break;
        }
        console.log("Menu: ", menuItem);
    } else switch (index) {
        case 0: // A
        case 2: // X
        case 14: // Dpad left
        case 4: // LT
        case 6:
            SwitchOneDown();
            break;
        case 1: // B
        case 3: // Y
        case 15: // Dpad right
        case 5:
        case 7:
            SwitchTwoDown();
            break;
        case 10: // XBox
            break;
        case 12: // dpad handled by timer elsewhere
        case 13:
            break;
        default:
    }
}

function removePressedButton(index) {
    console.log("Releasd: ", index);
    if (!splash.hidden) {
        console.log("Menu: ", menuItem);
    } else switch (index) {
        case 0: // A
        case 2: // X
        case 14: // Dpad left
        case 4: // LT
        case 6:
            SwitchOneUp();
            break;
        case 1: // B
        case 3: // Y
        case 15: // Dpad right
        case 5:
        case 7:
            SwitchTwoUp();
            break;
        case 10: // XBox
            break;
        case 12: // dpad handled by timer elsewhere
        case 13:
            break;
        default:
    }
}

var gpad;
var direction = 0;

//function getAxes() {
//    console.log('Axis', gpad.getAxis(0), gpad.getAxis(1), gpad.getAxis(2), gpad.getAxis(3));
//
//    if (splash.hidden) {
//        if (gpad.getAxis(0) < -.2 || gpad.getAxis(2) < -.2) {
//            if (direction != -1)
//                turnCar(-1);
//            direction = -1;
//        } else if (gpad.getAxis(0) > .2 || gpad.getAxis(2) > .2) {
//            if (direction != 1)
//                turnCar(1);
//            direction = 1;
//        } else {
//            if (direction != 0)
//                turnCar(0);
//            direction = 0;
//        }
//    }
//    setTimeout(function () {
//        getAxes();
//    }, 50);
//}

gamepads.addEventListener('connect', e => {
    //        crosshairs.hidden = false;
    console.log('Gamepad connected:');
    console.log(e.gamepad);
    gpad = e.gamepad;
    e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
    e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    //       e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, true),
    //            StandardMapping.Axis.JOYSTICK_LEFT);
    //        e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, false),
    //            StandardMapping.Axis.JOYSTICK_RIGHT);
    //    setTimeout(function () {
    //        getAxes();
    //    }, 50);
});

gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
});

gamepads.start();
