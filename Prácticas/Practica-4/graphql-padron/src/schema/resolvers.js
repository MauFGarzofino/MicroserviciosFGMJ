const Mesa = require("../entity/Mesa");
const Padron = require("../entity/Padron");

// Exporta una función que recibe AppDataSource y devuelve los resolvers
module.exports = function createResolvers(AppDataSource) {
    return {
        Query: {
            getPadrones: async () => {
                return await AppDataSource
                    .getRepository("Padron")
                    .find({ relations: ["mesa"] });
            },
            getMesas: async () => {
                return await AppDataSource
                    .getRepository("Mesa")
                    .find({ relations: ["padrones"] });
            },
            getPadronById: async (_parent, { id }) => {
                return await AppDataSource.getRepository("Padron").findOne({
                    where: { id },
                    relations: ["mesa"],
                });
            },
        },
        Mutation: {
            createMesa: async (_parent, { nro_mesa, nombre_escuela }) => {
                const repo = AppDataSource.getRepository("Mesa");
                const mesa = repo.create({ nro_mesa, nombre_escuela });
                console.log(mesa)
                return await repo.save(mesa);
            },
            createPadron: async (_parent, { nombres, apellidos, numero_documento, fotografia, mesaId }) => {
                const repoPadron = AppDataSource.getRepository("Padron");
                const repoMesa = AppDataSource.getRepository("Mesa");

                const mesa = await repoMesa.findOneBy({ id: mesaId });
                if (!mesa) throw new Error("Mesa no encontrada");

                const padron = repoPadron.create({
                    nombres,
                    apellidos,
                    numero_documento,
                    fotografia,
                    mesa,
                });
                return await repoPadron.save(padron);
            },
        },
    };
};
