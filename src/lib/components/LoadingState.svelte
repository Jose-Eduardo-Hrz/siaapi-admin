<script lang="ts">
    let { message = 'Cargando información...' }: { message?: string } = $props();
</script>

<div class="loading-state">
    <div class="spinner"></div>
    <span class="loading-text">{message}</span>
</div>

<style>
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 1.5rem;
        gap: 1rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-color);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    .loading-text {
        font-size: 0.9rem;
        color: var(--text-muted);
        font-weight: 500;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>
