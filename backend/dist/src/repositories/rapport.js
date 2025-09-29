import { PrismaClient } from "@prisma/client";
import { mnprisma } from '../config/db.js';
export class rapportRepository {
    async create(data) {
        return mnprisma.rapport.create({ data });
    }
    async findById(id) {
        return mnprisma.rapport.findUnique({ where: { id } });
    }
    async findAll() {
        return mnprisma.rapport.findMany();
    }
    async update(id, data) {
        return mnprisma.rapport.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.rapport.delete({ where: { id } });
    }
    async findByType(typeRapport) {
        return mnprisma.rapport.findMany({ where: { typeRapport } });
    }
}
//# sourceMappingURL=rapport.js.map