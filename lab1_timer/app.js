var cu_btn = document.getElementById("countup");
var cd_btn = document.getElementById("countdown");
var resume_btn = document.getElementById("resume");
var pause_btn = document.getElementById("pause");
var restart_btn = document.getElementById("restart");
var clear_btn = document.getElementById("clear");
var input_divs = document.getElementsByClassName("text-div");
var hint = document.getElementById("hint");

var hour_last, minute_last, second_last; // 用一个全局变量来记录输入的值，方便重新再计时使用
var hour, minute, second; // 记录当前要被显示的时间

var time = document.getElementById("time");

var direction;

var second_unit = 1000;
var minute_unit = 60 * 1000;
var hour_unit = 60 * 60 * 1000;
var start; // 开始时的时间
var current; // 当前的时间
var accumulator; // 暂停前的时间积累

var update_handle;

function update_up() {
    current = new Date().getTime();
    current = current - start + accumulator;
    hour = Math.floor(current / hour_unit);
    current = current % hour_unit;
    minute = Math.floor(current / minute_unit);
    current = current % minute_unit;
    second = Math.floor(current/second_unit);
    time.innerText = time2text(hour, minute, second);
    hint.innerText = "正在正计时 " + time2text(hour_last, minute_last, second_last);
    if(hour == hour_last && minute == minute_last && second == second_last) {
        clearInterval(update_handle);
        hint.innerText = "正计时 " + time2text(hour_last, minute_last, second_last) + " 已结束"; 
        resume_btn.style.display = "none";
        pause_btn.style.display = "none";
    }
}

function update_down() {
    current = new Date().getTime();
    var total = hour_last * hour_unit + minute_last * minute_unit + second_last * second_unit;
    current = total - (current - start + accumulator);
    if(current < 0) {
        clearInterval(update_handle)
        hint.innerText = "倒计时 " + time2text(hour_last, minute_last, second_last) + " 已结束"; 
        resume_btn.style.display = "none";
        pause_btn.style.display = "none";
        return;
    }
    current = current < 0 ? 0 : current;
    hour = Math.floor(current / hour_unit);
    current = current % hour_unit;
    minute = Math.floor(current / minute_unit);
    current = current % minute_unit;
    second = Math.floor(current/second_unit);
    time.innerText = time2text(hour, minute, second);
    hint.innerText = "正在倒计时 " + time2text(hour_last, minute_last, second_last);
}

function time2text(hour, minute, second) {
    var text_hour, text_minute, text_second;
    if(hour < 10) text_hour = '0' + hour;
    else text_hour = hour;
    if(minute < 10) text_minute = '0' + minute;
    else text_minute = minute;
    if(second < 10) text_second = '0' + second;
    else text_second = second;
    return text_hour + ':' + text_minute + ':' + text_second;
}

function text2num(text) {
    var regex = /^\d+$/;
    if(!regex.test(text)) {
        return -1;
    }
    else var num = parseInt(text);
    if(num > 59) num = 59;
    return num;
}

cu_btn.onclick = function() {
    // 读入输入到input里面的数字
    hour_last = text2num(document.getElementById("hour").value);
    minute_last = text2num(document.getElementById("minute").value);
    second_last = text2num(document.getElementById("second").value);
    if(hour_last == -1 
        || minute_last == -1 
        || second_last == -1) {
            alert('Invalid number!');
            return -1;
    }
    direction = 0; // 正计时
    start_countup();
};

function start_countup() {
    accumulator = 0;
    // 调整button和input的显隐
    countdown.style.display = "none";
    countup.style.display = "none";
    for(var i = 0; i < input_divs.length; i++) {
        input_divs[i].style.display = "none";
    }
    resume_btn.style.display = "none";
    pause_btn.style.display = "inline-block";
    clear_btn.style.display = "block";
    restart_btn.style.display = "block";
    clear_btn.value = "清空正计时";
    // 使下方的数字在不停走动，修改左侧文字
    hint.style.display = "inline-block";
    start = new Date().getTime();
    update_handle = setInterval(update_up, 50);
}

cd_btn.onclick = function() {
    // 读入输入到input里面的数字
    hour_last = text2num(document.getElementById("hour").value);
    minute_last = text2num(document.getElementById("minute").value);
    second_last = text2num(document.getElementById("second").value);
    if(hour_last == -1 
        || minute_last == -1 
        || second_last == -1) {
            alert('Invalid number!');
            return -1;
    }
    direction = 1; // 倒计时
    start_countdown();
};
function start_countdown() {
    accumulator = 0;
    // 调整button和input的显隐
    countdown.style.display = "none";
    countup.style.display = "none";
    for(var i = 0; i < input_divs.length; i++) {
        input_divs[i].style.display = "none";
    }
    pause_btn.style.display = "inline-block";
    resume_btn.style.display = "none";
    clear_btn.style.display = "block";
    restart_btn.style.display = "block";
    clear_btn.value = "清空倒计时";
    // 使下方的数字在不停走动，修改左侧文字
    hint.style.display = "inline-block";
    start = new Date().getTime();
    update_handle = setInterval(update_down, 50);
}

pause_btn.onclick = pause;
function pause() {
    // 使两边的时间流动停下来，并且修改文字
    current = new Date().getTime();
    accumulator += current - start;
    clearInterval(update_handle);
    if(direction == 0) hint.innerText = "暂停正计时 " + time2text(hour_last, minute_last, second_last);
    else if(direction == 1) hint.innerText = "暂停倒计时 " + time2text(hour_last, minute_last, second_last);
    else alert("No previous counting!");
    // 隐藏暂停按钮，显示恢复按钮
    pause_btn.style.display = "none";
    resume_btn.style.display = "inline-block";
}

resume_btn.onclick = resume;
function resume() {
    // 使时间继续流动
    start = new Date().getTime();
    if(direction == 0) update_handle = setInterval(update_up, 50);
    else if(direction == 1) update_handle = setInterval(update_down, 50);
    else alert("No previous counting!");
    // 隐藏恢复按钮，显示暂停按钮
    resume_btn.style.display = "none";
    pause_btn.style.display = "inline-block";
}

clear_btn.onclick = clear;
function clear() {
    // 把时间清零，并且修改文字
    clearInterval(update_handle);
    // 把开始前的input和按钮显示，隐藏无关按钮
    clear_btn.style.display = 'none';
    restart_btn.style.display = 'none';
    pause_btn.style.display = 'none';
    resume_btn.style.display = 'none';
    hint.style.display = 'none';
    countdown.style.display = "inline-block";
    countup.style.display = "inline-block";
    for(var i = 0; i < input_divs.length; i++) {
        input_divs[i].style.display = "inline-block";
    }
    time.innerText = "00:00:00";
}

restart_btn.onclick = restart;
function restart() {
    // 重设两个时间，并且修改文字
    clearInterval(update_handle);
    // 把暂停按钮显示，把回复按钮隐藏
    if(direction == 0) start_countup();
    else if(direction == 1) start_countdown();
    else alert("No previous counting!");
    //  resume_btn.style.display = "none";
}



document.onkeydown = function(event) {
    var e = event || window.event;
    var keyCode = e.keyCode || e.which;
    switch(keyCode) {
        case 32:
        case 13:
            event.preventDefault();
            break;
        default:
            break;
    }
}

document.onkeyup = function(event) {
    var e = event || window.event;
    var keyCode = e.keyCode || e.which;
    switch(keyCode) {
        case 13: // Enter 
            event.preventDefault();
            if(cu_btn.style.display != "none") {
                cu_btn.click();
            }
            break;
        case 32: // BlankSpace
            if(pause_btn.style.display != "none") {
                event.preventDefault();
                pause_btn.click();
            }
            else if(resume_btn.style.display != "none") {
                event.preventDefault();
                resume_btn.click();
            }
            break;
        default: break;
    }
}