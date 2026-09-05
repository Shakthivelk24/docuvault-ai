import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DocuVault AI server running on port ${PORT}`);
});