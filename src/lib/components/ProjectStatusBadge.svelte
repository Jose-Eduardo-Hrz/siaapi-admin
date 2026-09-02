<script lang="ts">
    import type { ProyectoCompletoRow, ProyectoConResponsableRow, ProyectoRow } from '$lib/types/db';
    import { evaluarEstadoProyecto } from '$lib/utils/projectStatus';

    let { 
        proyecto 
    }: { 
        proyecto: ProyectoCompletoRow | ProyectoRow | ProyectoConResponsableRow 
    } = $props();


    const info = $derived(evaluarEstadoProyecto(proyecto));
</script>

<div class="badge-group">
    {#if info.estado === 'Activo'}
        <span class="badge badge-green">
            <span class="dot green-dot"></span>
            Activo
        </span>
    {:else if info.estado === 'Terminado'}
        <span class="badge badge-red">
            <span class="dot red-dot"></span>
            Terminado
        </span>
    {:else if info.estado === 'Próximo a terminar'}
        <span class="badge badge-amber">
            <span class="dot amber-dot"></span>
            {info.label}
        </span>
    {/if}

    {#if info.tieneProrroga}
        <span class="badge badge-purple" title="Este proyecto cuenta con prórroga aprobada">
            ⏳ Prórroga
        </span>
    {/if}
</div>

<style>
    .badge-group {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        flex-wrap: wrap;
    }

    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
    }

    .green-dot { background-color: var(--success); }
    .red-dot { background-color: var(--danger); }
    .amber-dot { background-color: var(--warning); }
</style>
