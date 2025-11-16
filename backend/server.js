const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Carpeta pública (al mismo nivel que /backend)
app.use('/public', express.static(path.join(__dirname, '../public')));

// Multer para manejar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Función helper para guardar archivos
function saveFile(file, folder, fileName) {
  const dir = path.join(__dirname, '../public', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, file.buffer);

  return `http://localhost:3000/public/${folder}/${fileName}`;
}

// Endpoint para subir headshots
app.post('/upload-headshot', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');
    const ext = path.extname(req.file.originalname);
    const fileName = `${req.body.lastName}_${req.body.firstName}${ext}`;
    const url = saveFile(req.file, 'headshots', fileName);
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading headshot');
  }
});

// Endpoint para subir videos
app.post('/upload-video', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');
    const ext = path.extname(req.file.originalname);
    const fileName = `${req.body.videoName}${ext}`;
    const url = saveFile(req.file, 'videos', fileName);
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading video');
  }
});

// Iniciar servidor
app.listen(3000, () => console.log('Server running on port 3000'));
