import * as XLSX from 'xlsx';

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

// Color definitions for Excel styling
const ORANGE_ACCENT_COLOR = { rgb: "FFE699" }; // Orange Accent 2 lighter 60%
const GREEN_ACCENT_COLOR = { rgb: "C6EFCE" }; // Dark Green Accent 3 lighter 80%

const createCellStyle = (bgColor: any, bold = false) => ({
  fill: {
    fgColor: bgColor,
    patternType: "solid"
  },
  font: {
    bold,
    name: "Calibri",
    sz: 11
  },
  border: {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } }
  },
  alignment: {
    vertical: "top",
    wrapText: true
  }
});

const orangeStyle = createCellStyle(ORANGE_ACCENT_COLOR, true);
const greenStyle = createCellStyle(GREEN_ACCENT_COLOR, false);

export const generateHldExcel = async (data: HldData) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheet data
  const wsData = [
    // Header section with metadata
    ["Section ID", "", "", "", data.sectionId, "", "", "", "", "", "Author", "", "", "", data.author],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["Section Name", "", "", "", data.sectionName, "", "", "", "", "", "Reviewer", "", "", "", data.reviewer],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "CreateDate", "", "", "", data.createDate],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "UpdateDate", "", "", "", data.updateDate],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "ApprovalDate", "", "", "", data.approvalDate],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    
    // Change Overview
    ["Change Overview"],
    [""],
    [data.changeOverview],
    [""],
    
    // Objective
    ["Objective"],
    [""],
    [data.objective],
    [""],
    [""],
    
    // Design Considerations
    ["Design Considerations"],
    [""],
    ["", "", "", "", "", "", "", "", "", "", "Assumptions", "", "", "", "", "", "", "", "", "", data.assumptions],
    [""],
    [""],
    ["", "", "", "", "", "", "", "", "", "", "Constraints", "", "", "", "", "", "", "", "", "", data.constraints],
    [""],
    [""],
    ["", "", "", "", "", "", "", "", "", "", "Dependencies", "", "", "", "", "", "", "", "", "", data.dependencies],
    [""],
    [""],
    ["", "", "", "", "", "", "", "", "", "", "Risk", "", "", "", "", "", "", "", "", "", data.risk],
    [""],
    [""],
    
    // Architecture
    ["Architecture (only for the integration changes)"],
    [""],
    [""],
    ["Architecture", "", "", "", "", "", "", "", "", "", "System Architecture Details", "", "", "", "", "", "", "", "", "", data.systemArchDetails],
    [""],
    [""],
    ["", "", "", "", "", "", "", "", "", "", "Component Details", "", "", "", "", "", "", "", "", "", data.componentDetails],
    [""],
    [""],
    
    // Detailed Interface Design/Impact Analysis
    ["Detailed Interface Design/Impact Analysis"],
    [""],
    [""],
    ["Design/Analysis", "", "", "", "", "", "", "", "", "", "Requirement", "", "", "", "", "", "", "", "", "", data.requirements],
    ["", "", "", "", "", "", "", "", "", "", "Design", "", "", "", "", "", "", "", "", "", data.design + (data.designFiles.length > 0 ? "\n\nAttached Files: " + data.designFiles.map(f => f.name).join(", ") : "")],
    ["", "", "", "", "", "", "", "", "", "", "Impact", "", "", "", "", "", "", "", "", "", data.impact],
    ["", "", "", "", "", "", "", "", "", "", "Output Payload", "", "", "", "", "", "", "", "", "", data.outputPayload],
    [""],
    
    // Testing
    ["Testing"],
    [""],
    [""],
    ["Test1", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", data.test1],
  ];

  // Create the worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Apply styling
  if (!ws['!merges']) ws['!merges'] = [];
  if (!ws['!cols']) ws['!cols'] = [];
  if (!ws['!rows']) ws['!rows'] = [];

  // Set column widths
  ws['!cols'] = Array(25).fill({ wch: 4 }).map((col, index) => {
    if (index === 10 || index === 20) return { wch: 20 }; // Description columns
    if (index === 0 || index === 4) return { wch: 15 }; // Label columns
    return { wch: 4 };
  });

  // Apply cell styles and merging
  const applyCellStyles = () => {
    // Orange sections (header fields and main sections)
    const orangeSections = [
      'A1', 'E1', 'K1', 'O1', // Section ID, value, Author, value
      'A3', 'E3', 'K3', 'O3', // Section Name, value, Reviewer, value  
      'O7', 'S7', // CreateDate, value
      'O9', 'S9', // UpdateDate, value
      'O11', 'S11', // ApprovalDate, value
      'A17', // Objective
      'A22', // Design Considerations
      'A34', // Architecture
      'A41', // Design/Analysis
      'A48', // Testing
    ];

    orangeSections.forEach(cell => {
      if (ws[cell]) {
        ws[cell].s = orangeStyle;
      }
    });

    // Green sections (content areas)
    const greenCells = [
      'A13', 'A15', // Change Overview and content
      'A19', // Objective content area
      'K23', 'U23', // Assumptions
      'K26', 'U26', // Constraints  
      'K29', 'U29', // Dependencies
      'K32', 'U32', // Risk
      'A36', 'K36', 'U36', // Architecture details
      'K38', 'U38', // Component Details
      'A43', 'K43', 'U43', // Requirement
      'K44', 'U44', // Design
      'K45', 'U45', // Impact
      'K46', 'U46', // Output Payload
      'A50', 'U50', // Test1
    ];

    greenCells.forEach(cell => {
      if (ws[cell]) {
        ws[cell].s = greenStyle;
      }
    });
  };

  applyCellStyles();

  // Add merges for better layout
  ws['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Section ID label
    { s: { r: 0, c: 4 }, e: { r: 0, c: 9 } }, // Section ID value
    { s: { r: 0, c: 10 }, e: { r: 0, c: 13 } }, // Author label
    { s: { r: 0, c: 14 }, e: { r: 0, c: 24 } }, // Author value
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // Section Name label
    { s: { r: 2, c: 4 }, e: { r: 2, c: 9 } }, // Section Name value
    { s: { r: 2, c: 10 }, e: { r: 2, c: 13 } }, // Reviewer label
    { s: { r: 2, c: 14 }, e: { r: 2, c: 24 } }, // Reviewer value
    { s: { r: 12, c: 0 }, e: { r: 12, c: 24 } }, // Change Overview
    { s: { r: 14, c: 0 }, e: { r: 14, c: 24 } }, // Change Overview content
    { s: { r: 16, c: 0 }, e: { r: 16, c: 24 } }, // Objective
    { s: { r: 18, c: 0 }, e: { r: 20, c: 24 } }, // Objective content
  );

  // Set row heights for better readability
  ws['!rows'] = wsData.map((row, index) => {
    if (index === 14 || index === 18) return { hpt: 60 }; // Content rows
    return { hpt: 20 };
  });

  // Add the worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "HLD Document");

  // Generate filename with current date
  const today = new Date().toISOString().split('T')[0];
  const filename = `HLD_${data.sectionId || 'Document'}_${today}.xlsx`;

  // Write and download the file
  XLSX.writeFile(wb, filename);
};