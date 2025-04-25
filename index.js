const { Wechaty } = require('wechaty');
const QRCode = require('qrcode');
const { readBills, saveBills } = require('./storage'); // 引入 storage.js

// 初始化微信机器人
const bot = new Wechaty();

bot.on('message', async (message) => {
    const contact = message.from();
    const text = message.text();
    const room = message.room();

    // 如果是私聊消息
    if (!room) {
        if (text.includes('记账')) {
            const [_, amount, description] = text.split(' ');

            // 处理金额和描述
            if (amount && description) {
                const bills = readBills(); // 读取账单数据
                bills.push({ amount, description, time: new Date() });

                saveBills(bills); // 保存账单数据

                await contact.say(`记账成功！金额: ${amount}, 描述: ${description}`);
            } else {
                await contact.say('请使用格式：记账 金额 描述');
            }
        } else if (text === '查看账单') {
            // 显示所有账单
            const bills = readBills(); // 读取账单数据
            if (bills.length === 0) {
                await contact.say('当前没有账单记录');
            } else {
                let billText = '账单记录：\n';
                bills.forEach((bill, index) => {
                    billText += `${index + 1}. 金额: ${bill.amount}, 描述: ${bill.description}, 时间: ${bill.time}\n`;
                });
                await contact.say(billText);
            }
        } else {
            await contact.say('请输入有效命令。可用命令：\n1. 记账 金额 描述\n2. 查看账单');
        }
    }
});

bot.on('scan', (url, status) => {
    if (status === 0) {
        console.log('扫描二维码登录微信');
        QRCode.toString(url, { type: 'terminal' }, (err, qrCode) => {
            if (err) throw err;
            console.log(qrCode);
        });
    }
});

bot.on('login', user => {
    console.log(`${user} 登录成功`);
});

bot.on('logout', user => {
    console.log(`${user} 登出`);
});

bot.start().then(() => console.log('机器人启动成功!'));
