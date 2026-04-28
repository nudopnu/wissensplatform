export const pluginGaitMarkers = [
    // HEAD
    { name: "Left Front Head", abbreviation: "LFHD", description: "Linke vordere Stirnregion des Schädels.", landmark: "Os frontale (Stirnbein)", section: "head" },
    { name: "Right Front Head", abbreviation: "RFHD", description: "Rechte vordere Stirnregion des Schädels.", landmark: "Os frontale (Stirnbein)", section: "head" },
    { name: "Left Back Head", abbreviation: "LBHD", description: "Linke hintere Kopfreferenz am Hinterkopf.", landmark: "Os occipitale (Hinterhauptbein)", section: "head" },
    { name: "Right Back Head", abbreviation: "RBHD", description: "Rechte hintere Kopfreferenz am Hinterkopf.", landmark: "Os occipitale (Hinterhauptbein)", section: "head" },

    // TORSO
    { name: "7th cervical vertebra", abbreviation: "C7", description: "Auf dem Dornfortsatz des 7. Halswirbels.", landmark: "Processus spinosus C7", section: "back" },
    { name: "10th thoracic vertebra", abbreviation: "T10", description: "Auf dem Dornfortsatz des 10. Brustwirbels", landmark: "Processus spinosus T10", section: "back" },
    { name: "Clavicle", abbreviation: "CLAV", description: "An der Drosselgrube (Jugulargrube), wo die Schlüsselbeine auf das Brustbein treffen.", landmark: "Clavicula (sternal)", section: "chest" },
    { name: "Sternum", abbreviation: "STRN", description: "Marker am Brustbein.", landmark: "Corpus sterni", section: "chest" },
    { name: "Right Back", abbreviation: "RBAK", description: "Posteriorer Marker über dem rechten Schulterblatt.", landmark: "Dorsaler Thorax / Scapula-Region", section: "back" },

    // LEFT ARM
    { name: "Left Shoulder", abbreviation: "LSHO", description: "Linker Schultergürtel.", landmark: "Acromion scapulae", section: "arm left" },
    { name: "Left Upper Arm", abbreviation: "LUPA", description: "Linker Oberarm (lateraler Humerus).", landmark: "Humerusschaft", section: "arm left" },
    { name: "Left Elbow", abbreviation: "LELB", description: "Linkes Ellenbogengelenk.", landmark: "Epicondylus lateralis humeri", section: "arm left" },
    { name: "Left Forearm", abbreviation: "LFRM", description: "Linker Unterarm (mittlerer Bereich).", landmark: "Radius / Ulna Schaft", section: "arm left" },
    { name: "Left Wrist Radial", abbreviation: "LWRA", description: "Linke Handgelenksseite radial.", landmark: "Processus styloideus radii", section: "arm left" },
    { name: "Left Wrist Ulnar", abbreviation: "LWRB", description: "Linke Handgelenksseite ulnar.", landmark: "Processus styloideus ulnae", section: "arm left" },
    { name: "Left Finger", abbreviation: "LFIN", description: "Linke Hand/Fingerregion.", landmark: "Metakarpophalangeal-Gelenk", section: "arm left" },

    // RIGHT ARM
    { name: "Right Shoulder", abbreviation: "RSHO", description: "Rechter Schultergürtel.", landmark: "Acromion scapulae", section: "arm right" },
    { name: "Right Upper Arm", abbreviation: "RUPA", description: "Rechter Oberarm (lateraler Humerus).", landmark: "Humerusschaft", section: "arm right" },
    { name: "Right Elbow", abbreviation: "RELB", description: "Rechtes Ellenbogengelenk.", landmark: "Epicondylus lateralis humeri", section: "arm right" },
    { name: "Right Forearm", abbreviation: "RFRM", description: "Rechter Unterarm (mittlerer Bereich).", landmark: "Radius / Ulna Schaft", section: "arm right" },
    { name: "Right Wrist Radial", abbreviation: "RWRA", description: "Rechte Handgelenksseite radial.", landmark: "Processus styloideus radii", section: "arm right" },
    { name: "Right Wrist Ulnar", abbreviation: "RWRB", description: "Rechte Handgelenksseite ulnar.", landmark: "Processus styloideus ulnae", section: "arm right" },
    { name: "Right Finger", abbreviation: "RFIN", description: "Rechte Hand/Fingerregion.", landmark: "Metakarpophalangeal-Gelenk", section: "arm right" },

    // PELVIS
    { name: "Left ASIS", abbreviation: "LASI", description: "Linke vordere obere Darmbeinstachel.", landmark: "Spina iliaca anterior superior", section: "hip front" },
    { name: "Right ASIS", abbreviation: "RASI", description: "Rechte vordere obere Darmbeinstachel.", landmark: "Spina iliaca anterior superior", section: "hip front" },
    { name: "Left PSIS", abbreviation: "LPSI", description: "Linke hintere obere Darmbeinstachel.", landmark: "Spina iliaca posterior superior", section: "hip back" },
    { name: "Right PSIS", abbreviation: "RPSI", description: "Rechte hintere obere Darmbeinstachel.", landmark: "Spina iliaca posterior superior", section: "hip back" },

    // LEFT LEG
    { name: "Left Thigh", abbreviation: "LTHI", description: "Linker Oberschenkel.", landmark: "Femurschaft", section: "leg left" },
    { name: "Left Knee", abbreviation: "LKNE", description: "Linkes Knie (lateral).", landmark: "Epicondylus lateralis femoris", section: "leg left" },
    { name: "Left Tibia", abbreviation: "LTIB", description: "Linker Unterschenkel.", landmark: "Tibiaschaft", section: "leg left" },
    { name: "Left Ankle", abbreviation: "LANK", description: "Linkes Sprunggelenk (lateral).", landmark: "Malleolus lateralis", section: "leg left" },
    { name: "Left Toe", abbreviation: "LTOE", description: "Linker Vorfuß / Zehenbereich.", landmark: "Metatarsale II (Köpfchen)", section: "foot left" },
    { name: "Left Knee Medial", abbreviation: "LKNM", description: "Linke mediale Knie-Referenz (optional).", landmark: "Epicondylus medialis femoris", section: "leg left" },
    { name: "Left Medial Ankle", abbreviation: "LMED", description: "Linke mediale Sprunggelenksreferenz.", landmark: "Malleolus medialis", section: "leg left" },

    // RIGHT LEG
    { name: "Right Thigh", abbreviation: "RTHI", description: "Rechter Oberschenkel.", landmark: "Femurschaft", section: "leg right" },
    { name: "Right Knee", abbreviation: "RKNE", description: "Rechtes Knie (lateral).", landmark: "Epicondylus lateralis femoris", section: "leg right" },
    { name: "Right Tibia", abbreviation: "RTIB", description: "Rechter Unterschenkel.", landmark: "Tibiaschaft", section: "leg right" },
    { name: "Right Ankle", abbreviation: "RANK", description: "Rechtes Sprunggelenk (lateral).", landmark: "Malleolus lateralis", section: "leg right" },
    { name: "Right Toe", abbreviation: "RTOE", description: "Rechter Vorfuß / Zehenbereich.", landmark: "Metatarsale II (Köpfchen)", section: "foot right" },
    { name: "Right Knee Medial", abbreviation: "RKNM", description: "Rechte mediale Knie-Referenz (optional).", landmark: "Epicondylus medialis femoris", section: "leg right" },
    { name: "Right Medial Ankle", abbreviation: "RMED", description: "Rechte mediale Sprunggelenksreferenz.", landmark: "Malleolus medialis", section: "leg right" },

    // FEET BACK
    { name: "Left Heel", abbreviation: "LHEE", description: "Linke Ferse.", landmark: "Calcaneus", section: "foot back" },
    { name: "Right Heel", abbreviation: "RHEE", description: "Rechte Ferse.", landmark: "Calcaneus", section: "foot back" },
];