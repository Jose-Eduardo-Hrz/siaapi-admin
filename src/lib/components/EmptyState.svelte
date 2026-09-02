<script lang="ts">
    let {
        title = 'No se encontraron resultados',
        description = 'Intenta ajustar tus criterios de búsqueda o filtros.',
        icon = '🔍'
    }: {
        title?: string;
        description?: string;
        icon?: string;
    } = $props();
</script>

<div class="empty-state">
    <div class="empty-icon">{icon}</div>
    <h3 class="empty-title">{title}</h3>
    <p class="empty-desc">{description}</p>
</div>

<style>
    .empty-state {
        padding: 3rem 1.5rem;
        text-align: center;
        background-color: var(--bg-card);
        border: 1px dashed var(--border-color);
        border-radius: var(--radius-md);
        margin: 1.5rem 0;
    }

    .empty-icon {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
    }

    .empty-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-main);
    }

    .empty-desc {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-top: 0.25rem;
    }
</style>
