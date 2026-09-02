<script lang="ts">
    import type { ProyectoCompletoRow, ProyectoConResponsableRow, ProyectoRow } from '$lib/types/db';
    import { formatearFecha } from '$lib/utils/dateFormat';
    import ProjectStatusBadge from './ProjectStatusBadge.svelte';

    let { proyecto }: { proyecto: ProyectoCompletoRow | ProyectoRow | ProyectoConResponsableRow } = $props();

    const responsableNombre = $derived.by(() => {
        if ('responsable' in proyecto && proyecto.responsable) {
            if (typeof proyecto.responsable === 'string') {
                return proyecto.responsable;
            }
            if (Array.isArray(proyecto.responsable) && proyecto.responsable.length > 0) {
                return proyecto.responsable[0].nombre;
            }
            if (typeof proyecto.responsable === 'object' && 'nombre' in proyecto.responsable) {
                return (proyecto.responsable as any).nombre;
            }
        }
        return 'No asignado';
    });
</script>


<a href="/proyectos/{proyecto.id}" class="card card-interactive project-card">
    <div class="proj-header">
        <div class="proj-title-box">
            <span class="proj-clave">Clave: {proyecto.clave || 'S/C'}</span>
            <h3 class="proj-name">{proyecto.nombre}</h3>
        </div>
        <ProjectStatusBadge {proyecto} />
    </div>

    <div class="proj-dates">
        <div class="date-item">
            <span class="date-label">Inicio</span>
            <span class="date-val">{formatearFecha(proyecto.fecha_ini)}</span>
        </div>
        <div class="date-item">
            <span class="date-label">Fin</span>
            <span class="date-val">{formatearFecha(proyecto.fecha_fin)}</span>
        </div>
        {#if proyecto.fecha_prorroga || (proyecto as any).feche_prorroga}
            <div class="date-item">
                <span class="date-label">Próroga</span>
                <span class="date-val highlight">{formatearFecha(proyecto.fecha_prorroga ?? (proyecto as any).feche_prorroga)}</span>
            </div>
        {/if}
    </div>

    <div class="proj-footer">
        <span class="resp-text">👨‍🏫 {responsableNombre}</span>
        <span class="view-link">Ver detalle →</span>
    </div>
</a>

<style>
    .project-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
    }

    .proj-header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .proj-clave {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .proj-name {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        line-height: 1.35;
    }

    .proj-dates {
        display: flex;
        gap: 1.25rem;
        background-color: var(--bg-main);
        padding: 0.6rem 0.8rem;
        border-radius: var(--radius-sm);
    }

    .date-item {
        display: flex;
        flex-direction: column;
    }

    .date-label {
        font-size: 0.68rem;
        color: var(--text-light);
        text-transform: uppercase;
        font-weight: 600;
    }

    .date-val {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text-main);
    }

    .date-val.highlight {
        color: var(--purple);
    }

    .proj-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--border-light);
        padding-top: 0.75rem;
        font-size: 0.82rem;
    }

    .resp-text {
        color: var(--text-muted);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }

    .view-link {
        color: var(--text-light);
        font-weight: 500;
    }

    .project-card:hover .view-link {
        color: var(--primary);
    }
</style>
