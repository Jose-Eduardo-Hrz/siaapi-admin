<script module lang="ts">
    export interface Column<T> {
        key: keyof T | string;
        label: string;
        sortable?: boolean;
        align?: 'left' | 'center' | 'right';
    }
</script>

<script lang="ts" generics="T extends Record<string, any>">
    import type { Snippet } from 'svelte';
    import EmptyState from './EmptyState.svelte';

    let {
        columns = [],
        items = [],
        pageSize = 15,
        rowKey = 'id',
        rowSnippet,
        onRowClick
    }: {
        columns: Column<T>[];
        items: T[];
        pageSize?: number;
        rowKey?: keyof T | string;
        rowSnippet?: Snippet<[T]>;
        onRowClick?: (item: T) => void;
    } = $props();


    let currentPage = $state(1);
    let sortKey = $state<string | null>(null);
    let sortAsc = $state(true);

    function toggleSort(key: string) {
        if (sortKey === key) {
            sortAsc = !sortAsc;
        } else {
            sortKey = key;
            sortAsc = true;
        }
    }

    const sortedItems = $derived.by(() => {
        if (!sortKey) return items;

        return [...items].sort((a, b) => {
            const valA = a[sortKey as keyof T];
            const valB = b[sortKey as keyof T];

            if (valA === valB) return 0;
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            if (typeof valA === 'string' && typeof valB === 'string') {
                const cmp = valA.localeCompare(valB);
                return sortAsc ? cmp : -cmp;
            }

            return sortAsc ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
        });
    });

    const totalPages = $derived(Math.ceil(sortedItems.length / pageSize) || 1);

    const paginatedItems = $derived.by(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedItems.slice(start, start + pageSize);
    });

    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }
</script>

<div class="table-container card">
    {#if items.length === 0}
        <EmptyState title="No hay registros para mostrar" />
    {:else}
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        {#each columns as col}
                            <th 
                                class:sortable={col.sortable} 
                                style="text-align: {col.align || 'left'};"
                                onclick={() => col.sortable && toggleSort(String(col.key))}
                            >
                                <div class="th-content">
                                    <span>{col.label}</span>
                                    {#if col.sortable && sortKey === col.key}
                                        <span class="sort-icon">{sortAsc ? '▲' : '▼'}</span>
                                    {/if}
                                </div>
                            </th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each paginatedItems as item (item[rowKey as keyof T] || Math.random())}
                        <tr 
                            class:clickable={Boolean(onRowClick)}
                            onclick={() => onRowClick && onRowClick(item)}
                        >
                            {#if rowSnippet}
                                {@render rowSnippet(item)}
                            {:else}
                                {#each columns as col}
                                    <td style="text-align: {col.align || 'left'};">
                                        {item[col.key as keyof T] ?? '-'}
                                    </td>
                                {/each}
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        {#if totalPages > 1}
            <div class="table-pagination">
                <span class="pagination-info">
                    Mostrando {(currentPage - 1) * pageSize + 1} a {Math.min(currentPage * pageSize, items.length)} de {items.length} resultados
                </span>
                <div class="pagination-controls">
                    <button 
                        class="btn-page" 
                        disabled={currentPage === 1}
                        onclick={() => goToPage(currentPage - 1)}
                    >
                        Anterior
                    </button>
                    <span class="page-num">Página {currentPage} de {totalPages}</span>
                    <button 
                        class="btn-page" 
                        disabled={currentPage === totalPages}
                        onclick={() => goToPage(currentPage + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        {/if}
    {/if}
</div>

<style>
    .table-container {
        padding: 0;
        overflow: hidden;
    }

    .table-wrapper {
        overflow-x: auto;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        text-align: left;
    }

    th {
        background-color: var(--bg-main);
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 0.9rem 1.25rem;
        border-bottom: 1px solid var(--border-color);
        user-select: none;
    }

    th.sortable {
        cursor: pointer;
    }

    th.sortable:hover {
        color: var(--text-main);
        background-color: #f1f5f9;
    }

    .th-content {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
    }

    .sort-icon {
        font-size: 0.65rem;
        color: var(--primary);
    }

    td {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--border-light);
        color: var(--text-main);
        vertical-align: middle;
    }

    tr:last-child td {
        border-bottom: none;
    }

    tr.clickable {
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    tr.clickable:hover {
        background-color: rgba(37, 99, 235, 0.03);
    }

    .table-pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.9rem 1.25rem;
        border-top: 1px solid var(--border-color);
        background-color: var(--bg-main);
        font-size: 0.85rem;
    }

    .pagination-info {
        color: var(--text-muted);
    }

    .pagination-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .btn-page {
        padding: 0.35rem 0.75rem;
        border: 1px solid var(--border-color);
        background-color: #ffffff;
        border-radius: var(--radius-sm);
        font-size: 0.82rem;
        color: var(--text-main);
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .btn-page:hover:not(:disabled) {
        border-color: var(--primary);
        color: var(--primary);
    }

    .btn-page:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .page-num {
        font-weight: 600;
        color: var(--text-main);
    }
</style>
