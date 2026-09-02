import { pool } from '$lib/server/db';
import type { ProyectoCompletoRow } from '$lib/types/db'

export const ProyectoDAO = {

    async getTodos(): Promise<ProyectoCompletoRow[]> {
        const query = `
            SELECT * FROM vista_proyecto_completo;
        `;
        const [proyectos] = await pool.query<ProyectoCompletoRow[]>(query)
        return proyectos
    },

    async getPorId(id: number): Promise<ProyectoCompletoRow | null> {
        const query = `select * from vista_proyecto_completo where id = ?`;
        const [proyectos] = await pool.query<ProyectoCompletoRow[]>(query, [id])
        return proyectos.length > 0 ? proyectos[0] : null
    },

}
