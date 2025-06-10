auto();
console.show();

let shouldStop = false;
let wasInAllowedTime = false; // 标记是否已经在允许时间段内
let enteredTimeRange = false; // 标记是否刚刚进入允许时间段

// 控制台输入监听
threads.start(function() {
    console.log("提示: 在控制台输入回车键(ENTER)将停止脚本");
    while (!shouldStop) {
        let input = console.input();
        if (input !== null) {
            shouldStop = true;
            console.log("接收到停止指令，准备退出...");
        }
    }
});

// 判断当前是否在允许时间段内
function isInAllowedTime() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let totalMinutes = hour * 60 + minute;

    return (
        (totalMinutes >= 8 * 60 && totalMinutes <= 12 * 60 + 30) || // 08:00 - 12:30
        (totalMinutes >= 14 * 60 && totalMinutes <= 19 * 60 + 30) || // 14:00 - 19:30
        (totalMinutes >= 21 * 60 || totalMinutes <= 90)              // 21:00 - 01:30
    );
}

function clickPoint(x, y) {
    press(x, y, 50);
    console.log(`点击位置: (${x}, ${y})`);
    sleep(100);
}

function randomDrag(startX, startY) {
    let angle = Math.random() * Math.PI * 2;
    let radius = Math.random() * 10;
    let endX = startX + radius * Math.cos(angle);
    let endY = startY + radius * Math.sin(angle);

    console.log(`从[${startX},${startY}]拖动到[${Math.round(endX)},${Math.round(endY)}]`);
    swipe(startX, startY, endX, endY, 500);
    sleep(5000);
}

function main() {
    let points = [
        {x: 1733, y: 761, delay: 100},
        {x: 1733, y: 761, delay: 100},
        {x: 1098, y: 469, delay: 100},
        {x: 1370, y: 841, delay: 100},
        {x: 1480, y: 535, delay: 100},
        {x: 680, y: 734, delay: 100},
        {x: 1100, y: 964, delay: 200},
        {x: 1200, y: 981, delay: 100},
        {x: 150, y: 444, delay: 100}
    ];

    let dragStartPoint = {x: 216, y: 792};
    let cycleCount = 0;

    console.log("脚本已启动，在控制台按回车键停止");

    while (!shouldStop) {
        let nowAllowed = isInAllowedTime();

        if (!nowAllowed) {
            console.log("当前不在允许的时间段内，等待60秒后再次检测...");
            wasInAllowedTime = false;
            sleep(60000);
            continue;
        }

        if (!wasInAllowedTime) {
            enteredTimeRange = true;
            wasInAllowedTime = true;
        } else {
            enteredTimeRange = false;
        }

        if (enteredTimeRange) {
            console.log("首次进入允许时间段，点击 (147,96) 两次");
            clickPoint(147, 96);
            sleep(300);
            clickPoint(147, 96);
            sleep(500);
        }

        cycleCount++;
        console.log(`开始第 ${cycleCount} 轮操作`);

        randomDrag(dragStartPoint.x, dragStartPoint.y);
        if (shouldStop) break;

        for (let i = 0; i < points.length && !shouldStop; i++) {
            let point = points[i];
            console.log(`点击第 ${i + 1} 个点`);
            clickPoint(point.x, point.y);
            if (point.delay > 0) {
                sleep(point.delay);
            }
        }

        sleep(1000); // 每轮循环结束前稍作等待
    }

    console.log("脚本已停止");
    exit();
}

main();
