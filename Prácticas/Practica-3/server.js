const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para leer <form method="POST">
app.use(express.urlencoded({ extended: true }));

// Servir la vista principal
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/calcular', (req, res) => {
    const { operacion, a, b } = req.body;

    const x = parseFloat(a);
    const y = parseFloat(b);

    // Validaciones
    if (Number.isNaN(x) || Number.isNaN(y)) {
        return res.send(htmlResultado('Error: a y b deben ser números.', operacion, a, b));
    }
    if (operacion === 'dividir' && y === 0) {
        return res.send(htmlResultado('Error: división entre cero no permitida.', operacion, a, b));
    }

    // Cálculo
    let resultado;
    switch (operacion) {
        case 'sumar': resultado = x + y; break;
        case 'restar': resultado = x - y; break;
        case 'multiplicar': resultado = x * y; break;
        case 'dividir': resultado = x / y; break;
        default:
            return res.send(htmlResultado('Operación inválida.', operacion, a, b));
    }

    res.send(htmlResultado(`Resultado: ${resultado}`, operacion, a, b));
});

// Función que genera la página de resultado (todo en servidor)
function htmlResultado(mensaje, operacion, a, b) {
    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Calculadora - Resultado</title>
  <style>
    body { font-family: system-ui, Arial, sans-serif; max-width: 560px; margin: 40px auto; padding: 0 16px; }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
    .btn { display: inline-block; padding: 10px 14px; border-radius: 8px; text-decoration:none; background:#111827; color:white; }
    .muted { color:#6b7280; }
    .row { margin-top: 12px; }
    code { background:#f3f4f6; padding: 2px 6px; border-radius: 6px; }
  </style>
</head>
<body>
  <h1>Calculadora</h1>
  <div class="card">
    <p><strong>${mensaje}</strong></p>
    <div class="row muted">
      <div>Operación: <code>${operacion || '-'}</code></div>
      <div>a: <code>${a ?? '-'}</code> | b: <code>${b ?? '-'}</code></div>
    </div>
    <div class="row"><a class="btn" href="/">Volver</a></div>
  </div>
</body>
</html>`;
}

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
