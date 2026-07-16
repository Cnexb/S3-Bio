/** Chapter Quiz Summer — fixed in-class tests (document order; subtopics merged per chapter). */

export const IN_CLASS_SECTIONS = [
  { id: "microscopy", label: "Microscopy", labelZh: "顯微鏡" },
  { id: "cell-types", label: "Cell types", labelZh: "細胞類型" },
  { id: "ch3", label: "Membrane transport", labelZh: "細胞膜運輸" },
  { id: "enzyme-intro", label: "Enzyme basics", labelZh: "酶基礎" },
  { id: "enzyme-factors", label: "Enzyme factors", labelZh: "影響酶活性的因素" },
  { id: "carbohydrates", label: "Carbohydrates", labelZh: "碳水化合物" },
  { id: "lipids", label: "Lipids", labelZh: "脂質" },
  { id: "proteins", label: "Proteins", labelZh: "蛋白質" },
];

export const IN_CLASS_CHAPTERS = {
  ch2: {
    id: "ch2",
    number: 2,
    title: "Cellular Organisation",
    titleZh: "細胞組織",
    subtitle: "Chapter 2 · 20 MCQ (fixed order)",
  },
  ch3: {
    id: "ch3",
    number: 3,
    title: "Membrane Transport",
    titleZh: "細胞膜運輸",
    subtitle: "Chapter 3 · 10 MCQ (fixed order)",
  },
  ch4: {
    id: "ch4",
    number: 4,
    title: "Enzymes",
    titleZh: "酶",
    subtitle: "Chapter 4 · 20 MCQ (fixed order)",
  },
  ch5: {
    id: "ch5",
    number: 5,
    title: "Food and Human",
    titleZh: "食物與人類",
    subtitle: "Chapter 5 · 29 MCQ (fixed order)",
  },
};

const IMG = "./assets/in-class-test";

export const IN_CLASS_TEST_BANK = {
  ch2: [
    {
      id: "ict-ch2-01",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "The smallest functional unit of life according to cell theory is:",
      options: [
        { key: "A", text: "Tissue" },
        { key: "B", text: "Organ" },
        { key: "C", text: "Cell" },
        { key: "D", text: "Organelle" }
      ],
      answer: "C",
      hint: "Cell theory: the cell is the basic unit of life.",
    },
    {
      id: "ict-ch2-02",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "Robert Hooke observed “cells” in:",
      options: [
        { key: "A", text: "Living tissue" },
        { key: "B", text: "Cork (dead cells)" },
        { key: "C", text: "Onion epidermis" },
        { key: "D", text: "Blood" }
      ],
      answer: "B",
      hint: "Hooke coined “cell” while examining cork.",
    },
    {
      id: "ict-ch2-03",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "Images under light microscope appear:",
      options: [
        { key: "A", text: "Upright" },
        { key: "B", text: "Inverted" },
        { key: "C", text: "Same orientation" },
        { key: "D", text: "Magnified only" }
      ],
      answer: "B",
      hint: "The microscope produces an inverted image.",
    },
    {
      id: "ict-ch2-04",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "Which part of the microscope holds the slide?",
      options: [
        { key: "A", text: "Nosepiece" },
        { key: "B", text: "Stage" },
        { key: "C", text: "Condenser" },
        { key: "D", text: "Eyepiece" }
      ],
      answer: "B",
      hint: "The stage is the platform that holds the slide.",
    },
    {
      id: "ict-ch2-05",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "The fine adjustment knob is used for:",
      options: [
        { key: "A", text: "Moving the stage quickly" },
        { key: "B", text: "Sharp focus" },
        { key: "C", text: "Adjusting light" },
        { key: "D", text: "Rotating objectives" }
      ],
      answer: "B",
      hint: "Fine adjustment is for sharp focusing.",
    },
    {
      id: "ict-ch2-06",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "Cell theory states that:",
      options: [
        { key: "A", text: "Cells arise from non-living matter" },
        { key: "B", text: "All organisms consist of one or more cells" },
        { key: "C", text: "Cells do not divide" },
        { key: "D", text: "Only plants have cells" }
      ],
      answer: "B",
      hint: "Cell theory: organisms are made of one or more cells.",
    },
    {
      id: "ict-ch2-07",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "Which has higher magnification?",
      options: [
        { key: "A", text: "Shorter objective lens" },
        { key: "B", text: "Longer objective lens" },
        { key: "C", text: "Eyepiece only" },
        { key: "D", text: "Stage clips" }
      ],
      answer: "B",
      hint: "Longer objective lenses give higher magnification.",
    },
    {
      id: "ict-ch2-08",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "Mouth epithelial cells are examples of:",
      options: [
        { key: "A", text: "Plant cells" },
        { key: "B", text: "Animal cells" },
        { key: "C", text: "Prokaryotes" },
        { key: "D", text: "Fungi" }
      ],
      answer: "B",
      hint: "Cheek / mouth epithelial cells are animal cells.",
    },
    {
      id: "ict-ch2-09",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "Chloroplasts are visible in:",
      options: [
        { key: "A", text: "All animal cells" },
        { key: "B", text: "Plant cells (green parts)" },
        { key: "C", text: "Bacterial cells" },
        { key: "D", text: "Viruses" }
      ],
      answer: "B",
      hint: "Chloroplasts occur in green parts of plants.",
    },
    {
      id: "ict-ch2-10",
      section: "microscopy",
      difficulty: "Foundation",
      stem: "The diaphragm lever controls:",
      options: [
        { key: "A", text: "Focus" },
        { key: "B", text: "Amount of light" },
        { key: "C", text: "Slide movement" },
        { key: "D", text: "Objective rotation" }
      ],
      answer: "B",
      hint: "The diaphragm lever controls light intensity.",
    },
    {
      id: "ict-ch2-11",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Bacteria are examples of:",
      options: [
        { key: "A", text: "Eukaryotes" },
        { key: "B", text: "Prokaryotes" },
        { key: "C", text: "Plant cells" },
        { key: "D", text: "Animal cells" }
      ],
      answer: "B",
      hint: "Bacteria are prokaryotes.",
    },
    {
      id: "ict-ch2-12",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "True nucleus is present in:",
      options: [
        { key: "A", text: "Prokaryotes only" },
        { key: "B", text: "Eukaryotes only" },
        { key: "C", text: "Both" },
        { key: "D", text: "Neither" }
      ],
      answer: "B",
      hint: "Only eukaryotes have a true nucleus.",
    },
    {
      id: "ict-ch2-13",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Which is present only in plant cells?",
      options: [
        { key: "A", text: "Mitochondria" },
        { key: "B", text: "Chloroplast" },
        { key: "C", text: "Ribosome" },
        { key: "D", text: "Cell membrane" }
      ],
      answer: "B",
      hint: "Chloroplasts are unique to plant (and algal) cells among typical school examples.",
    },
    {
      id: "ict-ch2-14",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Prokaryotes are generally:",
      options: [
        { key: "A", text: "Larger" },
        { key: "B", text: "Smaller and simpler" },
        { key: "C", text: "Multicellular" },
        { key: "D", text: "Have many organelles" }
      ],
      answer: "B",
      hint: "Prokaryotes are usually smaller and simpler.",
    },
    {
      id: "ict-ch2-15",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Animal cells lack:",
      options: [
        { key: "A", text: "Cell membrane" },
        { key: "B", text: "Nucleus" },
        { key: "C", text: "Cell wall" },
        { key: "D", text: "Cytoplasm" }
      ],
      answer: "C",
      hint: "Animal cells have no cell wall.",
    },
    {
      id: "ict-ch2-16",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Membrane-bound organelles are absent in:",
      options: [
        { key: "A", text: "Animal cells" },
        { key: "B", text: "Plant cells" },
        { key: "C", text: "Prokaryotes" },
        { key: "D", text: "Eukaryotes" }
      ],
      answer: "C",
      hint: "Prokaryotes lack membrane-bound organelles.",
    },
    {
      id: "ict-ch2-17",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Onion cells are:",
      options: [
        { key: "A", text: "Prokaryotic" },
        { key: "B", text: "Eukaryotic plant" },
        { key: "C", text: "Eukaryotic animal" },
        { key: "D", text: "Viral" }
      ],
      answer: "B",
      hint: "Onion cells are eukaryotic plant cells.",
    },
    {
      id: "ict-ch2-18",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Which structure provides structural support in plant cells?",
      options: [
        { key: "A", text: "Vacuole" },
        { key: "B", text: "Cell wall" },
        { key: "C", text: "Mitochondria" },
        { key: "D", text: "Ribosome" }
      ],
      answer: "B",
      hint: "The cellulose cell wall provides structural support.",
    },
    {
      id: "ict-ch2-19",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Amoeba is:",
      options: [
        { key: "A", text: "Prokaryote" },
        { key: "B", text: "Unicellular eukaryote" },
        { key: "C", text: "Plant cell" },
        { key: "D", text: "Virus" }
      ],
      answer: "B",
      hint: "Amoeba is a unicellular eukaryotic organism.",
    },
    {
      id: "ict-ch2-20",
      section: "cell-types",
      difficulty: "Foundation",
      stem: "Viruses are:",
      options: [
        { key: "A", text: "Prokaryotic cells" },
        { key: "B", text: "Eukaryotic cells" },
        { key: "C", text: "Not cells" },
        { key: "D", text: "Plant cells" }
      ],
      answer: "C",
      hint: "Viruses are not cells; they are acellular.",
    }
  ],
  ch3: [
    {
      id: "ict-ch3-01",
      section: "ch3",
      difficulty: "Foundation",
      stem: 'Which of the following is evidence for the "Fluid" part of the Fluid Mosaic Model?',
      options: [
        { key: "A", text: "The presence of different types of proteins in the bilayer." },
        { key: "B", text: "The ability of phospholipids and proteins to move laterally within the membrane." },
        { key: "C", text: "The rigid structure of the phosphate heads." },
        { key: "D", text: "The fixed arrangement of carbohydrates on the outer surface." },
      ],
      answer: "B",
      hint: '"Fluid" means lipids and proteins can move laterally in the bilayer.',
    },
    {
      id: "ict-ch3-02",
      section: "ch3",
      difficulty: "Foundation",
      stem: "A phospholipid molecule is described as having a dual nature. Which part of the molecule is correctly matched with its property?",
      options: [
        { key: "A", text: "Fatty acid tails – Hydrophilic" },
        { key: "B", text: "Phosphate group – Hydrophobic" },
        { key: "C", text: "Glycerol backbone – Non-polar" },
        { key: "D", text: "Fatty acid tails – Hydrophobic" },
      ],
      answer: "D",
      hint: "Fatty acid tails are non-polar and hydrophobic.",
    },
    {
      id: "ict-ch3-03",
      section: "ch3",
      difficulty: "Foundation",
      stem: "Based on the diagram and the Fluid Mosaic Model, which statement is true?",
      options: [
        { key: "A", text: "Molecule X requires energy from respiration to cross." },
        { key: "B", text: "Molecule X passes through the phospholipid bilayer because it is lipid-soluble." },
        { key: "C", text: "Molecule Y passes through the bilayer because it is a large molecule." },
        { key: "D", text: "Both Molecule X and Y require membrane folding to enter the cell." },
      ],
      answer: "B",
      hint: "Small lipid-soluble (non-polar) molecules diffuse through the bilayer directly.",
      image: {
        src: `${IMG}/ch3-q3-fluid-mosaic.png`,
        alt: "Fluid mosaic membrane diagram showing Molecule X and Molecule Y",
        caption: "Fig · Fluid mosaic model — Molecule X and Molecule Y crossing the membrane.",
      },
    },
    {
      id: "ict-ch3-04",
      section: "ch3",
      difficulty: "Foundation",
      stem: 'Which membrane protein acts like a "card reader" by binding to chemical messengers such as hormones?',
      options: [
        { key: "A", text: "Glycoprotein" },
        { key: "B", text: "Enzyme" },
        { key: "C", text: "Receptor protein" },
        { key: "D", text: "Channel protein" },
      ],
      answer: "C",
      hint: "Receptor proteins bind specific chemical signals at the cell surface.",
    },
    {
      id: "ict-ch3-05",
      section: "ch3",
      difficulty: "Foundation",
      stem: "Why does the leakage of red pigment occur when a beetroot cylinder is placed in a concentrated organic solvent like ethanol?",
      options: [
        { key: "A", text: "Ethanol increases the water potential of the solution." },
        { key: "B", text: "Ethanol dissolves the phospholipid bilayer and denatures membrane proteins." },
        { key: "C", text: "Ethanol acts as a detergent that only breaks down protein-lipid interactions." },
        { key: "D", text: "Ethanol makes the membrane more rigid, forcing the pigment out." },
      ],
      answer: "B",
      hint: "Organic solvents disrupt the lipid bilayer and membrane proteins.",
    },
    {
      id: "ict-ch3-06",
      section: "ch3",
      difficulty: "Foundation",
      stem: "After 2 hours, what would be the expected observation?",
      options: [
        { key: "A", text: "The liquid level in Side A will rise." },
        { key: "B", text: "The liquid level in Side B will rise." },
        { key: "C", text: "Sucrose molecules will move from Side B to Side A until levels are equal." },
        { key: "D", text: "There will be no change in liquid levels because sucrose is too large." },
      ],
      answer: "B",
      hint: "Water moves by osmosis toward the side with lower water potential.",
      image: {
        src: `${IMG}/ch3-q6-osmosis-solution.png`,
        alt: "U-tube osmosis setup with sucrose solutions on two sides separated by a membrane",
        caption: "Fig · U-tube osmosis experiment after 2 hours.",
      },
    },
    {
      id: "ict-ch3-07",
      section: "ch3",
      difficulty: "Foundation",
      stem: "In the context of water potential, which of the following solutions has the highest (least negative) value?",
      options: [
        { key: "A", text: "5% sucrose solution" },
        { key: "B", text: "10% sucrose solution" },
        { key: "C", text: "Distilled water" },
        { key: "D", text: "Concentrated salt solution" },
      ],
      answer: "C",
      hint: "Pure water has the highest (zero) water potential.",
    },
    {
      id: "ict-ch3-08",
      section: "ch3",
      difficulty: "Foundation",
      stem: 'Which property of the cell membrane is most directly responsible for the process of "eating" (endocytosis) in unicellular organisms?',
      options: [
        { key: "A", text: "Differential permeability" },
        { key: "B", text: "Flexibility" },
        { key: "C", text: "Mosaic arrangement of proteins" },
        { key: "D", text: "Presence of glycoproteins" },
      ],
      answer: "B",
      hint: "Endocytosis requires the membrane to bend and fold inward.",
    },
    {
      id: "ict-ch3-09",
      section: "ch3",
      difficulty: "Foundation",
      stem: "A student places a potato strip in a solution and observes that the strip becomes longer and heavier. This indicates that:",
      options: [
        { key: "A", text: "The solution has a lower water potential than the potato cells." },
        { key: "B", text: "The solution is more concentrated than the potato cell sap." },
        { key: "C", text: "Water has moved into the potato cells by osmosis." },
        { key: "D", text: "The potato cells have lost water to the surrounding solution." },
      ],
      answer: "C",
      hint: "Gaining mass and length means water entered the cells by osmosis.",
    },
    {
      id: "ict-ch3-10",
      section: "ch3",
      difficulty: "Foundation",
      stem: "Which statement about the differentially permeable membrane in osmosis is correct?",
      options: [
        { key: "A", text: "It allows all solute particles to pass but blocks water." },
        { key: "B", text: "It allows water molecules to pass but prevents most solute particles from passing." },
        { key: "C", text: "It requires ATP energy to facilitate the movement of water." },
        { key: "D", text: "It only functions when the temperature is above 70ºC" },
      ],
      answer: "B",
      hint: "Osmosis is the net movement of water through a selectively permeable membrane.",
    },
  ],
  ch4: [
    {
      id: "ict-ch4-01",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "Enzymes are chemically:",
      options: [
        { key: "A", text: "Carbohydrates" },
        { key: "B", text: "Lipids" },
        { key: "C", text: "Proteins" },
        { key: "D", text: "Minerals" }
      ],
      answer: "C",
      hint: "Enzymes are proteins.",
    },
    {
      id: "ict-ch4-02",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "The function of an enzyme is to:",
      options: [
        { key: "A", text: "Provide energy" },
        { key: "B", text: "Lower activation energy" },
        { key: "C", text: "Increase activation energy" },
        { key: "D", text: "Change products permanently" }
      ],
      answer: "B",
      hint: "Enzymes lower activation energy.",
    },
    {
      id: "ict-ch4-03",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "The specific region where substrate binds is called:",
      options: [
        { key: "A", text: "Active site" },
        { key: "B", text: "Denatured site" },
        { key: "C", text: "Peptide bond" },
        { key: "D", text: "Glycosidic bond" }
      ],
      answer: "A",
      hint: "Correct choice: Active site.",
    },
    {
      id: "ict-ch4-04",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "In the enzyme-substrate complex:",
      options: [
        { key: "A", text: "Enzyme is changed permanently" },
        { key: "B", text: "Reaction rate decreases" },
        { key: "C", text: "Activation energy is lowered" },
        { key: "D", text: "Enzyme is destroyed" }
      ],
      answer: "C",
      hint: "Correct choice: Activation energy is lowered.",
    },
    {
      id: "ict-ch4-05",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "After the reaction, the enzyme:",
      options: [
        { key: "A", text: "Is used up" },
        { key: "B", text: "Remains unchanged" },
        { key: "C", text: "Becomes substrate" },
        { key: "D", text: "Denatures" }
      ],
      answer: "B",
      hint: "Enzymes remain unchanged and reusable after the reaction.",
    },
    {
      id: "ict-ch4-06",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "Maltase acts on:",
      options: [
        { key: "A", text: "Starch" },
        { key: "B", text: "Maltose" },
        { key: "C", text: "Protein" },
        { key: "D", text: "Lipid" }
      ],
      answer: "B",
      hint: "Maltase acts specifically on maltose.",
    },
    {
      id: "ict-ch4-07",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "The lock and key model explains enzyme:",
      options: [
        { key: "A", text: "Denaturation" },
        { key: "B", text: "Specificity" },
        { key: "C", text: "Temperature effect" },
        { key: "D", text: "pH only" }
      ],
      answer: "B",
      hint: "Lock and key explains enzyme specificity.",
    },
    {
      id: "ict-ch4-08",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "Enzymes speed up reactions by:",
      options: [
        { key: "A", text: "Increasing temperature" },
        { key: "B", text: "Providing alternative pathway with lower activation energy" },
        { key: "C", text: "Removing water" },
        { key: "D", text: "Changing pH" }
      ],
      answer: "B",
      hint: "Correct choice: Providing alternative pathway with lower activation energy.",
    },
    {
      id: "ict-ch4-09",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "Which is NOT true about enzymes?",
      options: [
        { key: "A", text: "They are reusable" },
        { key: "B", text: "They are specific" },
        { key: "C", text: "They work at any temperature" },
        { key: "D", text: "They are proteins" }
      ],
      answer: "C",
      hint: "Enzymes do not work at any temperature — extremes reduce activity or denature them.",
    },
    {
      id: "ict-ch4-10",
      section: "enzyme-intro",
      difficulty: "Foundation",
      stem: "The diagram showing substrate binding to active site represents:",
      options: [
        { key: "A", text: "Denaturation" },
        { key: "B", text: "Enzyme-substrate complex formation" },
        { key: "C", text: "Condensation only" },
        { key: "D", text: "Hydrolysis of enzyme" }
      ],
      answer: "B",
      hint: "Binding of substrate to the active site forms the enzyme–substrate complex.",
    },
    {
      id: "ict-ch4-11",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "The temperature at which enzyme activity is highest is called:",
      options: [
        { key: "A", text: "Minimum temperature" },
        { key: "B", text: "Optimum temperature" },
        { key: "C", text: "Denaturation temperature" },
        { key: "D", text: "Room temperature" }
      ],
      answer: "B",
      hint: "Optimum temperature gives the highest enzyme activity.",
    },
    {
      id: "ict-ch4-12",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "High temperature denatures enzymes by:",
      options: [
        { key: "A", text: "Increasing collisions only" },
        { key: "B", text: "Changing the 3D shape of active site" },
        { key: "C", text: "Adding water" },
        { key: "D", text: "Removing substrate" }
      ],
      answer: "B",
      hint: "Extreme heat or pH alters the 3D shape.",
    },
    {
      id: "ict-ch4-13",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "At low temperature, enzymes are:",
      options: [
        { key: "A", text: "Denatured" },
        { key: "B", text: "Inactive (low kinetic energy)" },
        { key: "C", text: "At maximum rate" },
        { key: "D", text: "Destroyed" }
      ],
      answer: "B",
      hint: "At low temperature enzymes are inactive but not denatured.",
    },
    {
      id: "ict-ch4-14",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "Increasing substrate concentration initially:",
      options: [
        { key: "A", text: "Decreases rate" },
        { key: "B", text: "Increases rate until active sites are saturated" },
        { key: "C", text: "Has no effect" },
        { key: "D", text: "Denatures enzyme" }
      ],
      answer: "B",
      hint: "Rate rises with substrate until active sites are saturated.",
    },
    {
      id: "ict-ch4-15",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "Increasing enzyme concentration:",
      options: [
        { key: "A", text: "Decreases reaction rate" },
        { key: "B", text: "Increases reaction rate" },
        { key: "C", text: "Has no effect" },
        { key: "D", text: "Lowers optimum temperature" }
      ],
      answer: "B",
      hint: "More enzyme means more active sites, so rate increases.",
    },
    {
      id: "ict-ch4-16",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "Denaturation is:",
      options: [
        { key: "A", text: "Reversible" },
        { key: "B", text: "Irreversible loss of 3D shape" },
        { key: "C", text: "Caused only by low pH" },
        { key: "D", text: "Beneficial" }
      ],
      answer: "B",
      hint: "Denaturation is irreversible loss of the functional 3D shape.",
    },
    {
      id: "ict-ch4-17",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "In the catalase experiment with potato, cutting potato into small pieces increases:",
      options: [
        { key: "A", text: "Substrate concentration" },
        { key: "B", text: "Reaction rate" },
        { key: "C", text: "Temperature" },
        { key: "D", text: "pH" }
      ],
      answer: "B",
      hint: "Smaller pieces increase surface area and reaction rate.",
    },
    {
      id: "ict-ch4-18",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "Which factor does NOT affect the 3D shape of the active site directly?",
      options: [
        { key: "A", text: "Extreme temperature" },
        { key: "B", text: "Extreme pH" },
        { key: "C", text: "Substrate concentration" },
        { key: "D", text: "Boiling" }
      ],
      answer: "C",
      hint: "Substrate concentration does not change the active-site shape.",
    },
    {
      id: "ict-ch4-19",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "When all active sites are occupied, further increase in substrate:",
      options: [
        { key: "A", text: "Increases rate" },
        { key: "B", text: "No further increase in rate" },
        { key: "C", text: "Denatures enzyme" },
        { key: "D", text: "Lowers rate" }
      ],
      answer: "B",
      hint: "Once saturated, extra substrate does not raise the rate further.",
    },
    {
      id: "ict-ch4-20",
      section: "enzyme-factors",
      difficulty: "Foundation",
      stem: "Enzymes become inactive at very low temperatures because:",
      options: [
        { key: "A", text: "They are denatured" },
        { key: "B", text: "Molecular collisions are too few" },
        { key: "C", text: "They lose specificity" },
        { key: "D", text: "Active site expands" }
      ],
      answer: "B",
      hint: "Low temperature reduces collision frequency; enzymes are not denatured.",
    }
  ],
  ch5: [
    {
      id: "ict-ch5-01",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "Which is the main respiratory fuel in cells?",
      options: [
        { key: "A", text: "Starch" },
        { key: "B", text: "Cellulose" },
        { key: "C", text: "Glucose" },
        { key: "D", text: "Sucrose" }
      ],
      answer: "C",
      hint: "Glucose is the main respiratory substrate.",
    },
    {
      id: "ict-ch5-02",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "Maltose is formed from two glucose molecules by:",
      options: [
        { key: "A", text: "Hydrolysis" },
        { key: "B", text: "Condensation" },
        { key: "C", text: "Denaturation" },
        { key: "D", text: "Oxidation" }
      ],
      answer: "B",
      hint: "Joining monomers releases water (condensation).",
    },
    {
      id: "ict-ch5-03",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "The reaction: Maltose + H₂O → 2 Glucose is an example of:",
      options: [
        { key: "A", text: "Condensation" },
        { key: "B", text: "Hydrolysis" },
        { key: "C", text: "Polymerisation" },
        { key: "D", text: "Dehydration" }
      ],
      answer: "B",
      hint: "Adding water to split a molecule is hydrolysis.",
    },
    {
      id: "ict-ch5-04",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "Starch is important in plants because it:",
      options: [
        { key: "A", text: "Provides structural support" },
        { key: "B", text: "Stores energy" },
        { key: "C", text: "Acts as enzyme" },
        { key: "D", text: "Transports water" }
      ],
      answer: "B",
      hint: "Correct choice: Stores energy.",
    },
    {
      id: "ict-ch5-05",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "Carbohydrates are organic molecules because they:",
      options: [
        { key: "A", text: "Contain nitrogen" },
        { key: "B", text: "Contain C–C and C–H bonds" },
        { key: "C", text: "Are soluble in water" },
        { key: "D", text: "Contain minerals" }
      ],
      answer: "B",
      hint: "Organic molecules contain C–C and C–H bonds.",
    },
    {
      id: "ict-ch5-06",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "How many water molecules are released when two glucose molecules form one maltose?",
      options: [
        { key: "A", text: "0" },
        { key: "B", text: "1" },
        { key: "C", text: "2" },
        { key: "D", text: "3" }
      ],
      answer: "B",
      hint: "One water molecule is released per glycosidic bond formed.",
    },
    {
      id: "ict-ch5-07",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "Which polysaccharide is found in plant cell walls?",
      options: [
        { key: "A", text: "Starch" },
        { key: "B", text: "Glycogen" },
        { key: "C", text: "Cellulose" },
        { key: "D", text: "Maltose" }
      ],
      answer: "C",
      hint: "Cellulose is the structural polysaccharide of plant cell walls.",
    },
    {
      id: "ict-ch5-08",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "The breaking down of starch into maltose is an example of:",
      options: [
        { key: "A", text: "Hydrolysis" },
        { key: "B", text: "Condensation" },
        { key: "C", text: "Denaturation" },
        { key: "D", text: "Oxidation" }
      ],
      answer: "A",
      hint: "Digestive breakdown of starch is hydrolysis.",
    },
    {
      id: "ict-ch5-09",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "In condensation reactions of carbohydrates:",
      options: [
        { key: "A", text: "Water is added" },
        { key: "B", text: "Water is removed" },
        { key: "C", text: "Energy is absorbed" },
        { key: "D", text: "No change occurs" }
      ],
      answer: "B",
      hint: "Condensation removes water when monomers join.",
    },
    {
      id: "ict-ch5-10",
      section: "carbohydrates",
      difficulty: "Foundation",
      stem: "Which represents hydrolysis of maltose?",
      options: [
        { key: "A", text: "Glucose → Maltose + H₂O" },
        { key: "B", text: "Maltose + H₂O → 2 Glucose" },
        { key: "C", text: "2 Glucose → Maltose" },
        { key: "D", text: "Starch → Glucose" }
      ],
      answer: "B",
      hint: "Hydrolysis of maltose: maltose + water → 2 glucose.",
    },
    {
      id: "ict-ch5-11",
      section: "lipids",
      difficulty: "Foundation",
      stem: "A triglyceride is formed by:",
      options: [
        { key: "A", text: "1 glucose + 3 fatty acids" },
        { key: "B", text: "1 glycerol + 3 fatty acids" },
        { key: "C", text: "3 glycerol + 1 fatty acid" },
        { key: "D", text: "Amino acids" }
      ],
      answer: "B",
      hint: "One glycerol joins three fatty acids.",
    },
    {
      id: "ict-ch5-12",
      section: "lipids",
      difficulty: "Foundation",
      stem: "The reaction that breaks down triglycerides is:",
      options: [
        { key: "A", text: "Condensation" },
        { key: "B", text: "Hydrolysis" },
        { key: "C", text: "Polymerisation" },
        { key: "D", text: "Denaturation" }
      ],
      answer: "B",
      hint: "Triglycerides are broken down by hydrolysis.",
    },
    {
      id: "ict-ch5-13",
      section: "lipids",
      difficulty: "Foundation",
      stem: "How many water molecules are produced when one triglyceride is formed?",
      options: [
        { key: "A", text: "1" },
        { key: "B", text: "2" },
        { key: "C", text: "3" },
        { key: "D", text: "4" }
      ],
      answer: "C",
      hint: "Three ester bonds form → three water molecules released.",
    },
    {
      id: "ict-ch5-14",
      section: "lipids",
      difficulty: "Foundation",
      stem: "Lipids are good for long-term energy storage because they:",
      options: [
        { key: "A", text: "Are soluble in water" },
        { key: "B", text: "Contain more energy per gram than carbohydrates" },
        { key: "C", text: "Are easily digested" },
        { key: "D", text: "Form cell walls" }
      ],
      answer: "B",
      hint: "Lipids store more energy per gram than carbohydrates.",
    },
    {
      id: "ict-ch5-15",
      section: "lipids",
      difficulty: "Foundation",
      stem: "Phospholipids are major components of:",
      options: [
        { key: "A", text: "Cell walls" },
        { key: "B", text: "Cell membranes" },
        { key: "C", text: "Nucleus" },
        { key: "D", text: "Vacuoles" }
      ],
      answer: "B",
      hint: "Phospholipids are major components of cell membranes.",
    },
    {
      id: "ict-ch5-16",
      section: "lipids",
      difficulty: "Foundation",
      stem: "Hydrolysis of a triglyceride produces:",
      options: [
        { key: "A", text: "Glucose + fructose" },
        { key: "B", text: "Glycerol + 3 fatty acids" },
        { key: "C", text: "Amino acids" },
        { key: "D", text: "Peptides" }
      ],
      answer: "B",
      hint: "Hydrolysis of a triglyceride yields glycerol + 3 fatty acids.",
    },
    {
      id: "ict-ch5-17",
      section: "lipids",
      difficulty: "Foundation",
      stem: "Fats and oils belong to the group:",
      options: [
        { key: "A", text: "Carbohydrates" },
        { key: "B", text: "Lipids" },
        { key: "C", text: "Proteins" },
        { key: "D", text: "Nucleic acids" }
      ],
      answer: "B",
      hint: "Fats and oils are lipids.",
    },
    {
      id: "ict-ch5-18",
      section: "lipids",
      difficulty: "Foundation",
      stem: "In condensation of lipids:",
      options: [
        { key: "A", text: "Water is added" },
        { key: "B", text: "Water is removed (3 molecules)" },
        { key: "C", text: "No water involved" },
        { key: "D", text: "Oxygen is released" }
      ],
      answer: "B",
      hint: "Lipid condensation removes three water molecules.",
    },
    {
      id: "ict-ch5-19",
      section: "lipids",
      difficulty: "Foundation",
      stem: "Which is NOT a function of lipids?",
      options: [
        { key: "A", text: "Energy storage" },
        { key: "B", text: "Structural support in cell wall" },
        { key: "C", text: "Hormone production" },
        { key: "D", text: "Insulation" }
      ],
      answer: "B",
      hint: "Cell walls are cellulose-based, not a lipid function.",
    },
    {
      id: "ict-ch5-20",
      section: "proteins",
      difficulty: "Foundation",
      stem: "Proteins are polymers of:",
      options: [
        { key: "A", text: "Glucose" },
        { key: "B", text: "Fatty acids" },
        { key: "C", text: "Amino acids" },
        { key: "D", text: "Nucleotides" }
      ],
      answer: "C",
      hint: "Proteins are polymers of amino acids.",
    },
    {
      id: "ict-ch5-21",
      section: "proteins",
      difficulty: "Foundation",
      stem: "The bond formed between two amino acids is called:",
      options: [
        { key: "A", text: "Glycosidic" },
        { key: "B", text: "Ester" },
        { key: "C", text: "Peptide" },
        { key: "D", text: "Phosphodiester" }
      ],
      answer: "C",
      hint: "Correct choice: Peptide.",
    },
    {
      id: "ict-ch5-22",
      section: "proteins",
      difficulty: "Foundation",
      stem: "Number of water molecules released when two amino acids form a dipeptide:",
      options: [
        { key: "A", text: "0" },
        { key: "B", text: "1" },
        { key: "C", text: "2" },
        { key: "D", text: "3" }
      ],
      answer: "B",
      hint: "One water is released when a dipeptide forms.",
    },
    {
      id: "ict-ch5-23",
      section: "proteins",
      difficulty: "Foundation",
      stem: "The 3D shape of a protein is important because it determines:",
      options: [
        { key: "A", text: "Colour" },
        { key: "B", text: "Specific function" },
        { key: "C", text: "Solubility only" },
        { key: "D", text: "Mass" }
      ],
      answer: "B",
      hint: "Protein function depends on specific 3D shape.",
    },
    {
      id: "ict-ch5-24",
      section: "proteins",
      difficulty: "Foundation",
      stem: "Denaturation of protein is caused by:",
      options: [
        { key: "A", text: "Low temperature" },
        { key: "B", text: "Extreme pH or high temperature" },
        { key: "C", text: "More substrate" },
        { key: "D", text: "Light" }
      ],
      answer: "B",
      hint: "Extreme heat or pH alters the 3D shape.",
    },
    {
      id: "ict-ch5-25",
      section: "proteins",
      difficulty: "Foundation",
      stem: "Hydrolysis of a dipeptide produces:",
      options: [
        { key: "A", text: "Two amino acids" },
        { key: "B", text: "Glucose" },
        { key: "C", text: "Fatty acids" },
        { key: "D", text: "Maltose" }
      ],
      answer: "A",
      hint: "Hydrolysis of a dipeptide yields two amino acids.",
    },
    {
      id: "ict-ch5-26",
      section: "proteins",
      difficulty: "Foundation",
      stem: "There are approximately how many different amino acids?",
      options: [
        { key: "A", text: "4" },
        { key: "B", text: "10" },
        { key: "C", text: "20" },
        { key: "D", text: "30" }
      ],
      answer: "C",
      hint: "About 20 different amino acids occur in proteins.",
    },
    {
      id: "ict-ch5-27",
      section: "proteins",
      difficulty: "Foundation",
      stem: "Which statement is true about polypeptides?",
      options: [
        { key: "A", text: "They have specific 3D function" },
        { key: "B", text: "They are inactive linear chains" },
        { key: "C", text: "They contain fatty acids" },
        { key: "D", text: "They are carbohydrates" }
      ],
      answer: "B",
      hint: "A polypeptide is still a linear chain until folded into a functional protein.",
    },
    {
      id: "ict-ch5-28",
      section: "proteins",
      difficulty: "Foundation",
      stem: "Irreversible loss of protein function is called:",
      options: [
        { key: "A", text: "Hydrolysis" },
        { key: "B", text: "Condensation" },
        { key: "C", text: "Denaturation" },
        { key: "D", text: "Polymerisation" }
      ],
      answer: "C",
      hint: "Denaturation causes irreversible loss of protein function.",
    },
    {
      id: "ict-ch5-29",
      section: "proteins",
      difficulty: "Foundation",
      stem: "Enzymes are:",
      options: [
        { key: "A", text: "Carbohydrates" },
        { key: "B", text: "Lipids" },
        { key: "C", text: "Proteins" },
        { key: "D", text: "Nucleic acids" }
      ],
      answer: "C",
      hint: "Enzymes are proteins.",
    }
  ],
};

export function getInClassChapter(id) {
  return IN_CLASS_CHAPTERS[id] || null;
}

export function getInClassQuestions(chapterId) {
  const items = IN_CLASS_TEST_BANK[chapterId];
  return items ? [...items] : [];
}
