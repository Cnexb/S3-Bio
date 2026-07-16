/**
 * True/False and fill-in-the-blank items from Ch 5 Food & Nutrition concept checks (course PDF).
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

const BASICS_WORD_BANK = [
  "condensation",
  "hydrolysis",
  "carbohydrates",
  "proteins",
  "lipids",
  "amino acid",
  "denature",
  "triglyceride",
  "polypeptide",
  "3D conformation",
];

const DETAILS_WORD_BANK = [
  "glycogen",
  "starch",
  "glucose",
  "enzymes",
  "proteins",
  "fructose",
  "lactose",
  "triglycerides",
  "phospholipids",
  "cellulose",
  "growth",
  "amino acids",
];

export const FOOD_NUTRITION_QUIZ_EXERCISES = [
  // —— Biomolecule basics T/F ——
  tf("fn-tf-1", "biomolecule-basics", "Hydrolysis breaks bonds in molecules.", "T", "Hydrolysis uses water to break covalent bonds."),
  tf("fn-tf-2", "biomolecule-basics", "Denaturation is a reversible process.", "F", "Denaturation is irreversible — the specific 3D conformation is lost permanently."),
  tf("fn-tf-3", "biomolecule-basics", "Proteins are made of amino acids.", "T", "Amino acids are the monomers joined to form proteins."),
  tf("fn-tf-4", "biomolecule-basics", "Lipids are hydrophilic molecules.", "F", "Lipids are hydrophobic — they do not dissolve readily in water."),
  tf("fn-tf-5", "biomolecule-basics", "Triglycerides are formed by condensation reactions.", "T", "Glycerol and three fatty acids join by condensation to form a triglyceride."),
  tf("fn-tf-6", "biomolecule-basics", "Carbohydrates provide energy for the body.", "T", "Carbohydrates are the main energy source for respiration."),
  tf("fn-tf-7", "biomolecule-basics", "Proteins are usually absent in the human body.", "F", "Proteins are abundant — enzymes, hormones, membranes, and tissues."),
  tf("fn-tf-8", "biomolecule-basics", "Butter is rich in carbohydrates.", "F", "Butter is rich in lipids (fats), not carbohydrates."),
  tf("fn-tf-9", "biomolecule-basics", "Hydrolysis requires water to break bonds.", "T", "Water participates in hydrolysis to split molecules."),
  tf("fn-tf-10", "biomolecule-basics", "Lipids are used to form cell membranes.", "T", "Phospholipids (lipids) are the main structural component of membranes."),
  tf("fn-tf-11", "biomolecule-basics", "Condensation produces water as a by-product.", "T", "Condensation joins smaller molecules and releases water."),
  tf("fn-tf-12", "biomolecule-basics", "Amino acids are the building blocks of proteins.", "T", "Proteins are polymers of amino acids."),
  tf("fn-tf-13", "biomolecule-basics", "Starch is a form of stored glucose in plants.", "T", "Plants store glucose as the polysaccharide starch."),
  tf("fn-tf-14", "biomolecule-basics", "Triglycerides are broken down into glycerol and fatty acids.", "T", "Hydrolysis of triglycerides yields glycerol and three fatty acids."),
  tf("fn-tf-15", "biomolecule-basics", "Proteins are inactive when denatured.", "T", "Denatured proteins lose their specific 3D conformation and function."),

  fill(
    "fn-fill-basics",
    "biomolecule-basics",
    "Fill in the blanks — biomolecule basics",
    [
      fillLine(T("1. "), B(["hydrolysis", "Hydrolysis"]), T(" is the process that breaks down a molecule using water.")),
      fillLine(T("2. "), B(["condensation", "Condensation"]), T(" reactions join smaller molecules to form larger ones.")),
      fillLine(T("3. "), B(["carbohydrates", "Carbohydrates"]), T(" are the main energy source for the body.")),
      fillLine(T("4. "), B(["proteins", "Proteins"]), T(" are made up of amino acids.")),
      fillLine(T("5. A "), B(["triglyceride", "Triglyceride"]), T(" is formed by three fatty acids and glycerol.")),
      fillLine(T("6. A "), B(["polypeptide", "Polypeptide"]), T(" is a chain of amino acids.")),
      fillLine(T("7. Proteins lose their "), B(["3D conformation", "3d conformation"]), T(" when they denature.")),
      fillLine(T("8. "), B(["amino acid", "Amino acid"]), T(" is the building block of proteins.")),
      fillLine(T("9. "), B(["lipids", "Lipids"]), T(" are insoluble in water and used for energy storage.")),
      fillLine(T("10. A protein's specific function depends on its "), B(["3D conformation", "3d conformation"]), T(".")),
      fillLine(T("11. "), B(["hydrolysis", "Hydrolysis"]), T(" reactions are required to break down triglycerides.")),
      fillLine(T("12. "), B(["condensation", "Condensation"]), T(" is the process that forms a dipeptide from two amino acids.")),
      fillLine(T("13. "), B(["carbohydrates", "Carbohydrates"]), T(" are organic molecules that include sugars and starches.")),
      fillLine(T("14. "), B(["denature", "Denature"]), T(" refers to the loss of a protein's functional shape.")),
      fillLine(T("15. "), B(["proteins", "Proteins"]), T(" are used to build tissues and enzymes in the body.")),
    ],
    "Word bank: condensation, hydrolysis, carbohydrates, proteins, lipids, amino acid, denature, triglyceride, polypeptide, 3D conformation.",
    BASICS_WORD_BANK
  ),

  // —— Functions & food sources T/F ——
  tf("fn-tf-16", "biomolecule-details", "Glucose is a monosaccharide.", "T", "Glucose is a single sugar unit — a monosaccharide."),
  tf("fn-tf-17", "biomolecule-details", "Proteins are used for energy storage in the body.", "F", "Lipids are primarily used for energy storage; proteins are for growth, repair, and enzymes."),
  tf("fn-tf-18", "biomolecule-details", "Cellulose is found in the cell walls of plants.", "T", "Cellulose is the structural polysaccharide in plant cell walls."),
  tf("fn-tf-19", "biomolecule-details", "Glycogen is stored in the liver and muscles.", "T", "Glycogen is the animal storage form of glucose."),
  tf("fn-tf-20", "biomolecule-details", "Lipids are the main source of quick energy in humans.", "F", "Carbohydrates (especially glucose) are the main quick energy source."),
  tf("fn-tf-21", "biomolecule-details", "Enzymes are proteins that speed up chemical reactions.", "T", "Enzymes are biological catalysts — a type of protein."),
  tf("fn-tf-22", "biomolecule-details", "Fructose is a disaccharide found in fruits.", "F", "Fructose is a monosaccharide — the fruit sugar."),
  tf("fn-tf-23", "biomolecule-details", "Starch is a storage carbohydrate in plants.", "T", "Plants store glucose as starch."),
  tf("fn-tf-24", "biomolecule-details", "Phospholipids are the main components of cell membranes.", "T", "The phospholipid bilayer forms the basic membrane structure."),
  tf("fn-tf-25", "biomolecule-details", "Proteins are required for growth and repair in humans.", "T", "Proteins are essential for tissue growth and repair."),
  tf("fn-tf-26", "biomolecule-details", "Steroids are a type of lipid that acts as a hormone.", "T", "Steroid hormones (e.g. sex hormones) are lipid-based."),
  tf("fn-tf-27", "biomolecule-details", "Maltose is a monosaccharide.", "F", "Maltose is a disaccharide made of two glucose units."),
  tf("fn-tf-28", "biomolecule-details", "Glycogen is the stored form of glucose in plants.", "F", "Glycogen is stored in animals; plants store starch."),
  tf("fn-tf-29", "biomolecule-details", "Non-green parts of plants, like potatoes, store starch.", "T", "Potatoes and grains store energy as starch."),
  tf("fn-tf-30", "biomolecule-details", "Lactose is a carbohydrate found in milk.", "T", "Lactose is the disaccharide sugar in milk."),

  fill(
    "fn-fill-details",
    "biomolecule-details",
    "Fill in the blanks — functions & food sources",
    [
      fillLine(T("The main carbohydrate stored in animals is "), B(["glycogen", "Glycogen"]), T(".")),
      fillLine(T("1. "), B(["cellulose", "Cellulose"]), T(" is the carbohydrate stored in plant cell walls.")),
      fillLine(T("2. Milk contains "), B(["lactose", "Lactose"]), T(", a disaccharide.")),
      fillLine(T("3. "), B(["enzymes", "Enzymes"]), T(" are used to speed up chemical reactions in the body.")),
      fillLine(T("4. The stored form of glucose in plants is "), B(["starch", "Starch"]), T(".")),
      fillLine(T("5. "), B(["glucose", "Glucose"]), T(" is a monosaccharide that provides quick energy.")),
      fillLine(T("6. The main lipid component of cell membranes is "), B(["phospholipids", "Phospholipids"]), T(".")),
      fillLine(T("7. "), B(["fructose", "Fructose"]), T(" is a carbohydrate found in fruits.")),
      fillLine(T("8. Proteins are essential for "), B(["growth", "Growth"]), T(" and repair of tissues.")),
      fillLine(T("9. "), B(["triglycerides", "Triglycerides"]), T(" is a lipid used for energy storage and insulation.")),
      fillLine(T("10. "), B(["glucose", "Glucose"]), T(" is a carbohydrate used by athletes for quick energy.")),
      fillLine(T("11. "), B(["glycogen", "Glycogen"]), T(" is the storage carbohydrate in the liver and muscles.")),
      fillLine(T("12. "), B(["lactose", "Lactose"]), T(" is the carbohydrate found in milk.")),
      fillLine(T("13. "), B(["amino acids", "Amino acids"]), T(" are the building blocks of proteins.")),
      fillLine(T("14. "), B(["cellulose", "Cellulose"]), T(" is the structural carbohydrate found in plant cell walls.")),
    ],
    "Word bank: glycogen, starch, glucose, enzymes, proteins, fructose, lactose, triglycerides, phospholipids, cellulose, growth, amino acids.",
    DETAILS_WORD_BANK
  ),
];
