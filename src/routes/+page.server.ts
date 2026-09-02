import type { PageServerLoad } from './$types';
import { DepartamentoDAO } from '$lib/server/consultas/DepartamentoDAO';
import { AreaDAO } from '$lib/server/consultas/AreaDAO';
import { PIADAO } from '$lib/server/consultas/PIADAO';
import { ProyectoDAO } from '$lib/server/consultas/ProyectoDAO';
import { calcularEstadisticasProyectos } from '$lib/utils/stats';
import { safeJsonParse } from '$lib/utils/jsonParser';

export const load: PageServerLoad = async () => {
    try {
        const [departamentos, areas, pias, proyectos] = await Promise.all([
            DepartamentoDAO.getTodosConAreas(),
            AreaDAO.getTodos(),
            PIADAO.getTodos(),
            ProyectoDAO.getTodos()
        ]);



        const proyectosStats = calcularEstadisticasProyectos(proyectos);

        // Mapear departamentos con métricas relacionales
        const departamentosResumen = departamentos.map((dept) => {
            const deptAreas = safeJsonParse(dept.areas, []);
            let totalPIAsDept = 0;
            const projIdsSet = new Set<number>();

            if (Array.isArray(deptAreas)) {
                deptAreas.forEach((area: any) => {
                    const piasArea = safeJsonParse(area.pias, []);
                    if (Array.isArray(piasArea)) {
                        totalPIAsDept += piasArea.length;
                        piasArea.forEach((pia: any) => {
                            if (!pia) return;
                            const projsArea = safeJsonParse(pia.proyectos, []);
                            if (Array.isArray(projsArea)) {
                                projsArea.forEach((p: any) => {
                                    if (p && p.id) {
                                        projIdsSet.add(p.id);
                                    }
                                });
                            }
                        });

                    }
                });
            }

            return {
                id: dept.id,
                nombre: dept.nombre,
                totalAreas: Array.isArray(deptAreas) ? deptAreas.length : 0,
                totalPIAs: totalPIAsDept,
                totalProyectos: projIdsSet.size
            };
        });


        return {
            totales: {
                departamentos: departamentos.length,
                areas: areas.length,
                pias: pias.length,
                proyectosStats
            },
            departamentosResumen,
        };
    } catch (e) {
        console.error('Error cargando datos del dashboard:', e);
        return {
            totales: {
                departamentos: 0,
                areas: 0,
                pias: 0,
                proyectosStats: { total: 0, activos: 0, terminados: 0, proximos: 0, conProrroga: 0 }
            },
            departamentosResumen: [],
            proyectosRecientes: []
        };
    }
};