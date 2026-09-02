# INSTRUCCIONES PARA ANTIGRAVITY
## Desarrollo de módulo de consulta, análisis y dashboards para SvelteKit + MySQL

## 1. CONTEXTO GENERAL DEL PROYECTO

Estoy desarrollando una aplicación web utilizando:

- SvelteKit
- TypeScript
- MySQL
- mysql2
- DAO (Data Access Objects) para el acceso a datos

El proyecto de SvelteKit YA ESTÁ INICIADO.

NO debes crear un proyecto nuevo.

NO debes cambiar innecesariamente la arquitectura existente.

NO debes reemplazar la conexión actual a MySQL.

NO debes reemplazar los DAO existentes.

NO debes instalar dependencias adicionales sin analizar primero si realmente son necesarias.

La conexión a MySQL ya existe y se encuentra funcionando.

Las interfaces TypeScript de la base de datos se encuentran en:

`src/lib/types/db.ts`

Los DAO se encuentran en:

`src/lib/server/consultas/`

Actualmente existen DAO como:

- `AreaDao.ts`
- `DepartamentoDAO.ts`
- `DocentesDAO.ts`
- `PIADAO.ts`
- `ProyectoDAO.ts`

También existen vistas/rutas que actualmente permiten obtener información de la base de datos.

El objetivo de esta tarea es MEJORAR LA PRESENTACIÓN, CONSULTA, NAVEGACIÓN Y ANÁLISIS de la información existente mediante dashboards, tarjetas, tablas, filtros, búsquedas y páginas de detalle.

---

# 2. INSTRUCCIÓN PRINCIPAL

Antes de modificar código:

1. Analiza la estructura actual del proyecto.
2. Analiza `src/lib/types/db.ts`.
3. Analiza la conexión existente a MySQL.
4. Analiza TODOS los DAO relacionados con:
   - departamentos
   - áreas
   - PIAs
   - proyectos
   - docentes
5. Analiza las rutas existentes de SvelteKit.
6. Analiza las vistas existentes.
7. Identifica qué información ya está disponible.
8. Identifica qué información falta para construir los dashboards.
9. Reutiliza los DAO existentes siempre que sea posible.
10. Evita duplicar consultas SQL que ya existen.
11. Si necesitas una nueva consulta, crea un método DAO siguiendo el patrón arquitectónico existente.
12. Mantén TypeScript correctamente tipado.
13. No utilices acceso directo a MySQL desde componentes Svelte.
14. El acceso a MySQL debe permanecer en el lado servidor.

Antes de implementar cambios importantes, explica brevemente qué archivos vas a modificar y por qué.

---

# 3. MODELO DE NEGOCIO

La aplicación administra la siguiente jerarquía:

DEPARTAMENTO
    └── ÁREAS
          └── PIAs
                └── PROYECTOS

Las reglas de negocio son:

### Departamento

- Un departamento puede tener muchas áreas.
- Un área solo puede pertenecer a un departamento.

### Área

- Un área pertenece a un único departamento.
- Un área puede tener muchas PIAs.
- Un área puede tener un único docente responsable.

### PIA

- Una PIA pertenece a un único área.
- Una PIA puede tener muchos proyectos.

### Proyecto

- Un proyecto pertenece a una PIA.
- Un proyecto puede tener una o como máximo dos PIAs.
- Un proyecto solo puede tener un docente responsable.
- Un docente puede ser responsable de varios proyectos.

### Docente

- Un docente puede ser responsable de un área.
- Un área solo puede tener un docente responsable.
- Un docente puede ser responsable de varios proyectos.

La jerarquía debe reflejarse visualmente en la aplicación.

---

# 4. VISTAS DISPONIBLES EN MYSQL

La base de datos actualmente proporciona las siguientes vistas.

## vista_departamento

Columnas:

- `id` INT
- `nombre` VARCHAR(120)

---

## vista_areas

Columnas:

- `id` INT
- `id_anterior` INT | NULL
- `id_departamento` INT
- `id_responsable` VARCHAR(56) | NULL
- `nombre` VARCHAR(250)
- `objeto` LONGTEXT
- `objetivo_general` LONGTEXT | NULL
- `objetivos_especificos` LONGTEXT
- `acuerdo` VARCHAR(128) | NULL

---

## vista_pias

Columnas:

- `id` INT
- `id_anterior` INT
- `id_area` INT
- `nombre` VARCHAR(500)
- `acuerdo` VARCHAR(16)

---

## vista_proyectos

Columnas:

- `id` INT
- `nombre` VARCHAR(500)
- `clave` VARCHAR(10)
- `acuerdo` VARCHAR(21)
- `fecha_ini` DATE
- `fecha_fin` DATE
- `fecha_prorroga` DATE
- `objetivos` LONGTEXT
- `id_responsable` INT
- `pia1_id` INT
- `pia2_id` INT

---

## vista_docente

Columnas:

- `id` INT
- `numec` VARCHAR(11)
- `nombre` VARCHAR(152)
- `id_departamento` INT

---

## vista_proyecto_con_responsable

Columnas:

- `id` INT
- `nombre` VARCHAR(500)
- `clave` VARCHAR(10)
- `acuerdo` VARCHAR(21)
- `fecha_ini` DATE
- `fecha_fin` DATE
- `feche_prorroga` DATE
- `objetivos` LONGTEXT
- `pia1_id` INT
- `pia2_id` INT
- `responsable` JSON

IMPORTANTE:

En esta vista la columna se llama:

`feche_prorroga`

mientras que en `vista_proyectos` se llama:

`fecha_prorroga`.

Verificar esta diferencia antes de implementar código.

---

## vista_pias_con_proyectos

Columnas:

- `id` INT
- `id_anterior` INT
- `id_area` INT
- `nombre` VARCHAR(500)
- `acuerdo` VARCHAR(16)
- `proyectos` JSON

---

## vista_areas_con_pias

Columnas:

- `id` INT
- `id_anterior` INT
- `id_departamento` INT
- `nombre` VARCHAR(250)
- `objeto` LONGTEXT
- `objetivo_general` LONGTEXT
- `objetivos_especificos` LONGTEXT
- `acuerdo` VARCHAR(128)
- `pias` JSON
- `responsable` JSON

---

## vista_departamento_con_areas

Columnas:

- `id` INT
- `nombre` VARCHAR(120)
- `areas` JSON

Estas vistas deben aprovecharse antes de crear consultas adicionales.

---

# 5. ARQUITECTURA ACTUAL DE LOS DAO

Los DAO están ubicados en:

`src/lib/server/consultas/`

Ejemplo de `ProyectoDAO.ts`:

```ts
import { pool } from '$lib/server/db';
import type { ProyectoRow, ProyectoConResponsableRow } from '$lib/types/db'

export const ProyectoDAO = {

    async getTodos(): Promise<ProyectoRow[]> {
        const query = `
            SELECT * FROM vista_proyectos;
        `;

        const [proyectos] = await pool.query<ProyectoRow[]>(query)

        return proyectos
    },

    async getPorId(id: number): Promise<ProyectoRow | null> {
        const query = `
            SELECT * 
            FROM vista_proyectos 
            WHERE id = ?
        `;

        const [proyectos] = await pool.query<ProyectoRow[]>(query, [id])

        return proyectos.length > 0 ? proyectos[0] : null
    },

    async getTodosConResponsables(): Promise<ProyectoConResponsableRow[]> {
        const query = `
            SELECT * 
            FROM vista_proyecto_con_responsable;
        `;

        const [proyectos] =
            await pool.query<ProyectoConResponsableRow[]>(query)

        return proyectos
    },

    async getPorIdConResponsable(
        id: number
    ): Promise<ProyectoConResponsableRow | null> {

        const query = `
            SELECT * 
            FROM vista_proyecto_con_responsable 
            WHERE id = ?
        `;

        const [proyectos] =
            await pool.query<ProyectoConResponsableRow[]>(query, [id])

        return proyectos.length > 0
            ? proyectos[0]
            : null
    }

}
```

Mantener este estilo y arquitectura.

---

# 6. OBJETIVO DE LA NUEVA INTERFAZ

Crear un módulo de consulta y análisis que permita al usuario comprender rápidamente el estado de:

- Departamentos
- Áreas
- PIAs
- Proyectos
- Docentes responsables

La interfaz debe sentirse como un sistema administrativo moderno.

Debe priorizar:

- claridad
- rapidez de consulta
- jerarquía visual
- búsqueda
- filtros
- indicadores
- navegación
- tablas
- dashboards
- páginas de detalle

Evitar interfaces saturadas.

---

# 7. DASHBOARD PRINCIPAL

Crear una página principal de dashboard.

El dashboard debe mostrar indicadores generales.

Por ejemplo:

### Tarjetas principales

- Total de departamentos
- Total de áreas
- Total de PIAs
- Total de proyectos
- Proyectos activos
- Proyectos terminados
- Proyectos próximos a terminar
- Proyectos con prórroga

Los números deben calcularse utilizando información real de MySQL.

NO colocar valores ficticios.

---

# 8. DASHBOARD DE DEPARTAMENTOS

Crear una vista para consultar departamentos.

Mostrar una tabla o tarjetas con:

- Nombre del departamento
- Número de áreas
- Número de PIAs
- Número de proyectos

Cada departamento debe poder seleccionarse para navegar a su detalle.

Ejemplo conceptual:

Departamento A

    Áreas: 8
    PIAs: 21
    Proyectos: 54

Departamento B

    Áreas: 5
    PIAs: 13
    Proyectos: 31

La información debe provenir de la base de datos.

---

# 9. DETALLE DE DEPARTAMENTO

Al seleccionar un departamento, mostrar:

## Información general

- Nombre
- ID

## Estadísticas

- Total de áreas
- Total de PIAs
- Total de proyectos
- Proyectos activos
- Proyectos terminados
- Proyectos próximos a terminar
- Proyectos con prórroga

## Áreas

Mostrar las áreas pertenecientes al departamento.

Para cada área mostrar:

- Nombre
- Responsable
- Número de PIAs
- Número de proyectos

Permitir seleccionar un área.

---

# 10. DASHBOARD DE ÁREAS

Crear una vista para consultar todas las áreas.

Mostrar:

- Nombre
- Departamento
- Responsable
- Número de PIAs
- Número de proyectos
- Proyectos activos
- Proyectos terminados
- Proyectos próximos a terminar
- Proyectos con prórroga

Agregar búsqueda y filtros.

Filtros sugeridos:

- Departamento
- Responsable
- Estado del proyecto
- Con/sin prórroga

---

# 11. DETALLE DE ÁREA

Al seleccionar un área mostrar:

## Información del área

- Nombre
- Departamento
- Responsable
- Objeto
- Objetivo general
- Objetivos específicos
- Acuerdo

## Estadísticas

- Número de PIAs
- Número de proyectos
- Proyectos activos
- Proyectos terminados
- Proyectos próximos a terminar
- Proyectos con prórroga

## PIAs

Mostrar las PIAs pertenecientes al área.

Para cada PIA:

- Nombre
- Acuerdo
- Número de proyectos

Cada PIA debe poder seleccionarse para ver su detalle.

---

# 12. DASHBOARD DE PIAs

Crear una vista para consultar todas las PIAs.

Mostrar:

- Nombre
- Área
- Departamento
- Acuerdo
- Número de proyectos

Agregar búsqueda por:

- Nombre de PIA
- ID
- Área
- Departamento
- Acuerdo

---

# 13. DETALLE DE PIA

Al seleccionar una PIA mostrar:

## Información

- Nombre
- ID
- ID anterior
- Área
- Acuerdo

## Estadísticas

- Número total de proyectos
- Proyectos activos
- Proyectos terminados
- Proyectos próximos a terminar
- Proyectos con prórroga

## Proyectos

Mostrar todos los proyectos asociados a la PIA.

Cada proyecto debe permitir navegar a su página de detalle.

IMPORTANTE:

Un proyecto puede tener `pia1_id` y `pia2_id`.

La aplicación debe manejar correctamente proyectos asociados a una o dos PIAs.

---

# 14. DASHBOARD DE PROYECTOS

Crear una vista completa de proyectos.

Debe ser una de las vistas principales de la aplicación.

Mostrar una tabla con:

- Clave
- Nombre
- Responsable
- PIA(s)
- Área(s)
- Fecha de inicio
- Fecha de finalización
- Fecha de prórroga
- Estado

Agregar búsqueda por:

- Clave
- Nombre
- Responsable
- PIA
- Área
- Departamento

---

# 15. ESTADOS DE PROYECTO

Crear una función centralizada para determinar el estado de un proyecto.

No duplicar esta lógica en diferentes componentes.

La clasificación debe contemplar al menos:

### Activo

Proyecto cuya fecha actual está dentro del periodo:

`fecha_ini <= hoy <= fecha_fin`

### Terminado

Proyecto cuya fecha de finalización ya pasó:

`fecha_fin < hoy`

### Próximo a terminar

Proyecto cuya fecha de finalización está próxima.

Utilizar una ventana configurable.

Por defecto:

30 días.

### Con prórroga

Proyecto que tenga:

`fecha_prorroga IS NOT NULL`

IMPORTANTE:

La lógica debe considerar correctamente los proyectos que tienen prórroga.

Si un proyecto tiene una fecha de prórroga posterior a `fecha_fin`, analizar si su estado debe considerar dicha fecha como nueva fecha efectiva de finalización.

Centralizar esta decisión en una función reutilizable.

No asumir silenciosamente una regla de negocio que no esté clara. Si es necesario, dejar la regla como una constante/configuración claramente identificada.

---

# 16. INDICADORES DE PROYECTOS

El dashboard de proyectos debe mostrar tarjetas como:

- Total de proyectos
- Activos
- Terminados
- Próximos a terminar
- Con prórroga

También puede incluir visualizaciones que ayuden a interpretar la información.

Por ejemplo:

- proyectos por departamento
- proyectos por área
- proyectos por estado
- proyectos con y sin prórroga
- proyectos por responsable

Las visualizaciones deben ser sencillas y útiles.

No agregar gráficas únicamente por estética.

---

# 17. BÚSQUEDA GLOBAL

Crear una búsqueda global.

El usuario debe poder buscar:

- Proyecto
- PIA
- Área
- Departamento

La búsqueda debe mostrar resultados agrupados por tipo.

Ejemplo:

RESULTADOS

PROYECTOS
- Proyecto de investigación X
- Proyecto de investigación Y

PIAs
- PIA X

ÁREAS
- Área X

DEPARTAMENTOS
- Departamento X

Al seleccionar un resultado, navegar directamente a su página de detalle.

---

# 18. BÚSQUEDA DE PROYECTOS

El usuario debe poder buscar un proyecto por:

- clave
- nombre
- ID
- responsable

Al abrir el proyecto mostrar TODA la información disponible.

## Detalle del proyecto

Mostrar:

- Nombre
- Clave
- ID
- Acuerdo
- Fecha de inicio
- Fecha de finalización
- Fecha de prórroga
- Estado
- Objetivos
- Responsable
- PIA 1
- PIA 2
- Área o áreas relacionadas
- Departamento o departamentos relacionados

Si existe información adicional en las vistas o DAO existentes, mostrarla cuando sea relevante.

---

# 19. DETALLE DE PROYECTO

Crear una página de detalle visualmente clara.

Ejemplo conceptual:

PROYECTO ABC-001

[ ACTIVO ]

Información general

Clave: ABC-001
Acuerdo: XXXXX
Responsable: Nombre del docente

Fechas

Inicio: 01/01/2026
Fin: 30/11/2026
Prórroga: --

Objetivos

...

PIAs relacionados

PIA 1
PIA 2

Áreas relacionadas

...

Departamentos relacionados

...

El usuario debe poder navegar desde el proyecto hacia:

- PIA
- Área
- Departamento
- Responsable

---

# 20. RESPONSABLES

La interfaz debe mostrar correctamente los docentes responsables.

Cuando exista información del responsable, mostrar:

- Nombre
- Número de empleado / `numec`
- Departamento

No realizar consultas adicionales innecesarias si la información ya viene disponible en JSON desde las vistas existentes.

Crear funciones utilitarias para interpretar los campos JSON si es necesario.

---

# 21. MANEJO DE JSON

Las siguientes vistas contienen campos JSON:

- `vista_proyecto_con_responsable`
- `vista_pias_con_proyectos`
- `vista_areas_con_pias`
- `vista_departamento_con_areas`

Analizar cómo mysql2 está devolviendo estos campos en el proyecto actual.

Puede ser necesario realizar parsing seguro.

Crear tipos TypeScript adecuados.

Evitar utilizar:

`any`

si es posible definir interfaces o tipos apropiados.

Si un JSON puede ser `null`, vacío o inválido, manejarlo de forma segura.

---

# 22. TIPADO TYPESCRIPT

Utilizar las interfaces existentes de:

`src/lib/types/db.ts`

Si faltan interfaces, agregar las necesarias.

Por ejemplo, pueden ser necesarios tipos para:

- Departamento
- Área
- PIA
- Proyecto
- Docente
- Responsable
- estadísticas
- estados de proyecto
- resultados de búsqueda

Evitar `any`.

Mantener consistencia entre:

MySQL → DAO → server load → Svelte → UI

---

# 23. SVELTEKIT

Seguir las convenciones actuales de SvelteKit del proyecto.

Separar correctamente:

### Server

Acceso a:

- MySQL
- DAO
- lógica sensible

### Cliente

Utilizar componentes Svelte para:

- tablas
- tarjetas
- filtros
- búsqueda
- navegación
- interacción
- dashboards

Nunca exponer directamente la conexión de MySQL al cliente.

---

# 24. RUTAS SUGERIDAS

Adaptar estas rutas a la estructura existente del proyecto.

Una posible estructura es:

`/dashboard`

`/departamentos`

`/departamentos/[id]`

`/areas`

`/areas/[id]`

`/pias`

`/pias/[id]`

`/proyectos`

`/proyectos/[id]`

`/buscar`

No es obligatorio utilizar exactamente esta estructura.

Primero analizar las rutas existentes y adaptarse a ellas.

No duplicar rutas existentes.

---

# 25. COMPONENTES REUTILIZABLES

Crear componentes reutilizables cuando tenga sentido.

Por ejemplo:

- `StatCard.svelte`
- `SearchInput.svelte`
- `DataTable.svelte`
- `StatusBadge.svelte`
- `ProjectStatusBadge.svelte`
- `DepartmentCard.svelte`
- `AreaCard.svelte`
- `PIACard.svelte`
- `ProjectCard.svelte`
- `Pagination.svelte`
- `EmptyState.svelte`
- `LoadingState.svelte`

No crear componentes innecesarios.

Priorizar reutilización.

---

# 26. TABLAS

Las tablas deben:

- permitir ordenar cuando sea útil
- permitir búsqueda
- permitir filtros
- tener paginación si existen muchos registros
- mostrar estados de forma visual
- permitir seleccionar una fila
- tener navegación al detalle

En pantallas pequeñas deben ser razonablemente responsivas.

---

# 27. UX

La aplicación debe permitir navegar fácilmente:

Departamento
→ Área
→ PIA
→ Proyecto

Y también:

Proyecto
→ PIA
→ Área
→ Departamento

Evitar que el usuario tenga que regresar constantemente a una página anterior.

Utilizar breadcrumbs cuando sea conveniente.

Ejemplo:

Departamentos
/
Departamento de Ingeniería
/
Área de Sistemas
/
PIA Desarrollo
/
Proyecto ABC-001

---

# 28. DISEÑO VISUAL

Crear una interfaz moderna de administración.

Prioridades:

1. Legibilidad
2. Jerarquía visual
3. Información importante visible
4. Navegación sencilla
5. Consistencia
6. Responsividad

Utilizar:

- tarjetas
- tablas
- badges
- indicadores
- breadcrumbs
- paneles
- filtros
- estados visuales
- iconografía cuando sea apropiado

No llenar la pantalla con gráficos innecesarios.

El usuario debe poder entender rápidamente el estado de la información.

---

# 29. FECHAS

Prestar especial atención a las fechas provenientes de MySQL.

Evitar problemas de zona horaria.

Las fechas de tipo `DATE` deben mostrarse correctamente en formato legible.

Por ejemplo:

`15/09/2026`

No modificar una fecha por conversiones UTC innecesarias.

Crear una utilidad centralizada para formatear fechas.

---

# 30. RENDIMIENTO

No cargar innecesariamente toda la base de datos en el navegador.

Si existen muchos proyectos:

- utilizar paginación
- realizar búsquedas en servidor cuando sea conveniente
- aplicar filtros en SQL cuando sea necesario
- evitar consultas N+1

No realizar una consulta individual por cada fila de una tabla.

Utilizar las vistas existentes para obtener información relacionada.

---

# 31. CONSULTAS Y ESTADÍSTICAS

Antes de crear nuevas consultas SQL, revisar:

- `vista_departamento`
- `vista_areas`
- `vista_pias`
- `vista_proyectos`
- `vista_docente`
- `vista_proyecto_con_responsable`
- `vista_pias_con_proyectos`
- `vista_areas_con_pias`
- `vista_departamento_con_areas`

Si una vista ya contiene la información necesaria, utilizarla.

Si se necesita una estadística que no puede obtenerse razonablemente de las vistas actuales, crear un método DAO específico.

Ejemplos de métodos posibles:

`getEstadisticas()`

`getEstadisticasPorDepartamento(id)`

`getEstadisticasPorArea(id)`

`getEstadisticasPorPIA(id)`

`buscar(termino)`

No crear estos métodos automáticamente si la funcionalidad puede resolverse reutilizando métodos existentes.

---

# 32. SEGURIDAD

Todas las consultas SQL deben utilizar parámetros.

Correcto:

```ts
WHERE id = ?
```

Incorrecto:

```ts
WHERE id = ${id}
```

Nunca concatenar directamente valores proporcionados por el usuario dentro de SQL.

---

# 33. MANEJO DE ERRORES

La aplicación debe manejar:

- errores de base de datos
- registros inexistentes
- JSON inválido
- parámetros inválidos
- búsquedas sin resultados
- errores inesperados

Crear páginas o componentes apropiados para:

- loading
- empty
- error
- not found

No mostrar errores internos de MySQL directamente al usuario final.

---

# 34. RESPONSIVE DESIGN

La aplicación debe funcionar correctamente en:

- escritorio
- laptop
- tablet
- móvil

El dashboard puede priorizar escritorio, pero las vistas de detalle y búsqueda deben ser utilizables en móvil.

---

# 35. REQUISITO IMPORTANTE SOBRE EL CÓDIGO EXISTENTE

NO reescribir código que ya funciona solamente por preferencia de estilo.

Antes de cambiar un archivo existente:

1. analizarlo
2. entender su propósito
3. determinar si realmente es necesario modificarlo

Conservar la arquitectura existente cuando sea adecuada.

---

# 36. REQUISITO IMPORTANTE SOBRE LAS VISTAS MYSQL

NO modificar las vistas MySQL existentes.

La primera opción debe ser consumirlas desde los DAO existentes.

Si detectas que una funcionalidad requiere información que no está disponible:

1. identifica exactamente qué información falta
2. determina si puede obtenerse desde otra vista
3. determina si puede calcularse en TypeScript
4. solamente después considera crear una nueva consulta DAO

No modificar el esquema de la base de datos sin autorización explícita.

---

# 37. FASES DE IMPLEMENTACIÓN

Trabajar en las siguientes fases.

## FASE 1 — ANÁLISIS

Analizar:

- estructura del proyecto
- rutas
- componentes
- DAO
- interfaces
- vistas existentes
- conexión MySQL

Entregar un resumen de la arquitectura encontrada.

---

## FASE 2 — MODELO DE DATOS

Verificar y completar:

- interfaces TypeScript
- tipos JSON
- tipos de estadísticas
- tipos de búsqueda
- estados de proyectos

---

## FASE 3 — LÓGICA

Crear funciones reutilizables para:

- estado del proyecto
- fechas
- estadísticas
- parsing de JSON
- búsqueda

---

## FASE 4 — DASHBOARD PRINCIPAL

Implementar:

- estadísticas generales
- proyectos por estado
- departamentos
- áreas
- PIAs
- proyectos

---

## FASE 5 — DEPARTAMENTOS

Implementar:

- listado
- búsqueda
- estadísticas
- detalle
- áreas relacionadas

---

## FASE 6 — ÁREAS

Implementar:

- listado
- filtros
- estadísticas
- detalle
- responsable
- PIAs
- proyectos

---

## FASE 7 — PIAs

Implementar:

- listado
- búsqueda
- filtros
- detalle
- proyectos relacionados

---

## FASE 8 — PROYECTOS

Implementar:

- listado
- búsqueda
- filtros
- estados
- estadísticas
- detalle completo

---

## FASE 9 — BÚSQUEDA GLOBAL

Implementar búsqueda de:

- departamentos
- áreas
- PIAs
- proyectos

---

## FASE 10 — UX Y REVISIÓN

Revisar:

- navegación
- responsive
- estados vacíos
- errores
- loading
- rendimiento
- consistencia visual
- TypeScript
- consultas SQL

---

# 38. CRITERIO DE ÉXITO

Consideraré que esta tarea está correctamente implementada cuando un usuario pueda:

1. Entrar al dashboard y conocer rápidamente el estado general del sistema.

2. Ver cuántos departamentos existen.

3. Ver cuántas áreas existen en cada departamento.

4. Ver cuántas PIAs existen en cada área.

5. Ver cuántos proyectos existen en cada PIA.

6. Ver cuántos proyectos existen por área.

7. Ver cuántos proyectos existen por departamento.

8. Saber cuáles proyectos están activos.

9. Saber cuáles proyectos terminaron.

10. Saber cuáles proyectos están próximos a terminar.

11. Saber cuáles proyectos tienen prórroga.

12. Buscar un proyecto y obtener toda su información.

13. Buscar una PIA y obtener toda su información.

14. Buscar un área y obtener toda su información.

15. Navegar fácilmente desde un departamento hasta sus proyectos.

16. Navegar desde un proyecto hacia sus PIAs, áreas y departamentos.

17. Identificar claramente al responsable de cada área y proyecto.

18. Utilizar la aplicación desde escritorio y dispositivos móviles.

---

# 39. REGLA FINAL

No inventes información de negocio.

No inventes relaciones entre entidades.

No inventes campos que no existan.

No inventes estados que contradigan las reglas establecidas.

Cuando encuentres una ambigüedad:

1. identifica la ambigüedad
2. explica qué impacto tiene
3. utiliza la solución más conservadora
4. deja la lógica centralizada para que pueda modificarse posteriormente

La prioridad es:

BASE DE DATOS EXISTENTE
→ DAO EXISTENTES
→ TIPOS EXISTENTES
→ LÓGICA DE NEGOCIO
→ SERVER LOAD
→ COMPONENTES SVELTE
→ UI/DASHBOARD

La aplicación debe integrarse con el proyecto existente, no reemplazarlo.

Antes de comenzar a escribir una gran cantidad de código, analiza primero el proyecto y presenta el plan de implementación.