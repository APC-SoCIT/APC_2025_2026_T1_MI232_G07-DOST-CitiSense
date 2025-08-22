import Gauge from "../charts/gauge";
import Service from "../charts/service";
import Gender from "../charts/gender";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import DashboardDialog from "./DashboardDialog";
import { toast } from "sonner";
import api from "../../api";

function DashboardPage() {
  const [preview, setPreview] = useState<string>(""); //state for the current url of the image just downloaded from the browser
  const [isSaving, setIsSaving] = useState(false);
  const [fileName, setFileName] = useState("dashboard.png"); //state for the name of the image to be downloaded; default to dashboard.png
  const cardRef = useRef<HTMLElement | null>(null);

  //for capturing the dashboard page and saving to png
  const handleCapture = async () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    try {
      //temporarily remove the scale-85 style; this is to prevent capturing and saving cropped canvas
      cardElement.classList.remove("scale-85");

      //takes a screenshot of the dashboard and puts it in memory
      const canvas = await html2canvas(cardElement, {
        backgroundColor: "#ffffff",
        useCORS: true,
        scale: 2,
        allowTaint: true,
      });

      //get the url for the saved image from the canvas
      const dataUrl = canvas.toDataURL("image/png");

      //restore scaling after capture
      cardElement.classList.add("scale-85");

      //set the state for the URL of the image; for previewing the image before saving
      setPreview(dataUrl);
      setIsSaving(true);
    } catch (error) {
      alert("Faled to capture screenshot");
      cardElement.classList.add("scale-85");
    } finally {
      cardElement.classList.add("scale-85");
    }
  };

  const handleArchiveSubmit = async () => {
    //get the url of the image
    const response = await fetch(preview);
    //convert the url to binary
    const blob = await response.blob();

    //check if the filename ends with an extension ".png" or ".jpg"
    const fileNameEnd = fileName.endsWith(".png") || fileName.endsWith(".jpg");

    let finalFileName = fileName;
    //if file name doesn't include a file extension, then append ".png" to it
    if (!fileNameEnd) {
      finalFileName += ".png";
    }

    //create a form data and append the image and the fileName to the formData
    const formData = new FormData();
    formData.append("image", blob, finalFileName);
    formData.append("title", finalFileName);

    try {
      //post the formData to the backend
      await api.post("/archive/", formData);
      setIsSaving(false);
      toast.success("Successfully archived image!");
    } catch (error) {
      console.log("this is the error", error.response?.data);
      alert("error");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mr-20">
        <Button className="" variant="outline" onClick={handleCapture}>
          Capture Dashboard
        </Button>
      </div>

      <main
        ref={cardRef}
        className="scale-85 origin-top flex justify-center flex-col lg:flex-row"
      >
        <div className="flex flex-col w-full lg:w-1/2 mr-5">
          <div className="h-[400px] rounded-md shadow-lg mt-20 p-10">
            <div className="flex justify-center items-center h-[250px]">
              <div className="h-[330px] w-[400px]">
                <Gauge />
              </div>
            </div>
          </div>
          <div className="h-[400px] rounded-md shadow-lg mt-10 p-4">
            <Service />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 ml-5 pb-10">
          <div className="h-[400px] rounded-md shadow-lg mt-20 p-4">
            <Gender />
          </div>
          <div className="h-[400px] rounded-md shadow-lg mt-10 p-4">
            <Gender />
          </div>
        </div>
      </main>

      <DashboardDialog
        image={preview}
        isOpen={isSaving}
        setIsOpen={setIsSaving}
        fileName={fileName}
        setFileName={setFileName}
        onCancel={() => setIsSaving(false)}
        onConfirm={() => handleArchiveSubmit()}
        dialogTitle="Preview image"
        descriptionText="Please enter a name for the file to be downloaded"
        buttonText="Redo?"
      />
    </div>
  );
}

export default DashboardPage;
