/**
 * Formatea una fecha de MySQL (tipo Date o string YYYY-MM-DD / ISO) a formato legible en español (DD/MM/YYYY).
 * Evita problemas de desplazamiento por zona horaria UTC.
 */
export function formatearFecha(fecha: Date | string | null | undefined): string {
    if (!fecha) return 'Sin fecha';

    let d: Date;

    if (typeof fecha === 'string') {
        // Si viene en formato YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss...
        const partes = fecha.split('T')[0].split('-');
        if (partes.length === 3) {
            const anio = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10) - 1; // 0-indexed
            const dia = parseInt(partes[2], 10);
            d = new Date(anio, mes, dia);
        } else {
            d = new Date(fecha);
        }
    } else if (fecha instanceof Date) {
        d = fecha;
    } else {
        return 'Sin fecha';
    }

    if (isNaN(d.getTime())) {
        return 'Fecha inválida';
    }

    const diaStr = String(d.getDate()).padStart(2, '0');
    const mesStr = String(d.getMonth() + 1).padStart(2, '0');
    const anioStr = d.getFullYear();

    return `${diaStr}/${mesStr}/${anioStr}`;
}

/**
 * Convierte una fecha a objeto Date local sin problemas de desfase UTC.
 */
export function parsearFechaLocal(fecha: Date | string | null | undefined): Date | null {
    if (!fecha) return null;

    if (typeof fecha === 'string') {
        const partes = fecha.split('T')[0].split('-');
        if (partes.length === 3) {
            const anio = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10) - 1;
            const dia = parseInt(partes[2], 10);
            return new Date(anio, mes, dia);
        }
        return new Date(fecha);
    }
    
    if (fecha instanceof Date) {
        return fecha;
    }

    return null;
}
