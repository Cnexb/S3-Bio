/** Ch 4 Enzymes — flashcard deck (30 cards) */
export const FLASHCARD_SUBTITLE = "HKDSE Biology · Enzyme definitions & diagrams";
export const FLASHCARD_TAGS = ["Biology", "Enzymes", "Catalysis", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Subtopic 1: Enzyme Basics
  {
    id: 1,
    subtopic: "Enzyme Basics",
    front: "What are <strong>enzymes</strong> (酶)?",
    back: "<strong>Proteins</strong> (蛋白質) that <strong>catalyze</strong> (催化) chemical reactions.",
  },
  {
    id: 2,
    subtopic: "Enzyme Basics",
    front: "How do enzymes speed up reactions?",
    back: "By <strong>lowering activation energy</strong> (活化能).",
    image: "./assets/activation-energy.png",
    imageAlt: "Activation energy diagram — with enzymes (red) vs without enzymes (blue)",
  },
  {
    id: 3,
    subtopic: "Enzyme Basics",
    front: "Are enzymes <strong>consumed</strong> in a reaction?",
    back: "<strong>No</strong> — they <strong>remain unchanged</strong> after releasing products and can be reused.",
    image: "./assets/maltose-action-cycle.png",
    imageAlt: "Maltase action cycle — enzyme unchanged after products are released",
  },
  {
    id: 4,
    subtopic: "Enzyme Basics",
    front: "What determines an enzyme's <strong>3D conformation</strong> (構象)?",
    back: "The <strong>amino acid sequence</strong> (胺基酸序列).",
    image: "./assets/protein-3d.png",
    imageAlt: "Polypeptide chain folds into a 3D protein structure",
  },
  {
    id: 5,
    subtopic: "Enzyme Basics",
    front: "How are <strong>proteins</strong> (蛋白質) formed from amino acids?",
    back: "One or more <strong>polypeptides</strong> (多肽) formed by <strong>condensation</strong> (縮合), then <strong>folding</strong> held by <strong>hydrogen bonds</strong> between amino acids.",
    image: "./assets/protein-3d.png",
    imageAlt: "Polypeptide chain folds into a 3D protein structure",
    backSize: "large",
  },
  {
    id: 6,
    subtopic: "Enzyme Basics",
    front: "Enzymes are <strong>specific</strong> (獨特) to their —?",
    back: "Their <strong>substrates</strong> (底物) — the active site has a complementary shape.",
    image: "./assets/lock-and-key.png",
    imageAlt: "Lock-and-key model — substrate fits the enzyme active site",
  },

  // Subtopic 2: Enzyme Mechanism
  {
    id: 7,
    subtopic: "Enzyme Mechanism",
    front: "State the <strong>3 steps</strong> of enzyme action.",
    back: "(1) Substrate binds <strong>active site</strong> by collision<br>(2) <strong>Enzyme-substrate complex</strong> forms<br>(3) Products released; <strong>enzyme unchanged</strong>",
    image: "./assets/maltose-action-cycle.png",
    imageAlt: "Maltase action cycle — substrate binding, complex formation, product release",
    backSize: "small",
  },
  {
    id: 8,
    subtopic: "Enzyme Mechanism",
    front: "What is the <strong>substrate</strong> for <strong>maltase</strong> (麥芽糖酶)?",
    back: "<strong>Maltose</strong> (麥芽糖).",
    image: "./assets/maltose-action-cycle.png",
    imageAlt: "Maltose substrate binding to maltase active site",
  },
  {
    id: 9,
    subtopic: "Enzyme Mechanism",
    front: "What are the <strong>products</strong> when maltase breaks down maltose?",
    back: "<strong>Two glucose</strong> molecules (葡萄糖).",
    image: "./assets/maltose-action-cycle.png",
    imageAlt: "Maltase breaks maltose into two glucose molecules",
  },
  {
    id: 10,
    subtopic: "Enzyme Mechanism",
    front: "Write the <strong>hydrolysis</strong> (水解) equation for maltose breakdown by maltase.",
    back: "<strong>Maltose + water → glucose + glucose</strong> (catalysed by maltase).",
    image: "./assets/maltose-hydrolysis.png",
    imageAlt: "Maltose hydrolysis — water breaks maltose into two glucose molecules",
  },
  {
    id: 11,
    subtopic: "Enzyme Mechanism",
    front: "What is the role of <strong>water</strong> in the enzymatic breakdown of maltose?",
    back: "Water is a <strong>substrate</strong> that participates in <strong>hydrolysis</strong> to break the bond.",
    image: "./assets/maltose-hydrolysis.png",
    imageAlt: "Water participates in maltose hydrolysis to break the glycosidic bond",
  },

  // Subtopic 3: Types of Enzymes
  {
    id: 12,
    subtopic: "Types of Enzymes",
    front: "What do <strong>carbohydrases</strong> (碳水化合物酶) catalyze?",
    back: "<strong>Condensation</strong> (縮合) / <strong>hydrolysis</strong> (水解) of <strong>carbohydrates</strong>.",
  },
  {
    id: 13,
    subtopic: "Types of Enzymes",
    front: "What does <strong>lipase</strong> (脂肪酶) catalyze?",
    back: "<strong>Condensation</strong> / <strong>hydrolysis</strong> of <strong>lipids</strong> (脂質).",
  },
  {
    id: 14,
    subtopic: "Types of Enzymes",
    front: "What do <strong>proteases</strong> (蛋白酶) catalyze?",
    back: "<strong>Condensation</strong> / <strong>hydrolysis</strong> of <strong>proteins</strong> (蛋白質).",
  },
  {
    id: 15,
    subtopic: "Types of Enzymes",
    front: "Since enzymes are <strong>proteins</strong>, they can be broken down by —?",
    back: "<strong>Proteases</strong> (蛋白酶).",
  },

  // Subtopic 4: Temperature Effects
  {
    id: 16,
    subtopic: "Temperature Effects",
    front: "At <strong>low temperatures</strong>, enzymes are —?",
    back: "<strong>Inactive</strong> (不活躍) — low kinetic energy, low collision chance, low reaction rate.<br>Active site 3D shape <strong>not affected</strong>; enzyme <strong>not denatured</strong>.",
    image: "./assets/optimum-temperature.png",
    imageAlt: "Effect of temperature on amylase activity — low rate at low temperatures",
    backSize: "large",
  },
  {
    id: 17,
    subtopic: "Temperature Effects",
    front: "What is <strong>optimum temperature</strong> (最佳溫度)?",
    back: "The temperature at which an enzyme works <strong>most efficiently</strong> (highest reaction rate).",
    image: "./assets/optimum-temperature.png",
    imageAlt: "Effect of temperature on amylase activity — peak rate at optimum temperature",
  },
  {
    id: 18,
    subtopic: "Temperature Effects",
    front: "When temperature rises <strong>to the optimum</strong>, what happens to reaction rate?",
    back: "<strong>Higher</strong> kinetic energy → more collisions → more enzyme-substrate complexes → <strong>higher rate</strong>. Active site shape <strong>unchanged</strong>; <strong>not denatured</strong>.",
    image: "./assets/optimum-temperature.png",
    imageAlt: "Reaction rate increases as temperature rises toward the optimum",
    frontSize: "small",
    backSize: "small",
  },
  {
    id: 19,
    subtopic: "Temperature Effects",
    front: "What is the approximate <strong>optimum temperature</strong> for most human body enzymes?",
    back: "About <strong>37°C</strong>.",
    frontSize: "large",
  },
  {
    id: 20,
    subtopic: "Temperature Effects",
    front: "In the <strong>starch + amylase + iodine</strong> experiment, the optimum temperature is around —?",
    back: "About <strong>60°C</strong> (fastest disappearance of blue-black colour).",
    image: "./assets/optimum-temperature.png",
    imageAlt: "Amylase activity peaks at about 60°C in the starch-iodine experiment",
    frontSize: "large",
  },
  {
    id: 21,
    subtopic: "Temperature Effects",
    front: "What happens when temperature goes <strong>beyond the optimum</strong>?",
    back: "Enzyme <strong>denatured</strong> (變性) — active site 3D shape <strong>affected</strong>, cannot form enzyme-substrate complex, reaction rate <strong>falls</strong>.",
    image: "./assets/optimum-temperature.png",
    imageAlt: "Reaction rate falls sharply when temperature exceeds the optimum",
    frontSize: "small",
    backSize: "small",
  },
  {
    id: 22,
    subtopic: "Temperature Effects",
    front: "What is the effect of <strong>boiling</strong> on enzymes?",
    back: "Causes <strong>denaturation</strong> — enzyme loses function (active site shape destroyed).",
    image: "./assets/optimum-temperature.png",
    imageAlt: "High temperature denatures enzymes and destroys the active site",
  },

  // Subtopic 5: Concentration Effects
  {
    id: 23,
    subtopic: "Concentration Effects",
    front: "Effect of <strong>increasing substrate concentration</strong> (enzyme amount fixed)?",
    back: "More collisions → more enzyme-substrate complexes → <strong>higher rate</strong> until <strong>all active sites occupied</strong>.<br>Does <strong>not</strong> change active site shape or denature enzyme.",
    image: "./assets/substrate-concentration.png",
    imageAlt: "Low vs high substrate concentration — more successful collisions when saturated",
    backSize: "small",
  },
  {
    id: 24,
    subtopic: "Concentration Effects",
    front: "Effect of <strong>increasing enzyme concentration</strong> (substrate fixed)?",
    back: "More <strong>active sites</strong> → more collisions → <strong>higher rate</strong> until substrate is used up.<br>Does <strong>not</strong> denature enzyme.",
    image: "./assets/substrate-concentration.png",
    imageAlt: "More enzymes provide more active sites for substrate binding",
    backSize: "small",
  },
  {
    id: 25,
    subtopic: "Concentration Effects",
    front: "What does <strong>catalase</strong> (過氧化氫酶) break down hydrogen peroxide into?",
    back: "<strong>Water + oxygen</strong> (H₂O + O₂).",
  },
  {
    id: 26,
    subtopic: "Concentration Effects",
    front: "More <strong>catalase</strong> (e.g. more potato pieces) with fixed H₂O₂ — what increases?",
    back: "More <strong>active sites</strong> → faster reaction → <strong>more oxygen</strong> released.",
    frontSize: "large",
  },
  {
    id: 27,
    subtopic: "Concentration Effects",
    front: "More <strong>hydrogen peroxide</strong> (substrate) with fixed catalase — what increases?",
    back: "Higher <strong>collision chance</strong> → faster reaction → more oxygen released (until saturation).",
  },

  // Subtopic 6: Denaturation
  {
    id: 28,
    subtopic: "Denaturation",
    front: "After denaturation, can the <strong>enzyme-substrate complex</strong> form?",
    back: "<strong>No</strong> — the active site no longer has the correct shape.",
  },
  {
    id: 29,
    subtopic: "Denaturation",
    front: "Can <strong>cooling</strong> reverse denaturation after boiling?",
    back: "<strong>No</strong> — denaturation is often <strong>irreversible</strong>.",
  },
  {
    id: 30,
    subtopic: "Denaturation",
    front: "If an enzyme is denatured, is the loss of function <strong>reversible</strong>?",
    back: "<strong>No</strong> (in most cases, especially after boiling / high temperature).",
  },
];

export const FLASHCARD_DECK_SIZE = FLASHCARD_DECK.length;
