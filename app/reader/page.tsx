"use client";

import PDFViewer from "@/components/PDFViewer";
import "./style.css";

export default function Home() {
  return (
    <main>
      <PDFViewer file="api-design.pdf" />
    </main>
  );
}
