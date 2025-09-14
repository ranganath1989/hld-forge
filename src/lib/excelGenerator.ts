import ExcelJS from 'exceljs';

interface HldData {
  sectionId: string;
  sectionName: string;
  author: string;
  reviewer: string;
  createDate: string;
  updateDate: string;
  approvalDate: string;
  changeOverview: string;
  objective: string;
  assumptions: string;
  constraints: string;
  dependencies: string;
  risk: string;
  systemArchDetails: string;
  componentDetails: string;
  requirements: string;
  design: string;
  impact: string;
  outputPayload: string;
  test1: string;
  designFiles: File[];
}

// Excel color ARGB (with FF alpha)
const ORANGE = 'FFFFE699'; // Orange Accent 2, Lighter 60%
const GREEN = 'FFC6EFCE';  // Dark Green Accent 3, Lighter 80%
const BLACK = 'FF000000';

export const generateHldExcel = async (data: HldData) => {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('HLD Document', {
    views: [{ state: 'normal', showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  // Create worksheet data (kept identical to current layout)
  const wsData: (string | undefined)[][] = [
    ['Section ID', '', '', '', data.sectionId, '', '', '', '', '', 'Author', '', '', '', data.author],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Section Name', '', '', '', data.sectionName, '', '', '', '', '', 'Reviewer', '', '', '', data.reviewer],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'CreateDate', '', '', '', data.createDate],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'UpdateDate', '', '', '', data.updateDate],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'ApprovalDate', '', '', '', data.approvalDate],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],

    // Change Overview
    ['Change Overview'],
    [''],
    [data.changeOverview],
    [''],

    // Objective
    ['Objective'],
    [''],
    [data.objective],
    [''],
    [''],

    // Design Considerations
    ['Design Considerations'],
    [''],
    ['', '', '', '', '', '', '', '', '', '', 'Assumptions', '', '', '', '', '', '', '', '', '', data.assumptions],
    [''],
    [''],
    ['', '', '', '', '', '', '', '', '', '', 'Constraints', '', '', '', '', '', '', '', '', '', data.constraints],
    [''],
    [''],
    ['', '', '', '', '', '', '', '', '', '', 'Dependencies', '', '', '', '', '', '', '', '', '', data.dependencies],
    [''],
    [''],
    ['', '', '', '', '', '', '', '', '', '', 'Risk', '', '', '', '', '', '', '', '', '', data.risk],
    [''],
    [''],

    // Architecture
    ['Architecture (only for the integration changes)'],
    [''],
    [''],
    ['Architecture', '', '', '', '', '', '', '', '', '', 'System Architecture Details', '', '', '', '', '', '', '', '', '', data.systemArchDetails],
    [''],
    [''],
    ['', '', '', '', '', '', '', '', '', '', 'Component Details', '', '', '', '', '', '', '', '', '', data.componentDetails],
    [''],
    [''],

    // Detailed Interface Design/Impact Analysis
    ['Detailed Interface Design/Impact Analysis'],
    [''],
    [''],
    ['Design/Analysis', '', '', '', '', '', '', '', '', '', 'Requirement', '', '', '', '', '', '', '', '', '', data.requirements],
    ['', '', '', '', '', '', '', '', '', '', 'Design', '', '', '', '', '', '', '', '', '', data.design],
    ['', '', '', '', '', '', '', '', '', '', 'Impact', '', '', '', '', '', '', '', '', '', data.impact],
    ['', '', '', '', '', '', '', '', '', '', 'Output Payload', '', '', '', '', '', '', '', '', '', data.outputPayload],
    [''],

    // Testing
    ['Testing'],
    [''],
    [''],
    ['Test1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', data.test1],
  ];

  // Add rows to worksheet
  wsData.forEach((row) => ws.addRow(row));

  // Set 25 columns with widths similar to previous
  const totalCols = 25;
  const columns = Array.from({ length: totalCols }, (_, i) => {
    const index = i + 1; // 1-based
    if (index === 11 || index === 21) return { width: 20 };
    if (index === 1 || index === 5) return { width: 15 };
    return { width: 4 };
  });
  ws.columns = columns as any;

  // Common style helper
  const applyBaseCellStyle = (cell: ExcelJS.Cell, bold = false) => {
    cell.font = { name: 'Calibri', size: 11, bold };
    cell.border = {
      top: { style: 'thin', color: { argb: BLACK } },
      bottom: { style: 'thin', color: { argb: BLACK } },
      left: { style: 'thin', color: { argb: BLACK } },
      right: { style: 'thin', color: { argb: BLACK } },
    };
    cell.alignment = { vertical: 'top', wrapText: true };
  };

  const fillRow = (rowNumber: number, argb: string, bold = false) => {
    const row = ws.getRow(rowNumber);
    for (let c = 1; c <= totalCols; c++) {
      const cell = row.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
      applyBaseCellStyle(cell, bold);
    }
  };

  const styleAllCells = () => {
    for (let r = 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= totalCols; c++) {
        const cell = row.getCell(c);
        applyBaseCellStyle(cell);
      }
    }
  };

  styleAllCells();

  // Merge cells (mirror of previous implementation)
  // A1:D1, E1:J1, K1:N1, O1:Y1
  ws.mergeCells(1, 1, 1, 4);
  ws.mergeCells(1, 5, 1, 10);
  ws.mergeCells(1, 11, 1, 14);
  ws.mergeCells(1, 15, 1, 25);
  // Row 3
  ws.mergeCells(3, 1, 3, 4);
  ws.mergeCells(3, 5, 3, 10);
  ws.mergeCells(3, 11, 3, 14);
  ws.mergeCells(3, 15, 3, 25);
  // Change Overview (row 13 title + row 15 content)
  ws.mergeCells(13, 1, 13, 25);
  ws.mergeCells(15, 1, 15, 25);
  // Objective (row 17 title + 19..21 content block)
  ws.mergeCells(17, 1, 17, 25);
  ws.mergeCells(19, 1, 21, 25);

  // Apply required coloring rules
  const greenSectionTitles = new Set<string>([ 
    'Change Overview',
    'Architecture (only for the integration changes)',
    'Detailed Interface Design/Impact Analysis',
    'Testing',
  ]);

  const orangeRowsLabels = new Set<string>([
    'Section ID', 'Section Name', 'Author', 'Reviewer',
    'CreateDate', 'UpdateDate', 'ApprovalDate',
    'Objective', 'Design Considerations', 'Architecture',
    'Design/Analysis', 'Test1',
  ]);

  const rowHasAnyLabel = (row: ExcelJS.Row, labels: Set<string>) => {
    for (let c = 1; c <= totalCols; c++) {
      const v = row.getCell(c).value;
      const text = typeof v === 'string' ? v : (v as any)?.toString?.();
      if (text && labels.has(text)) return true;
    }
    return false;
  };

  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    if (rowHasAnyLabel(row, greenSectionTitles)) {
      fillRow(r, GREEN, false);
    }
    if (rowHasAnyLabel(row, orangeRowsLabels)) {
      fillRow(r, ORANGE, true);
    }
  }

  // Try to find the "Design" content row (column K/11 has label 'Design')
  let designLabelRow = -1;
  for (let r = 1; r <= ws.rowCount; r++) {
    const cellK = ws.getRow(r).getCell(11);
    if (typeof cellK.value === 'string' && cellK.value.trim() === 'Design') {
      designLabelRow = r;
      break;
    }
  }

  // Embed uploaded images below the Design row (visible screenshots)
  if (designLabelRow > 0 && data.designFiles?.length) {
    let imageIndex = 0;
    for (const file of data.designFiles) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) continue; // only embed images; other files ignored here

      const ab = await file.arrayBuffer();
      const ext = file.type.endsWith('png') || file.name.toLowerCase().endsWith('.png') ? 'png'
        : file.type.endsWith('jpeg') || file.type.endsWith('jpg') || /\.jpe?g$/i.test(file.name) ? 'jpeg'
        : file.type.endsWith('gif') || file.name.toLowerCase().endsWith('.gif') ? 'gif'
        : 'png';

      const imageId = workbook.addImage({ buffer: new Uint8Array(ab), extension: ext as any });

      // Place each image starting a few rows below the Design row, spaced apart
      const anchorRow = designLabelRow + 1 + imageIndex * 16; // spacing between images
      // Use top-left anchor with fixed size; columns are 0-based for images
      ws.addImage(imageId, {
        tl: { col: 12, row: anchorRow - 1 }, // place starting around column 12
        ext: { width: 480, height: 300 },
        editAs: 'oneCell',
      });

      // Increase row heights in the area to ensure visibility
      for (let rr = anchorRow; rr < anchorRow + 16; rr++) {
        if (rr <= ws.rowCount) ws.getRow(rr).height = 22;
      }

      imageIndex++;
    }
  }

  // Generate filename
  const today = new Date().toISOString().split('T')[0];
  const filename = `HLD_${data.sectionId || 'Document'}_${today}.xlsx`;

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};
