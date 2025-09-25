import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, "proto", "universidad.proto");

// Cargar el proto (opciones útiles para defaults y enums/longs como strings)
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    includeDirs: [path.resolve(__dirname, "proto")],
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// ===== Base de datos en memoria =====
const estudiantes = []; // Estudiante[]
const cursos = [];      // Curso[]

// Relación muchos-a-muchos:
// - Map de ci -> Set de codigos de curso
// - Map de codigo -> Set de cis (estudiantes)
const cursosPorEstudiante = new Map(); // Map<string, Set<string>>
const estudiantesPorCurso = new Map(); // Map<string, Set<string>>

// ===== Helpers =====
function buscarEstudiante(ci) {
    return estudiantes.find(e => e.ci === ci) || null;
}
function buscarCurso(codigo) {
    return cursos.find(c => c.codigo === codigo) || null;
}

function inscribir(ci, codigo) {
    if (!cursosPorEstudiante.has(ci)) cursosPorEstudiante.set(ci, new Set());
    if (!estudiantesPorCurso.has(codigo)) estudiantesPorCurso.set(codigo, new Set());
    const setCursos = cursosPorEstudiante.get(ci);
    const setEstudiantes = estudiantesPorCurso.get(codigo);

    if (setCursos.has(codigo)) {
        // ya inscrito
        const err = {
            code: grpc.status.ALREADY_EXISTS,
            message: `El estudiante ${ci} ya está inscrito en el curso ${codigo}`
        };
        throw err;
    }

    setCursos.add(codigo);
    setEstudiantes.add(ci);
}

// ===== Implementación de servicios =====
const serviceImpl = {
    AgregarEstudiante: (call, callback) => {
        const nuevo = call.request; // Estudiante
        if (!nuevo.ci || !nuevo.nombres) {
            return callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: "ci y nombres son obligatorios"
            });
        }
        const yaExiste = buscarEstudiante(nuevo.ci);
        if (yaExiste) {
            return callback({
                code: grpc.status.ALREADY_EXISTS,
                message: `Ya existe un estudiante con ci ${nuevo.ci}`
            });
        }
        estudiantes.push(nuevo);
        callback(null, { estudiante: nuevo });
    },

    AgregarCurso: (call, callback) => {
        const nuevo = call.request; // Curso
        if (!nuevo.codigo || !nuevo.nombre) {
            return callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: "codigo y nombre son obligatorios"
            });
        }
        const yaExiste = buscarCurso(nuevo.codigo);
        if (yaExiste) {
            return callback({
                code: grpc.status.ALREADY_EXISTS,
                message: `Ya existe un curso con código ${nuevo.codigo}`
            });
        }
        cursos.push(nuevo);
        callback(null, { curso: nuevo });
    },

    InscribirEstudiante: (call, callback) => {
        const { ci, codigo } = call.request;
        const est = buscarEstudiante(ci);
        const cur = buscarCurso(codigo);

        if (!est) {
            return callback({ code: grpc.status.NOT_FOUND, message: `Estudiante ${ci} no encontrado` });
        }
        if (!cur) {
            return callback({ code: grpc.status.NOT_FOUND, message: `Curso ${codigo} no encontrado` });
        }
        try {
            inscribir(ci, codigo);
            callback(null, { estudiante: est, curso: cur });
        } catch (err) {
            callback(err);
        }
    },

    ListarCursosDeEstudiante: (call, callback) => {
        const { ci } = call.request;
        const est = buscarEstudiante(ci);
        if (!est) {
            return callback({ code: grpc.status.NOT_FOUND, message: `Estudiante ${ci} no encontrado` });
        }
        const codigos = Array.from(cursosPorEstudiante.get(ci) || []);
        const cursosDelEst = cursos.filter(c => codigos.includes(c.codigo));
        callback(null, { cursos: cursosDelEst });
    },

    ListarEstudiantesDeCurso: (call, callback) => {
        const { codigo } = call.request;
        const cur = buscarCurso(codigo);
        if (!cur) {
            return callback({ code: grpc.status.NOT_FOUND, message: `Curso ${codigo} no encontrado` });
        }
        const cis = Array.from(estudiantesPorCurso.get(codigo) || []);
        const ests = estudiantes.filter(e => cis.includes(e.ci));
        callback(null, { estudiantes: ests });
    },

    // RPCs opcionales (útiles para verificar estado)
    ListarEstudiantes: (_call, callback) => {
        callback(null, { estudiantes });
    },
    ListarCursos: (_call, callback) => {
        callback(null, { cursos });
    }
};

// ===== Boot del servidor =====
const server = new grpc.Server();
server.addService(proto.UniversidadService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
        console.error("Error al iniciar servidor:", err);
        return;
    }
    console.log(`Servidor gRPC escuchando en ${bindPort}`);
    server.start();
});
