import { pool } from '$lib/server/db';
import type { AreaRow, AreaConPIARow } from '$lib/types/db';

export const AreaDAO = {

    async getTodos(): Promise<AreaRow[]> {
        const query = `SELECT * FROM vista_areas;`;
        const [areas] = await pool.query<AreaRow[]>(query);
        return areas;
    },

    async getPorId(id: number): Promise<AreaRow | null> {
        const query = `SELECT * FROM vista_areas WHERE id = ?;`;
        const [areas] = await pool.query<AreaRow[]>(query, [id]);
        return areas.length > 0 ? areas[0] : null;
    },

    async getTodosConPIAs(): Promise<AreaConPIARow[]> {
        const query = `SELECT * FROM vista_areas_con_pias;`;
        const [areas] = await pool.query<AreaConPIARow[]>(query);
        return areas;
    },

    async getPorIdConPIAs(id: number): Promise<AreaConPIARow | null> {
        const query = `SELECT * FROM vista_areas_con_pias WHERE id = ?;`;
        const [areas] = await pool.query<AreaConPIARow[]>(query, [id]);
        return areas.length > 0 ? areas[0] : null;
    }
};