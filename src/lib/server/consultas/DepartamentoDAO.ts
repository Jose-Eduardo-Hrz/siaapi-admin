import { pool } from '$lib/server/db';
import type { DepartamentoRow, DepartamentoConPIARow } from '$lib/types/db';

export const DepartamentoDAO = {

    async getTodos(): Promise<DepartamentoRow[]> {
        const query = `SELECT * FROM vista_departamento;`;
        try {
            const [departamentos] = await pool.query<DepartamentoRow[]>(query);
            return departamentos;
        } catch {
            // Fallback en caso de plural
            const [departamentos] = await pool.query<DepartamentoRow[]>(`SELECT * FROM vista_departamentos;`);
            return departamentos;
        }
    },

    async getPorId(id: number): Promise<DepartamentoRow | null> {
        const query = `SELECT * FROM vista_departamento WHERE id = ?;`;
        try {
            const [departamentos] = await pool.query<DepartamentoRow[]>(query, [id]);
            return departamentos.length > 0 ? departamentos[0] : null;
        } catch {
            const [departamentos] = await pool.query<DepartamentoRow[]>(`SELECT * FROM vista_departamentos WHERE id = ?;`, [id]);
            return departamentos.length > 0 ? departamentos[0] : null;
        }
    },

    async getTodosConAreas(): Promise<DepartamentoConPIARow[]> {
        const query = `SELECT * FROM vista_departamento_con_areas;`;
        try {
            const [departamentos] = await pool.query<DepartamentoConPIARow[]>(query);
            return departamentos;
        } catch {
            const [departamentos] = await pool.query<DepartamentoConPIARow[]>(`SELECT * FROM vista_departamentos_areas;`);
            return departamentos;
        }
    },

    async getPorIdConAreas(id: number): Promise<DepartamentoConPIARow | null> {
        const query = `SELECT * FROM vista_departamento_con_areas WHERE id = ?;`;
        try {
            const [departamentos] = await pool.query<DepartamentoConPIARow[]>(query, [id]);
            return departamentos.length > 0 ? departamentos[0] : null;
        } catch {
            const [departamentos] = await pool.query<DepartamentoConPIARow[]>(`SELECT * FROM vista_departamentos_areas WHERE id = ?;`, [id]);
            return departamentos.length > 0 ? departamentos[0] : null;
        }
    }
};