/**
 * Parsea campos JSON devueltos por mysql2 que pueden ser objetos/arrays ya parseados,
 * strings JSON, nulls o invalidados.
 */
export function safeJsonParse<T>(data: unknown, fallback: T): T {
    if (data === null || data === undefined) {
        return fallback;
    }

    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return (parsed as T) ?? fallback;
        } catch {
            return fallback;
        }
    }

    if (typeof data === 'object') {
        return (data as T) ?? fallback;
    }

    return fallback;
}
