auto();
console.show();

let shouldPause = false; // 改为暂停标志
let wasInAllowedTime = false;
let enteredTimeRange = false;

// 控制台输入监听
threads.start(function() {
    console.log("提示: 在控制台输入回车键(ENTER)将暂停/继续脚本");
    while (true) {
        let input = console.input();
        if (input !== null) {
            shouldPause = !shouldPause; // 切换暂停状态
            if (shouldPause) {
                console.log("脚本已暂停，再次按回车键继续...");
            } else {
                console.log("脚本已继续运行...");
            }
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
        (totalMinutes >= 21 * 60 || totalMinutes <= 2 * 60 + 30)       // 21:00 - 02:30
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
        {x: 1733, y: 761, delay: 100},      // 点击两次书，复位
        {x: 1733, y: 761, delay: 100},      //
        {x: 1098, y: 469, delay: 100},      // 点击娱乐模式
        {x: 1101, y: 841, delay: 100},      // 点击模仿者模式
        {x: 1480, y: 535, delay: 100},      // 选择12人
        {x: 680, y: 734, delay: 100},       // 开始游戏
        {x: 1100, y: 964, delay: 200},      // 确认准备
        {x: 1200, y: 981, delay: 100},      
        {x: 150, y: 444, delay: 100}
    ];

    let dragStartPoint = {x: 216, y: 792};
    let cycleCount = 0;

    console.log("脚本已启动，在控制台按回车键暂停/继续");

    while (true) {
        // 检查暂停状态
        while (shouldPause) {
            sleep(1000);
        }

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
        if (shouldPause) continue;

        for (let i = 0; i < points.length; i++) {
            // 检查暂停状态
            while (shouldPause) {
                sleep(1000);
            }
            
            let point = points[i];
            console.log(`点击第 ${i + 1} 个点`);
            clickPoint(point.x, point.y);
            if (point.delay > 0) {
                sleep(point.delay);
            }
        }

        // 检查暂停状态
        while (shouldPause) {
            sleep(1000);
        }
        
        sleep(1000); // 每轮循环结束前稍作等待
    }
}

main();