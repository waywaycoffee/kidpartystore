import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES模块中__dirname的替代方案）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取Markdown文件
const markdownContent = fs.readFileSync(
  path.join(__dirname, '../产品说明书.md'),
  'utf-8'
);

// 解析Markdown并转换为docx格式
function parseMarkdownToDocx(content) {
  const lines = content.split('\n');
  const children = [];
  let currentParagraph = [];
  let inCodeBlock = false;
  let codeBlockContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 处理代码块
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // 结束代码块
        if (codeBlockContent.length > 0) {
          children.push(
            new Paragraph({
              text: codeBlockContent.join('\n'),
              style: 'Code',
            })
          );
          codeBlockContent = [];
        }
        inCodeBlock = false;
      } else {
        // 开始代码块
        if (currentParagraph.length > 0) {
          children.push(
            new Paragraph({
              children: currentParagraph,
            })
          );
          currentParagraph = [];
        }
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // 处理标题
    if (line.startsWith('# ')) {
      if (currentParagraph.length > 0) {
        children.push(new Paragraph({ children: currentParagraph }));
        currentParagraph = [];
      }
      children.push(
        new Paragraph({
          text: line.substring(2).trim(),
          heading: HeadingLevel.TITLE,
        })
      );
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentParagraph.length > 0) {
        children.push(new Paragraph({ children: currentParagraph }));
        currentParagraph = [];
      }
      children.push(
        new Paragraph({
          text: line.substring(3).trim(),
          heading: HeadingLevel.HEADING_1,
        })
      );
      continue;
    }

    if (line.startsWith('### ')) {
      if (currentParagraph.length > 0) {
        children.push(new Paragraph({ children: currentParagraph }));
        currentParagraph = [];
      }
      children.push(
        new Paragraph({
          text: line.substring(4).trim(),
          heading: HeadingLevel.HEADING_2,
        })
      );
      continue;
    }

    if (line.startsWith('#### ')) {
      if (currentParagraph.length > 0) {
        children.push(new Paragraph({ children: currentParagraph }));
        currentParagraph = [];
      }
      children.push(
        new Paragraph({
          text: line.substring(5).trim(),
          heading: HeadingLevel.HEADING_3,
        })
      );
      continue;
    }

    // 处理分隔线
    if (line.trim() === '---') {
      if (currentParagraph.length > 0) {
        children.push(new Paragraph({ children: currentParagraph }));
        currentParagraph = [];
      }
      continue;
    }

    // 处理列表项
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (currentParagraph.length > 0) {
        children.push(new Paragraph({ children: currentParagraph }));
        currentParagraph = [];
      }
      const listText = line.trim().substring(2);
      children.push(
        new Paragraph({
          text: `• ${listText}`,
          bullet: { level: 0 },
        })
      );
      continue;
    }

    // 处理有序列表
    if (/^\d+\.\s/.test(line.trim())) {
      if (currentParagraph.length > 0) {
        children.push(new Paragraph({ children: currentParagraph }));
        currentParagraph = [];
      }
      const listText = line.trim().replace(/^\d+\.\s/, '');
      children.push(
        new Paragraph({
          text: listText,
          numbering: { level: 0, reference: 'default-numbering' },
        })
      );
      continue;
    }

    // 处理粗体文本
    if (line.includes('**')) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      parts.forEach(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.substring(2, part.length - 2);
          currentParagraph.push(
            new TextRun({
              text: boldText,
              bold: true,
            })
          );
        } else if (part.trim()) {
          currentParagraph.push(new TextRun({ text: part }));
        }
      });
      continue;
    }

    // 处理代码行
    if (line.includes('`')) {
      const parts = line.split(/(`[^`]+`)/g);
      parts.forEach(part => {
        if (part.startsWith('`') && part.endsWith('`')) {
          const codeText = part.substring(1, part.length - 1);
          currentParagraph.push(
            new TextRun({
              text: codeText,
              font: 'Courier New',
            })
          );
        } else if (part.trim()) {
          currentParagraph.push(new TextRun({ text: part }));
        }
      });
      continue;
    }

    // 处理普通文本
    if (line.trim()) {
      currentParagraph.push(new TextRun({ text: line }));
    } else {
      // 空行，结束当前段落
      if (currentParagraph.length > 0) {
        children.push(new Paragraph({ children: currentParagraph }));
        currentParagraph = [];
      }
      // 添加空行
      children.push(new Paragraph({ text: '' }));
    }
  }

  // 处理剩余的段落
  if (currentParagraph.length > 0) {
    children.push(new Paragraph({ children: currentParagraph }));
  }

  return children;
}

// 创建Word文档
const doc = new Document({
  sections: [
    {
      properties: {},
      children: parseMarkdownToDocx(markdownContent),
    },
  ],
  numbering: {
    config: [
      {
        reference: 'default-numbering',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT,
          },
        ],
      },
    ],
  },
});

// 导出为docx文件
async function exportToDocx() {
  try {
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, '../产品说明书.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ 成功导出到: ${outputPath}`);
  } catch (error) {
    console.error('❌ 导出失败:', error);
    process.exit(1);
  }
}

exportToDocx();

