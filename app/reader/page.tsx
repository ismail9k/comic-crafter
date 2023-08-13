"use client";

import PDFViewer from "@/components/PDFViewer";
import "./style.css";

export default function Home() {
  return (
    <main>
      <PDFViewer file="comic_series_01.pdf" />
    </main>
  );
}
