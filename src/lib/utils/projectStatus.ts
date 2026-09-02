import type { EstadoProyectoInfo, ProyectoCompletoRow, ProyectoConResponsableRow, ProyectoRow } from '$lib/types/db';
import { parsearFechaLocal } from './dateFormat';

export const DIAS_PROXIMO_VENCIMIENTO_DEFAULT = 30;

type ProyectoGenerico = ProyectoCompletoRow | ProyectoRow | ProyectoConResponsableRow | {
    fecha_ini: Date | string;
    fecha_fin: Date | string;
    fecha_prorroga?: Date | string | null;
    feche_prorroga?: Date | string | null;
};


/**
 * Evalúa el estado actual de un proyecto de acuerdo a las reglas de negocio:
 * 1. La fecha de finalización efectiva es fecha_prorroga (si existe y es posterior) o fecha_fin.
 * 2. Terminado: hoy > fechaFinEfectiva.
 * 3. Próximo a terminar: hoy <= fechaFinEfectiva y faltan <= windowDays.
 * 4. Activo: hoy <= fechaFinEfectiva.
 * 5. Con Prórroga: fecha_prorroga is not null.
 */
export function evaluarEstadoProyecto(
    proyecto: ProyectoGenerico,
    windowDays: number = DIAS_PROXIMO_VENCIMIENTO_DEFAULT,
    fechaReferencia: Date = new Date()
): EstadoProyectoInfo {
    const hoy = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), fechaReferencia.getDate());

    const fechaIni = parsearFechaLocal(proyecto.fecha_ini);
    const fechaFin = parsearFechaLocal(proyecto.fecha_fin);
    const fechaProrroga = parsearFechaLocal(proyecto.fecha_prorroga ?? proyecto.feche_prorroga);

    const tieneProrroga = Boolean(fechaProrroga);

    // Fecha efectiva de finalización
    let fechaFinEfectiva = fechaFin;
    if (fechaProrroga && fechaFin) {
        if (fechaProrroga.getTime() > fechaFin.getTime()) {
            fechaFinEfectiva = fechaProrroga;
        }
    } else if (fechaProrroga) {
        fechaFinEfectiva = fechaProrroga;
    }

    if (!fechaFinEfectiva) {
        return {
            estado: 'Activo',
            tieneProrroga,
            diasRestantes: 999,
            label: 'Activo',
            color: 'green'
        };
    }

    const fechaFinNormalizada = new Date(
        fechaFinEfectiva.getFullYear(),
        fechaFinEfectiva.getMonth(),
        fechaFinEfectiva.getDate()
    );

    const msDiferencia = fechaFinNormalizada.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(msDiferencia / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
        return {
            estado: 'Terminado',
            tieneProrroga,
            diasRestantes,
            label: 'Terminado',
            color: 'red'
        };
    }

    if (diasRestantes <= windowDays) {
        return {
            estado: 'Próximo a terminar',
            tieneProrroga,
            diasRestantes,
            label: `Próximo a terminar (${diasRestantes} d)`,
            color: 'amber'
        };
    }

    return {
        estado: 'Activo',
        tieneProrroga,
        diasRestantes,
        label: 'Activo',
        color: 'green'
    };
}
