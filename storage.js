const fs = require('fs');
const path = require('path');

// 存储账单文件路径
const filePath = path.join(__dirname, 'bills.json');

// 读取账单数据
function readBills() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// 写入账单数据
function saveBills(bills) {
  fs.writeFileSync(filePath, JSON.stringify(bills, null, 2));
}

module.exports = {
  readBills,
  saveBills
};
