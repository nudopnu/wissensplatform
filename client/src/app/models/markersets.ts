export type MarkerSetName = "pig" | "hbm2";

export type BodySection = "head" | "back" | "chest" | "arm left" | "arm right" | "hip front" | "hip back" | "leg left" | "leg right" | "foot right" | "foot left" | "foot back";

export type Marker = {
  name: string;
  abbreviation: string;
  description: string;
  landmark: string;
  section: BodySection;
  initOnly?: boolean;
};

export const pluginGaitMarkers: Marker[] = [
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
  { name: "Left PSIS", abbreviation: "LPSI", description: "Linker posterior superior iliac spine (direkt unterhalb der Iliosakralgelenke, wo die Wirbelsäule auf das Becken trifft)", landmark: "Spina iliaca posterior superior", section: "hip back" },
  { name: "Right PSIS", abbreviation: "RPSI", description: "Rechter posterior superior iliac spine (direkt unterhalb der Iliosakralgelenke, wo die Wirbelsäule auf das Becken trifft)", landmark: "Spina iliaca posterior superior", section: "hip back" },
  { name: "Left ASIS", abbreviation: "LASI", description: "Linker anterior superior iliac spine", landmark: "Spina iliaca anterior superior", section: "hip front" },
  { name: "Right ASIS", abbreviation: "RASI", description: "Rechter anterior superior iliac spine", landmark: "Spina iliaca anterior superior", section: "hip front" },

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

export const hbm2Markers: Marker[] = [
  // Kopf
  { name: "Left Head", abbreviation: "LHEAD", description: "Über dem linken Ohr, mittig", landmark: "Just above ear, middle", section: "head", initOnly: false },
  { name: "Right Head", abbreviation: "RHEAD", description: "Über dem rechten Ohr, mittig", landmark: "Just above ear, middle", section: "head", initOnly: false },
  { name: "Top Head", abbreviation: "THEAD", description: "Auf dem Kopf, in Linie mit LHEAD und RHEAD", landmark: "On top of head, aligned with LHEAD and RHEAD", section: "head", initOnly: false },
  { name: "Forehead", abbreviation: "FHEAD", description: "Stirn, leicht links der Mitte", landmark: "On forehead, slightly left of center", section: "head", initOnly: false },

  // Brust
  { name: "Jugular Notch", abbreviation: "JN", description: "Drosselgrube am Brustbein", landmark: "Jugular notch of sternum", section: "chest", initOnly: false },
  { name: "Xiphoid Process", abbreviation: "XIPH", description: "Schwertfortsatz des Brustbeins", landmark: "Xiphoid process of sternum", section: "chest", initOnly: false },

  // Rücken
  { name: "C7", abbreviation: "C7", description: "7. Halswirbel", landmark: "7th cervical vertebra", section: "back", initOnly: false },
  { name: "T10", abbreviation: "T10", description: "10. Brustwirbel", landmark: "10th thoracic vertebra", section: "back", initOnly: false },

  // Rechter Arm
  { name: "Right Shoulder", abbreviation: "RSHO", description: "Auf dem Akromion", landmark: "Top of acromion", section: "arm right", initOnly: false },
  { name: "Right Deltoid", abbreviation: "RDELT", description: "Spitze des Deltamuskels", landmark: "Apex of deltoid muscle", section: "arm right", initOnly: false },
  { name: "Right Lateral Elbow", abbreviation: "RLEE", description: "Lateraler Epikondylus", landmark: "Lateral epicondyle of elbow", section: "arm right", initOnly: false },
  { name: "Right Medial Elbow", abbreviation: "RMEE", description: "Medialer Epikondylus", landmark: "Medial epicondyle of elbow", section: "arm right", initOnly: false },
  { name: "Right Medial Wrist", abbreviation: "RMW", description: "Processus styloideus radius (Daumenseite)", landmark: "Radial styloid process", section: "arm right", initOnly: false },
  { name: "Right Lateral Wrist", abbreviation: "RLW", description: "Processus styloideus ulnae (Kleinfingerseite)", landmark: "Ulnar styloid process", section: "arm right", initOnly: false },
  { name: "Right Forearm", abbreviation: "RFRM", description: "Mitte zwischen RLEE und RMW", landmark: "Midpoint RLEE–RMW", section: "arm right", initOnly: false },
  { name: "Right Fingers", abbreviation: "RFIN", description: "Zentrum der Hand (Metakarpale 3)", landmark: "Caput metacarpal 3", section: "arm right", initOnly: false },

  // Linker Arm
  { name: "Left Shoulder", abbreviation: "LSHO", description: "Auf dem Akromion", landmark: "Top of acromion", section: "arm left", initOnly: false },
  { name: "Left Deltoid", abbreviation: "LDELT", description: "Spitze des Deltamuskels", landmark: "Apex of deltoid muscle", section: "arm left", initOnly: false },
  { name: "Left Lateral Elbow", abbreviation: "LLEE", description: "Lateraler Epikondylus", landmark: "Lateral epicondyle of elbow", section: "arm left", initOnly: false },
  { name: "Left Medial Elbow", abbreviation: "LMEE", description: "Medialer Epikondylus", landmark: "Medial epicondyle of elbow", section: "arm left", initOnly: false },
  { name: "Left Medial Wrist", abbreviation: "LMW", description: "Processus styloideus radius (Daumenseite)", landmark: "Radial styloid process", section: "arm left", initOnly: false },
  { name: "Left Lateral Wrist", abbreviation: "LLW", description: "Processus styloideus ulnae (Kleinfingerseite)", landmark: "Ulnar styloid process", section: "arm left", initOnly: false },
  { name: "Left Forearm", abbreviation: "LFRM", description: "Mitte zwischen LLEE und LMW", landmark: "Midpoint LLEE–LMW", section: "arm left", initOnly: false },
  { name: "Left Fingers", abbreviation: "LFIN", description: "Zentrum der Hand (Metakarpale 3)", landmark: "Caput metacarpal 3", section: "arm left", initOnly: false },

  // Hüfte hinten
  { name: "Left PSIS", abbreviation: "LPSIS", description: "Linke hintere obere Darmbeinstachel", landmark: "Left posterior superior iliac spine", section: "hip back", initOnly: false },
  { name: "Right PSIS", abbreviation: "RPSIS", description: "Rechte hintere obere Darmbeinstachel", landmark: "Right posterior superior iliac spine", section: "hip back", initOnly: false },

  // Hüfte vorne
  { name: "Left ASIS", abbreviation: "LASIS", description: "Linke vordere obere Darmbeinstachel", landmark: "Left anterior superior iliac spine", section: "hip front", initOnly: false },
  { name: "Right ASIS", abbreviation: "RASIS", description: "Rechte vordere obere Darmbeinstachel", landmark: "Right anterior superior iliac spine", section: "hip front", initOnly: false },

  // Rechtes Bein
  { name: "Right Thigh (Lateral)", abbreviation: "RLTHI", description: "Mitte zwischen Trochanter major und Knie", landmark: "Midpoint hip–knee", section: "leg right", initOnly: false },
  { name: "Right Lateral Knee", abbreviation: "RLEK", description: "Lateraler Knieepikondylus", landmark: "Lateral epicondyle of knee", section: "leg right", initOnly: false },
  { name: "Right Medial Knee", abbreviation: "RMEK", description: "Medialer Knieepikondylus (optional)", landmark: "Medial epicondyle of knee", section: "leg right", initOnly: true },
  { name: "Right Shank (Lateral)", abbreviation: "RLSHA", description: "Mitte zwischen Knie und Sprunggelenk", landmark: "Midpoint knee–ankle", section: "leg right", initOnly: false },
  { name: "Right Lateral Malleolus", abbreviation: "RLM", description: "Außenseite Sprunggelenk", landmark: "Lateral malleolus", section: "leg right", initOnly: false },
  { name: "Right Medial Malleolus", abbreviation: "RMM", description: "Innenseite Sprunggelenk (optional)", landmark: "Medial malleolus", section: "leg right", initOnly: true },
  { name: "Right 2nd Metatarsal", abbreviation: "RMT2", description: "Kopf des 2. Mittelfußknochens", landmark: "2nd metatarsal head", section: "leg right", initOnly: false },
  { name: "Right 5th Metatarsal", abbreviation: "RMT5", description: "Kopf des 5. Mittelfußknochens", landmark: "5th metatarsal head", section: "leg right", initOnly: false },

  // Linkes Bein
  { name: "Left Thigh (Lateral)", abbreviation: "LLTHI", description: "Mitte zwischen Trochanter major und Knie", landmark: "Midpoint hip–knee", section: "leg left", initOnly: false },
  { name: "Left Lateral Knee", abbreviation: "LLEK", description: "Lateraler Knieepikondylus", landmark: "Lateral epicondyle of knee", section: "leg left", initOnly: false },
  { name: "Left Medial Knee", abbreviation: "LMEK", description: "Medialer Knieepikondylus (optional)", landmark: "Medial epicondyle of knee", section: "leg left", initOnly: true },
  { name: "Left Shank (Lateral)", abbreviation: "LLSHA", description: "Mitte zwischen Knie und Sprunggelenk", landmark: "Midpoint knee–ankle", section: "leg left", initOnly: false },
  { name: "Left Lateral Malleolus", abbreviation: "LLM", description: "Außenseite Sprunggelenk", landmark: "Lateral malleolus", section: "leg left", initOnly: false },
  { name: "Left Medial Malleolus", abbreviation: "LMM", description: "Innenseite Sprunggelenk (optional)", landmark: "Medial malleolus", section: "leg left", initOnly: true },
  { name: "Left 2nd Metatarsal", abbreviation: "LMT2", description: "Kopf des 2. Mittelfußknochens", landmark: "2nd metatarsal head", section: "leg left", initOnly: false },
  { name: "Left 5th Metatarsal", abbreviation: "LMT5", description: "Kopf des 5. Mittelfußknochens", landmark: "5th metatarsal head", section: "leg left", initOnly: false },

  { name: "Right Heel", abbreviation: "RHEE", description: "Zentrum der Ferse", landmark: "Center of heel", section: "foot back", initOnly: false },
  { name: "Left Heel", abbreviation: "LHEE", description: "Zentrum der Ferse", landmark: "Center of heel", section: "foot back", initOnly: false },
];