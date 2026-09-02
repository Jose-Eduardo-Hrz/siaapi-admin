import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { ProyectoDAO } from '$lib/server/consultas/ProyectoDAO';

export const load: PageServerLoad = async ({ params }) => {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        throw error(400, 'ID de proyecto inválido');
    }

    try {
        const proyecto = await ProyectoDAO.getPorId(id);

        if (!proyecto) {
            throw error(404, 'Proyecto no encontrado');
        }

        return {
            proyecto
        };
    } catch (e: any) {
        if (e.status === 404 || e.status === 400) throw e;
        console.error('Error cargando detalle de proyecto:', e);
        throw error(500, 'Error al consultar información del proyecto');
    }
};
