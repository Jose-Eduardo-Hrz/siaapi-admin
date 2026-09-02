<script lang="ts">
    import type { PageData } from './$types';
    import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
    import ProjectStatusBadge from '$lib/components/ProjectStatusBadge.svelte';
    import { formatearFecha } from '$lib/utils/dateFormat';

    let { data }: { data: PageData } = $props();
    const { proyecto } = $derived(data);
</script>

<div class="proyecto-detail-page">
    <Breadcrumbs items={[
        { label: 'Proyectos', href: '/proyectos' },
        { label: proyecto.clave ? `Clave ${proyecto.clave}` : `ID #${proyecto.id}` }
    ]} />

    <header class="page-header header-with-badge">
        <div class="header-main-info">
            <div class="meta-row">
                <span class="clave-pill">{proyecto.clave || 'S/C'}</span>
                <span class="id-badge">ID: #{proyecto.id}</span>
            </div>
            <h1 class="page-title">{proyecto.nombre}</h1>
        </div>
        <div class="header-status">
            <ProjectStatusBadge {proyecto} />
        </div>
    </header>

    <div class="details-grid">
        <!-- Panel Izquierdo: Fechas, Objetivos, Acuerdo -->
        <div class="main-column">
            <!-- Bloque de Fechas -->
            <div class="card card-section">
                <h2 class="card-section-title">📅 Cronograma y Fechas</h2>
                <div class="dates-row">
                    <div class="date-box">
                        <span class="date-label">Fecha de Inicio</span>
                        <span class="date-value">🚀 {formatearFecha(proyecto.fecha_ini)}</span>
                    </div>
                    <div class="date-box">
                        <span class="date-label">Fecha de Finalización</span>
                        <span class="date-value">🏁 {formatearFecha(proyecto.fecha_fin)}</span>
                    </div>
                    <div class="date-box">
                        <span class="date-label">Fecha de Prórroga</span>
                        <span class="date-value highlight">
                            {proyecto.fecha_prorroga 
                                ? `⏳ ${formatearFecha(proyecto.fecha_prorroga)}` 
                                : '--'}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Bloque de Objetivos -->
            <div class="card card-section">
                <h2 class="card-section-title">🎯 Objetivos del Proyecto</h2>
                <div class="objectives-body">
                    {#if proyecto.objetivos}
                        <p class="objectives-text">{proyecto.objetivos}</p>
                    {:else}
                        <p class="no-data">Sin objetivos registrados en el sistema.</p>
                    {/if}
                </div>
            </div>

            <!-- Datos de Registro -->
            <div class="card card-section">
                <h2 class="card-section-title">📜 Registro y Acuerdos</h2>
                <div class="info-row">
                    <span class="info-lbl">Acuerdo de Aprobación:</span>
                    <span class="info-val">{proyecto.acuerdo || 'Sin acuerdo'}</span>
                </div>
            </div>
        </div>

        <!-- Panel Derecho: Responsables, PIAs, Áreas, Deptos -->
        <div class="sidebar-column">
            <!-- Responsables -->
            <div class="card card-section">
                <h2 class="card-section-title">👨‍🏫 Docente Responsable</h2>
                <div class="docente-box">
                    <div class="docente-avatar">👨‍🏫</div>
                    <div class="docente-info">
                        <span class="docente-name">{proyecto.responsable || 'No asignado'}</span>
                    </div>
                </div>
            </div>

            <!-- Relaciones Jerárquicas -->
            <div class="card card-section">
                <h2 class="card-section-title">🔗 Jerarquía Perteneciente</h2>
                
                <div class="rel-group">
                    <span class="rel-group-title">PIAs Vinculados</span>
                    {#if proyecto.pia1}
                        <div class="rel-info-item">
                            <span class="rel-icon">📄</span>
                            <div class="rel-text">
                                <span class="rel-name">{proyecto.pia1}</span>
                                <span class="rel-sub">PIA 1 (Principal)</span>
                            </div>
                        </div>
                    {/if}
                    {#if proyecto.pia2}
                        <div class="rel-info-item">
                            <span class="rel-icon">📄</span>
                            <div class="rel-text">
                                <span class="rel-name">{proyecto.pia2}</span>
                                <span class="rel-sub">PIA 2 (Secundaria)</span>
                            </div>
                        </div>
                    {/if}
                    {#if !proyecto.pia1 && !proyecto.pia2}
                        <span class="no-data">Sin PIAs vinculadas.</span>
                    {/if}
                </div>

                <div class="rel-group">
                    <span class="rel-group-title">Área Relacionada</span>
                    {#if proyecto.area}
                        <div class="rel-info-item">
                            <span class="rel-icon">🏢</span>
                            <div class="rel-text">
                                <span class="rel-name">{proyecto.area}</span>
                                <span class="rel-sub">Área Académica</span>
                            </div>
                        </div>
                    {:else}
                        <span class="no-data">Sin área vinculada.</span>
                    {/if}
                </div>

                <div class="rel-group">
                    <span class="rel-group-title">Departamento Relacionado</span>
                    {#if proyecto.departamento}
                        <div class="rel-info-item">
                            <span class="rel-icon">🏛️</span>
                            <div class="rel-text">
                                <span class="rel-name">{proyecto.departamento}</span>
                                <span class="rel-sub">Departamento</span>
                            </div>
                        </div>
                    {:else}
                        <span class="no-data">Sin departamento vinculado.</span>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .proyecto-detail-page {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
    }

    .header-with-badge {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    .meta-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.35rem;
    }

    .clave-pill {
        font-family: monospace;
        font-weight: 700;
        font-size: 0.85rem;
        color: var(--primary);
        background-color: var(--primary-light);
        padding: 0.25rem 0.6rem;
        border-radius: var(--radius-sm);
    }

    .id-badge {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 600;
    }

    .details-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
    }

    @media (max-width: 960px) {
        .details-grid {
            grid-template-columns: 1fr;
        }
    }

    .main-column, .sidebar-column {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .card-section-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        border-bottom: 1px solid var(--border-light);
        padding-bottom: 0.65rem;
        margin-bottom: 1rem;
    }

    .dates-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
    }

    .date-box {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        background-color: var(--bg-main);
        padding: 0.75rem;
        border-radius: var(--radius-sm);
    }

    .date-label {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
    }

    .date-value {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
    }

    .date-value.highlight {
        color: var(--purple);
    }

    .objectives-text {
        font-size: 0.95rem;
        line-height: 1.65;
        color: var(--text-main);
        white-space: pre-line;
    }

    .docente-box {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .docente-avatar {
        font-size: 2rem;
        background-color: var(--primary-light);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .docente-info {
        display: flex;
        flex-direction: column;
    }

    .docente-name {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
    }

    .rel-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1.25rem;
    }

    .rel-group:last-child {
        margin-bottom: 0;
    }

    .rel-group-title {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text-light);
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .rel-info-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 0.8rem;
        background-color: var(--bg-main);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
    }

    .rel-icon {
        font-size: 1.2rem;
    }

    .rel-text {
        display: flex;
        flex-direction: column;
    }

    .rel-name {
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--text-main);
    }

    .rel-sub {
        font-size: 0.72rem;
        color: var(--text-muted);
    }

    .no-data {
        font-size: 0.85rem;
        color: var(--text-light);
        font-style: italic;
    }

    .info-row {
        display: flex;
        gap: 0.5rem;
        font-size: 0.9rem;
    }

    .info-lbl {
        color: var(--text-muted);
        font-weight: 500;
    }

    .info-val {
        font-weight: 600;
        color: var(--text-main);
    }
</style>
