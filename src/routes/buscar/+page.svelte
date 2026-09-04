<script lang="ts">
    import { asset } from "$app/paths";
    import type { PageData } from "./$types";
    import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
    import SearchInput from "$lib/components/SearchInput.svelte";
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import PIACard from "$lib/components/PIACard.svelte";
    import AreaCard from "$lib/components/AreaCard.svelte";
    import DepartmentCard from "$lib/components/DepartmentCard.svelte";
    import EmptyState from "$lib/components/EmptyState.svelte";
    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();

    let searchInputVal = $state(data.query);

    $effect(() => {
        searchInputVal = data.query;
    });

    function executeSearch(term: string) {
        if (term.trim()) {
            goto(asset(`/buscar?q=${encodeURIComponent(term.trim())}`));
        }
    }

    const totalResultados = $derived(
        data.resultados.proyectos.length +
            data.resultados.pias.length +
            data.resultados.areas.length +
            data.resultados.departamentos.length,
    );
</script>

<div class="buscar-page">
    <Breadcrumbs items={[{ label: "Búsqueda Global" }]} />

    <header class="page-header">
        <h1 class="page-title">Búsqueda Global Multi-Entidad</h1>
        <p class="page-subtitle">
            Encuentra proyectos, PIAs, áreas y departamentos en todo el sistema
        </p>
    </header>

    <div class="card search-hero-card">
        <div class="hero-search-box">
            <SearchInput
                placeholder="Escribe el nombre, clave, ID o acuerdo a buscar..."
                bind:value={searchInputVal}
            />
            <button
                class="btn btn-primary"
                onclick={() => executeSearch(searchInputVal)}
            >
                🔍 Buscar
            </button>
        </div>
    </div>

    {#if data.query}
        <div class="search-summary">
            <h2>
                Resultados para <span class="highlight">"{data.query}"</span>
                <span class="count-tag">({totalResultados} encontrados)</span>
            </h2>
        </div>

        {#if totalResultados === 0}
            <EmptyState
                title="No se encontraron coincidencias"
                description={`No hubo resultados que coincidan con "${data.query}". Prueba buscar por clave de proyecto, nombre de PIA o docente.`}
            />
        {:else}
            <!-- 1. Proyectos -->
            {#if data.resultados.proyectos.length > 0}
                <section class="results-section">
                    <h3 class="section-badge-title">
                        🔬 Proyectos ({data.resultados.proyectos.length})
                    </h3>
                    <div class="grid-cards">
                        {#each data.resultados.proyectos as proyecto}
                            <ProjectCard {proyecto} />
                        {/each}
                    </div>
                </section>
            {/if}

            <!-- 2. PIAs -->
            {#if data.resultados.pias.length > 0}
                <section class="results-section">
                    <h3 class="section-badge-title">
                        📄 PIAs ({data.resultados.pias.length})
                    </h3>
                    <div class="grid-cards">
                        {#each data.resultados.pias as pia}
                            <PIACard
                                id={pia.id}
                                nombre={pia.nombre}
                                acuerdo={pia.acuerdo}
                            />
                        {/each}
                    </div>
                </section>
            {/if}

            <!-- 3. Áreas -->
            {#if data.resultados.areas.length > 0}
                <section class="results-section">
                    <h3 class="section-badge-title">
                        🏢 Áreas ({data.resultados.areas.length})
                    </h3>
                    <div class="grid-cards">
                        {#each data.resultados.areas as area}
                            <AreaCard id={area.id} nombre={area.nombre} />
                        {/each}
                    </div>
                </section>
            {/if}

            <!-- 4. Departamentos -->
            {#if data.resultados.departamentos.length > 0}
                <section class="results-section">
                    <h3 class="section-badge-title">
                        🏛️ Departamentos ({data.resultados.departamentos
                            .length})
                    </h3>
                    <div class="grid-cards">
                        {#each data.resultados.departamentos as dept}
                            <DepartmentCard id={dept.id} nombre={dept.nombre} />
                        {/each}
                    </div>
                </section>
            {/if}
        {/if}
    {/if}
</div>

<style>
    .buscar-page {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .search-hero-card {
        padding: 1.5rem;
    }

    .hero-search-box {
        display: flex;
        gap: 0.75rem;
        width: 100%;
    }

    .search-summary {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-main);
    }

    .highlight {
        color: var(--primary);
    }

    .count-tag {
        font-size: 0.9rem;
        color: var(--text-muted);
        font-weight: 500;
    }

    .results-section {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .section-badge-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-main);
        border-bottom: 2px solid var(--border-light);
        padding-bottom: 0.5rem;
    }
</style>
