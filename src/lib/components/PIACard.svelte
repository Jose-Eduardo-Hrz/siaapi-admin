<script lang="ts">
    let {
        id,
        nombre,
        acuerdo = "",
        areaNombre = "",
        totalProyectos = 0,
    }: {
        id: number;
        nombre: string;
        acuerdo?: string;
        areaNombre?: string;
        totalProyectos?: number;
    } = $props();
</script>

<div class="card card-interactive pia-card">
    <div class="pia-header">
        <span class="pia-icon">📄</span>
        <div class="pia-title-box">
            <h3 class="pia-name">{nombre}</h3>
            {#if acuerdo}
                <span class="pia-acuerdo">Acuerdo: {acuerdo}</span>
            {/if}
        </div>
    </div>

    {#if areaNombre}
        <div class="pia-area">
            <span class="area-tag">🏢 Área: {areaNombre}</span>
        </div>
    {/if}
</div>

<style>
    .pia-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
    }

    .pia-header {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .pia-icon {
        font-size: 1.4rem;
        background-color: var(--success-bg);
        width: 40px;
        height: 40px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .pia-title-box {
        display: flex;
        flex-direction: column;
    }

    .pia-name {
        font-size: 0.98rem;
        font-weight: 700;
        color: var(--text-main);
        line-height: 1.35;
    }

    .pia-acuerdo {
        font-size: 0.76rem;
        color: var(--text-muted);
        margin-top: 0.2rem;
    }

    .pia-area {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .pia-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--border-light);
        padding-top: 0.75rem;
        font-size: 0.82rem;
    }

    .proj-count {
        font-weight: 600;
        color: var(--primary);
    }

    .view-more {
        color: var(--text-light);
        font-weight: 500;
    }
</style>
