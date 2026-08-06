// test-vercel.mjs
const API_SECRET = "sua-chave-secreta-aqui";

async function testVercel() {
  try {
    console.log("🚀 Testando serviço Vercel...");
    console.log(
      "URL:",
      "https://vercel-pdf-service-seven.vercel.app/api/generate-pdf",
    );

    const response = await fetch(
      "https://vercel-pdf-service-seven.vercel.app/api/generate-pdf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_SECRET,
        },
        body: JSON.stringify({ url: "https://example.com" }),
      },
    );

    console.log("📡 Status:", response.status);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      console.log("✅ PDF gerado com sucesso!");
      console.log("📄 Tamanho:", buffer.byteLength, "bytes");

      const fs = await import("fs");
      fs.writeFileSync("test.pdf", Buffer.from(buffer));
      console.log("💾 Arquivo salvo como: test.pdf");
    } else {
      const errorText = await response.text();
      console.log("❌ Erro:", response.status, errorText);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error.message);
  }
}

testVercel();
