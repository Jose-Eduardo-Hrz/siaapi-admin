<script lang="ts">
    import { page } from '$app/stores';

    let navItems = [
        { label: 'Dashboard', href: '/', icon: '📊' },
        { label: 'Proyectos', href: '/proyectos', icon: '🔬' },
        { label: 'Búsqueda Global', href: '/buscar', icon: '🔍' }
    ];


    function isActive(href: string, currentPath: string): boolean {
        if (href === '/') {
            return currentPath === '/';
        }
        return currentPath.startsWith(href);
    }
</script>

<aside class="sidebar">
    <div class="sidebar-header">
        <div class="logo">
            <span class="logo-icon">🌐</span>
            <div class="logo-text">
                <span class="logo-title">SIAAPI Admin</span>
                <span class="logo-subtitle">Gestión & Analítica</span>
            </div>
        </div>
    </div>

    <nav class="sidebar-nav">
        <div class="nav-section-title">MENÚ PRINCIPAL</div>
        <ul>
            {#each navItems as item}
                {@const active = isActive(item.href, $page.url.pathname)}
                <li>
                    <a href={item.href} class="nav-link" class:active>
                        <span class="nav-icon">{item.icon}</span>
                        <span class="nav-label">{item.label}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>

    <div class="sidebar-footer">
        <div class="user-pill">
            <span class="user-avatar">👨‍🏫</span>
            <div class="user-info">
                <span class="user-name">Sistema SIAAPI</span>
                <span class="user-role">CBI Admin</span>
            </div>
        </div>
    </div>
</aside>

<style>
    .sidebar {
        width: var(--sidebar-width);
        background-color: var(--bg-sidebar);
        color: var(--text-sidebar);
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        z-index: 100;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .logo-icon {
        font-size: 1.75rem;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

    }

    .logo-text {
        display: flex;
        flex-direction: column;
    }

    .logo-title {
        font-weight: 700;
        font-size: 1.15rem;
        color: #ffffff;
        letter-spacing: -0.02em;
    }

    .logo-subtitle {
        font-size: 0.75rem;
        color: #94a3b8;
    }

    .sidebar-nav {
        flex: 1;
        padding: 1.5rem 1rem;
        overflow-y: auto;
    }

    .nav-section-title {
        font-size: 0.7rem;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 0.08em;
        margin-bottom: 0.75rem;
        padding-left: 0.75rem;
    }

    ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.7rem 0.9rem;
        border-radius: var(--radius-sm);
        color: #cbd5e1;
        font-weight: 500;
        font-size: 0.92rem;
        transition: all 0.2s ease;
    }

    .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.06);
        color: #ffffff;
    }

    .nav-link.active {
        background-color: var(--primary);
        color: #ffffff;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .nav-icon {
        font-size: 1.1rem;
    }

    .sidebar-footer {
        padding: 1rem 1.25rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .user-pill {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.04);
    }

    .user-avatar {
        font-size: 1.5rem;
    }

    .user-info {
        display: flex;
        flex-direction: column;
    }

    .user-name {
        font-size: 0.85rem;
        font-weight: 600;
        color: #ffffff;
    }

    .user-role {
        font-size: 0.72rem;
        color: #94a3b8;
    }

    @media (max-width: 900px) {
        .sidebar {
            display: none;
        }
    }
</style>
