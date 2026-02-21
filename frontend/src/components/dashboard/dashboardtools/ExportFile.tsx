import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { Button } from "../../ui/button";
import { Download } from "lucide-react";
import { type ExportFileProps } from "@/types/DashboardProps";

function loadFile(url: string, callback: (err: Error, data: string) => void) {
  PizZipUtils.getBinaryContent(url, callback);
}

export const ExportFile = ({
  totalCount,
  gauge,
  genderValue,
  serviceValue,
}: ExportFileProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const downloadTemplate = async () => {
    loadFile(
      "/templates/ReportTemplate.docx",
      function (error: string, content: string) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        doc.render({
          date_now: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
          totalCount: totalCount,
          gauge: gauge.toFixed(2),
          genderValue: genderValue.map((item, index) => {
            return item.name;
          }),
          serviceValue: serviceValue,
        });
        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }); //Output the document using Data-URI
        saveAs(out, "output.docx");
      },
    );
  };

  return (
    <Button
      variant="outline"
      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 hover:text-white text-white"
      onClick={downloadTemplate}
    >
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
};
