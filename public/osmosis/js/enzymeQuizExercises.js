/**
 * True/False and fill-in-the-blank items from Ch 4 Enzymes concept checks (course PDF).
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

export const ENZYME_QUIZ_EXERCISES = [
  tf(
    "enz-tf-1",
    "enzyme-basics",
    "Enzymes lower the activation energy of a reaction.",
    "T",
    "Enzymes are biological catalysts that reduce activation energy."
  ),
  tf(
    "enz-tf-2",
    "mechanism",
    "Substrates bind to the active site of an enzyme randomly.",
    "F",
    "Substrates bind specifically to the complementary active site — not to any random region."
  ),
  tf(
    "enz-tf-3",
    "enzyme-basics",
    "Enzymes are permanently changed after a reaction.",
    "F",
    "Enzymes remain unchanged after releasing products and can be reused."
  ),
  tf(
    "enz-tf-4",
    "denaturation",
    "Increasing temperature beyond the optimum causes enzyme denaturation.",
    "T",
    "Excess heat disrupts the specific 3D shape of the active site."
  ),
  tf(
    "enz-tf-5",
    "denaturation",
    "Boiling an enzyme makes it more efficient.",
    "F",
    "Boiling denatures enzymes and they lose their catalytic function."
  ),
  tf(
    "enz-tf-6",
    "enzyme-basics",
    "Enzymes are specific to their substrates.",
    "T",
    "Each enzyme has an active site shaped for its particular substrate(s)."
  ),
  tf(
    "enz-tf-7",
    "factors",
    "Increasing substrate concentration always increases the reaction rate.",
    "F",
    "Rate increases only until all active sites are occupied, then levels off."
  ),
  tf(
    "enz-tf-8",
    "denaturation",
    "Denaturation of an enzyme is reversible.",
    "F",
    "Denaturation is often irreversible — cooling after boiling does not restore function."
  ),
  tf(
    "enz-tf-9",
    "enzyme-basics",
    "Enzymes are consumed in biological reactions.",
    "F",
    "Enzymes are catalysts — they are not used up in the reaction."
  ),
  tf(
    "enz-tf-10",
    "mechanism",
    "Catalase breaks down hydrogen peroxide into water and oxygen.",
    "T",
    "Catalase catalyses: 2 H₂O₂ → 2 H₂O + O₂."
  ),

  fill(
    "enz-fill",
    "enzyme-basics",
    "Fill in the blanks — enzymes & key terms",
    [
      fillLine(
        T("1. Enzymes lower the "),
        B(["activation energy", "活化能"]),
        T(" of a reaction, making it proceed faster.")
      ),
      fillLine(
        T("2. The "),
        B(["substrate", "底物"]),
        T(" binds to the enzyme at the active site.")
      ),
      fillLine(
        T("3. The "),
        B(["active site", "活性位點"]),
        T(" is the region of the enzyme where the substrate binds.")
      ),
      fillLine(
        T("4. The "),
        B(["enzyme-substrate complex", "酶-底物複合物", "酶底物複合物"]),
        T(" forms when the substrate binds to the enzyme.")
      ),
      fillLine(
        T("5. Enzymes work most efficiently at their "),
        B(["optimum temperature", "最佳溫度"]),
        T(".")
      ),
      fillLine(
        T("6. Boiling can cause "),
        B(["denaturation", "變性"]),
        T(", rendering the enzyme inactive.")
      ),
    ],
    "Word bank: activation energy, substrate, active site, enzyme-substrate complex, optimum temperature, denaturation.",
    [
      "activation energy",
      "substrate",
      "active site",
      "enzyme-substrate complex",
      "optimum temperature",
      "denaturation",
    ]
  ),
];
