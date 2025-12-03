## 📌 1. Visão Geral

Este backend foi desenvolvido para processar arquivos PDF, extrair o texto, gerar um relatório automático usando a API da OpenAI (ChatGPT) e enviar o resultado tanto por **e-mail (via Nodemailer)** quanto por **WhatsApp (via Meta WhatsApp Cloud API)**.

Ele funciona em conjunto com o front-end disponível em:
👉 **[https://github.com/RomuloLB28/gerador-de-relatorio-usando-chatgpt-front](https://github.com/RomuloLB28/gerador-de-relatorio-usando-chatgpt-front)**

---

## 🧠 2. Fluxo de Funcionamento

1. O usuário envia um arquivo PDF + email + telefone pelo front-end.
2. O servidor:

   * recebe o PDF
   * extrai o texto
   * envia o conteúdo para o ChatGPT
   * recebe um relatório estruturado gerado pela IA
3. O relatório é enviado:

   * por **e-mail**
   * via **WhatsApp**
4. O arquivo é apagado do servidor.

---

## 🛠️ 3. Tecnologias Utilizadas

* **Node.js + Express**
* **Multer** (upload de arquivos)
* **pdf-parse** (leitura de PDFs)
* **OpenAI API**
* **Nodemailer** (envio de e-mails)
* **Meta WhatsApp API**
* **Axios**

---

## 📁 4. Estrutura do Projeto

```
/uploads           # PDFs temporários
serverOpenAi.cjs   # Fluxo usando ChatGPT + e-mail
serverOllama.cjs   # Versão alternativa (IA local)
package.json
README.md
```

---

## 🚀 5. Como Rodar o Projeto

### 1. Instale as dependências:

```bash
git clone https://github.com/RomuloLB28/projeto-relatorio-backend
```

```bash
npm install
```

### 2. Configure as variáveis (API Keys)

Edite dentro do código:

* `apiKey` → chave da OpenAI
* `token` → chave da API do WhatsApp
* Email e senha de app do Gmail para o Nodemailer

### 3. Inicie o servidor:

```bash
node serverOpenAi.cjs
```

Servidor disponível em:

```
http://localhost:3001
```

---

## 📬 6. Endpoint Principal

### **POST /send-email**

Envia relatório por e-mail e WhatsApp.

### **Body (multipart/form-data)**:

| Campo | Tipo   | Obrigatório | Descrição                    |
| ----- | ------ | ----------- | ---------------------------- |
| file  | PDF    | ✔           | Arquivo enviado pelo usuário |
| email | string | ✔           | E-mail para envio            |
| tel   | string | ✔           | Número no WhatsApp           |

---

## 📦 7. Exemplo de Resposta

```json
{
  "success": true,
  "message": "Relatório enviado com sucesso!"
}
```
