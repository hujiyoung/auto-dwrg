auto();
console.show();

// 全局变量控制循环
let shouldStop = false;

// 监听控制台输入
threads.start(function() {
    console.log("提示: 在控制台输入回车键(ENTER)将停止脚本");
    while(!shouldStop) {
        let input = console.input(); // 等待用户输入
        if(input !== null) { // 只要用户按下回车(即使不输入内容)
            shouldStop = true;
            console.log("接收到停止指令，准备退出...");
        }
    }
});

// 点击屏幕上的指定坐标点
function clickPoint(x, y) {
    press(x, y, 50);
    console.log(`点击位置: (${x}, ${y})`);
    sleep(100);
}

// 从起点随机拖动到半径10px圆内的点，持续0.5秒
function randomDrag(startX, startY) {
    // 计算随机角度(0-360度)
    let angle = Math.random() * Math.PI * 2;
    // 计算随机半径(0-10像素)
    let radius = Math.random() * 10;
    
    // 计算目标坐标
    let endX = startX + radius * Math.cos(angle);
    let endY = startY + radius * Math.sin(angle);
    
    console.log(`从[${startX},${startY}]拖动到[${Math.round(endX)},${Math.round(endY)}]`);
    
    // 执行拖动操作(持续500ms)
    swipe(startX, startY, endX, endY, 500);
    
    // 保持1秒间隔
    sleep(1000);
}

// 主函数
function main() {
    let points = [
        {x: 1733, y: 761, delay: 100},
        {x: 680, y: 761, delay: 100},
        {x: 1098, y: 469, delay: 100},
        {x: 959, y: 986, delay: 100},
        {x: 1610, y: 986, delay: 100}
    ];
    
    // 拖动起始点
    let dragStartPoint = {x: 216, y: 792};
    
    let cycleCount = 0;
    
    console.log("脚本已启动，在控制台按回车键停止");
    
    while(!shouldStop) {
        cycleCount++;
        console.log(`开始第 ${cycleCount} 轮操作`);
        
        // 执行随机拖动操作
        randomDrag(dragStartPoint.x, dragStartPoint.y);
        if(shouldStop) break;
        
        // 点击预设坐标点
        for(let i = 0; i < points.length && !shouldStop; i++) {
            let point = points[i];
            console.log(`点击第 ${i + 1} 个点`);
            clickPoint(point.x, point.y);
            
            if(point.delay > 0) {
                sleep(point.delay);
            }
            
            if(shouldStop) break;
        }
        
        if(shouldStop) break;
    }
    
    console.log("脚本已停止");
    exit();
}

// 调用主函数
main();