import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";

interface TermsAndConditionsPopupProps {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const TermsAndConditionsPopup: React.FC<TermsAndConditionsPopupProps> = ({
  open,
  onClose,
  onAgree,
}) => {
  // State to track if the user has agreed to the terms
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  // Handler for the "Accept & Continue" button
  const handleOk = () => {
    if (agreed) {
      setError("");
      onAgree();
    } else {
      setError("You must agree to the Terms and Conditions to register.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b px-8 py-6 bg-white">
          <DialogTitle className="text-2xl font-bold text-slate-800 m-0">
            Terms and Conditions
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-slate-500">
            <strong>Project:</strong> CitiSense | <strong>Agency:</strong> DOST
          </DialogDescription>
        </DialogHeader>
        <div
          className="px-8 py-6 overflow-y-auto text-[0.95rem] text-slate-700 leading-relaxed bg-slate-50"
          style={{ maxHeight: "40vh" }}
        >
          <section className="mb-5">
            <h3 className="text-base text-slate-900 mb-2 font-semibold">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing or using CitiSense (the “System”), you agree to
              comply with these Terms and Conditions and the DOST Privacy
              Policy. Use of this System constitutes agreement to follow all
              internal ICT policies of the Department.
            </p>
          </section>
          <section className="mb-5">
            <h3 className="text-base text-slate-900 mb-2 font-semibold">
              2. Purpose of the System
            </h3>
            <p>
              CitiSense is a Research and Development (R&D) tool designed to
              provide automated sentiment insights from text-based data to
              support data-driven decision-making.
            </p>
          </section>
          <section className="mb-5">
            <h3 className="text-base text-slate-900 mb-2 font-semibold">
              3. Data Privacy and Protection
            </h3>
            <p className="mb-2">In compliance with Republic Act No. 10173:</p>
            <ul className="list-disc pl-5 m-0">
              <li>
                <strong>Data Collection:</strong> Uploading Sensitive Personal
                Information is prohibited unless strictly necessary.
              </li>
              <li>
                <strong>Access Control:</strong> Use of another person’s account
                violates DOST AO No. 002.
              </li>
            </ul>
          </section>
          <section className="mb-5">
            <h3 className="text-base text-slate-900 mb-2 font-semibold">
              4. Intellectual Property
            </h3>
            <ul className="list-disc pl-5 m-0">
              <li>
                <strong>Ownership:</strong> Algorithms remain the property of
                DOST.
              </li>
              <li>
                <strong>Attribution:</strong> Publications must credit CitiSense
                and DOST.
              </li>
            </ul>
          </section>
          <section>
            <h3 className="text-base text-slate-900 mb-2 font-semibold">
              5. Acceptable Use Policy
            </h3>
            <p>
              Users agree NOT to use CitiSense for political/religious
              promotion, commercial gain without TLA, or malicious activity.
            </p>
          </section>
        </div>
        <DialogFooter className="border-t px-8 py-6 bg-white">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2 mb-5">
              <Checkbox
                id="agree-checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <Label
                htmlFor="agree-checkbox"
                className="text-sm cursor-pointer select-none text-slate-600"
              >
                I have read and agree to the Terms and Conditions
              </Label>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleOk}
                disabled={!agreed}
                className={
                  agreed
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-400 cursor-not-allowed"
                }
              >
                Accept & Continue
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsPopup;
