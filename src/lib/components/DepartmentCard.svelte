<script lang="ts">
    let {
        id,
        nombre,
        totalAreas = 0,
        totalPIAs = 0,
        totalProyectos = 0,
    }: {
        id: number;
        nombre: string;
        totalAreas?: number;
        totalPIAs?: number;
        totalProyectos?: number;
    } = $props();
</script>

<div class="card dept-card">
    <div class="dept-header">
        <span class="dept-icon">🏛️</span>
        <div class="dept-title-box">
            <h3 class="dept-name">{nombre}</h3>
            <span class="dept-id">ID: #{id}</span>
        </div>
    </div>
</div>

<style>
    .dept-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1.25rem;
    }

    .dept-header {
        display: flex;
        align-items: center;
        gap: 0.9rem;
    }

    .dept-icon {
        font-size: 1.6rem;
        background-color: var(--primary-light);
        width: 44px;
        height: 44px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .dept-title-box {
        display: flex;
        flex-direction: column;
    }

    .dept-name {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-main);
        line-height: 1.3;
    }

    .dept-id {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-weight: 500;
    }

    .dept-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        background-color: var(--bg-main);
        padding: 0.75rem;
        border-radius: var(--radius-sm);
    }

    .stat-pill {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .stat-num {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--primary);
    }

    .stat-label {
        font-size: 0.72rem;
        color: var(--text-muted);
        text-transform: uppercase;
        font-weight: 600;
    }
</style>
