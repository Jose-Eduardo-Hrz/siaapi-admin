<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SIAAPI Admin - Sistema de Gestión y Dashboards</title>
	<meta name="description" content="Módulo de consulta, análisis y dashboards para la gestión de Departamentos, Áreas, PIAs y Proyectos." />
</svelte:head>

<div class="app-container">
	<Sidebar />
	<div class="main-content">
		<Navbar />
		<main class="page-body">
			{@render children()}
		</main>
	</div>
</div>
