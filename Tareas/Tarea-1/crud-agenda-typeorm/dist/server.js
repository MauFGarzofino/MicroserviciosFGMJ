"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const db_1 = require("./database/db");
const agenda_routes_1 = __importDefault(require("./routes/agenda.routes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 5000);
// Vistas
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Middlewares
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, method_override_1.default)('_method'));
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
db_1.AppDataSource.initialize()
    .then(() => {
    console.log('Conectado a la base de datos');
    app.use('/', agenda_routes_1.default);
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error al inicializar la base de datos:', err);
});
