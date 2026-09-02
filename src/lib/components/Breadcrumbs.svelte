<script lang="ts">
    export interface BreadcrumbItem {
        label: string;
        href?: string;
    }

    let { items = [] }: { items: BreadcrumbItem[] } = $props();
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
        <li>
            <a href="/" class="crumb-home">🏠 Inicio</a>
        </li>
        {#each items as item, index}
            <li class="crumb-separator">/</li>
            <li>
                {#if item.href && index < items.length - 1}
                    <a href={item.href} class="crumb-link">{item.label}</a>
                {:else}
                    <span class="crumb-current" aria-current="page">{item.label}</span>
                {/if}
            </li>
        {/each}
    </ol>
</nav>

<style>
    .breadcrumbs {
        margin-bottom: 1.25rem;
    }

    ol {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        list-style: none;
        font-size: 0.85rem;
    }

    .crumb-home, .crumb-link {
        color: var(--text-muted);
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .crumb-home:hover, .crumb-link:hover {
        color: var(--primary);
    }

    .crumb-separator {
        color: var(--text-light);
        font-size: 0.75rem;
    }

    .crumb-current {
        color: var(--text-main);
        font-weight: 600;
    }
</style>
