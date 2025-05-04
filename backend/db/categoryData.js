const cat2D = [
    {
      name: "Animaciones",
      children: [],
      meta: "2D"
    },
    {
      name: "Entornos",
      children: [],
      meta: "2D"
    },
    {
      name: "Fuentes",
      children: [],
      meta: "2D"
    },
    {
      name: "Interfaces",
      children: [],
      meta: "2D"
    },
    {
      name: "Personajes",
      children: [],
      meta: "2D"
    },
    {
      name: "Texturas y materiales",
      children: [],
      meta: "2D"
    },
    {
      name: "Otros",
      children: [],
      meta: "2D"
    }
]

const cat3D = [
    {
      name: "Animaciones",
      children: [],
      meta: "3D"
    },
    {
      name: "Entornos",
      children: [],
      meta: "3D"
    },
    {
      name: "Interfaces",
      children: [],
      meta: "3D"
    },
    {
      name: "Personajes",
      children: [],
      meta: "3D"
    },
    {
      name: "Props",
      children: [],
      meta: "3D"
    },
    {
      name: "Simulaciones y FX",
      children: [],
      meta: "3D"
    },
    {
      name: "Vegetación",
      children: [],
      meta: "3D"
    },
    {
      name: "Vehículos",
      children: [],
      meta: "3D"
    },
    {
      name: "Otros",
      children: [],
      meta: "3D"
    }
];
   
const catAudio = [
    {
      name: "Ambiental",
      children: [],
      meta: "Audio"
    },
    {
      name: "Música",
      children: [],
      meta: "Audio"
    },
    {
      name: "Sonidos",
      children: [],
      meta: "Audio"
    },
    {
      name: "Otros",
      children: [],
      meta: "Audio"
    }
]

const catVideo = [
    {
      name: "Cinemáticas",
      children: [],
      meta: "Video"
    },
    {
      name: "Efectos VFX",
      children: [],
      meta: "Video"
    },
    {
      name: "Gameplay",
      children: [],
      meta: "Video"
    },
    {
      name: "Making-of",
      children: [],
      meta: "Video"
    },
    {
      name: "Motion graphics",
      children: [],
      meta: "Video"
    },
    {
      name: "Otros",
      children: [],
      meta: "Video"
    }
]

const catCodigo = [
    {
      name: "Depuración y testing",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Herramientas y scripts",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Interfaces",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Integraciones y APIs",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Optimizaciones",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Plugins",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Prototipos",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Shaders y materiales",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Sistemas de juego",
      children: [],
      meta: "Codigo"
    },
    {
      name: "Otros",
      children: [],
      meta: "Codigo"
    }
]

const catOtros = [
    {
      name: "Blueprints y prefabs",
      children: [
        {
          name: "Blueprints o Graphs",
        },
        {
          name: "Plantillas de niveles",
        },
        {
          name: "Prefabs escenarios",
        }
      ],
      meta: "Otros"
    },
    {
      name: "Documentación y referencias",
      children: [
        {
          name: "Concept art",
        },
        {
          name: "Guías de diseño",
        },
        {
          name: "Guías de la historia",
        },
        {
          name: "Guías técnicas",
        },
        {
          name: "Moodboards",
        }
      ],
      meta: "Otros"
    },
    {
      name: "Materiales de producción",
      children: [
        {
          name: "Storyboards",
        },
        {
          name: "Mapas de niveles",
        },
        {
          name: "Guiones y diálogos",
        }
      ],
      meta: "Otros"
    },
    {
      name: "Otros",
      children: [],
      meta: "Otros"
    }
]

const allCats = [...cat2D, ...cat3D, ...catAudio, ...catVideo, ...catCodigo, ...catOtros];

export default allCats;