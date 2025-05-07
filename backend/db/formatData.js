const formats = [
    [
        { name: "DDS", meta: "2D" },
        { name: "JPG/JPEG", meta: "2D" },
        { name: "PNG", meta: "2D" },
        { name: "SVG", meta: "2D" },
        { name: "TIFF", meta: "2D" },
        { name: "TGA", meta: "2D" },
    ],
    [
        { name: "BLEND", meta: "3D" },
        { name: "FBX", meta: "3D" },
        { name: "GLTF / GLB", meta: "3D" },
        { name: "MAX / MB / MA", meta: "3D" },
        { name: "OBJ", meta: "3D" },
        { name: "PLY", meta: "3D" },
        { name: "STL", meta: "3D" },
    ],
    [
        { name: "FLAC", meta: "Audio" },
        { name: "MP3", meta: "Audio" },
        { name: "MIDI", meta: "Audio" },
        { name: "OGG", meta: "Audio" },
        { name: "WAV", meta: "Audio" },
        { name: "XWV / XSB / XGS", meta: "Audio" },
    ],
    [
        { name: "AVI", meta: "Video" },
        { name: "BINK", meta: "Video" },
        { name: "MP4", meta: "Video" },
        { name: "MOV", meta: "Video" },
        { name: "Thora", meta: "Video" },
        { name: "WEBM", meta: "Video" },
    ],
    [
        { name: "C", meta: "Codigo" },
        { name: "C++", meta: "Codigo" },
        { name: "HLSL / GLSL / ShaderLab", meta: "Codigo" },
        { name: "JavaScript++", meta: "Codigo" },
        { name: "Lua", meta: "Codigo" },
        { name: "Python", meta: "Codigo" },
        { name: "TypeScript", meta: "Codigo" },
        { name: "YAML", meta: "Codigo" },
    ],
    [
        { name: "CSV", meta: "Otros" },
        { name: "INI", meta: "Otros" },
        { name: "JSON", meta: "Otros" },
        { name: "NAVMESH / AI Graphs", meta: "Otros" },
        { name: "PDF", meta: "Otros" },
        { name: "SQL / SQLite", meta: "Otros" },
        { name: "XML", meta: "Otros" },
        { name: "ZIP", meta: "Otros" },
        { name: "Otros", meta: "Otros" }
    ]
];

export default formats;
