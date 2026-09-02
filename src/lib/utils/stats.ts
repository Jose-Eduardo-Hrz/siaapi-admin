import type { EstadisticasProyectos, ProyectoCompletoRow, ProyectoConResponsableRow, ProyectoRow } from '$lib/types/db';
import { evaluarEstadoProyecto } from './projectStatus';

/**
 * Calcula estadísticas agregadas para una lista de proyectos.
 */
export function calcularEstadisticasProyectos(
    proyectos: Array<ProyectoCompletoRow | ProyectoRow | ProyectoConResponsableRow>
): EstadisticasProyectos {

    let activos = 0;
    let terminados = 0;
    let proximos = 0;
    let conProrroga = 0;

    for (const proj of proyectos) {
        const info = evaluarEstadoProyecto(proj);
        
        if (info.tieneProrroga) {
            conProrroga++;
        }

        if (info.estado === 'Terminado') {
            terminados++;
        } else if (info.estado === 'Próximo a terminar') {
            proximos++;
        } else {
            activos++;
        }
    }

    return {
        total: proyectos.length,
        activos,
        terminados,
        proximos,
        conProrroga
    };
}
