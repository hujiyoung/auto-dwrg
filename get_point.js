auto();
console.show();

// 监听触摸事件（需要root权限）
events.observeTouch();
events.onTouch(function(p) {
    console.log(`触摸坐标: X=${p.x}, Y=${p.y}`);
});

// 保持脚本运行
setInterval(() => {}, 1000);