<script lang="ts">
    import type { PageData } from "./$types";
    import StatCard from "$lib/components/StatCard.svelte";
    import DepartmentCard from "$lib/components/DepartmentCard.svelte";

    let { data }: { data: PageData } = $props();

    const { totales, departamentosResumen } = $derived(data);
    const { proyectosStats } = $derived(totales);
</script>

<div class="dashboard">
    <header class="page-header">
        <h1 class="page-title">Dashboard Principal</h1>
        <p class="page-subtitle">
            Indicadores generales y resumen ejecutivo del sistema SIAAPI
        </p>
    </header>

    <!-- Indicadores Principales -->
    <section class="section-stats">
        <h2 class="section-title">📊 Totales del Sistema</h2>
        <div class="grid-stats">
            <StatCard
                title="Departamentos"
                value={totales.departamentos}
                icon="🏛️"
                color="blue"
            />
            <StatCard
                title="Áreas"
                value={totales.areas}
                icon="🏢"
                color="purple"
            />
            <StatCard
                title="PIAs"
                value={totales.pias}
                icon="📄"
                color="green"
            />
            <StatCard
                title="Proyectos Totales"
                value={proyectosStats.total}
                icon="🔬"
                color="blue"
                href="/proyectos"
            />
        </div>
    </section>

    <!-- Estado de Proyectos -->
    <section class="section-stats">
        <h2 class="section-title">⚡ Estado de los Proyectos</h2>
        <div class="grid-stats">
            <StatCard
                title="Proyectos Activos"
                value={proyectosStats.activos}
                icon="🟢"
                color="green"
                subtitle="En desarrollo regular"
            />
            <StatCard
                title="Próximos a Vencer"
                value={proyectosStats.proximos}
                icon="🟠"
                color="amber"
                subtitle="Vencen en los próximos 30 días"
            />
            <StatCard
                title="Con Prórroga"
                value={proyectosStats.conProrroga}
                icon="⏳"
                color="purple"
                subtitle="Cuentan con extensión de fecha"
            />
            <StatCard
                title="Terminados"
                value={proyectosStats.terminados}
                icon="🔴"
                color="red"
                subtitle="Periodo concluido"
            />
        </div>
    </section>

    <!-- Resumen de Departamentos -->
    <section class="dashboard-section">
        <div class="section-header">
            <h2 class="section-title">🏛️ Departamentos</h2>
        </div>
        <div class="grid-cards">
            {#each departamentosResumen as dept}
                <DepartmentCard
                    id={dept.id}
                    nombre={dept.nombre}
                    totalAreas={dept.totalAreas}
                    totalPIAs={dept.totalPIAs}
                    totalProyectos={dept.totalProyectos}
                />
            {/each}
        </div>
    </section>

</div>

<style>
    .dashboard {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    .dashboard-section {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
        letter-spacing: -0.01em;
    }
</style>

