import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, "proto", "universidad.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    includeDirs: [path.resolve(__dirname, "proto")],
});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

const client = new proto.UniversidadService(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

function agregarEstudiante(est) {
    return new Promise((resolve, reject) => {
        client.AgregarEstudiante(est, (err, res) => (err ? reject(err) : resolve(res.estudiante)));
    });
}

function agregarCurso(cur) {
    return new Promise((resolve, reject) => {
        client.AgregarCurso(cur, (err, res) => (err ? reject(err) : resolve(res.curso)));
    });
}

function inscribir(ci, codigo) {
    return new Promise((resolve, reject) => {
        client.InscribirEstudiante({ ci, codigo }, (err, res) => (err ? reject(err) : resolve(res)));
    });
}

function listarCursosDeEstudiante(ci) {
    return new Promise((resolve, reject) => {
        client.ListarCursosDeEstudiante({ ci }, (err, res) => (err ? reject(err) : resolve(res.cursos)));
    });
}

function listarEstudiantesDeCurso(codigo) {
    return new Promise((resolve, reject) => {
        client.ListarEstudiantesDeCurso({ codigo }, (err, res) => (err ? reject(err) : resolve(res.estudiantes)));
    });
}

(async () => {
    try {
        // Registro de estudiante
        const estudiante = await agregarEstudiante({
            ci: "12345",
            nombres: "Mauricio",
            apellidos: "Montellano",
            carrera: "Sistemas",
        });
        console.log("Estudiante agregado:", estudiante);

        // Registro de cursos
        const curso1 = await agregarCurso({ codigo: "COM600", nombre: "Microservicios", docente: "Ing. Montellano" });
        const curso2 = await agregarCurso({ codigo: "SIS256", nombre: "WEB", docente: "Ing. Montellano" });
        console.log("Cursos agregados:", curso1, curso2);

        // Inscripción estudiante - cursos
        await inscribir("12345", "COM600");
        await inscribir("12345", "SIS256");
        console.log("Inscripciones realizadas.");

        // Intentar inscribir duplicado para ver ALREADY_EXISTS
        try {
            await inscribir("12345", "COM600");
        } catch (e) {
            console.log("Inscripción duplicada:", e.code === 6 ? "ALREADY_EXISTS" : e.message);
        }

        //Consultar los cursos del estudiante
        const cursosDelEst = await listarCursosDeEstudiante("12345");
        console.log("Cursos del estudiante 12345:", cursosDelEst);

        // Consultar los estudiantes de un curso
        const estudiantesDeCOM600 = await listarEstudiantesDeCurso("COM600");
        console.log("Estudiantes en COM600:", estudiantesDeCOM600);
    } catch (err) {
        console.error("Error en cliente:", err);
    }
})();
