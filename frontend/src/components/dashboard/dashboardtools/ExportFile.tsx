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
  genderTypes,
  serviceValue,
  serviceTypes,
  themes,
  genderTooltip,
  genderTooltipCount,
  serviceTooltip,
  serviceTooltipCount,
  modelName,
}: ExportFileProps) => {
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

        // ---------------- GENDER PROCESSING ----------------
        const sentimentSeries = genderValue.reduce(
          (acc, series) => {
            acc[series.name.toLowerCase()] = series.data;
            return acc;
          },
          {} as Record<string, number[]>,
        );

        const getCount = (sentiment: string, index: number) =>
          sentimentSeries[sentiment]?.[index] ?? 0;

        // Keep whitespace-only categories in the data, but make them visible in the report.
        const displayCategory = (
          label: string | null | undefined,
          fallback: string,
        ) => (label == null ? fallback : label.trim() ? label : "(blank)");

        const maxGenderLength = Math.max(
          genderTypes.length,
          ...Object.values(sentimentSeries).map((arr) => arr.length),
        );

        const genderLabels = Array.from({ length: maxGenderLength }, (_, i) =>
          displayCategory(genderTypes[i], `Gender ${i + 1}`),
        );

        const allGenderData = genderLabels.map((label, index) => {
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
            summary_negative: genderTooltip[0]?.[index] ?? "",
            summary_neutral: genderTooltip[1]?.[index] ?? "",
            summary_positive: genderTooltip[2]?.[index] ?? "",
            summary_count_negative: genderTooltipCount[0]?.[index] ?? 0,
            summary_count_neutral: genderTooltipCount[1]?.[index] ?? 0,
            summary_count_positive: genderTooltipCount[2]?.[index] ?? 0,
          };
        });

        
        const genderRowsForReport = [...allGenderData];

        // ---------------- SERVICE PROCESSING ----------------
        const serviceSeries = serviceValue.reduce(
          (acc, series) => {
            acc[series.name.toLowerCase()] = series.data;
            return acc;
          },
          {} as Record<string, number[]>,
        );

        const getServiceCount = (sentiment: string, index: number) =>
          serviceSeries[sentiment]?.[index] ?? 0;

        const maxServiceLength = Math.max(
          serviceTypes.length,
          ...Object.values(serviceSeries).map((arr) => arr.length),
        );

        const allServiceData = Array.from(
          { length: maxServiceLength },
          (_, index) => {
          const label = displayCategory(
            serviceTypes[index],
            `Service ${index + 1}`,
          );
          const negC = getServiceCount("negative", index);
          const neuC = getServiceCount("neutral", index);
          const posC = getServiceCount("positive", index);
          const total = negC + neuC + posC;
          const toPercent = (value: number) =>
            total > 0 ? Number(((value / total) * 100).toFixed(2)) : 0;

          return {
            name: label,
            sNegP: toPercent(negC),
            sNegC: negC,
            sNeuP: toPercent(neuC),
            sNeuC: neuC,
            sPosP: toPercent(posC),
            sPosC: posC,
            service_summary_negative: serviceTooltip[0]?.[index] ?? "",
            service_summary_neutral: serviceTooltip[1]?.[index] ?? "",
            service_summary_positive: serviceTooltip[2]?.[index] ?? "",
            service_summary_count_negative: serviceTooltipCount[0]?.[index] ?? 0,
            service_summary_count_neutral: serviceTooltipCount[1]?.[index] ?? 0,
            service_summary_count_positive: serviceTooltipCount[2]?.[index] ?? 0,
          };
          },
        );

        const genderTooltipRows = genderRowsForReport.map((row) => ({
          name: row.name,
          summary_negative: row.summary_negative,
          summary_neutral: row.summary_neutral,
          summary_positive: row.summary_positive,
          summary_count_negative: row.summary_count_negative,
          summary_count_neutral: row.summary_count_neutral,
          summary_count_positive: row.summary_count_positive,
        }));

        const serviceTooltipRows = allServiceData.map((row) => ({
          name: row.name,
          service_summary_negative: row.service_summary_negative,
          service_summary_neutral: row.service_summary_neutral,
          service_summary_positive: row.service_summary_positive,
          service_summary_count_negative: row.service_summary_count_negative,
          service_summary_count_neutral: row.service_summary_count_neutral,
          service_summary_count_positive: row.service_summary_count_positive,
        }));

        doc.render({
          date_now: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
          model_name: modelName,
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
          ...Object.fromEntries(
            Array.from({ length: 6 }, (_, index) => {
              const theme = themes[index];
              return [
                [`theme_name${index + 1}`, theme?.top ?? ""],
                [`theme_percentage${index + 1}`, theme?.percentage ?? 0],
              ];
            }).flat(),
          ),
          genderRows: genderRowsForReport,
          genderTooltipRows,
          serviceRows: allServiceData,
          serviceTooltipRows,
        });
        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
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