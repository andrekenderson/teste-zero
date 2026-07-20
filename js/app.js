// Registra o Service Worker quando a página terminar de carregar
if ('serviceWorker' in navigator) {
    window.addEventListener('load', registerServiceWorker);
}

/**
 * Registra o Service Worker da aplicação.
 */
async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        console.log('[SW] Registrado com sucesso.');
        console.log(`[SW] Escopo: ${registration.scope}`);
    } catch (error) {
        console.error('[SW] Falha ao registrar o Service Worker:', error);
    }
}