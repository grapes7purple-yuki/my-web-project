document.addEventListener('DOMContentLoaded', function() {
    const message = document.getElementById('message');
    const colorButton = document.getElementById('colorButton');
    const resetButton = document.getElementById('resetButton');
    
    // 颜色数组
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#33FFF6'];
    
    // 改变颜色功能
    colorButton.addEventListener('click', function() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        message.style.color = randomColor;
        message.textContent = '颜色已改变！';
    });
    
    // 重置功能
    resetButton.addEventListener('click', function() {
        message.style.color = '#333';
        message.textContent = '点击按钮改变颜色！';
    });
});