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
        const { current_date_value, name_hiragana, name_kanji, birth_value, gender_value,
            address_postcode_value, address_value, address_hiragana_value, tel_value, email_value,
            emergency_address_postcode_value, emergency_address_value, emergency_address_hiragana_value,
            emergency_tel_value, emergency_email_value, filename } = req.body;

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
        worksheet.getCell('B13').value = address_postcode_value;
        worksheet.getCell('C15').value = address_value;
        worksheet.getCell('C12').value = address_hiragana_value;
        worksheet.getCell('I12').value = tel_value;
        worksheet.getCell('I13').value = email_value;
        worksheet.getCell('B19').value = emergency_address_postcode_value;
        worksheet.getCell('B20').value = emergency_address_value;
        worksheet.getCell('D17').value = emergency_address_hiragana_value;
        worksheet.getCell('I17').value = emergency_tel_value;
        worksheet.getCell('I19').value = emergency_email_value;
        worksheet.getCell('D26').value = "学　　　歴";
        worksheet.getCell('D26').alignment = { vertical: 'middle', horizontal: 'center' };

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
