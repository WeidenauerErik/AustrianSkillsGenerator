import {
  Document, Packer, Paragraph, TextRun,
  HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ShadingType
} from 'docx'
import { saveAs } from 'file-saver'

const RED   = 'C03B3B'
const DARK  = '1C1C1E'
const GRAY  = '636366'
const LIGHT = 'F2F2F7'

const border = (color = 'E5E5EA', size = 4) => ({
  top:    { style: BorderStyle.SINGLE, size, color },
  bottom: { style: BorderStyle.SINGLE, size, color },
  left:   { style: BorderStyle.SINGLE, size, color },
  right:  { style: BorderStyle.SINGLE, size, color }
})

const noBorder = () => ({
  top:    { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left:   { style: BorderStyle.NONE },
  right:  { style: BorderStyle.NONE }
})

function spacer(pts = 120) {
  return new Paragraph({ children: [new TextRun('')], spacing: { before: pts, after: pts } })
}

function coverTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 52, color: 'FFFFFF', font: 'Inter' })],
    alignment: AlignmentType.LEFT,
    spacing: { before: 0, after: 160 },
    shading: { type: ShadingType.SOLID, color: RED }
  })
}

function sectionHeader(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20, color: RED, characterSpacing: 80 })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RED, space: 4 } },
    spacing: { before: 400, after: 160 }
  })
}

function subHeader(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, color: DARK })],
    spacing: { before: 240, after: 80 }
  })
}

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: '3A3A3C' })],
    spacing: { before: 40, after: 40 },
    line: { rule: 'auto', value: 280 }
  })
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 21, color: '3A3A3C' })],
    bullet: { level: 0 },
    spacing: { before: 30, after: 30 }
  })
}

function overviewTable(rows) {
  const hCell = (txt) => new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: txt, bold: true, size: 18, color: 'FFFFFF' })],
      alignment: AlignmentType.CENTER
    })],
    shading: { type: ShadingType.SOLID, color: RED },
    borders: noBorder(),
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  })

  const dCell = (txt, align = AlignmentType.LEFT, bold = false) => new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: String(txt), size: 20, color: DARK, bold })],
      alignment: align
    })],
    borders: { ...noBorder(), bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E5E5EA' } },
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  })

  const headerRow = new TableRow({
    children: [hCell('Modul'), hCell('Dauer'), hCell('Punkte'), hCell('Schwerpunkt')],
    tableHeader: true
  })

  const dataRows = rows.map(m => new TableRow({
    children: [
      dCell(`Modul ${m.module}`, AlignmentType.CENTER, true),
      dCell(m.duration, AlignmentType.CENTER),
      dCell(`${m.points} Pts`, AlignmentType.CENTER, true),
      dCell(m.focus)
    ]
  }))

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder()
  })
}

/**
 * Export task data to a Word .docx file.
 * @param {object} taskData
 */
export async function exportToDocx(taskData) {
  const children = []

  // ── Cover ──
  children.push(
    new Paragraph({
      children: [new TextRun({
        text: 'AUSTRIANSKILLS  ·  WEB DEVELOPMENT',
        size: 16, color: 'FFFFFF', characterSpacing: 150
      })],
      alignment: AlignmentType.LEFT,
      shading: { type: ShadingType.SOLID, color: RED },
      spacing: { before: 0, after: 0 }
    }),
    new Paragraph({
      children: [new TextRun({ text: taskData.title, bold: true, size: 52, color: DARK })],
      spacing: { before: 480, after: 160 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Thema: ', bold: true, size: 22, color: GRAY }),
        new TextRun({ text: taskData.theme, size: 22, color: GRAY, italics: true })
      ],
      spacing: { before: 0, after: 600 }
    }),
    spacer(200)
  )

  // ── Introduction ──
  children.push(sectionHeader('Einführung'))
  children.push(subHeader('Szenario'))
  children.push(body(taskData.introduction.overallScenario))
  children.push(subHeader('Bewertung'))
  children.push(body(taskData.introduction.marking))
  children.push(spacer())

  // ── Overview Table ──
  children.push(sectionHeader('Modulübersicht'))
  children.push(spacer(80))
  children.push(overviewTable(taskData.modulesOverview))
  children.push(spacer())

  // ── Modules ──
  for (const mod of taskData.modules) {
    children.push(sectionHeader(`Modul ${mod.module} — ${mod.title}`))
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${mod.timebox}  ·  ${mod.points} Punkte`, size: 20, color: GRAY, italics: true })
        ],
        spacing: { before: 0, after: 180 }
      })
    )
    children.push(subHeader('Übersicht'))
    children.push(body(mod.overview))
    children.push(subHeader('User Stories'))
    for (const story of mod.userStories) {
      children.push(bullet(story))
    }
    children.push(spacer())
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22, color: DARK } }
      }
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 }
        }
      },
      children
    }]
  })

  const blob = await Packer.toBlob(doc)
  const filename = `AustrianSkills_${taskData.theme.replace(/[^a-zA-Z0-9]/g, '_')}.docx`
  saveAs(blob, filename)
}

/**
 * Download task data as JSON file.
 * @param {object} taskData
 */
export function exportToJson(taskData) {
  const blob = new Blob([JSON.stringify(taskData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `AustrianSkills_${taskData.theme.replace(/[^a-zA-Z0-9]/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
