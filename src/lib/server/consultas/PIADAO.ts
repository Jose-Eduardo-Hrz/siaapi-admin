import { pool } from '$lib/server/db';
import type { PIARow, PIAConProyectosRow } from '$lib/types/db';

export const PIADAO = {

    async getTodos(): Promise<PIARow[]> {
        const query = `SELECT * FROM vista_pias;`;
        const [pias] = await pool.query<PIARow[]>(query);
        return pias;
    },

    async getPorId(id: number): Promise<PIARow | null> {
        const query = `SELECT * FROM vista_pias WHERE id = ?;`;
        const [pias] = await pool.query<PIARow[]>(query, [id]);
        return pias.length > 0 ? pias[0] : null;
    },

    async getTodosConProyectos(): Promise<PIAConProyectosRow[]> {
        const query = `SELECT * FROM vista_pias_con_proyectos;`;
        const [pias] = await pool.query<PIAConProyectosRow[]>(query);
        return pias;
    },

    async getPorIdConProyectos(id: number): Promise<PIAConProyectosRow | null> {
        const query = `SELECT * FROM vista_pias_con_proyectos WHERE id = ?;`;
        const [pias] = await pool.query<PIAConProyectosRow[]>(query, [id]);
        return pias.length > 0 ? pias[0] : null;
    }
};