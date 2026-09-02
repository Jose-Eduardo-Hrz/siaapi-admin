<script lang="ts">
    import { goto } from '$app/navigation';

    let searchQuery = $state('');

    function handleSearch(e: Event) {
        e.preventDefault();
        if (searchQuery.trim()) {
            goto(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    }
</script>

<header class="navbar">
    <div class="search-container">
        <form onsubmit={handleSearch} class="search-form">
            <span class="search-icon">🔍</span>
            <input 
                type="text" 
                placeholder="Buscar por proyecto, PIA, área o departamento..." 
                bind:value={searchQuery}
                class="search-input"
            />
            {#if searchQuery}
                <button type="submit" class="search-btn">Buscar</button>
            {/if}
        </form>
    </div>

    <div class="navbar-actions">
        <a href="/buscar" class="action-btn" title="Búsqueda avanzada">
            ⚡ Búsqueda Avanzada
        </a>
    </div>
</header>

<style>
    .navbar {
        height: var(--header-height);
        background-color: var(--bg-header);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2rem;
        position: sticky;
        top: 0;
        z-index: 90;
        box-shadow: var(--shadow-sm);
    }

    .search-container {
        flex: 1;
        max-width: 540px;
    }

    .search-form {
        display: flex;
        align-items: center;
        position: relative;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        font-size: 0.9rem;
        color: var(--text-muted);
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        padding: 0.55rem 1rem 0.55rem 2.4rem;
        background-color: var(--bg-main);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-full);
        color: var(--text-main);
        transition: all 0.2s ease;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--primary);
        background-color: #ffffff;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .search-btn {
        position: absolute;
        right: 6px;
        background: var(--primary);
        color: #ffffff;
        padding: 0.3rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: 0.8rem;
        font-weight: 500;
    }

    .navbar-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .action-btn {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary);
        background-color: var(--primary-light);
        padding: 0.45rem 0.9rem;
        border-radius: var(--radius-full);
        transition: all 0.2s ease;
    }

    .action-btn:hover {
        background-color: #dbeafe;
    }

    @media (max-width: 640px) {
        .navbar {
            padding: 0 1rem;
        }
        .action-btn {
            display: none;
        }
    }
</style>
