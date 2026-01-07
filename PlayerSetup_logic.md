### Lógica Relevante en `PlayerSetup.tsx`

Este componente gestiona la configuración inicial de jugadores y el número de impostores para una nueva partida, interactuando con el `GameContext` global.

#### 1. Estado Local y Sincronización

*   **`playerNames`**: Un array de strings (`string[]`) para almacenar los nombres de los jugadores. Se inicializa con 3 campos vacíos o con los nombres de jugadores existentes en el `GameContext` si se vuelve a la pantalla.
*   **`impostors`**: Un número para la cantidad de impostores. Se inicializa con el valor del `GameContext` o 0.
*   **Manejo de Cambios**:
    *   `handlePlayerNameChange`: Actualiza un nombre de jugador específico en el array `playerNames`.
    *   `addPlayerInput`: Añade un nuevo campo de entrada vacío a `playerNames`.
    *   `removePlayerInput`: Elimina un campo de entrada específico de `playerNames` (permitiendo un mínimo de 3 jugadores).
    *   `handleImpostorChange`: Ajusta el número de impostores, asegurando que no sea menor que 0.

#### 2. Interacción con `GameContext`

*   El componente accede al estado global del juego y a la función `dispatch` usando `useContext(GameContext)`.
*   Esto permite tanto leer el estado actual (`state.players`, `state.impostorCount`) como despachar acciones para actualizarlo.
*   **Acción `CREATE_GAME` (implícita en la navegación)**:
    *   Al hacer clic en "CREATE GAME", se crea un array de objetos `Player` con nombres e IDs únicos.
    *   Se despachan las acciones `SET_PLAYERS` y `SET_IMPOSTOR_COUNT` para actualizar el `GameContext` con la lista final de jugadores y el número de impostores.
    *   También se despacha `SET_CURRENT_PHASE` a `'LOBBY'`, preparando el juego para la siguiente fase.

#### 3. Validación y Habilitación del Botón "CREATE GAME"

*   **`validateGameSetup`**: Una función memoizada (`useCallback`) que encapsula la lógica de validación para habilitar o deshabilitar el botón "CREATE GAME".
*   **Criterios de Validación**:
    *   Debe haber al menos 3 jugadores con nombres ingresados (no vacíos).
    *   Ningún campo de nombre de jugador puede estar vacío (incluso si hay más de 3).
    *   El número de impostores debe ser mayor que 0 y estrictamente menor que la mitad del número total de jugadores activos.
*   El botón "CREATE GAME" se deshabilita (`disabled={!validateGameSetup()}`) si alguna de estas condiciones no se cumple.

#### 4. Navegación

*   Se utiliza `useNavigate` de `react-router-dom` para redirigir al usuario a la ruta `/lobby` una vez que el juego se ha creado exitosamente.

#### 5. Estilo y Componentes Reutilizables

*   Utiliza `DynamicBackground` para el fondo.
*   Reutiliza el componente `Button` para la acción principal.
*   Incorpora clases de Tailwind CSS para un estilo Cyber-Neon, incluyendo `drop-shadow-neon`, `shadow-neon-sm` e `input-neon-effect` para los elementos de UI.
