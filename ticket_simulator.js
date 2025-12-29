// 抢票模拟器 JavaScript 文件

// 全局变量
let currentUser = null;
let autoBuyInterval = null;
let ticketStatus = {
    vip: { available: false, count: 0 },
    ordinary: { available: false, count: 0 }
};

// 高级策略变量
let preorderInfo = {
    isPreordered: false,
    ticketType: null,
    preorderTime: null,
    orderId: null
};

// DOM 元素
const loginSection = document.getElementById('loginSection');
const ticketSection = document.getElementById('ticketSection');
const messageArea = document.getElementById('messageArea');
const logContainer = document.getElementById('logContainer');

// 登录功能
function initLogin() {
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            // 模拟登录过程
            addLog('info', '正在登录票务系统...');
            
            // 模拟网络延迟
            setTimeout(() => {
                // 简单的模拟登录验证
                if (username === 'demo_user' && password === 'demo_pass') {
                    currentUser = username;
                    showMessage('登录成功！欢迎来到抢票系统', 'success');
                    addLog('success', `用户 ${username} 登录成功`);
                    
                    // 切换到抢票界面
                    loginSection.style.display = 'none';
                    ticketSection.style.display = 'block';
                    
                    // 开始模拟票务状态变化
                    startTicketSimulation();
                } else {
                    showMessage('用户名或密码错误，请重试', 'error');
                    addLog('error', '登录失败：用户名或密码错误');
                }
            }, 1000);
        } else {
            showMessage('请输入用户名和密码', 'error');
        }
    });
}

// 显示消息通知
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageArea.appendChild(messageDiv);
    
    // 3秒后自动移除消息
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// 添加日志
function addLog(type, message) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN');
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.innerHTML = `<span class="log-time">[${timeString}]</span>${message}`;
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight; // 滚动到底部
}

// 更新票状态显示
function updateTicketDisplay() {
    for (const type of ['vip', 'ordinary']) {
        const statusElement = document.getElementById(`${type}Status`);
        const countElement = document.getElementById(`${type}Count`);
        
        if (ticketStatus[type].available) {
            statusElement.className = 'status available';
            statusElement.textContent = '有票';
        } else {
            statusElement.className = 'status unavailable';
            statusElement.textContent = '暂无票';
        }
        
        countElement.textContent = `${ticketStatus[type].count}张`;
    }
}

// 模拟票务状态变化
function startTicketSimulation() {
    // 每5-10秒随机更新一次票务状态
    setInterval(() => {
        // 随机决定是否有票
        const vipAvailable = Math.random() > 0.7; // 30% 概率有票
        const ordinaryAvailable = Math.random() > 0.5; // 50% 概率有票
        
        // 更新票状态
        ticketStatus.vip.available = vipAvailable;
        ticketStatus.vip.count = vipAvailable ? Math.floor(Math.random() * 10) + 1 : 0;
        
        ticketStatus.ordinary.available = ordinaryAvailable;
        ticketStatus.ordinary.count = ordinaryAvailable ? Math.floor(Math.random() * 20) + 1 : 0;
        
        // 更新显示
        updateTicketDisplay();
        
        // 记录日志
        if (vipAvailable) {
            addLog('info', `VIP票已上架，剩余 ${ticketStatus.vip.count} 张`);
        }
        if (ordinaryAvailable) {
            addLog('info', `普通票已上架，剩余 ${ticketStatus.ordinary.count} 张`);
        }
    }, Math.random() * 5000 + 5000); // 5-10秒随机间隔
}

// 手动抢票功能
function initManualBuy() {
    const buyButtons = document.querySelectorAll('.btn-buy');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ticketType = button.dataset.type;
            buyTicket(ticketType);
        });
    });
}

// 购买票
function buyTicket(ticketType) {
    if (!ticketStatus[ticketType].available || ticketStatus[ticketType].count <= 0) {
        showMessage(`${ticketType === 'vip' ? 'VIP' : '普通'}票暂时无票，请稍后再试`, 'error');
        addLog('error', `尝试购买${ticketType === 'vip' ? 'VIP' : '普通'}票失败：票已售罄`);
        return;
    }
    
    // 模拟购买过程
    addLog('info', `正在尝试购买${ticketType === 'vip' ? 'VIP' : '普通'}票...`);
    
    // 模拟网络延迟
    setTimeout(() => {
        // 模拟购买成功率（80%）
        const success = Math.random() > 0.2;
        
        if (success) {
            // 减少库存
            ticketStatus[ticketType].count--;
            if (ticketStatus[ticketType].count === 0) {
                ticketStatus[ticketType].available = false;
            }
            
            updateTicketDisplay();
            showMessage(`恭喜！成功购买${ticketType === 'vip' ? 'VIP' : '普通'}票1张`, 'success');
            addLog('success', `用户 ${currentUser} 成功购买${ticketType === 'vip' ? 'VIP' : '普通'}票1张`);
        } else {
            showMessage(`购买失败，票已被其他人抢走`, 'error');
            addLog('error', `用户 ${currentUser} 购买${ticketType === 'vip' ? 'VIP' : '普通'}票失败：票已被抢光`);
        }
    }, 1000);
}

// 自动抢票功能
function initAutoBuy() {
    const startBtn = document.getElementById('startAutoBuy');
    const stopBtn = document.getElementById('stopAutoBuy');
    
    startBtn.addEventListener('click', () => {
        const ticketType = document.getElementById('autoBuyType').value;
        const interval = parseInt(document.getElementById('refreshInterval').value) * 1000;
        
        // 清除之前的定时任务
        if (autoBuyInterval) {
            clearInterval(autoBuyInterval);
        }
        
        showMessage(`开始自动抢${ticketType === 'vip' ? 'VIP' : '普通'}票，刷新间隔 ${interval/1000} 秒`, 'success');
        addLog('success', `开始自动抢${ticketType === 'vip' ? 'VIP' : '普通'}票，间隔 ${interval/1000} 秒`);
        
        // 开始自动抢票
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        autoBuyInterval = setInterval(() => {
            checkAndBuy(ticketType);
        }, interval);
        
        // 立即执行一次
        checkAndBuy(ticketType);
    });
    
    stopBtn.addEventListener('click', () => {
        if (autoBuyInterval) {
            clearInterval(autoBuyInterval);
            autoBuyInterval = null;
        }
        
        showMessage('已停止自动抢票', 'info');
        addLog('info', '停止自动抢票');
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });
}

// 检查并自动购买
function checkAndBuy(ticketType) {
    addLog('info', `自动检查${ticketType === 'vip' ? 'VIP' : '普通'}票库存...`);
    
    if (ticketStatus[ticketType].available && ticketStatus[ticketType].count > 0) {
        addLog('warning', `发现${ticketType === 'vip' ? 'VIP' : '普通'}票！立即尝试购买...`);
        
        // 模拟网络延迟
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% 成功率
            
            if (success) {
                // 减少库存
                ticketStatus[ticketType].count--;
                if (ticketStatus[ticketType].count === 0) {
                    ticketStatus[ticketType].available = false;
                }
                
                updateTicketDisplay();
                showMessage(`🎉 自动抢票成功！已成功购买${ticketType === 'vip' ? 'VIP' : '普通'}票1张`, 'success');
                addLog('success', `自动抢票成功：购买${ticketType === 'vip' ? 'VIP' : '普通'}票1张`);
                
                // 停止自动抢票
                if (autoBuyInterval) {
                    clearInterval(autoBuyInterval);
                    autoBuyInterval = null;
                    document.getElementById('startAutoBuy').disabled = false;
                    document.getElementById('stopAutoBuy').disabled = true;
                }
            } else {
                addLog('error', `自动抢票失败：${ticketType === 'vip' ? 'VIP' : '普通'}票被其他人抢走了`);
            }
        }, 800);
    } else {
        addLog('info', `${ticketType === 'vip' ? 'VIP' : '普通'}票暂时无票，继续等待...`);
    }
}

// 高级策略：预占+秒付功能
function initAdvancedStrategy() {
    const preorderBtn = document.getElementById('preorderBtn');
    const instantPayBtn = document.getElementById('instantPayBtn');
    const cancelPreorderBtn = document.getElementById('cancelPreorderBtn');
    const preorderStatus = document.getElementById('preorderStatus');
    
    // 预占订单
    preorderBtn.addEventListener('click', () => {
        if (preorderInfo.isPreordered) {
            showMessage('您已经有一个预占订单，请先取消', 'error');
            return;
        }
        
        const ticketType = document.getElementById('preorderType').value;
        
        addLog('info', `正在预占 ${ticketType === 'vip' ? 'VIP' : '普通'} 票订单...`);
        
        // 模拟预占过程
        setTimeout(() => {
            // 生成模拟订单号
            const orderId = `ORD${Date.now()}`;
            
            preorderInfo = {
                isPreordered: true,
                ticketType: ticketType,
                preorderTime: new Date(),
                orderId: orderId
            };
            
            showMessage(`成功预占${ticketType === 'vip' ? 'VIP' : '普通'}票订单！`, 'success');
            addLog('success', `预占成功：订单号 ${orderId}，${ticketType === 'vip' ? 'VIP' : '普通'} 票`);
            
            // 更新按钮状态
            preorderBtn.disabled = true;
            instantPayBtn.disabled = false;
            cancelPreorderBtn.disabled = false;
            
            // 更新状态显示
            preorderStatus.innerHTML = `
                <strong>预占成功！</strong><br>
                票种：${ticketType === 'vip' ? 'VIP' : '普通'}票<br>
                订单号：${orderId}<br>
                预占时间：${preorderInfo.preorderTime.toLocaleTimeString()}
            `;
            preorderStatus.style.color = '#28a745';
            preorderStatus.style.background = '#d4edda';
            preorderStatus.style.padding = '15px';
            preorderStatus.style.borderRadius = '5px';
        }, 1000);
    });
    
    // 秒付功能
    instantPayBtn.addEventListener('click', () => {
        if (!preorderInfo.isPreordered) {
            showMessage('请先预占订单', 'error');
            return;
        }
        
        const ticketType = preorderInfo.ticketType;
        
        addLog('warning', `执行秒付操作：${ticketType === 'vip' ? 'VIP' : '普通'}票订单 ${preorderInfo.orderId}`);
        
        // 模拟秒付过程（毫秒级响应）
        setTimeout(() => {
            // 检查票是否可用
            if (ticketStatus[ticketType].available && ticketStatus[ticketType].count > 0) {
                // 减少库存
                ticketStatus[ticketType].count--;
                if (ticketStatus[ticketType].count === 0) {
                    ticketStatus[ticketType].available = false;
                }
                
                updateTicketDisplay();
                showMessage(`🎉 秒付成功！已成功购买${ticketType === 'vip' ? 'VIP' : '普通'}票1张`, 'success');
                addLog('success', `秒付成功：订单 ${preorderInfo.orderId} 已完成付款`);
                
                // 重置预占状态
                resetPreorder();
            } else {
                showMessage('票已售罄，秒付失败', 'error');
                addLog('error', `秒付失败：${ticketType === 'vip' ? 'VIP' : '普通'}票已售罄`);
            }
        }, 100); // 100毫秒响应，模拟毫秒级操作
    });
    
    // 取消预占
    cancelPreorderBtn.addEventListener('click', () => {
        if (!preorderInfo.isPreordered) {
            showMessage('没有可取消的预占订单', 'error');
            return;
        }
        
        addLog('info', `取消预占订单 ${preorderInfo.orderId}`);
        showMessage('预占订单已取消', 'info');
        
        resetPreorder();
    });
}

// 重置预占状态
function resetPreorder() {
    preorderInfo = {
        isPreordered: false,
        ticketType: null,
        preorderTime: null,
        orderId: null
    };
    
    // 更新按钮状态
    document.getElementById('preorderBtn').disabled = false;
    document.getElementById('instantPayBtn').disabled = true;
    document.getElementById('cancelPreorderBtn').disabled = true;
    
    // 更新状态显示
    const preorderStatus = document.getElementById('preorderStatus');
    preorderStatus.innerHTML = '未预占任何订单';
    preorderStatus.style.color = '#6c757d';
    preorderStatus.style.background = '#f8f9fa';
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    // 添加初始日志
    addLog('info', '抢票系统模拟器已启动');
    addLog('info', '请使用 demo_user / demo_pass 登录体验');
    
    // 初始化功能
    initLogin();
    initManualBuy();
    initAutoBuy();
    initAdvancedStrategy(); // 初始化高级策略功能
    
    // 更新初始显示
    updateTicketDisplay();
});

// 添加动画效果
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);