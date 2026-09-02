<script lang="ts">
    let { 
        title, 
        value, 
        icon = '📊', 
        subtitle = '', 
        color = 'blue',
        href = ''
    }: {
        title: string;
        value: number | string;
        icon?: string;
        subtitle?: string;
        color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
        href?: string;
    } = $props();

    const colorClasses = {
        blue: 'card-blue',
        green: 'card-green',
        amber: 'card-amber',
        red: 'card-red',
        purple: 'card-purple'
    };
</script>

{#if href}
    <a {href} class="stat-card {colorClasses[color]} is-link">
        <div class="stat-icon">{icon}</div>
        <div class="stat-details">
            <span class="stat-title">{title}</span>
            <span class="stat-value">{value}</span>
            {#if subtitle}
                <span class="stat-subtitle">{subtitle}</span>
            {/if}
        </div>
    </a>
{:else}
    <div class="stat-card {colorClasses[color]}">
        <div class="stat-icon">{icon}</div>
        <div class="stat-details">
            <span class="stat-title">{title}</span>
            <span class="stat-value">{value}</span>
            {#if subtitle}
                <span class="stat-subtitle">{subtitle}</span>
            {/if}
        </div>
    </div>
{/if}

<style>
    .stat-card {
        background-color: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 1.25rem;
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        box-shadow: var(--shadow-sm);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card.is-link:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .stat-icon {
        font-size: 1.75rem;
        width: 48px;
        height: 48px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-main);
        flex-shrink: 0;
    }

    .card-blue .stat-icon { background-color: var(--primary-light); }
    .card-green .stat-icon { background-color: var(--success-bg); }
    .card-amber .stat-icon { background-color: var(--warning-bg); }
    .card-red .stat-icon { background-color: var(--danger-bg); }
    .card-purple .stat-icon { background-color: var(--purple-bg); }

    .stat-details {
        display: flex;
        flex-direction: column;
    }

    .stat-title {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-main);
        line-height: 1.2;
        margin-top: 0.15rem;
    }

    .stat-subtitle {
        font-size: 0.78rem;
        color: var(--text-light);
        margin-top: 0.25rem;
    }
</style>
