// api/generate.js
import { generatePDFFromUrl } from "./_lib/renderer.js";

// Sanitiza o nome do arquivo para evitar injeção
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9\-_. ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

// Lista de templates permitidos (segurança)
const ALLOWED_TEMPLATES = [
  "anualLivre",
  "anualCompleto",
  "anualComercialDuplo",
  "diario",
  "diarioLivre",
  "diarioFloral",
  "mensalCompleto",
  "mensalLivre",
  "mensalComercialDuplo",
  "semanal",
  "tarefas",
  "capa",
  "dadosPessoais",
  "calendarios",
  "gratidao",
  "habitos",
  "financas",
  "conteudo",
  "refeicoes",
  "metas",
  "saude",
  "pet",
  "sono",
  "estudos",
  "leitura",
  "viagem",
  "compras",
  "sonhos",
  "wishlist",
  "cadernoUniversitario",
  "cadernoReceitas",
  "bulletJournal",
  "babyBook",
  "listaChamada",
  "boletim",
  "planoAula",
  "caligrafia",
  "noivas",
  "partituras",
  "floralMensal",
  "floralAnual",
  "diarioComercial",
  "diarioComercialDuplo",
  "plannerMensal",
  "semData",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");

  const {
    template,
    selectedDate,
    colorTheme = "classico",
    customName = "",
    footerType = "default",
    businessProfileId = "default",
  } = req.body;

  // Validações
  if (!template || !selectedDate) {
    return res
      .status(400)
      .json({ error: "template e selectedDate são obrigatórios" });
  }

  if (!ALLOWED_TEMPLATES.includes(template)) {
    return res.status(400).json({ error: "Template inválido" });
  }

  // Sanitiza o nome do arquivo
  const safeTemplate = sanitizeFilename(template);
  const safeDate = sanitizeFilename(selectedDate);
  const filename = `agenda-${safeTemplate}-${safeDate}.pdf`;

  // Constrói a URL de preview
  const frontendUrl = process.env.FRONTEND_URL || "https://seu-site.vercel.app";
  const previewUrl = new URL("/preview", frontendUrl);
  previewUrl.searchParams.set("template", template);
  previewUrl.searchParams.set("selectedDate", selectedDate);
  previewUrl.searchParams.set("colorTheme", colorTheme);
  previewUrl.searchParams.set("customName", customName || "");
  previewUrl.searchParams.set("footerType", footerType);
  previewUrl.searchParams.set("businessProfileId", businessProfileId);
  previewUrl.searchParams.set("printing", "true");
  previewUrl.searchParams.set("_t", Date.now()); // cache buster

  console.log(
    `[generate] Gerando PDF para ${filename} a partir de ${previewUrl.toString()}`,
  );

  try {
    const pdfBuffer = await generatePDFFromUrl(previewUrl.toString());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "no-cache");

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("[generate] Erro:", error);
    return res.status(500).json({
      error: "Falha ao gerar o PDF",
      details: error.message,
    });
  }
}
