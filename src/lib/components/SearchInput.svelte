<script lang="ts">
    let {
        value = $bindable(''),
        placeholder = 'Buscar...'
    }: {
        value: string;
        placeholder?: string;
    } = $props();
</script>

<div class="search-input-wrapper">
    <span class="search-icon">🔍</span>
    <input 
        type="text" 
        {placeholder} 
        bind:value
        class="search-input-element"
    />
    {#if value}
        <button class="clear-btn" onclick={() => value = ''} title="Limpiar búsqueda">✕</button>
    {/if}
</div>

<style>
    .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        font-size: 0.85rem;
        color: var(--text-muted);
        pointer-events: none;
    }

    .search-input-element {
        width: 100%;
        padding: 0.55rem 2rem 0.55rem 2.3rem;
        background-color: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        color: var(--text-main);
        outline: none;
        transition: all 0.2s ease;
    }

    .search-input-element:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    .clear-btn {
        position: absolute;
        right: 10px;
        background: none;
        border: none;
        color: var(--text-light);
        font-size: 0.8rem;
        cursor: pointer;
    }

    .clear-btn:hover {
        color: var(--text-main);
    }
</style>
