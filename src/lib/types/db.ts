import type { RowDataPacket } from 'mysql2';

export interface ProyectoCompletoRow extends RowDataPacket {
    id: number;
    nombre: string;
    clave: string;
    acuerdo: string;
    fecha_ini: Date;
    fecha_fin: Date;
    fecha_prorroga: Date | null;
    objetivos: string;
    responsable: string;
    pia1: string;
    pia2: string;
    area: string;
    departamento: string;
}

export type EstadoProyecto = 'Activo' | 'Terminado' | 'Próximo a terminar';

export interface EstadoProyectoInfo {
    estado: EstadoProyecto;
    tieneProrroga: boolean;
    diasRestantes: number;
    label: string;
    color: 'green' | 'red' | 'amber' | 'purple';
}

export interface ProyectoConResponsableRow extends RowDataPacket {
    id: number;
    pia1_id: number | null;
    pia2_id: number | null;
    responsable: DocenteRow[] | DocenteRow | string | null;
    nombre: string;
    clave: string;
    acuerdo: string;
    fecha_ini: Date | string;
    fecha_fin: Date | string;
    fecha_prorroga?: Date | string | null;
    feche_prorroga?: Date | string | null; // Nombre de columna alternativo en vista_proyecto_con_responsable
    objetivos: string;
}

export interface PIAConProyectosRow extends RowDataPacket {
    id: number;
    id_anterior: number | null;
    id_area: number;
    nombre: string;
    acuerdo: string;
    proyectos: ProyectoConResponsableRow[] | string | null;
}

export interface AreaConPIARow extends RowDataPacket {
    id: number;
    id_anterior: number | null;
    id_departamento: number;
    nombre: string;
    objeto: string;
    objetivo_general: string | null;
    objetivos_especificos: string;
    acuerdo: string | null;
    pias: PIAConProyectosRow[] | string | null;
    responsable: DocenteRow[] | DocenteRow | string | null;
}

export interface DepartamentoConPIARow extends RowDataPacket {
    id: number;
    nombre: string;
    areas: AreaConPIARow[] | string | null;
}

// Alias de compatibilidad para DepartamentoDAO
export type Departamento_AreaRow = DepartamentoConPIARow;

/**
 * Interfaces básicas para registros directos de tablas / vistas simples
 */

export interface DocenteRow extends RowDataPacket {
    id: number;
    id_departamento: number;
    numec: string;
    nombre: string;
}

export interface ProyectoRow extends RowDataPacket {
    id: number;
    pia1_id: number | null;
    pia2_id: number | null;
    id_responsable: number;
    nombre: string;
    clave: string;
    acuerdo: string;
    fecha_ini: Date | string;
    fecha_fin: Date | string;
    fecha_prorroga: Date | string | null;
    objetivos: string;
}

export interface PIARow extends RowDataPacket {
    id: number;
    id_anterior: number | null;
    id_area: number;
    nombre: string;
    acuerdo: string;
}

export interface AreaRow extends RowDataPacket {
    id: number;
    id_anterior: number | null;
    id_departamento: number;
    id_responsable: number | null;
    nombre: string;
    objeto: string;
    objetivo_general: string | null;
    objetivos_especificos: string;
    acuerdo: string | null;
}

export interface DepartamentoRow extends RowDataPacket {
    id: number;
    nombre: string;
}

/**
 * Interfaces para estadísticas y analítica
 */

export interface EstadisticasProyectos {
    total: number;
    activos: number;
    terminados: number;
    proximos: number;
    conProrroga: number;
}

export interface EstadisticasGlobales {
    totalDepartamentos: number;
    totalAreas: number;
    totalPIAs: number;
    proyectosStats: EstadisticasProyectos;
}

export interface EstadisticasDepartamento {
    totalAreas: number;
    totalPIAs: number;
    proyectosStats: EstadisticasProyectos;
}

export interface EstadisticasArea {
    totalPIAs: number;
    proyectosStats: EstadisticasProyectos;
}

export interface EstadisticasPIA {
    proyectosStats: EstadisticasProyectos;
}

export interface ResultadoBusquedaGlobal {
    proyectos: ProyectoCompletoRow[];
    pias: PIARow[];
    areas: AreaRow[];
    departamentos: DepartamentoRow[];
}

