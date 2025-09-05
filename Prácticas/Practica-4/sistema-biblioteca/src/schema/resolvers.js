const Libro = require("../entity/Libro");
const Prestamo = require("../entity/Prestamo");

module.exports = function createResolvers(AppDataSource) {
    return {
        Query: {
            getLibros: async () => {
                return await AppDataSource.getRepository(Libro).find({
                    relations: ["prestamos"],
                    order: { id: "ASC" },
                });
            },
            getPrestamos: async () => {
                return await AppDataSource.getRepository(Prestamo).find({
                    relations: ["libro"],
                    order: { id: "ASC" },
                });
            },
            getPrestamoById: async (_p, { id }) => {
                return await AppDataSource.getRepository(Prestamo).findOne({
                    where: { id: Number(id) },
                    relations: ["libro"],
                });
            },
            getPrestamosByUsuario: async (_p, { usuario }) => {
                return await AppDataSource.getRepository(Prestamo).find({
                    where: { usuario },
                    relations: ["libro"],
                    order: { id: "ASC" },
                });
            },
        },

        Mutation: {
            createLibro: async (_p, args) => {
                const repoLibro = AppDataSource.getRepository(Libro);
                const nuevo = repoLibro.create(args);
                return await repoLibro.save(nuevo);
            },

            createPrestamo: async (_p, { usuario, fecha_prestamo, fecha_devolucion, libroId }) => {
                const repoPrestamo = AppDataSource.getRepository(Prestamo);
                const repoLibro = AppDataSource.getRepository(Libro);

                const libro = await repoLibro.findOneBy({ id: Number(libroId) });
                if (!libro) throw new Error("Libro no encontrado");

                const prestamo = repoPrestamo.create({
                    usuario,
                    fecha_prestamo,
                    fecha_devolucion,
                    libro,
                });
                return await repoPrestamo.save(prestamo);
            },
        },

    };
};
