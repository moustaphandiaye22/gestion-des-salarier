import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class ParametreGlobalRepository {
    async findAll() {
        return await prisma.parametreGlobal.findMany({
            orderBy: { categorie: 'asc' }
        });
    }
    async findById(id) {
        return await prisma.parametreGlobal.findUnique({
            where: { id }
        });
    }
    async create(data) {
        return await prisma.parametreGlobal.create({ data });
    }
    async getAll() {
        return await prisma.parametreGlobal.findMany({
            orderBy: { categorie: 'asc' }
        });
    }
    async getById(id) {
        return await prisma.parametreGlobal.findUnique({
            where: { id }
        });
    }
    async getByKey(cle) {
        return await prisma.parametreGlobal.findUnique({
            where: { cle }
        });
    }
    async update(id, data) {
        return await prisma.parametreGlobal.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await prisma.parametreGlobal.delete({
            where: { id }
        });
    }
    async getByCategory(categorie) {
        return await prisma.parametreGlobal.findMany({
            where: { categorie },
            orderBy: { cle: 'asc' }
        });
    }
}
//# sourceMappingURL=parametreGlobal.js.map