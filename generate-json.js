// generate-json.js

const fs = require('fs');
const path = require('path');

// =================================================================
// 配置区域
// =================================================================

// 定义存放图标的目录
const iconsDir = path.join(__dirname, 'icons'); 

// 定义允许的图片文件后缀名列表 (你可以根据需要自行增删)
const allowedExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico'];

// 定义输出 JSON 文件的路径
const outputFile = path.join(__dirname, 'icons.json');

// GitHub 仓库配置
const GITHUB_USERNAME = 'Alex-hj';
const GITHUB_REPO = 'MarkBuyIcons';
const GITHUB_BRANCH = 'master';
const ICONS_DIR_NAME = 'icons';

// 项目元信息
const PROJECT_NAME = 'MarkBuyIcons';
const PROJECT_DESCRIPTION = 'Icon collection for MarkBuy';

// =================================================================
// 脚本主逻辑
// =================================================================

// 确保图标目录存在
if (!fs.existsSync(iconsDir))
{
    // 如果目录不存在，创建一个空的json文件并退出，避免报错
    console.warn(`警告：找不到目录 ${iconsDir}，将生成一个空的 icons.json。`);
    const emptyData = 
    {
        name: PROJECT_NAME,
        description: PROJECT_DESCRIPTION,
        icons: []
    };
    fs.writeFileSync(outputFile, JSON.stringify(emptyData, null, 2), 'utf8');
    process.exit(0);
}

// 读取图标目录下的所有文件名
fs.readdir(iconsDir, (err, files) => 
{
    if (err)
    {
        console.error('读取目录时出错:', err);
        process.exit(1);
    }

    // 1. 过滤出拥有合法后缀名的文件
    // 2. 为每个图标生成包含 name 和 url 的对象
    const icons = files
        .filter(file => 
        {
            const extension = path.extname(file).toLowerCase();
            return allowedExtensions.includes(extension);
        })
        .map(file => 
        {
            // 提取不含后缀的文件名作为图标名称
            const iconName = path.basename(file, path.extname(file));
            
            // 构建 GitHub raw 文件 URL
            const iconUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${ICONS_DIR_NAME}/${file}`;
            
            return {
                name: iconName,
                url: iconUrl
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name)); // 按名称排序，保持列表稳定

    // 构建最终的 JSON 数据结构
    const jsonData = 
    {
        name: PROJECT_NAME,
        description: PROJECT_DESCRIPTION,
        icons: icons
    };

    // 将数据转换为格式化的 JSON 字符串
    const jsonContent = JSON.stringify(jsonData, null, 2);

    // 将 JSON 内容写入到 icons.json 文件
    fs.writeFile(outputFile, jsonContent, 'utf8', (err) => 
    {
        if (err)
        {
            console.error('写入 JSON 文件时出错:', err);
            process.exit(1);
        }
        console.log(`成功生成 icons.json，包含 ${icons.length} 个图标。`);
    });
});