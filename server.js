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
        const { current_date_value, name_hiragana, name_kanji, birth_value, gender_value, filename } = req.body;

        const templatePath = path.join(__dirname, 'rirekisyo_a4_mhlw.xlsx');
        const outputPath = path.join(__dirname, filename);

        // テンプレートをコピー（書式完全保持）
        fs.copyFileSync(templatePath, outputPath);

        // コピーしたファイルを読み込み
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(outputPath);

        const worksheet = workbook.getWorksheet('A4サイズ');
        console.log(workbook.worksheets.map(ws => ws.name));

        worksheet.getCell('E3').value = current_date_value;
        worksheet.getCell('D5').value = name_hiragana;
        worksheet.getCell('B7').value = name_kanji;
        worksheet.getCell('B10').value = birth_value;
        worksheet.getCell('B10').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('H11').value = gender_value;


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
