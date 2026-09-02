import { pool } from '$lib/server/db';
import type { 
    ProyectoConResponsableRow, 
    PIARow, 
    AreaRow, 
    DepartamentoRow, 
    ResultadoBusquedaGlobal 
} from '$lib/types/db';

export const BusquedaDAO = {

    async buscarGlobal(termino: string): Promise<ResultadoBusquedaGlobal> {
        const terminoLimpio = termino.trim();
        if (!terminoLimpio) {
            return {
                proyectos: [],
                pias: [],
                areas: [],
                departamentos: []
            };
        }

        const pattern = `%${terminoLimpio}%`;
        const idNumerico = parseInt(terminoLimpio, 10);
        const esNumero = !isNaN(idNumerico);

        // 1. Proyectos
        const queryProyectos = `
            SELECT * FROM vista_proyecto_con_responsable 
            WHERE nombre LIKE ? OR clave LIKE ? OR acuerdo LIKE ? ${esNumero ? 'OR id = ?' : ''}
            LIMIT 20;
        `;
        const paramsProyectos = esNumero ? [pattern, pattern, pattern, idNumerico] : [pattern, pattern, pattern];

        // 2. PIAs
        const queryPIAs = `
            SELECT * FROM vista_pias 
            WHERE nombre LIKE ? OR acuerdo LIKE ? ${esNumero ? 'OR id = ?' : ''}
            LIMIT 20;
        `;
        const paramsPIAs = esNumero ? [pattern, pattern, idNumerico] : [pattern, pattern];

        // 3. Áreas
        const queryAreas = `
            SELECT * FROM vista_areas 
            WHERE nombre LIKE ? OR acuerdo LIKE ? ${esNumero ? 'OR id = ?' : ''}
            LIMIT 20;
        `;
        const paramsAreas = esNumero ? [pattern, pattern, idNumerico] : [pattern, pattern];

        // 4. Departamentos
        let queryDeptos = `
            SELECT * FROM vista_departamento 
            WHERE nombre LIKE ? ${esNumero ? 'OR id = ?' : ''}
            LIMIT 20;
        `;
        const paramsDeptos = esNumero ? [pattern, idNumerico] : [pattern];

        const [proyectos] = await pool.query<ProyectoConResponsableRow[]>(queryProyectos, paramsProyectos);
        const [pias] = await pool.query<PIARow[]>(queryPIAs, paramsPIAs);
        const [areas] = await pool.query<AreaRow[]>(queryAreas, paramsAreas);

        let departamentos: DepartamentoRow[] = [];
        try {
            const [deptos] = await pool.query<DepartamentoRow[]>(queryDeptos, paramsDeptos);
            departamentos = deptos;
        } catch {
            queryDeptos = `
                SELECT * FROM vista_departamentos 
                WHERE nombre LIKE ? ${esNumero ? 'OR id = ?' : ''}
                LIMIT 20;
            `;
            const [deptos] = await pool.query<DepartamentoRow[]>(queryDeptos, paramsDeptos);
            departamentos = deptos;
        }

        return {
            proyectos,
            pias,
            areas,
            departamentos
        };
    }
};
