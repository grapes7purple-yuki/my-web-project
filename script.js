// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 主题切换功能 =====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // 检查本地存储的主题偏好
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // 切换图标
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // ===== 导航栏滚动效果 =====
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '1rem 0';
        }
    });
    
    // ===== 演示按钮动画 =====
    const demoBtn1 = document.getElementById('demoBtn1');
    if (demoBtn1) {
        demoBtn1.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> 完成！';
                this.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
                
                setTimeout(() => {
                    this.innerHTML = '演示动画';
                    this.style.transform = '';
                    this.style.background = 'var(--accent-color)';
                }, 1000);
            }, 1500);
        });
    }
    
    // ===== 颜色游戏逻辑 =====
    const gameBoard = document.getElementById('gameBoard');
    const targetColor = document.getElementById('targetColor');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const startGameBtn = document.getElementById('startGame');
    const resetGameBtn = document.getElementById('resetGame');
    const hintBtn = document.getElementById('hintBtn');
    const gameMessage = document.getElementById('gameMessage');
    
    let score = 0;
    let timeLeft = 30;
    let timer;
    let isGameActive = false;
    let correctColorIndex;
    let colors = [];
    
    // 生成随机颜色
    function generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // 初始化游戏
    function initGame() {
        if (isGameActive) return;
        
        score = 0;
        timeLeft = 30;
        scoreElement.textContent = score;
        timerElement.textContent = timeLeft;
        gameBoard.innerHTML = '';
        colors = [];
        isGameActive = true;
        
        // 生成目标颜色
        const target = generateRandomColor();
        targetColor.style.backgroundColor = target;
        colors.push(target);
        
        // 生成其他颜色（与目标颜色相似但不相同）
        for (let i = 0; i < 11; i++) {
            let color;
            do {
                color = generateRandomColor();
            } while (colors.includes(color));
            colors.push(color);
        }
        
        // 随机排列颜色
        colors.sort(() => Math.random() - 0.5);
        correctColorIndex = colors.indexOf(target);
        
        // 创建颜色方块
        colors.forEach((color, index) => {
            const square = document.createElement('div');
            square.className = 'color-square';
            square.style.backgroundColor = color;
            square.dataset.index = index;
            
            square.addEventListener('click', function() {
                if (!isGameActive) return;
                
                const clickedIndex = parseInt(this.dataset.index);
                if (clickedIndex === correctColorIndex) {
                    // 正确选择
                    score += 10;
                    scoreElement.textContent = score;
                    gameMessage.textContent = '正确！+10分';
                    gameMessage.style.color = '#4CAF50';
                    
                    // 视觉反馈
                    this.style.transform = 'scale(1.2)';
                    this.style.border = '3px solid #4CAF50';
                    
                    // 下一轮
                    setTimeout(() => {
                        initGame();
                    }, 500);
                } else {
                    // 错误选择
                    score = Math.max(0, score - 5);
                    scoreElement.textContent = score;
                    gameMessage.textContent = '错误！-5分';
                    gameMessage.style.color = '#f44336';
                    
                    // 视觉反馈
                    this.style.transform = 'scale(0.9)';
                    this.style.border = '3px solid #f44336';
                    
                    setTimeout(() => {
                        this.style.transform = '';
                        this.style.border = '';
                        gameMessage.textContent = '点击与目标颜色相同的方块！';
                        gameMessage.style.color = '';
                    }, 500);
                }
            });
            
            gameBoard.appendChild(square);
        });
        
        // 开始计时器
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 10) {
                timerElement.style.color = '#f44336';
            }
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    // 结束游戏
    function endGame() {
        isGameActive = false;
        clearInterval(timer);
        
        let message = `游戏结束！最终得分: ${score}`;
        if (score >= 100) {
            message += ' 🌟 太棒了！';
        } else if (score >= 50) {
            message += ' 👍 不错！';
        } else {
            message += ' 💪 继续努力！';
        }
        
        gameMessage.textContent = message;
        gameMessage.style.color = '#FF9800';
    }
    
    // 提示功能
    function showHint() {
        if (!isGameActive) return;
        
        const correctSquare = gameBoard.children[correctColorIndex];
        correctSquare.style.border = '3px solid #FFD700';
        correctSquare.style.boxShadow = '0 0 20px #FFD700';
        
        setTimeout(() => {
            correctSquare.style.border = '';
            correctSquare.style.boxShadow = '';
        }, 1000);
        
        score = Math.max(0, score - 3);
        scoreElement.textContent = score;
    }
    
    // 事件监听
    if (startGameBtn) {
        startGameBtn.addEventListener('click', initGame);
    }
    
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', function() {
            clearInterval(timer);
            isGameActive = false;
            initGame();
        });
    }
    
    if (hintBtn) {
        hintBtn.addEventListener('click', showHint);
    }
    
    // 初始化一次游戏
    initGame();
    
    // ===== 表单提交功能 =====
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
            submitBtn.disabled = true;
            
            // 模拟发送过程
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> 发送成功！';
                submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
                
                // 重置表单
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    
                    // 显示通知
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #4CAF50;
                        color: white;
                        padding: 1rem;
                        border-radius: 5px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        z-index: 1000;
                    `;
                    notification.innerHTML = '<i class="fas fa-check-circle"></i> 消息发送成功！';
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }, 1000);
            }, 1500);
        });
    }
    
    // ===== 回到顶部按钮 =====
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== 平滑滚动 =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== 页面加载动画 =====
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 初始设置
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    
    // ===== 控制台欢迎信息 =====
    console.log('%c🎨 欢迎来到创意网站！', 'color: #4361ee; font-size: 18px; font-weight: bold;');
    console.log('%c这是一个使用 HTML5, CSS3 和 JavaScript 构建的现代网站示例', 'color: #7209b7;');
});