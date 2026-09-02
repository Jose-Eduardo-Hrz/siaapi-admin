import type { PageServerLoad } from './$types';
import { BusquedaDAO } from '$lib/server/consultas/BusquedaDAO';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q') ?? '';

    if (!query.trim()) {
        return {
            query: '',
            resultados: {
                proyectos: [],
                pias: [],
                areas: [],
                departamentos: []
            }
        };
    }

    try {
        const resultados = await BusquedaDAO.buscarGlobal(query);
        return {
            query,
            resultados
        };
    } catch (e) {
        console.error('Error en búsqueda global:', e);
        return {
            query,
            resultados: {
                proyectos: [],
                pias: [],
                areas: [],
                departamentos: []
            }
        };
    }
};
