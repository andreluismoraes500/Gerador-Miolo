import express from "express";
import cors from "cors";
import { generatePDFFromUrl } from "./renderer.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/generate", async (req, res) => {
  const {
    template,
    selectedDate,
    colorTheme = "classico",
    customName = "",
    footerType = "default",
    businessProfileId = "default",
  } = req.body;

  if (!template || !selectedDate) {
    return res
      .status(400)
      .json({ error: "template e selectedDate são obrigatórios" });
  }

  // URL do frontend em desenvolvimento
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const previewUrl = new URL("/preview", frontendUrl);
  const params = new URLSearchParams({
    template,
    selectedDate,
    colorTheme,
    customName,
    footerType,
    businessProfileId,
  });
  previewUrl.search = params.toString();

  try {
    const pdfBuffer = await generatePDFFromUrl(previewUrl.toString());
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="agenda-${template}-${selectedDate}.pdf"`,
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).json({ error: "Falha ao gerar o PDF" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
