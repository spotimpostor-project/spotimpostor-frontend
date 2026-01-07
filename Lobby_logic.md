### Lógica Relevante en `Lobby.tsx`

Este componente gestiona la sala de espera antes de que comience el juego, donde los jugadores confirman que están listos.

#### 1. Estado y Sincronización del Juego

*   **`useGame()`**: Accede al `GameContext` para obtener el estado global (`state`) y la función `dispatch`.
*   **`players` y `gameResult`**:
    *   `state.players`: Es la fuente de verdad para el estado `isReady` de cada jugador.
    *   `gameResult.data`: Contiene la información asignada por el backend, como el rol y la palabra de cada jugador.

#### 2. Combinación de Datos de Jugadores

*   **`lobbyPlayers`**: Un `useMemo` combina los datos de `gameResult.data` y `state.players`.
    *   Por cada jugador en `gameResult.data`, busca el jugador correspondiente en `state.players` para obtener su estado `isReady`.
    *   El resultado es un array de objetos `LobbyPlayer` que contiene toda la información necesaria para la UI (ID, nombre, rol, palabra y estado `isReady`).

#### 3. Manejo de la Lógica "Ready"

*   **`handleReady`**: Una función `useCallback` que se pasa a cada `PlayerCard`.
    *   Cuando un jugador hace clic en "listo", despacha la acción `UPDATE_PLAYER_READY_STATUS` con el ID del jugador y `isReady: true`.
*   **Contadores y Validación**:
    *   `readyPlayersCount`: Un `useMemo` que cuenta cuántos jugadores en `lobbyPlayers` tienen `isReady` como `true`.
    *   `allPlayersReady`: Un `useMemo` que devuelve `true` solo si todos los jugadores están listos (`readyPlayersCount` es igual al total de jugadores).

#### 4. Inicio del Juego

*   **`handleStartGame`**: La función que se ejecuta al hacer clic en "INICIAR PARTIDA".
    *   **Navegación**: Utiliza `useNavigate` para redirigir al usuario a la ruta `/game-session`, iniciando la siguiente fase del juego.
    *   **Habilitación del Botón**: El botón "INICIAR PARTIDA" está deshabilitado hasta que `allPlayersReady` sea `true`, asegurando que el juego no comience prematuramente.

#### 5. Componentes y Estilo

*   **`PlayerCard`**: Un componente reutilizable que muestra la información de un jugador y el botón para marcarlo como "listo".
*   **`Button`**: El componente de botón genérico.
*   **Estilo**: Utiliza `twMerge` y `clsx` para combinar condicionalmente clases de Tailwind CSS, aplicando estilos dinámicos (por ejemplo, deshabilitando el botón de inicio).
