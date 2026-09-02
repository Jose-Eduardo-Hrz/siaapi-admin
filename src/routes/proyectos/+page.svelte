<script lang="ts">
    import type { PageData } from "./$types";
    import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
    import StatCard from "$lib/components/StatCard.svelte";
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import ProjectStatusBadge from "$lib/components/ProjectStatusBadge.svelte";
    import DataTable, { type Column } from "$lib/components/DataTable.svelte";
    import SearchInput from "$lib/components/SearchInput.svelte";
    import { formatearFecha } from "$lib/utils/dateFormat";
    import { evaluarEstadoProyecto } from "$lib/utils/projectStatus";
    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();

    let searchTerm = $state("");
    let selectedEstado = $state<string>("all");
    let selectedDepto = $state<string>("all");
    let viewMode = $state<"cards" | "table">("table");

    const proyectosFiltrados = $derived.by(() => {
        return data.proyectos.filter((p) => {
            const statusInfo = evaluarEstadoProyecto(p);

            // Filtro por Estado
            let matchesEstado = true;
            if (selectedEstado === "activo")
                matchesEstado = statusInfo.estado === "Activo";
            else if (selectedEstado === "proximo")
                matchesEstado = statusInfo.estado === "Próximo a terminar";
            else if (selectedEstado === "prorroga")
                matchesEstado = statusInfo.tieneProrroga;
            else if (selectedEstado === "terminado")
                matchesEstado = statusInfo.estado === "Terminado";

            // Filtro por Departamento
            const matchesDepto =
                selectedDepto === "all" || p.departamento === selectedDepto;

            // Buscador por texto
            let matchesSearch = true;
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                matchesSearch =
                    p.nombre.toLowerCase().includes(term) ||
                    (p.clave && p.clave.toLowerCase().includes(term)) ||
                    (p.responsable &&
                        p.responsable.toLowerCase().includes(term)) ||
                    (p.area && p.area.toLowerCase().includes(term)) ||
                    (p.departamento &&
                        p.departamento.toLowerCase().includes(term)) ||
                    (p.pia1 && p.pia1.toLowerCase().includes(term)) ||
                    (p.pia2 && p.pia2.toLowerCase().includes(term)) ||
                    p.id.toString().includes(term);
            }

            return matchesEstado && matchesDepto && matchesSearch;
        });
    });

    const columns: Column<(typeof data.proyectos)[0]>[] = [
        { key: "clave", label: "Clave", sortable: true },
        { key: "nombre", label: "Nombre del Proyecto", sortable: true },
        { key: "responsable", label: "Responsable", sortable: true },
        { key: "area", label: "Área", sortable: true },
        { key: "fecha_ini", label: "Inicio", sortable: true },
        { key: "fecha_fin", label: "Fin", sortable: true },
        { key: "estado", label: "Estado", sortable: false },
    ];

    function handleRowClick(row: (typeof data.proyectos)[0]) {
        goto(`/proyectos/${row.id}`);
    }
</script>

<div class="proyectos-page">
    <Breadcrumbs items={[{ label: "Proyectos de Investigación" }]} />

    <header class="page-header header-with-actions">
        <div>
            <h1 class="page-title">Catálogo de Proyectos</h1>
            <p class="page-subtitle">
                Consulta, filtra y analiza todos los proyectos de investigación
            </p>
        </div>

        <div class="view-toggle">
            <button
                class="toggle-btn"
                class:active={viewMode === "table"}
                onclick={() => (viewMode = "table")}
                title="Vista de Tabla"
            >
                📋 Tabla
            </button>
            <button
                class="toggle-btn"
                class:active={viewMode === "cards"}
                onclick={() => (viewMode = "cards")}
                title="Vista de Tarjetas"
            >
                🎴 Tarjetas
            </button>
        </div>
    </header>

    <!-- Barra de Filtros y Búsqueda -->
    <div class="card filters-card">
        <div class="filters-grid">
            <div class="filter-group">
                <label for="filter-estado" class="filter-label">Estado:</label>
                <select
                    id="filter-estado"
                    bind:value={selectedEstado}
                    class="select-control"
                >
                    <option value="all">Todos los estados</option>
                    <option value="activo">🟢 Activos</option>
                    <option value="proximo">🟠 Próximos a terminar (30d)</option
                    >
                    <option value="prorroga">⏳ Con Prórroga</option>
                    <option value="terminado">🔴 Terminados</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="filter-depto" class="filter-label"
                    >Departamento:</label
                >
                <select
                    id="filter-depto"
                    bind:value={selectedDepto}
                    class="select-control"
                >
                    <option value="all">Todos los departamentos</option>
                    {#each data.departamentos as dept}
                        <option value={dept.nombre}>{dept.nombre}</option>
                    {/each}
                </select>
            </div>

            <div class="filter-group search-group">
                <label for="search-input-field" class="filter-label"
                    >Búsqueda rápida:</label
                >
                <SearchInput
                    placeholder="Buscar por clave, nombre, responsable, PIA..."
                    bind:value={searchTerm}
                />
            </div>
        </div>
    </div>

    <!-- Contenido Principal (Tabla / Tarjetas) -->
    {#if viewMode === "table"}
        <DataTable
            {columns}
            items={proyectosFiltrados}
            pageSize={15}
            onRowClick={handleRowClick}
        >
            {#snippet rowSnippet(proyecto)}
                <td>
                    <span class="clave-pill">{proyecto.clave || "S/C"}</span>
                </td>
                <td>
                    <div class="proj-table-name">
                        <a href="/proyectos/{proyecto.id}" class="proj-link">
                            {proyecto.nombre}
                        </a>
                        {#if proyecto.pia1}
                            <span class="sub-pia">PIA: {proyecto.pia1}</span>
                        {/if}
                    </div>
                </td>
                <td>
                    <span class="resp-table font-medium"
                        >👨‍🏫 {proyecto.responsable || "No asignado"}</span
                    >
                </td>
                <td
                    ><span class="area-badge"
                        >{proyecto.area || "Sin área"}</span
                    ></td
                >
                <td>{formatearFecha(proyecto.fecha_ini)}</td>
                <td>{formatearFecha(proyecto.fecha_fin)}</td>
                <td><ProjectStatusBadge {proyecto} /></td>
            {/snippet}
        </DataTable>
    {:else}
        <div class="grid-cards">
            {#each proyectosFiltrados as proyecto}
                <ProjectCard {proyecto} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .proyectos-page {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
    }

    .header-with-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .view-toggle {
        display: flex;
        background-color: var(--bg-main);
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
    }

    .toggle-btn {
        padding: 0.4rem 0.85rem;
        font-size: 0.82rem;
        font-weight: 500;
        color: var(--text-muted);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .toggle-btn.active {
        background-color: #ffffff;
        color: var(--primary);
        font-weight: 600;
        box-shadow: var(--shadow-sm);
    }

    .filters-card {
        padding: 1.25rem;
    }

    .filters-grid {
        display: flex;
        align-items: flex-end;
        gap: 1.25rem;
        flex-wrap: wrap;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .filter-group.search-group {
        flex: 1;
        min-width: 280px;
    }

    .filter-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .select-control {
        padding: 0.55rem 0.9rem;
        background-color: var(--bg-main);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        color: var(--text-main);
        font-size: 0.9rem;
        outline: none;
        cursor: pointer;
    }

    .select-control:focus {
        border-color: var(--primary);
    }

    .clave-pill {
        font-family: monospace;
        font-weight: 700;
        font-size: 0.8rem;
        color: var(--primary);
        background-color: var(--primary-light);
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-sm);
    }

    .proj-table-name {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }

    .proj-link {
        font-weight: 600;
        color: var(--text-main);
        line-height: 1.35;
    }

    .proj-link:hover {
        color: var(--primary);
    }

    .sub-pia {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .area-badge {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .resp-table {
        font-size: 0.85rem;
    }
</style>
