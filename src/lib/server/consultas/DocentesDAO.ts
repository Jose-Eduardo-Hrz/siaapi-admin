import { pool } from '$lib/server/db';
import type { DocenteRow } from '$lib/types/db'

export const DocenteDAO = {

    async getTodos(): Promise<DocenteRow[]> {
        const query = `
            SELECT * FROM vista_docente;
        `;
        const [docentes] = await pool.query<DocenteRow[]>(query)
        return docentes
    },

}