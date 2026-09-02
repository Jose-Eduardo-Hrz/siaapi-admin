import type { PageServerLoad } from './$types';
import { ProyectoDAO } from '$lib/server/consultas/ProyectoDAO';
import { DepartamentoDAO } from '$lib/server/consultas/DepartamentoDAO';
import { calcularEstadisticasProyectos } from '$lib/utils/stats';

export const load: PageServerLoad = async () => {
    try {
        const [proyectos, departamentos] = await Promise.all([
            ProyectoDAO.getTodos(),
            DepartamentoDAO.getTodos()
        ]);

        const stats = calcularEstadisticasProyectos(proyectos);

        return {
            proyectos,
            stats,
            departamentos
        };
    } catch (e) {
        console.error('Error cargando catálogo de proyectos:', e);
        return {
            proyectos: [],
            stats: { total: 0, activos: 0, terminados: 0, proximos: 0, conProrroga: 0 },
            departamentos: []
        };
    }
};