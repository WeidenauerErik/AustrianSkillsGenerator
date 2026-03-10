import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// ── Column index constants (0-based) ──────────────────────────────────────
const COL = {
  SUB_ID:       0,  // A - Sub Criterion ID
  SUB_NAME:     1,  // B - Sub Criterion Name
  DAY:          2,  // C - Day of Marking
  TYPE:         3,  // D - Aspect Type (M/J)
  DESCRIPTION:  4,  // E - Aspect Description
  JUDG_SCORE:   5,  // F - Judg Score
  EXTRA:        6,  // G - Extra Description / Score Description
  REQUIREMENT:  7,  // H - Requirement (M only)
  WSSS_SECTION: 8,  // I - WSSS Section
  CALC_ROW:     9,  // J - Calculation Row (Export only)
  MAX_MARK:     10, // K - Max Mark
  CRIT_LABEL:   11, // L - Criterion label
  TOTAL_LABEL:  12, // M - "Total Mark"
  TOTAL_FORMULA:13  // N - SUM formula
}

const NUM_COLS = 14

// ── Helpers ────────────────────────────────────────────────────────────────

/** Convert 0-based column index to Excel column letter (A, B, ..., N) */
function colLetter(idx) {
  let result = ''
  let n = idx + 1
  while (n > 0) {
    const rem = (n - 1) % 26
    result = String.fromCharCode(65 + rem) + result
    n = Math.floor((n - 1) / 26)
  }
  return result
}

/** Convert 0-based row/col to Excel cell address (e.g. "K24") */
function addr(row0, col0) {
  return `${colLetter(col0)}${row0 + 1}`
}

/** Create a string cell object */
const s = (v) => ({ t: 's', v: String(v ?? '') })

/** Create a number cell object */
const n = (v) => ({ t: 'n', v: Number(v) })

/** Create a formula cell object */
const f = (formula) => ({ t: 'n', f: formula })

/** Create an empty cell */
const empty = () => ({ t: 's', v: '' })

/**
 * Calculate the number of data rows for a criterion (excluding the header row).
 * Includes 2 trailing empty rows.
 */
function criterionDataRows(criterion) {
  let rows = 0
  for (const sc of criterion.subCriteria) {
    rows += 1 // sub-criterion header row
    for (const asp of sc.aspects) {
      rows += 1 // aspect row
      if (asp.type === 'J') {
        rows += asp.scores?.length ?? 4 // score description rows
      }
    }
  }
  rows += 2 // trailing empty rows
  return rows
}

/**
 * Write a cell value into the worksheet cell map.
 * @param {object} ws - SheetJS worksheet object
 * @param {number} row - 0-based row index
 * @param {number} col - 0-based col index
 * @param {object} cell - SheetJS cell object
 */
function setCell(ws, row, col, cell) {
  ws[addr(row, col)] = cell
}

// ── Main export function ───────────────────────────────────────────────────

/**
 * Export the marking scheme data as a CIS-compatible Excel file.
 * @param {object} markingData - Generated marking scheme JSON
 * @param {string} competitionTitle - For the filename
 */
export async function exportToXlsx(markingData) {
  const ws = {}
  let row = 0 // current 0-based row pointer

  const title = markingData.competitionTitle ?? '17 Web Development'
  const year  = markingData.year ?? new Date().getFullYear().toString()

  // ── SECTION 1: Title & WSSS Overview ────────────────────────────────────

  // Row 0: Competition title
  setCell(ws, row, COL.SUB_ID, s(`${title}`))
  row++

  // Row 1: WorldSkills Standards Specification
  setCell(ws, row, COL.SUB_ID, s('WorldSkills Standards Specification'))
  row++

  // Row 2: WSSS table headers
  setCell(ws, row, COL.SUB_ID,       s('Section'))
  setCell(ws, row, COL.SUB_NAME,     s('WSSS Area'))
  setCell(ws, row, COL.WSSS_SECTION, s('WSSS Marks'))
  setCell(ws, row, COL.MAX_MARK,     s('Aspect Marks'))
  setCell(ws, row, COL.CRIT_LABEL,   s('Variation'))
  row++

  // Rows 3-7: WSSS sections
  const wsss = markingData.wsssSections ?? []
  const wsssStartRow = row
  for (const sec of wsss) {
    setCell(ws, row, COL.SUB_ID,       n(sec.id))
    setCell(ws, row, COL.SUB_NAME,     s(sec.name))
    setCell(ws, row, COL.WSSS_SECTION, n(sec.marks))
    setCell(ws, row, COL.MAX_MARK,     f(`ABS(${addr(row, COL.WSSS_SECTION)}-${addr(row, COL.MAX_MARK - 1)})`))
    setCell(ws, row, COL.CRIT_LABEL,   f(`ABS(${addr(row, COL.MAX_MARK - 1)}-${addr(row, COL.MAX_MARK)})`))
    row++
  }

  // Total Variation row
  const wsssEndRow = row - 1
  setCell(ws, row, COL.WSSS_SECTION, s('Total Variation'))
  setCell(ws, row, COL.CRIT_LABEL,   f(`SUM(${addr(wsssStartRow, COL.CRIT_LABEL)}:${addr(wsssEndRow, COL.CRIT_LABEL)})`))
  row++

  // ── SECTION 2: Criteria Overview ────────────────────────────────────────

  // Blank row
  row++

  // "Criteria" label
  setCell(ws, row, COL.SUB_ID, s('Criteria'))
  row++

  // Criteria table header
  setCell(ws, row, COL.SUB_ID,   s('ID'))
  setCell(ws, row, COL.SUB_NAME, s('Name'))
  setCell(ws, row, COL.MAX_MARK, s('Mark'))
  row++

  const criteria = markingData.criteria ?? []
  for (const crit of criteria) {
    setCell(ws, row, COL.SUB_ID,   s(crit.id))
    setCell(ws, row, COL.SUB_NAME, s(crit.title))
    setCell(ws, row, COL.MAX_MARK, n(crit.totalMark))
    row++
  }

  // Blank separator
  row++

  // ── SECTION 3: Per-criterion data blocks ───────────────────────────────

  // Column header labels (reused for each criterion's header row)
  const COL_HEADERS = [
    'Sub Criterion ID',
    'Sub Criterion Name or Description',
    'Day of Marking',
    'Aspect Type (M=Meas / J=Judg)',
    'Aspect - Description',
    'Judg Score',
    'Extra Description (Meas) / Score Description (Judg)',
    'Requirement (Measurement Only)',
    'WSSS Section',
    'Calculation Row (Export only)',
    'Max Mark'
  ]

  for (let ci = 0; ci < criteria.length; ci++) {
    const crit = criteria[ci]

    // Pre-calculate data rows for SUM range
    const dataRows   = criterionDataRows(crit)
    const dataStart  = row + 1       // row AFTER this header row
    const dataEnd    = row + dataRows // inclusive end of data block

    // Write column-headers row (doubles as criterion total row)
    for (let c = 0; c < COL_HEADERS.length; c++) {
      setCell(ws, row, c, s(COL_HEADERS[c]))
    }
    setCell(ws, row, COL.CRIT_LABEL,    s(`Criterion ${crit.id}`))
    setCell(ws, row, COL.TOTAL_LABEL,   s('Total Mark'))
    setCell(ws, row, COL.TOTAL_FORMULA, f(`SUM(${addr(dataStart, COL.MAX_MARK)}:${addr(dataEnd, COL.MAX_MARK)})`))
    row++

    // Sub-criteria
    for (const sc of crit.subCriteria) {
      // Sub-criterion header row
      setCell(ws, row, COL.SUB_ID,   s(sc.id))
      setCell(ws, row, COL.SUB_NAME, s(sc.name))
      setCell(ws, row, COL.DAY,      s(sc.dayOfMarking ?? 'Any'))
      row++

      for (const asp of sc.aspects) {
        // Aspect row
        setCell(ws, row, COL.TYPE,         s(asp.type))
        setCell(ws, row, COL.DESCRIPTION,  s(asp.description))
        setCell(ws, row, COL.WSSS_SECTION, asp.wsssSection != null ? n(asp.wsssSection) : empty())
        setCell(ws, row, COL.MAX_MARK,     n(asp.maxMark))

        if (asp.type === 'M') {
          setCell(ws, row, COL.EXTRA,       s(asp.extraDescription ?? ''))
          setCell(ws, row, COL.REQUIREMENT, s(asp.requirement ?? ''))
        }
        row++

        // J-type: score description rows (0-3)
        if (asp.type === 'J') {
          for (const score of (asp.scores ?? [])) {
            setCell(ws, row, COL.JUDG_SCORE, n(score.score))
            setCell(ws, row, COL.EXTRA,      s(score.description ?? ''))
            row++
          }
        }
      }
    }

    // 2 trailing empty rows
    row += 2
  }

  // Total competition mark (bottom-right)
  setCell(ws, row, COL.CRIT_LABEL,    s('Competition'))
  setCell(ws, row, COL.TOTAL_LABEL,   s('Total Mark'))
  // Sum all totalMark values from criteria overview
  setCell(ws, row, COL.TOTAL_FORMULA, n(criteria.reduce((sum, c) => sum + (c.totalMark ?? 0), 0)))
  row++

  // ── Finalize worksheet ──────────────────────────────────────────────────

  ws['!ref'] = `A1:${addr(row, NUM_COLS - 1)}`

  ws['!cols'] = [
    { wch: 12 },  // A Sub ID
    { wch: 32 },  // B Sub Name
    { wch: 12 },  // C Day
    { wch: 8  },  // D Type
    { wch: 48 },  // E Description
    { wch: 8  },  // F Judg Score
    { wch: 48 },  // G Extra/Score Desc
    { wch: 36 },  // H Requirement
    { wch: 12 },  // I WSSS Section
    { wch: 14 },  // J Calc Row
    { wch: 10 },  // K Max Mark
    { wch: 14 },  // L Criterion
    { wch: 12 },  // M Total label
    { wch: 16 }   // N Total formula
  ]

  // ── Build workbook & download ────────────────────────────────────────────

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'CIS Marking Scheme Import')

  // Add empty Calculations sheet (mirrors original)
  const wsCalc = {}
  wsCalc['!ref'] = 'A1:A1'
  XLSX.utils.book_append_sheet(wb, wsCalc, 'Calculations')

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob  = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  const filename = `AustrianSkills_MarkingScheme_${
    (markingData.competitionTitle ?? 'WebDev').replace(/[^a-zA-Z0-9]/g, '_')
  }_${year}.xlsx`

  saveAs(blob, filename)
}
