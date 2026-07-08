/** Ch 2 Cells — flashcard deck (37 concept cards) */
export const FLASHCARD_SUBTITLE = "HKDSE Biology · Cell theory, organelles & cell types";
export const FLASHCARD_TAGS = ["Biology", "Cells", "Organelles", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Subtopic 1: Cell Theory
  {
    id: 1,
    subtopic: "Cell Theory",
    front: "According to the <strong>cell theory</strong> (細胞學說), what are cells?",
    back: "The <strong>smallest functioning units of life</strong> (生命的最小功能單位).",
    image: "./assets/ch2/doc_img02.png",
    imageAlt: "Robert Hooke's cork cells — the smallest units of life",
  },
  {
    id: 2,
    subtopic: "Cell Theory",
    front: "Can a single cell perform all characteristics of life?",
    back: "<strong>Yes</strong> — a cell can perform all <strong>seven characteristics of life</strong>.",
  },
  {
    id: 3,
    subtopic: "Cell Theory",
    front: "What do <strong>all organisms</strong> consist of?",
    back: "<strong>One or more cells</strong> (一個或多個細胞).",
  },
  {
    id: 4,
    subtopic: "Cell Theory",
    front: "Define <strong>unicellular</strong> (單細胞) and <strong>multicellular</strong> (多細胞) organisms.",
    back: "<strong>Unicellular</strong> = one cell only; <strong>multicellular</strong> = many cells working together.",
  },
  {
    id: 5,
    subtopic: "Cell Theory",
    front: "Where do new cells come from?",
    back: "Cells arise from <strong>pre-existing cells</strong> (e.g. <strong>cell division</strong> 細胞分裂).",
  },
  {
    id: 6,
    subtopic: "Cell Theory",
    front: "Who discovered cells and from what material?",
    back: "<strong>Robert Hooke</strong> (羅拔·虎克) observed <strong>cork tissue</strong> (軟木組織) — actually <strong>dead cells</strong> that looked like tiny rooms (“牢房”).",
    image: "./assets/ch2/doc_img01.png",
    imageAlt: "Robert Hooke and cork cell observations",
    backSize: "normal",
  },
  {
    id: 7,
    subtopic: "Cell Theory",
    front: "Are <strong>viruses</strong> (病毒) considered cells?",
    back: "<strong>No</strong> — viruses are <strong>not cells</strong>!",
  },

  // Subtopic 2: Light Microscope
  {
    id: 8,
    subtopic: "Light Microscope",
    front: "What is the function of the <strong>eyepieces</strong> (目鏡)?",
    back: "They <strong>magnify</strong> (放大) the image.",
    image: "./assets/ch2/doc_img06.png",
    imageAlt: "Light microscope — eyepieces magnify the image",
  },
  {
    id: 9,
    subtopic: "Light Microscope",
    front: "How do <strong>objective lenses</strong> (物鏡) relate to magnification?",
    back: "They magnify the image — <strong>longer lenses = higher magnification</strong>.",
  },
  {
    id: 10,
    subtopic: "Light Microscope",
    front: "What do <strong>stage clips</strong> (載物夾) and the <strong>stage</strong> (載物台) do?",
    back: "They <strong>hold the slide</strong> (載玻片) in place.",
  },
  {
    id: 11,
    subtopic: "Light Microscope",
    front: "What is the function of the <strong>condenser</strong> (聚光器)?",
    back: "It <strong>focuses light</strong> on the specimen (標本).",
  },
  {
    id: 12,
    subtopic: "Light Microscope",
    front: "What image orientation do you see under a light microscope?",
    back: "An <strong>inverted image</strong> (倒像) — upside down and reversed.",
    image: "./assets/ch2/inverted-image-microscope.png",
    imageAlt: "Inverted image — naked eye (upright e), low power (inverted e), high power (magnified view)",
  },

  // Subtopic 3: Biomolecules & Cell Membrane
  {
    id: 13,
    subtopic: "Biomolecules & Cell Membrane",
    front: "What is the function of <strong>glucose</strong> (葡萄糖)?",
    back: "Main <strong>respiratory fuel</strong> (呼吸作用) for quick energy.",
  },
  {
    id: 14,
    subtopic: "Biomolecules & Cell Membrane",
    front: "What is the function of <strong>starch</strong> (澱粉) in plants?",
    back: "<strong>Energy storage</strong> in plants.",
  },
  {
    id: 15,
    subtopic: "Biomolecules & Cell Membrane",
    front: "What is the function of <strong>cellulose</strong> (纖維素)?",
    back: "<strong>Structural component</strong> in the <strong>plant cell wall</strong> (細胞壁).",
  },
  {
    id: 16,
    subtopic: "Biomolecules & Cell Membrane",
    front: "What is a <strong>phospholipid</strong> (磷脂質) made of?",
    back: "<strong>Phosphate</strong> (磷) + <strong>glycerol</strong> (甘油) + <strong>2 fatty acids</strong> (脂肪酸).",
  },
  {
    id: 17,
    subtopic: "Biomolecules & Cell Membrane",
    front: "What is the main role of <strong>phospholipids</strong> in cells?",
    back: "Main component of <strong>cell membranes</strong> (細胞膜).",
    image: "./assets/ch2/cell-membrane-fluid-mosaic.png",
    imageAlt: "Fluid mosaic model — phospholipids, proteins, carbohydrates, and cholesterol in the cell membrane",
  },
  {
    id: 18,
    subtopic: "Biomolecules & Cell Membrane",
    front: "What is the function of <strong>cholesterol</strong> (膽固醇) in cell membranes?",
    back: "Helps to <strong>stabilize</strong> (穩定) cell membranes.",
    image: "./assets/ch2/cell-membrane-cholesterol.png",
    imageAlt: "Cell membrane fluid mosaic model — cholesterol highlighted between phospholipid tails",
  },
  {
    id: 19,
    subtopic: "Biomolecules & Cell Membrane",
    front: "Give <strong>three functions of proteins</strong> (蛋白質) related to cells.",
    back: "<strong>Growth and repair</strong> (修復) of tissues; found in <strong>cell membranes</strong>; <strong>enzymes</strong> (酶) speed up reactions; most <strong>hormones</strong> (荷爾蒙).",
    backSize: "small",
  },
  {
    id: 20,
    subtopic: "Biomolecules & Cell Membrane",
    front: "What does the <strong>cell membrane</strong> mainly consist of?",
    back: "<strong>Phospholipid bilayer</strong> (磷脂雙層) with <strong>embedded proteins</strong> (嵌入蛋白質).",
  },

  // Subtopic 4: Organelles
  {
    id: 21,
    subtopic: "Organelles",
    front: "State the structure and function of the <strong>cell membrane</strong> (細胞膜).",
    back: "<strong>Single</strong> membrane of phospholipid bilayer & proteins; <strong>differentially permeable</strong> (差異滲透性) — controls movement of substances in and out.",
    backSize: "normal",
  },
  {
    id: 22,
    subtopic: "Organelles",
    front: "State the structure and function of the <strong>cell wall</strong> (細胞壁).",
    back: "Made of <strong>cellulose</strong> (纖維素); <strong>fully permeable</strong>; provides <strong>structural support and protection</strong>. (Plant cells only)",
    backSize: "normal",
  },
  {
    id: 23,
    subtopic: "Organelles",
    front: "What is the <strong>cytoplasm</strong> (細胞質)?",
    back: "<strong>Jelly-like</strong> (果凍狀) fluid of water & dissolved substances; <strong>site for reactions</strong>.",
  },
  {
    id: 24,
    subtopic: "Organelles",
    front: "What is the function of the <strong>vacuole</strong> (液泡) in plant cells?",
    back: "<strong>Large, central</strong> vacuole filled with water + dissolved substances (e.g. minerals).",
  },
  {
    id: 25,
    subtopic: "Organelles",
    front: "What is the function of the <strong>nucleus</strong> (細胞核)?",
    back: "<strong>Double nuclear membrane</strong>; contains <strong>DNA</strong> (genetic material); <strong>controls cell activities</strong> (including protein synthesis 合成).",
    backSize: "normal",
  },
  {
    id: 26,
    subtopic: "Organelles",
    front: "What is the function of the <strong>nucleolus</strong> (核仁)?",
    back: "Makes <strong>ribosomes</strong> (核糖體).",
  },
  {
    id: 27,
    subtopic: "Organelles",
    front: "What is the function of <strong>ribosomes</strong> (核糖體)?",
    back: "<strong>Protein synthesis</strong> (蛋白質合成).",
  },
  {
    id: 28,
    subtopic: "Organelles",
    front: "What is the function of <strong>rough ER</strong> (粗面內質網)?",
    back: "<strong>Single</strong> membrane; <strong>protein synthesis and transport</strong>.",
  },
  {
    id: 29,
    subtopic: "Organelles",
    front: "What is the function of <strong>smooth ER</strong> (滑面內質網)?",
    back: "<strong>Single</strong> membrane; <strong>lipid synthesis and transport</strong>.",
  },
  {
    id: 30,
    subtopic: "Organelles",
    front: "What is the function of <strong>mitochondria</strong> (粒線體)?",
    back: "<strong>Double</strong> membrane; <strong>aerobic respiration</strong> (需氧呼吸, needs oxygen) for <strong>energy</strong>.",
  },
  {
    id: 31,
    subtopic: "Organelles",
    front: "What is the function of <strong>chloroplasts</strong> (葉綠體)?",
    back: "<strong>Double</strong> membrane; <strong>photosynthesis</strong> → food (glucose), stores starch granules; contains <strong>chlorophyll</strong> (葉綠素) that absorbs light.",
  },

  // Subtopic 5: Prokaryotes vs Eukaryotes
  {
    id: 32,
    subtopic: "Prokaryotes vs Eukaryotes",
    front: "Do <strong>prokaryotes</strong> (原核生物) have a true nucleus?",
    back: "<strong>No true nucleus</strong> — DNA lies <strong>free in the cytoplasm</strong>.",
    image: "./assets/ch2/prokaryotic-cells.png",
    imageAlt: "Prokaryotic cells 原核細胞 — genetic material (DNA), ribosomes, cytoplasm, cell membrane, cell wall, capsule, flagellum",
  },
  {
    id: 33,
    subtopic: "Prokaryotes vs Eukaryotes",
    front: "Where is DNA located in <strong>eukaryotic</strong> (真核生物) cells?",
    back: "DNA is <strong>bounded by a nuclear membrane</strong> inside the nucleus.",
  },
  {
    id: 34,
    subtopic: "Prokaryotes vs Eukaryotes",
    front: "Do prokaryotes have <strong>membrane-bound organelles</strong> (膜性胞器)?",
    back: "<strong>No</strong> — e.g. no ER, vacuole, mitochondria, or chloroplast.",
  },
  {
    id: 35,
    subtopic: "Prokaryotes vs Eukaryotes",
    front: "Where are <strong>ribosomes</strong> found in prokaryotes vs eukaryotes?",
    back: "Prokaryotes: <strong>free in cytoplasm</strong>. Eukaryotes: some free, some <strong>bound to rough ER</strong>.",
  },
  {
    id: 36,
    subtopic: "Prokaryotes vs Eukaryotes",
    front: "Is the <strong>cell wall</strong> always present in animal cells?",
    back: "<strong>Always absent</strong> in animal cells (present in plant cells; some prokaryotes & fungi 真菌 also have cell walls).",
    backSize: "normal",
  },
  {
    id: 37,
    subtopic: "Prokaryotes vs Eukaryotes",
    front: "Which cells have <strong>chloroplasts</strong>? Give the colour rule.",
    back: "<strong>Plant cells</strong> in <strong>green parts</strong> only — non-green parts (e.g. <strong>onion</strong> 洋蔥) have <strong>no chloroplasts</strong>. Animal cells have <strong>no chloroplasts</strong>.",
    backSize: "normal",
    backImages: [
      {
        src: "./assets/ch2/doc_img05.jpeg",
        alt: "Plant cells with chloroplasts — green parts contain chloroplasts",
      },
      {
        src: "./assets/ch2/doc_img06.png",
        alt: "Onion epidermal cells — no chloroplasts in non-green parts",
      },
    ],
  },
];
export const FLASHCARD_DECK_SIZE = FLASHCARD_DECK.length;
