const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/send-email", upload.single("file"), async (req, res) => {
  const { email } = req.body;
  const { tel } = req.body;
  const file = req.file;

  if (!email || !file || !tel) {
    return res.status(400).json({ success: false, message: "Dados inválidos." });
  }

  try {
    // Lê o arquivo PDF e extrai o texto
    const fileBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(fileBuffer);
    const extractedText = pdfData.text;

    // Envia o texto para a API do Ollama
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1",
        prompt: `Faça um relatório do seguinte texto extraído de um PDF:\n${extractedText}`,
        stream: false,
        max_tokens: 500,
      }),
    });

    const responseData = await ollamaResponse.json();
    const ollamaReport = responseData.response;

    const data = {
      messaging_product: "whatsapp",
      to: tel,
      type: "text",
      text: { body: ollamaReport },
    };

    // Configura o transporte do Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // ou outro serviço de e-mail
      auth: {
        user: "",//email que vai enviar mensagem
        pass: "",//password app desse email
      },
    });

    const response = await axios.post(url, data, { headers });
    res.json({ success: true, data: response.data });

    // Configura as opções do e-mail
    const mailOptions = {
      from: "",//email que vai enviar a mensagem
      to: email,
      subject: "Texto extraído do arquivo PDF",
      text: `Relatório gerado pela IA:\n\n${ollamaReport}`,
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);

    // Remove o arquivo temporário após o uso
    fs.unlinkSync(file.path);
  } catch (error) {
    console.error("Erro ao processar o arquivo ou enviar o e-mail:", error);

    // Remove o arquivo temporário em caso de erro
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.status(500).json({ success: false, message: "Erro ao processar o arquivo ou enviar o e-mail." });
  }
});
const axios = require("axios");

const url = "https://graph.facebook.com/v22.0/581147828408410/messages";
const token = "";//TOKEN DA API DO WHATSAPP(developers.facebook)
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

rl.question("Digite sua mensagem: ", (ollamaReport, tel) => {
  const data = {
    messaging_product: "whatsapp",
    to: tel,
    type: "text",
    text: { body: `${ollamaReport}` }, // Mensagem direta
  };


  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Mensagem enviada com sucesso:", response.data);
    })
    .catch((error) => {
      console.error(
        "Erro ao enviar mensagem:",
        error.response ? error.response.data : error.message
      );
    })
    .finally(() => {
      rl.close();
    });
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
