
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } from "docx";

export async function buildElectionReport(data:any){
  const rows = [
    new TableRow({
      children:[
        new TableCell({children:[new Paragraph("Khu vực")]}),
        new TableCell({children:[new Paragraph("Đơn vị bầu cử")]}),
        new TableCell({children:[new Paragraph("Tổ dân phố")]}),
        new TableCell({children:[new Paragraph("Địa điểm")]}),
        new TableCell({children:[new Paragraph("Tổng cử tri")]}),
        new TableCell({children:[new Paragraph("Đã bỏ phiếu")]})
      ]
    })
  ];

  data.areas.forEach((a:any)=>{
    rows.push(
      new TableRow({
        children:[
          new TableCell({children:[new Paragraph("KV "+a.area_number)]}),
          new TableCell({children:[new Paragraph(a.election_unit)]}),
          new TableCell({children:[new Paragraph(a.neighborhoods.join(", "))]}),
          new TableCell({children:[new Paragraph(a.polling_place)]}),
          new TableCell({children:[new Paragraph(String(a.total_voters))]}),
          new TableCell({children:[new Paragraph(String(a.voted_count ?? 0))]})
        ]
      })
    )
  });

  const table = new Table({
    rows,
    width:{size:100,type:WidthType.PERCENTAGE}
  });

  const doc = new Document({
    sections:[{
      children:[
        new Paragraph({
          text:"BÁO CÁO TIẾN ĐỘ BẦU CỬ - PHƯỜNG AYUN PA",
          heading:"Heading1"
        }),
        new Paragraph("Tổng cử tri: "+data.totalWardVoters),
        new Paragraph("Đã bỏ phiếu: "+data.totalVoted),
        new Paragraph("Tỷ lệ: "+data.turnoutRate+" %"),
        table
      ]
    }]
  });

  return Packer.toBuffer(doc);
}
