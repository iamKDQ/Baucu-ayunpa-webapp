
"use client";
export default function ExportDocxButton(){
  function handleDownload(){
    window.location.href="/api/reports/docx";
  }
  return(
    <button
      onClick={handleDownload}
      className="button-primary"
    >
      Xuất báo cáo Word (.docx)
    </button>
  )
}
