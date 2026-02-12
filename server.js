const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/write-file', async (req, res) => {
    try {
        const { name_kana, name_kanji, filename } = req.body;

        const templatePath = path.join(__dirname, 'rirekisyo_a4_mhlw.xlsx');
        const outputPath = path.join(__dirname, filename);

        // テンプレートをコピー（書式完全保持）
        fs.copyFileSync(templatePath, outputPath);

        // コピーしたファイルを読み込み
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(outputPath);

        const worksheet = workbook.getWorksheet('A4サイズ');
        console.log(workbook.worksheets.map(ws => ws.name));

        worksheet.getCell('D5').value = name_kana;
        worksheet.getCell('B7').value = name_kanji;

        // 上書き保存
        await workbook.xlsx.writeFile(outputPath);

        res.json({ success: true, filename });

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
});

// ダウンロード
app.get('/api/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, req.params.filename);
    res.download(filePath);
});

app.listen(PORT, () => {
    console.log(`サーバー起動: http://localhost:${PORT}`);
});
