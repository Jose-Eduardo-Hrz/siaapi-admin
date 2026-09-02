<script lang="ts">
    let {
        id,
        nombre,
        responsableNombre = "",
        departamentoNombre = "",
        totalPIAs = 0,
        totalProyectos = 0,
    }: {
        id: number;
        nombre: string;
        responsableNombre?: string;
        departamentoNombre?: string;
        totalPIAs?: number;
        totalProyectos?: number;
    } = $props();
</script>

<div class="card area-card">
    <div class="area-header">
        <span class="area-icon">🏢</span>
        <div class="area-title-box">
            <h3 class="area-name">{nombre}</h3>
            {#if departamentoNombre}
                <span class="area-dept">🏛️ {departamentoNombre}</span>
            {/if}
        </div>
    </div>

    {#if responsableNombre}
        <div class="area-responsable">
            <span class="resp-label">Responsable:</span>
            <span class="resp-name">👨‍🏫 {responsableNombre}</span>
        </div>
    {/if}
</div>

<style>
    .area-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
    }

    .area-header {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .area-icon {
        font-size: 1.4rem;
        background-color: var(--purple-bg);
        width: 40px;
        height: 40px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .area-title-box {
        display: flex;
        flex-direction: column;
    }

    .area-name {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        line-height: 1.35;
    }

    .area-dept {
        font-size: 0.78rem;
        color: var(--text-muted);
        margin-top: 0.2rem;
    }

    .area-responsable {
        font-size: 0.82rem;
        background-color: var(--bg-main);
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-sm);
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }

    .resp-label {
        font-size: 0.7rem;
        color: var(--text-light);
        text-transform: uppercase;
        font-weight: 600;
    }

    .resp-name {
        font-weight: 600;
        color: var(--text-main);
    }

    .area-stats {
        display: flex;
        gap: 1.5rem;
        border-top: 1px solid var(--border-light);
        padding-top: 0.75rem;
    }

    .stat-item {
        display: flex;
        align-items: baseline;
        gap: 0.35rem;
    }

    .stat-value {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--primary);
    }

    .stat-tag {
        font-size: 0.78rem;
        color: var(--text-muted);
    }
</style>
