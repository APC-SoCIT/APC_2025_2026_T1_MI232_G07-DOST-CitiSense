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
      function (error: Error, content: string) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        const sentimentSeries = genderValue.reduce(
          (acc, series) => {
            acc[series.name.toLowerCase()] = series.data;
            return acc;
          },
          {} as Record<string, number[]>,
        );

        const getCount = (sentiment: string, index: number) =>
          sentimentSeries[sentiment]?.[index] ?? 0;

        const defaultLabels = ["Female", "Male"];
        const genderData = defaultLabels.map((label, index) => {
          const negC = getCount("negative", index);
          const neuC = getCount("neutral", index);
          const posC = getCount("positive", index);
          const total = negC + neuC + posC;
          const toPercent = (value: number) =>
            total > 0 ? Number(((value / total) * 100).toFixed(2)) : 0;

          return {
            name: label,
            negP: toPercent(negC),
            negC,
            neuP: toPercent(neuC),
            neuC,
            posP: toPercent(posC),
            posC,
          };
        });

        const genderRow1 = genderData[0];
        const genderRow2 = genderData[1];

        const serviceSeries = serviceValue.reduce(
          (acc, series) => {
            acc[series.name.toLowerCase()] = series.data;
            return acc;
          },
          {} as Record<string, number[]>,
        );

        const getServiceCount = (sentiment: string, index: number) =>
          serviceSeries[sentiment]?.[index] ?? 0;

        const getStoredServiceNames = () => {
          try {
            const raw = localStorage.getItem("serviceNameFilter");
            if (!raw || raw === "undefined" || raw === "null") {
              return [] as string[];
            }
            const parsed = JSON.parse(raw) as string[];
            return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
          } catch {
            return [] as string[];
          }
        };

        const fallbackServiceLabels = [
          "Hybrid Seminar",
          "Material Requests",
          "Online Library",
          "Library Tour",
        ];

        const storedServiceNames = getStoredServiceNames();
        const inferredLength = Math.max(
          0,
          ...Object.values(serviceSeries).map((arr) => arr.length),
        );

        const serviceLabels =
          storedServiceNames.length === inferredLength
            ? storedServiceNames
            : inferredLength > 0
              ? fallbackServiceLabels.slice(0, inferredLength)
              : fallbackServiceLabels;

        const serviceData = serviceLabels.map((label, index) => {
          const negC = getServiceCount("negative", index);
          const neuC = getServiceCount("neutral", index);
          const posC = getServiceCount("positive", index);
          const total = negC + neuC + posC;
          const toPercent = (value: number) =>
            total > 0 ? Number(((value / total) * 100).toFixed(2)) : 0;

          return {
            name: label,
            negP: toPercent(negC),
            negC,
            neuP: toPercent(neuC),
            neuC,
            posP: toPercent(posC),
            posC,
          };
        });

        const serviceRow1 = serviceData[0];
        const serviceRow2 = serviceData[1];
        const serviceRow3 = serviceData[2];
        const serviceRow4 = serviceData[3];

        doc.render({
          date_now: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
          filters_applied: (() => {
            const getStoredJson = <T,>(key: string, fallback: T): T => {
              try {
                const raw = localStorage.getItem(key);
                if (!raw || raw === "undefined" || raw === "null") {
                  return fallback;
                }
                return JSON.parse(raw) as T;
              } catch {
                return fallback;
              }
            };

            const formatDate = (date: Date) =>
              date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

            const names = getStoredJson<string[]>("serviceNameFilter", []);
            const types = getStoredJson<string[]>("serviceTypeFilter", []);
            const range = getStoredJson<
              { from?: string; to?: string } | undefined
            >("dateRangeFilter", undefined);

            const datePart =
              range?.from && range?.to
                ? `${formatDate(new Date(range.from))} – ${formatDate(new Date(range.to))}`
                : range?.from
                  ? formatDate(new Date(range.from))
                  : "";

            const parts = [...names, ...types, datePart].filter(Boolean);

            return parts.length > 0 ? parts.join(" - ") : "No filters applied";
          })(),
          totalCount: totalCount,
          gauge: gauge.toFixed(2),
          genderValue: genderValue.map((item, index) => {
            return item.name;
<<<<<<< Updated upstream
          }),
          genderData,
          gender_name1: genderRow1?.name ?? "",
          NegP: genderRow1?.negP ?? 0,
          NegC: genderRow1?.negC ?? 0,
          NeuP: genderRow1?.neuP ?? 0,
          NeuC: genderRow1?.neuC ?? 0,
          posP: genderRow1?.posP ?? 0,
          posC: genderRow1?.posC ?? 0,
          gender_name2: genderRow2?.name ?? "",
          NegP2: genderRow2?.negP ?? 0,
          NegC2: genderRow2?.negC ?? 0,
          NeuP2: genderRow2?.neuP ?? 0,
          NeuC2: genderRow2?.neuC ?? 0,
          posP2: genderRow2?.posP ?? 0,
          posC2: genderRow2?.posC ?? 0,
          serviceData,
          service_name1: serviceRow1?.name ?? "",
          sNegP1: serviceRow1?.negP ?? 0,
          sNegC1: serviceRow1?.negC ?? 0,
          sNeuP1: serviceRow1?.neuP ?? 0,
          sNeuC1: serviceRow1?.neuC ?? 0,
          sPosP1: serviceRow1?.posP ?? 0,
          sPosC1: serviceRow1?.posC ?? 0,
          service_name2: serviceRow2?.name ?? "",
          sNegP2: serviceRow2?.negP ?? 0,
          sNegC2: serviceRow2?.negC ?? 0,
          sNeuP2: serviceRow2?.neuP ?? 0,
          sNeuC2: serviceRow2?.neuC ?? 0,
          sPosP2: serviceRow2?.posP ?? 0,
          sPosC2: serviceRow2?.posC ?? 0,
          service_name3: serviceRow3?.name ?? "",
          sNegP3: serviceRow3?.negP ?? 0,
          sNegC3: serviceRow3?.negC ?? 0,
          sNeuP3: serviceRow3?.neuP ?? 0,
          sNeuC3: serviceRow3?.neuC ?? 0,
          sPosP3: serviceRow3?.posP ?? 0,
          sPosC3: serviceRow3?.posC ?? 0,
          service_name4: serviceRow4?.name ?? "",
          sNegP4: serviceRow4?.negP ?? 0,
          sNegC4: serviceRow4?.negC ?? 0,
          sNeuP4: serviceRow4?.neuP ?? 0,
          sNeuC4: serviceRow4?.neuC ?? 0,
          sPosP4: serviceRow4?.posP ?? 0,
          sPosC4: serviceRow4?.posC ?? 0,
=======
          }), //Sample lang to gab. maglloop ka pa sa mga array na to
>>>>>>> Stashed changes
          serviceValue: serviceValue,
        });
        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }); //Output the document using Data-URI
        const now = new Date();
        const pad = (value: number) => value.toString().padStart(2, "0");
        const timestamp = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()}`;
        saveAs(out, `Dashboard_Report_${timestamp}.docx`);
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
