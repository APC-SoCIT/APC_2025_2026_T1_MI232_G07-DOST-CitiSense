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

        const maxGenderLength = Math.max(
          genderTypes.length,
          ...Object.values(sentimentSeries).map((arr) => arr.length),
        );

        const genderLabels = Array.from({ length: maxGenderLength }, (_, i) =>
          genderTypes[i] ?? `Gender ${i + 1}`,
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

        const genderRow1 = allGenderData[0];
        const genderRow2 = allGenderData[1];
        const additionalGenders = allGenderData.slice(2);

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
          "Consultation",
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
              ? inferredLength > fallbackServiceLabels.length
                ? Array.from(
                    { length: inferredLength },
                    (_, i) => fallbackServiceLabels[i] ?? `Service ${i + 1}`,
                  )
                : fallbackServiceLabels.slice(0, inferredLength)
              : fallbackServiceLabels;

        const allServiceData = serviceLabels.map((label, index) => {
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
        });

        // Rows 1 to 4 for fixed service positions
        const serviceRow1 = allServiceData[0];
        const serviceRow2 = allServiceData[1];
        const serviceRow3 = allServiceData[2];
        const serviceRow4 = allServiceData[3];

        // Any service starting from index 4 (5th service) onwards
        const additionalServices = allServiceData.slice(4);

        const genderTooltipRows = allGenderData.map((row) => ({
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
          ...Object.fromEntries(
            ["negative", "neutral", "positive"].flatMap((sentiment, index) =>
              Array.from({ length: allGenderData.length }, (_, genderIndex) => [
                `gender_summary_${sentiment}${genderIndex + 1}`,
                genderTooltip[index]?.[genderIndex] ?? "",
              ]),
            ),
          ),
          ...Object.fromEntries(
            ["negative", "neutral", "positive"].flatMap((sentiment, index) =>
              Array.from({ length: allGenderData.length }, (_, genderIndex) => [
                `gender_summary_count_${sentiment}${genderIndex + 1}`,
                genderTooltipCount[index]?.[genderIndex] ?? 0,
              ]),
            ),
          ),
          ...Object.fromEntries(
            ["negative", "neutral", "positive"].flatMap((sentiment, index) =>
              Array.from({ length: 5 }, (_, serviceIndex) => [
                `service_summary_${sentiment}${serviceIndex + 1}`,
                serviceTooltip[index]?.[serviceIndex] ?? "",
              ]),
            ),
          ),
          ...Object.fromEntries(
            ["negative", "neutral", "positive"].flatMap((sentiment, index) =>
              Array.from({ length: 5 }, (_, serviceIndex) => [
                `service_summary_count_${sentiment}${serviceIndex + 1}`,
                serviceTooltipCount[index]?.[serviceIndex] ?? 0,
              ]),
            ),
          ),
          genderValue: genderValue.map((item) => item.name),
          genderData: allGenderData,
          genderTooltipRows,
          ...Object.fromEntries(
            allGenderData.slice(2).flatMap((row, index) => {
              const placeholderIndex = index + 3;
              return [
                [`gender_name${placeholderIndex}`, row.name],
                [`NegP${placeholderIndex}`, row.negP],
                [`NegC${placeholderIndex}`, row.negC],
                [`NeuP${placeholderIndex}`, row.neuP],
                [`NeuC${placeholderIndex}`, row.neuC],
                [`posP${placeholderIndex}`, row.posP],
                [`posC${placeholderIndex}`, row.posC],
              ];
            }),
          ),
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
          additional_genders: additionalGenders,
          serviceData: allServiceData,
          serviceTooltipRows,
          service_name1: serviceRow1?.name ?? "",
          sNegP1: serviceRow1?.sNegP ?? 0,
          sNegC1: serviceRow1?.sNegC ?? 0,
          sNeuP1: serviceRow1?.sNeuP ?? 0,
          sNeuC1: serviceRow1?.sNeuC ?? 0,
          sPosP1: serviceRow1?.sPosP ?? 0,
          sPosC1: serviceRow1?.sPosC ?? 0,
          service_name2: serviceRow2?.name ?? "",
          sNegP2: serviceRow2?.sNegP ?? 0,
          sNegC2: serviceRow2?.sNegC ?? 0,
          sNeuP2: serviceRow2?.sNeuP ?? 0,
          sNeuC2: serviceRow2?.sNeuC ?? 0,
          sPosP2: serviceRow2?.sPosP ?? 0,
          sPosC2: serviceRow2?.sPosC ?? 0,
          service_name3: serviceRow3?.name ?? "",
          sNegP3: serviceRow3?.sNegP ?? 0,
          sNegC3: serviceRow3?.sNegC ?? 0,
          sNeuP3: serviceRow3?.sNeuP ?? 0,
          sNeuC3: serviceRow3?.sNeuC ?? 0,
          sPosP3: serviceRow3?.sPosP ?? 0,
          sPosC3: serviceRow3?.sPosC ?? 0,
          service_name4: serviceRow4?.name ?? "",
          sNegP4: serviceRow4?.sNegP ?? 0,
          sNegC4: serviceRow4?.sNegC ?? 0,
          sNeuP4: serviceRow4?.sNeuP ?? 0,
          sNeuC4: serviceRow4?.sNeuC ?? 0,
          sPosP4: serviceRow4?.sPosP ?? 0,
          sPosC4: serviceRow4?.sPosC ?? 0,
          additional_services: additionalServices,
          serviceValue: serviceValue,
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