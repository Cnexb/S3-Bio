/**
 * True/False and fill-in-the-blank items from Ch 2 Cells concept checks (course notes).
 */

const TF_OPTS = [
  { key: "T", text: "True", textZh: "正確" },
  { key: "F", text: "False", textZh: "錯誤" },
];

const T = (value) => ({ type: "text", value });
const B = (accept) => ({ type: "blank", accept });

function fillLine(...segments) {
  return { segments };
}

function tf(id, section, stem, answer, hint) {
  return {
    id,
    format: "tf",
    section,
    difficulty: "Foundation",
    stem,
    options: TF_OPTS,
    answer,
    hint,
  };
}

function fill(id, section, stem, lines, hint, wordBank = []) {
  return {
    id,
    format: "fill",
    section,
    difficulty: "Foundation",
    stem,
    wordBank,
    lines,
    hint,
  };
}

const CELL_WORD_BANK = [
  "nucleus",
  "細胞核",
  "chloroplast",
  "葉綠體",
  "ribosome",
  "核糖體",
  "cell wall",
  "細胞壁",
  "prokaryotic",
  "原核",
  "eukaryotic",
  "真核",
  "cytoplasm",
  "細胞質",
  "mitochondria",
  "粒線體",
  "vacuole",
  "液泡",
  "cellulose",
  "纖維素",
  "aerobic respiration",
  "有氧呼吸",
  "DNA",
  "membrane-bound",
  "膜結構",
];

export const CELL_QUIZ_EXERCISES = [
  tf(
    "cell-tf-1",
    "cell-theory",
    "Cells are the smallest functioning units of life.",
    "T",
    "This is a core statement of the cell theory."
  ),
  tf(
    "cell-tf-2",
    "cell-theory",
    "All organisms consist of one or more cells.",
    "T",
    "Unicellular and multicellular organisms are both made of cells."
  ),
  tf(
    "cell-tf-3",
    "cell-types",
    "Prokaryotes have membrane-bound organelles.",
    "F",
    "Prokaryotes lack membrane-bound organelles such as a true nucleus, ER, and mitochondria."
  ),
  tf(
    "cell-tf-4",
    "cell-types",
    "Eukaryotic cells have a true nucleus.",
    "T",
    "Eukaryotic DNA is enclosed by a nuclear membrane."
  ),
  tf(
    "cell-tf-5",
    "organelles",
    "The cell wall is made of phospholipid bilayer.",
    "F",
    "The plant cell wall is made of cellulose, not phospholipid."
  ),
  tf(
    "cell-tf-6",
    "organelles",
    "Ribosomes are responsible for protein synthesis.",
    "T",
    "Ribosomes translate mRNA to build polypeptides."
  ),
  tf(
    "cell-tf-7",
    "organelles",
    "Vacuoles are larger and central in plant cells.",
    "T",
    "Plant cells typically have a large central vacuole for storage."
  ),
  tf(
    "cell-tf-8",
    "organelles",
    "The mitochondria are involved in aerobic respiration.",
    "T",
    "Mitochondria carry out aerobic respiration to release energy."
  ),
  tf(
    "cell-tf-9",
    "organelles",
    "Chloroplasts are present in animal cells.",
    "F",
    "Chloroplasts are found in plant cells (green parts), not animal cells."
  ),
  tf(
    "cell-tf-10",
    "organelles",
    "Cytoplasm is the site for cellular reactions.",
    "T",
    "The jelly-like cytoplasm is where many metabolic reactions occur."
  ),
  tf(
    "cell-tf-11",
    "organelles",
    "The nucleus controls the activities of the cell.",
    "T",
    "The nucleus contains DNA and controls protein synthesis and cell activities."
  ),
  tf(
    "cell-tf-12",
    "organelles",
    "The nucleolus makes ribosomes.",
    "T",
    "The nucleolus is the site of ribosome production."
  ),
  tf(
    "cell-tf-13",
    "cell-types",
    "DNA in prokaryotic cells is not enclosed by a nuclear membrane.",
    "T",
    "Prokaryotic DNA lies free in the cytoplasm without a true nucleus."
  ),
  tf(
    "cell-tf-14",
    "organelles",
    "The rough ER is responsible for lipid synthesis.",
    "F",
    "The rough ER is involved in protein synthesis and transport; lipid synthesis is mainly in smooth ER."
  ),
  tf(
    "cell-tf-15",
    "biomolecules",
    "The cell membrane is fully permeable.",
    "F",
    "The cell membrane is differentially permeable — it controls what enters and exits."
  ),
  tf(
    "cell-tf-16",
    "organelles",
    "The smooth ER is involved in lipid synthesis and transport.",
    "T",
    "Smooth ER synthesises and transports lipids."
  ),
  tf(
    "cell-tf-17",
    "cell-types",
    "Ribosomes are absent in prokaryotic cells.",
    "F",
    "Both prokaryotic and eukaryotic cells have ribosomes for protein synthesis."
  ),
  tf(
    "cell-tf-18",
    "cell-types",
    "Plant cells have a regular shape due to the cell wall.",
    "T",
    "The rigid cellulose cell wall gives plant cells a regular shape."
  ),
  tf(
    "cell-tf-19",
    "organelles",
    "Mitochondria have a double membrane.",
    "T",
    "Mitochondria are double-membrane organelles."
  ),
  tf(
    "cell-tf-20",
    "cell-types",
    "Prokaryotic cells are larger than eukaryotic cells.",
    "F",
    "Prokaryotic cells are much smaller than eukaryotic cells."
  ),

  fill(
    "cell-fill-1",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(B(["prokaryotic", "原核"]), T(" cells lack a true nucleus."))],
    "Prokaryotic cells have no true nucleus.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-2",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(B(["eukaryotic", "真核"]), T(" cells have a nuclear membrane."))],
    "Eukaryotic cells enclose DNA with a nuclear membrane.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-3",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(T("The "), B(["nucleus", "細胞核"]), T(" controls all cell activities."))],
    "The nucleus controls cell activities.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-4",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(T("The "), B(["ribosome", "核糖體"]), T(" is the site for protein synthesis."))],
    "Ribosomes synthesise proteins.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-5",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(T("The "), B(["mitochondria", "粒線體"]), T(" is responsible for aerobic respiration."))],
    "Mitochondria carry out aerobic respiration.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-6",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [
      fillLine(
        T("The "),
        B(["vacuole", "液泡"]),
        T(" stores water and dissolved substances in plant cells.")
      ),
    ],
    "Plant vacuoles store water and dissolved substances.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-7",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(T("The "), B(["cell wall", "細胞壁"]), T(" is made of cellulose in plant cells."))],
    "The plant cell wall is made of cellulose.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-8",
    "cell-types",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [
      fillLine(
        B(["eukaryotic", "真核"]),
        T(" cells, like human cells, have membrane-bound organelles.")
      ),
    ],
    "Human cells are eukaryotic with membrane-bound organelles.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-9",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(T("The "), B(["cytoplasm", "細胞質"]), T(" is jelly-like and is the site of reactions."))],
    "Cytoplasm is jelly-like and is the site of reactions.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-10",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(T("The "), B(["DNA"]), T(" contains genetic material in eukaryotic cells."))],
    "DNA in eukaryotes is the genetic material.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-11",
    "cell-types",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [
      fillLine(
        B(["membrane-bound", "膜結構"]),
        T(" organelles like the rough ER are absent in prokaryotic cells.")
      ),
    ],
    "Prokaryotes lack membrane-bound organelles such as rough ER.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-12",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [
      fillLine(
        T("The "),
        B(["chloroplast", "葉綠體"]),
        T(" is responsible for photosynthesis in plant cells.")
      ),
    ],
    "Chloroplasts carry out photosynthesis in plant cells.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-13",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [fillLine(B(["cellulose", "纖維素"]), T(" is the main component of the plant cell wall."))],
    "Cellulose is the main component of the plant cell wall.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-14",
    "organelles",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [
      fillLine(
        B(["aerobic respiration", "有氧呼吸"]),
        T(" is the process that requires oxygen for energy production.")
      ),
    ],
    "Aerobic respiration requires oxygen to release energy.",
    CELL_WORD_BANK
  ),
  fill(
    "cell-fill-15",
    "cell-types",
    "Fill in the blank — choose from the word bank (some words may be reused).",
    [
      fillLine(
        B(["prokaryotic", "原核"]),
        T(" cells are simpler in structure compared to eukaryotic cells.")
      ),
    ],
    "Prokaryotic cells are simpler than eukaryotic cells.",
    CELL_WORD_BANK
  ),
];
