
# ESTRUCTURA DE PAQUETES

src/
├── assets/             # Imágenes, SVGs, fuentes
├── configs/            # Constantes de entorno, variables globales
├── modules/
│   ├── auth/           # Login, Registro
│   ├── game/           # Lógica del juego (Lobby, Votación, Revelación)
│   ├── collection/     # CRUD de colecciones y visualización
│   ├── user/           # Perfil y configuración
│   └── home/           # Pantalla inicial (Landing)
├── shared/             # Lo que todos usan
│   ├── components/     # UI Kit: Button.tsx, Card.tsx, Input.tsx (Atomos)
│   ├── hooks/          # useLocalStorage, useScreenSize
│   ├── types/          # Tipos base o compartidos
│   └── utils/          # Helpers (helpers.ts, constants.ts)
├── pages/              # Ensamblado de rutas (Home.tsx, GamePage.tsx)
├── store/              # Context Providers (AuthContext, GameContext)
└── router/             # Configuración de React Router

