const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 2209;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resource', express.static(path.join(__dirname, 'resource')));

// 读取指定 JSON 文件的路由，支持子目录
app.get('/read-json/*', (req, res) => {
    const relativePath = req.params[0];
    const filePath = path.join(__dirname, 'config', relativePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `无法读取文件 ${relativePath}` });
        }
        
        // 确保文件内容不为空，否则返回一个空对象
        const jsonData = data.trim() === '' ? '{}' : data;

        try {
            res.json(JSON.parse(jsonData));
        } catch (parseErr) {
            return res.status(500).json({ error: `解析 JSON 文件时出错 ${relativePath}` });
        }
    });
});


// 写入指定 JSON 文件的路由，支持子目录
app.post('/write-json/*', express.json(), (req, res) => {
    const relativePath = req.params[0];
    const filePath = path.join(__dirname, 'config', relativePath);
    const newData = JSON.stringify(req.body || {}, null, 2); // 确保至少有一个空对象

    const dir = path.dirname(filePath);
    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            return res.status(500).json({ error: `无法创建目录 ${dir}` });
        }

        fs.writeFile(filePath, newData, 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: `无法写入文件 ${relativePath}` });
            }
            res.json({ message: `文件 ${relativePath} 已更新` });
        });
    });
});


app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
