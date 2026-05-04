export const pluginGaitMarkers = [
    // HEAD
    { name: "Left Front Head", abbreviation: "LFHD", description: "Linke Schläfe", landmark: "Os frontale (Stirnbein)", section: "head" },
    { name: "Right Front Head", abbreviation: "RFHD", description: "Rechte Schläfe", landmark: "Os frontale (Stirnbein)", section: "head" },
    { name: "Left Back Head", abbreviation: "LBHD", description: "Linker Hinterkopf (definiert zusammen mit den Frontmarkern die Transversalebene des Kopfes)", landmark: "Os occipitale (Hinterhauptbein)", section: "head" },
    { name: "Right Back Head", abbreviation: "RBHD", description: "Rechter Hinterkopf (definiert zusammen mit den Frontmarkern die Transversalebene des Kopfes)", landmark: "Os occipitale (Hinterhauptbein)", section: "head" },

    // TORSO
    { name: "7th Cervical Vertebra", abbreviation: "C7", description: "Auf dem Dornfortsatz des 7. Halswirbels", landmark: "Processus spinosus C7", section: "back" },
    { name: "10th Thoracic Vertebra", abbreviation: "T10", description: "Auf dem Dornfortsatz des 10. Brustwirbels", landmark: "Processus spinosus T10", section: "back" },
    { name: "Clavicle", abbreviation: "CLAV", description: "An der Drosselgrube (Jugulargrube), wo die Schlüsselbeine auf das Brustbein treffen", landmark: "Clavicula (sternal)", section: "chest" },
    { name: "Sternum", abbreviation: "STRN", description: "Am Schwertfortsatz (Processus xiphoideus) des Brustbeins", landmark: "Corpus sterni", section: "chest" },
    { name: "Right Back", abbreviation: "RBAK", description: "Irgendwo über dem rechten Schulterblatt (Position nicht kritisch; wird nicht in PiG-Berechnungen einbezogen)", landmark: "Dorsaler Thorax / Scapula-Region", section: "back" },

    // LEFT ARM
    { name: "Left Shoulder", abbreviation: "LSHO", description: "Am Akromioklavikulargelenk", landmark: "Acromion scapulae", section: "arm left" },
    { name: "Left Upper Arm", abbreviation: "LUPA", description: "Auf dem äußeren oberen Drittel des linken Oberarms", landmark: "Humerusschaft", section: "arm left" },
    { name: "Left Elbow", abbreviation: "LELB", description: "Am lateralen Epicondylus", landmark: "Epicondylus lateralis humeri", section: "arm left" },
    { name: "Left Forearm", abbreviation: "LFRM", description: "Auf dem äußeren unteren Drittel des linken Unterarms", landmark: "Radius / Ulna Schaft", section: "arm left" },
    { name: "Left Wrist A", abbreviation: "LWRA", description: "Daumenseitig, möglichst nahe am Gelenkzentrum", landmark: "Processus styloideus radii", section: "arm left" },
    { name: "Left Wrist B", abbreviation: "LWRB", description: "Kleinfingerseitig, möglichst nahe am Gelenkzentrum", landmark: "Processus styloideus ulnae", section: "arm left" },
    { name: "Left Finger", abbreviation: "LFIN", description: "Direkt proximal (körpernah) des mittleren Fingergelenks", landmark: "Metakarpophalangeal-Gelenk", section: "arm left" },

    // RIGHT ARM
    { name: "Right Shoulder", abbreviation: "RSHO", description: "Am Akromioklavikulargelenk", landmark: "Acromion scapulae", section: "arm right" },
    { name: "Right Upper Arm", abbreviation: "RUPA", description: "Auf dem äußeren unteren Drittel des rechten Oberarms", landmark: "Humerusschaft", section: "arm right" },
    { name: "Right Elbow", abbreviation: "RELB", description: "Am lateralen Epicondylus (ungefähre Ellenbogenachse)", landmark: "Epicondylus lateralis humeri", section: "arm right" },
    { name: "Right Forearm", abbreviation: "RFRM", description: "Auf dem äußeren unteren Drittel des rechten Unterarms", landmark: "Radius / Ulna Schaft", section: "arm right" },
    { name: "Right Wrist A", abbreviation: "RWRA", description: "Daumenseitig, möglichst nahe am Gelenkzentrum", landmark: "Processus styloideus radii", section: "arm right" },
    { name: "Right Wrist B", abbreviation: "RWRB", description: "Kleinfingerseitig, möglichst nahe am Gelenkzentrum", landmark: "Processus styloideus ulnae", section: "arm right" },
    { name: "Right Finger", abbreviation: "RFIN", description: "Direkt unterhalb des mittleren Fingergelenks", landmark: "Metakarpophalangeal-Gelenk", section: "arm right" },

    // PELVIS
    { name: "Left ASIS", abbreviation: "LASI", description: "Linker anterior superior iliac spine", landmark: "Spina iliaca anterior superior", section: "hip front" },
    { name: "Right ASIS", abbreviation: "RASI", description: "Rechter anterior superior iliac spine", landmark: "Spina iliaca anterior superior", section: "hip front" },
    { name: "Left PSIS", abbreviation: "LPSI", description: "Linker posterior superior iliac spine (direkt unterhalb der Iliosakralgelenke, wo die Wirbelsäule auf das Becken trifft)", landmark: "Spina iliaca posterior superior", section: "hip back" },
    { name: "Right PSIS", abbreviation: "RPSI", description: "Rechter posterior superior iliac spine (direkt unterhalb der Iliosakralgelenke, wo die Wirbelsäule auf das Becken trifft)", landmark: "Spina iliaca posterior superior", section: "hip back" },

    // LEFT LEG
    { name: "Left Thigh", abbreviation: "LTHI", description: "Auf dem äußeren unteren Drittel des linken Oberschenkels", landmark: "Femurschaft", section: "leg left" },
    { name: "Left Knee", abbreviation: "LKNE", description: "Auf der lateralen Flexions-/Extensionsachse des linken Knies", landmark: "Epicondylus lateralis femoris", section: "leg left" },
    { name: "Left Tibia", abbreviation: "LTIB", description: "Auf dem unteren Drittel der linken Unterschenkelvorderseite", landmark: "Tibiaschaft", section: "leg left" },
    { name: "Left Ankle", abbreviation: "LANK", description: "Am lateralen Malleolus entlang einer gedachten Linie durch die transmalleolare Achse", landmark: "Malleolus lateralis", section: "leg left" },
    { name: "Left Toe", abbreviation: "LTOE", description: "Über dem Kopf des zweiten Mittelfußknochens, mittelfußseitig der Übergangszone zwischen Vorfuß und Mittelfuß", landmark: "Metatarsale II (Köpfchen)", section: "foot left" },
    { name: "Left Knee Medial", abbreviation: "LKNM", description: "Auf der medialen Flexions-/Extensionsachse des linken Knies", landmark: "Epicondylus medialis femoris", section: "leg left" },
    { name: "Left Ankle Medial", abbreviation: "LMED", description: "Am medialen Malleolus entlang einer gedachten Linie durch die transmalleolare Achse", landmark: "Malleolus medialis", section: "leg left" },

    // RIGHT LEG
    { name: "Right Thigh", abbreviation: "RTHI", description: "Auf dem äußeren oberen Drittel des rechten Oberschenkels", landmark: "Femurschaft", section: "leg right" },
    { name: "Right Knee", abbreviation: "RKNE", description: "Auf der lateralen Flexions-/Extensionsachse des rechten Knies", landmark: "Epicondylus lateralis femoris", section: "leg right" },
    { name: "Right Tibia", abbreviation: "RTIB", description: "Auf dem oberen Drittel der rechten Unterschenkelvorderseite", landmark: "Tibiaschaft", section: "leg right" },
    { name: "Right Ankle", abbreviation: "RANK", description: "Am lateralen Malleolus entlang einer gedachten Linie durch die transmalleolare Achse", landmark: "Malleolus lateralis", section: "leg right" },
    { name: "Right Toe", abbreviation: "RTOE", description: "Über dem Kopf des zweiten Mittelfußknochens, mittelfußseitig der Übergangszone zwischen Vorfuß und Mittelfuß", landmark: "Metatarsale II (Köpfchen)", section: "foot right" },
    { name: "Right Knee Medial", abbreviation: "RKNM", description: "Auf der medialen Flexions-/Extensionsachse des rechten Knies", landmark: "Epicondylus medialis femoris", section: "leg right" },
    { name: "Right Ankle Medial", abbreviation: "RMED", description: "Am medialen Malleolus entlang einer gedachten Linie durch die transmalleolare Achse", landmark: "Malleolus medialis", section: "leg right" },

    // FEET BACK
    { name: "Left Heel", abbreviation: "LHEE", description: "Am Calcaneus auf gleicher Höhe über der Fußsohle wie der Zehenmarker", landmark: "Calcaneus", section: "foot back" },
    { name: "Right Heel", abbreviation: "RHEE", description: "Am Calcaneus auf gleicher Höhe über der Fußsohle wie der Zehenmarker", landmark: "Calcaneus", section: "foot back" },
];
