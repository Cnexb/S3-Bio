/** Ch 2 — note slides aligned to docx sequence; hero images for classroom visibility */

function orgTableHead() {
  return `<thead><tr class="bg-primary/10">
    <th class="p-2 text-left">Organelle<br/><span class="deck-meta">細胞器</span></th>
    <th class="p-2 text-center">Animal<br/><span class="deck-meta">動物</span></th>
    <th class="p-2 text-center">Plant<br/><span class="deck-meta">植物</span></th>
    <th class="p-2">Membrane<br/><span class="deck-meta">膜</span></th>
    <th class="p-2">Details</th>
  </tr></thead>`;
}

function orgTick(v) {
  if (v === true) return `<span class="text-secondary font-bold">✓</span>`;
  if (v === false) return `<span class="text-tertiary font-bold">✗</span>`;
  return String(v ?? "");
}

function prokEukCompareRefs(fig, figGrid2) {
  return figGrid2(
    fig("image10.png", "Prokaryote 原核", "Prokaryotic cell 原核細胞", "fig-ref-lg"),
    fig("image9.png", "Eukaryote 真核", "Eukaryotic cell 真核細胞 — membrane-bound organelles", "fig-ref-lg")
  );
}

function prokEukSideRefs(fig) {
  return `${fig("image10.png", "Prokaryote 原核", "Prokaryotic cell 原核細胞", "fig-side-ref")}
${fig("image9.png", "Eukaryote 真核", "Eukaryotic cell 真核細胞", "fig-side-ref")}`;
}

function organelleCellRefs(fig) {
  return `${fig("image6.png", "Animal cell 動物細胞", "Animal cell", "fig-side-ref")}
${fig("image7.png", "Plant cell 植物細胞", "Plant cell", "fig-side-ref")}`;
}

function prokEukTableHead() {
  return `<thead>
      <tr class="bg-primary/10"><th class="p-2" rowspan="2">Feature</th><th class="p-2" rowspan="2">Prokaryotes<br/><span class="deck-meta">原核</span></th><th class="p-2 text-center" colspan="2">Eukaryotes <span class="deck-meta">真核</span></th></tr>
      <tr class="bg-primary/10"><th class="p-2">Animal Cells</th><th class="p-2">Plant Cells</th></tr>
    </thead>`;
}

export function buildNotesSlides(ctx) {
  const {
    slide,
    hl,
    fig,
    layoutSplit,
    layoutFigTop,
    layoutPicHero,
    figGrid2,
    tableWrap,
    drawSpace,
    drawSpacePair,
    layoutCompareWithRefs,
    layoutCompareSplit,
    layoutSideRefs,
    layoutDrawTogether,
    labEmbed,
    labFootnote,
    LAB_ENDOSYMBIOTIC,
  } = ctx;
  const hero = (src, alt, cap, text = "") =>
    layoutPicHero(fig(src, alt, cap, "fig-hero"), text);
  const s = [];

  s.push(
    slide(
      "Ch 2 Cellular Organizations",
      `<div class="text-center">
      <div class="inline-block px-4 py-1 mb-6 bg-secondary/10 text-secondary rounded-full font-label-bold step">Chapter 2 · Cellular organizations</div>
      <h1 class="font-headline-xl text-headline-xl mb-4">Cells &amp; ${hl("Organelles", "u")}</h1>
      <p class="text-on-surface-variant max-w-2xl mx-auto step">Michael Y's Summer Biology Course</p>
      <p class="text-on-surface-variant text-body-sm mt-8 step"><kbd>Space</kbd> / <kbd>→</kbd> next · <kbd>B</kbd> sidebar</p>
    </div>`,
      { center: true, previewImg: "image1.png" }
    )
  );

  s.push(
    slide(
      "Cell theory 細胞學說",
      `<ul class="deck-text space-y-2 step step-text list-disc list-inside">
      <li>Cells are the ${hl("smallest functioning units", "u")} of life</li>
      <li>A cell can perform all ${hl("seven characteristics of life", "c")}</li>
      <li>All organisms consist of one or more cells</li>
      <li>${hl("Unicellular organisms 單細胞", "b")} &amp; ${hl("multicellular organisms 多細胞", "b")}</li>
      <li>Cells arise from ${hl("pre-existing cells", "u")} — e.g. ${hl("cell division", "c")}</li>
    </ul>`,
      { previewImg: "image2.jpeg" }
    )
  );

  s.push(
    slide(
      "Robert Hooke 羅拔·虎克",
      hero(
        "image1.png",
        "Robert Hooke",
        "First observed cork under the microscope (1665).",
        `<p class="deck-text-sm step step-text">Robert Hooke 羅拔·虎克 — pioneer of microscopy.</p>`
      ),
      { previewImg: "image1.png" }
    )
  );

  s.push(
    slide(
      "Cork cells · “cells” 牢房",
      layoutPicHero(
        figGrid2(
          fig("image2.jpeg", "Cork under microscope", "Hooke's observation.", "fig-hero"),
          fig("image3.jpeg", "Cork tissue", "Dead cells of cork tissue 軟木組織.", "fig-hero")
        ),
        `<p class="deck-text step step-text">Cells = ${hl("“small rooms” 牢房", "u")}</p>
    <p class="deck-text-sm step step-text">${hl("Soft cork tissue 軟木組織: actually dead cells!", "r")} — not living cells.</p>`
      ),
      { previewImg: "image3.jpeg" }
    )
  );

  s.push(
    slide(
      "Microscope · labelled diagram 顯微鏡",
      hero(
        "image4.png",
        "Labelled light microscope",
        "Eyepieces, nosepiece, objectives, stage, condenser, diaphragm, knobs, light source.",
        `<p class="deck-meta step step-text">Use ${hl("coarse knob first", "u")}, then ${hl("fine knob", "c")} for sharp focus.</p>`
      ),
      { previewImg: "image4.png" }
    )
  );

  s.push(
    slide(
      "Microscope parts & functions 部件與功能",
      layoutCompareWithRefs(
        `<div class="deck-meta mb-1 step step-text">Labelled diagram · 標籤圖</div>
      ${fig("image4.png", "Labelled light microscope", "Eyepieces, objectives, stage, condenser…", "fig-ref")}`,
        tableWrap(`<table class="w-full deck-text-sm org-table"><thead><tr class="bg-primary/10"><th class="p-2">Part</th><th class="p-2">Function</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2">Eyepieces 目鏡</td><td class="p-2">${hl("Magnifies 放大", "u")} the image</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Nosepiece 旋轉鏡筒</td><td class="p-2">Holds and rotates objective lenses</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Objective lenses 物鏡</td><td class="p-2">Magnifies the image — ${hl("longer = higher magnification", "c")}</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Stage clips 載物夾 &amp; stage 載物台</td><td class="p-2">Holds the slide 載玻片</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Coarse adjustment knob 粗調旋鈕</td><td class="p-2">Moves stage for basic focus</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Fine adjustment knob 微調旋鈕</td><td class="p-2">${hl("Fine-tunes 微調", "u")} for sharp focus</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Condenser 聚光器</td><td class="p-2">Focuses light on specimen 標本</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Diaphragm lever 光圈控制桿</td><td class="p-2">Adjusts light amount</td></tr>
      <tr class="step step-text"><td class="p-2">Light source 光源</td><td class="p-2">Provides light</td></tr>
    </tbody></table>`)
      ),
      { previewImg: "image4.png" }
    )
  );

  s.push(
    slide(
      "Inverted image 倒像",
      hero(
        "image5.png",
        "Compound light microscope",
        "Modern light microscope for classroom use.",
        `<p class="deck-text step step-text">${hl("Inverted image 倒像", "r")} under light microscopes.</p>`
      ),
      { previewImg: "image5.png" }
    )
  );

  s.push(
    slide(
      "Recalling · cells",
      figGrid2(
        fig("image6.png", "Animal cell", "", "fig-hero"),
        fig("image7.png", "Plant cell", "", "fig-hero")
      ),
      { previewImg: "image6.png" }
    )
  );

  s.push(
    slide(
      "Carbohydrates 碳水化合物",
      layoutCompareWithRefs(
        `${fig("image7.png", "Plant cell · S1 Ch 4", "Starch 澱粉 · Cellulose in cell wall 細胞壁", "fig-ref")}`,
        `<p class="deck-text-sm step step-text mb-3">Recalling ${hl("carbohydrates, lipids and proteins", "b")} related to cells</p>
    ${tableWrap(`<table class="w-full deck-text-sm"><thead><tr class="bg-primary/10"><th class="p-2">Names</th><th class="p-2">Functions</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2">Monosaccharides 單醣<br/>Glucose 葡萄糖</td><td class="p-2">${hl("Main respiratory 呼吸作用 fuel", "u")} for quick energy</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Polysaccharides 多醣<br/>Starch 澱粉</td><td class="p-2">Energy storage in plants</td></tr>
      <tr class="step step-text"><td class="p-2">Polysaccharides 多醣<br/>Cellulose 纖維素</td><td class="p-2">${hl("Structural component", "c")} in plant cell wall 細胞壁</td></tr>
    </tbody></table>`)}`
      ),
      { previewImg: "image7.png" }
    )
  );

  s.push(
    slide(
      "Lipids 脂質",
      layoutCompareWithRefs(
        `${fig("image8.jpeg", "Cell membrane · S1 Ch 4", "Phospholipid bilayer 磷脂雙層", "fig-ref")}`,
        tableWrap(`<table class="w-full deck-text-sm"><thead><tr class="bg-primary/10"><th class="p-2">Names</th><th class="p-2">Functions</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2"><strong>Phospholipids</strong> 磷脂質<br/>Phosphate 磷+ Glycerol 甘油+ 2 fatty acids 脂肪酸</td><td class="p-2">${hl("Main component of cell membranes 細胞膜", "b")}</td></tr>
      <tr class="step step-text"><td class="p-2"><strong>Steroids</strong> 類固醇<br/>e.g. Cholesterol 膽固醇</td><td class="p-2">Sex hormones 性荷爾蒙<br/>Help to ${hl("stabilize 穩定", "u")} cell membranes</td></tr>
    </tbody></table>`)
      ),
      { previewImg: "image8.jpeg" }
    )
  );

  s.push(
    slide(
      "Protein 蛋白質",
      layoutCompareWithRefs(
        `${fig("image6.png", "Animal cell · S1 Ch 4", "Proteins in membrane &amp; cytoplasm", "fig-ref")}`,
        tableWrap(`<table class="w-full deck-text-sm"><thead><tr class="bg-primary/10"><th class="p-2">Names</th><th class="p-2">Functions</th></tr></thead><tbody>
      <tr class="step step-text"><td class="p-2 align-top">Protein 蛋白質<br/>Amino acids 胺基酸</td><td class="p-2 align-top">
        <ul class="list-disc list-inside space-y-1">
          <li class="step step-text">${hl("Growth and repair 修復", "c")} of tissues 組織</li>
          <li class="step step-text">Found in cell membranes</li>
          <li class="step step-text">${hl("Enzymes 酶", "b")}: Speed up reactions</li>
          <li class="step step-text">Most hormones 荷爾蒙</li>
        </ul>
      </td></tr>
    </tbody></table>`)
      ),
      { previewImg: "image6.png" }
    )
  );

  s.push(
    slide(
      "Cell membrane 細胞膜",
      hero(
        "image8.jpeg",
        "Cell membrane",
        "",
        `<p class="deck-text step step-text">The cell membrane mainly consists of:</p>
    <ul class="deck-text step step-text list-disc list-inside mt-2">
      <li>${hl("Phospholipid bilayer 雙層", "b")}</li>
      <li>${hl("Embedded 嵌入 proteins", "c")}</li>
    </ul>`
      ),
      { previewImg: "image8.jpeg" }
    )
  );

  s.push(
    slide(
      "Animal vs plant cell structures 動物 vs 植物",
      hero(
        "image9.png",
        "Cell structures",
        "Animal cell (top) vs plant cell (bottom) — organelles labelled.",
        `<p class="deck-text-sm step step-text">${hl("Cell wall & chloroplast", "c")} in plants · ${hl("large central vacuole", "b")} in plants.</p>`
      ),
      { previewImg: "image9.png" }
    )
  );

  s.push(
    slide(
      "Prokaryotic cells 原核細胞",
      hero(
        "image10.png",
        "Prokaryotic cells 原核細胞",
        "DNA, ribosomes, cytoplasm, flagellum, capsule, cell wall, membrane.",
        `<p class="deck-text-sm step step-text"><strong>Prokaryotes 原核生物</strong> — e.g. ${hl("E. coli 大腸桿菌", "b")}, cyanobacteria 藍菌, Taq bacteria.</p>`
      ),
      { previewImg: "image10.png" }
    )
  );

  s.push(
    slide(
      "From prokaryotes to eukaryotes 原核→真核",
      `<div class="layout-draw-focus">
      <div class="layout-draw-focus__intro">
        <p class="deck-text step step-text">${hl("Organelles 細胞器", "u")} — membrane-bound structures with specific functions in ${hl("eukaryotic 真核", "c")} cells.</p>
        <p class="deck-meta step step-text mt-2">Table: ✓ / ✗ for ${hl("Animal 動物", "b")} vs ${hl("Plant 植物", "b")}.</p>
      </div>
      <div class="layout-draw-focus__box step step-text">${drawSpace("Drawing space 落筆區", "Sketch prokaryotic vs eukaryotic cell · 畫出原核與真核細胞")}</div>
    </div>`,
      { previewImg: "image9.png" }
    )
  );

  s.push(
    slide(
      "Prokaryote → eukaryote · animation 原核變真核",
      `<div class="slide-lab-layout">
      ${labEmbed(LAB_ENDOSYMBIOTIC, "Endosymbiotic theory · 內共生學說 — prokaryote to eukaryote")}
      ${labFootnote(
        `<p class="deck-text-sm"><strong class="text-primary">Interactive · 互動</strong> — 7-step animation: how ${hl("prokaryotes became eukaryotic organelles", "u")} (mitochondria, chloroplast).</p>`,
        LAB_ENDOSYMBIOTIC
      )}
    </div>`,
      { lab: true, previewImg: "image10.png" }
    )
  );

  s.push(
    slide(
      "Organelles · Part 1",
      layoutSideRefs(
        organelleCellRefs(fig),
        `<p class="deck-meta step step-text mb-1">Organelle table · ✓ / ✗ = Animal / Plant</p>
    ${tableWrap(`<table class="w-full org-table org-table--compact">${orgTableHead()}<tbody>
      <tr class="step step-text border-b"><td class="p-2"><strong>Cell membrane</strong> 細胞膜</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">Single</td><td class="p-2">Made of phospholipid bilayer &amp; proteins<br/>${hl("Differentially permeable 差異滲透性", "c")}<br/>Controls substances movement in and out</td></tr>
      <tr class="step step-text border-b"><td class="p-2"><strong>Cell wall</strong> 細胞壁</td><td class="p-2 text-center">${orgTick(false)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">N/A</td><td class="p-2">Made of ${hl("cellulose 纖維素", "u")} (carbohydrate)<br/>Fully permeable<br/>Structural support and protection</td></tr>
      <tr class="step step-text border-b"><td class="p-2"><strong>Cytoplasm</strong> 細胞質</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">N/A</td><td class="p-2">Jelly-like 果凍狀<br/>Water &amp; dissolved substances (e.g. protein)<br/>Site for reactions</td></tr>
      <tr class="step step-text"><td class="p-2"><strong>Vacuole</strong> 液泡</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">Single</td><td class="p-2">${hl("Large central", "b")} in plant cells<br/>Filled with water + dissolved substances (e.g. minerals)</td></tr>
    </tbody></table>`)}`
      ),
      { previewImg: "image6.png" }
    )
  );

  s.push(
    slide(
      "Organelles · Part 2",
      layoutSideRefs(
        organelleCellRefs(fig),
        tableWrap(`<table class="w-full org-table org-table--compact">${orgTableHead()}<tbody>
      <tr class="step step-text border-b"><td class="p-2"><strong>Nucleus</strong> 細胞核</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">Double nuclear membrane</td><td class="p-2">Contain DNA (genetic material)<br/>Control activities of cell (${hl("protein synthesis 合成", "c")})<br/>${hl("Nucleolus 核仁", "u")}: make ribosomes</td></tr>
      <tr class="step step-text border-b"><td class="p-2"><strong>Ribosomes</strong> 核糖體</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">N/A</td><td class="p-2">For ${hl("protein synthesis", "u")}</td></tr>
      <tr class="step step-text border-b"><td class="p-2"><strong>Rough ER</strong> 粗面內質網</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">Single</td><td class="p-2">Protein synthesis and transport</td></tr>
      <tr class="step step-text"><td class="p-2"><strong>Smooth ER</strong> 滑面內質網</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">Single</td><td class="p-2">${hl("Lipid synthesis", "c")} and transport</td></tr>
    </tbody></table>`)
      ),
      { previewImg: "image7.png" }
    )
  );

  s.push(
    slide(
      "Organelles · Part 3",
      layoutSideRefs(
        organelleCellRefs(fig),
        tableWrap(`<table class="w-full org-table org-table--compact">${orgTableHead()}<tbody>
      <tr class="step step-text border-b"><td class="p-2"><strong>Mitochondria</strong> 粒線體</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">Double</td><td class="p-2">${hl("Aerobic respiration 需氧呼吸", "r")} (needs oxygen) for energy</td></tr>
      <tr class="step step-text"><td class="p-2"><strong>Chloroplast</strong> 葉綠體</td><td class="p-2 text-center">${orgTick(false)}</td><td class="p-2 text-center">${orgTick(true)}</td><td class="p-2">Double</td><td class="p-2">Photosynthesis for food (glucose); store starch granules<br/>${hl("Chlorophyll 葉綠素", "c")} (green pigment) absorbs light<br/>${hl("Green = have chloroplast", "u")}; non-green = no (e.g. onion)</td></tr>
    </tbody></table>`)
      ),
      { previewImg: "image7.png" }
    )
  );

  s.push(
    slide(
      "Cell examples 細胞例子",
      layoutPicHero(
        figGrid2(
          fig("image11.jpeg", "E.coli 大腸桿菌", "", "fig-hero"),
          fig("image12.jpeg", "Amoeba 變形蟲", "", "fig-hero")
        ),
        `<p class="deck-text-sm step step-text">E.coli 大腸桿菌 · Amoeba 變形蟲</p>`
      ),
      { previewImg: "image11.jpeg" }
    )
  );

  s.push(
    slide(
      "Plant cells · chloroplasts 植物細胞",
      hero(
        "image13.jpeg",
        "Plant cells with chloroplasts",
        "",
        `<p class="deck-text-sm step step-text">${hl("Green parts", "c")} of plants contain chloroplasts.</p>`
      ),
      { previewImg: "image13.jpeg" }
    )
  );

  s.push(
    slide(
      "Onion & fungi 洋蔥與真菌",
      layoutPicHero(
        figGrid2(
          fig("image14.png", "Onion 洋蔥", "", "fig-hero"),
          fig("image15.png", "Fungi 真菌", "", "fig-hero")
        ),
        `<p class="deck-text-sm step step-text">Onion 洋蔥 · Fungi 真菌</p>`
      ),
      { previewImg: "image14.png" }
    )
  );

  s.push(
    slide(
      "Prokaryotes vs eukaryotes · Part 1 原核 vs 真核",
      layoutSideRefs(
        prokEukSideRefs(fig),
        tableWrap(`<table class="w-full org-table org-table--compact">${prokEukTableHead()}<tbody>
      <tr class="step step-text border-b"><td class="p-2">Examples</td><td class="p-2">Bacteria</td><td class="p-2">Mushroom, human</td><td class="p-2">Grass</td></tr>
      <tr class="step step-text border-b"><td class="p-2">No. of cells</td><td class="p-2">${hl("Unicellular 單細胞", "u")} only</td><td class="p-2" colspan="2">Unicellular or ${hl("multicellular 多細胞", "b")}</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Size</td><td class="p-2">${hl("Very small", "r")}</td><td class="p-2">smaller</td><td class="p-2">larger</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Shape</td><td class="p-2">simpler</td><td class="p-2">${hl("Irregular", "u")}</td><td class="p-2">${hl("Regular", "c")} (cell wall)</td></tr>
      <tr class="step step-text"><td class="p-2">Nucleus 細胞核</td><td class="p-2">${hl("No true nucleus", "r")}<br/>DNA lying free in cytoplasm</td><td class="p-2" colspan="2">With true nucleus 真核<br/>DNA bounded by nuclear membrane</td></tr>
    </tbody></table>`)
      ),
      { previewImg: "image10.png" }
    )
  );

  s.push(
    slide(
      "Prokaryotes vs eukaryotes · Part 2 原核 vs 真核",
      layoutSideRefs(
        prokEukSideRefs(fig),
        tableWrap(`<table class="w-full org-table org-table--compact">${prokEukTableHead()}<tbody>
      <tr class="step step-text border-b"><td class="p-2">Membrane-bound organelles<br/><span class="deck-meta">膜性胞器</span></td><td class="p-2 text-center">${orgTick(false)}</td><td class="p-2" colspan="2">${orgTick(true)} (e.g. ER, vacuole, mitochondria, chloroplast)</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Ribosomes 核糖體</td><td class="p-2 text-center">${orgTick(true)}<br/>Free in cytoplasm</td><td class="p-2" colspan="2">${orgTick(true)}<br/>Some free, some bound to rough ER</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Cell wall</td><td class="p-2">Some</td><td class="p-2">${hl("Always absent", "u")} (except fungi 真菌)</td><td class="p-2">${hl("Always present", "c")}</td></tr>
      <tr class="step step-text"><td class="p-2">Chloroplasts 葉綠體</td><td class="p-2 text-center">${orgTick(false)}</td><td class="p-2 text-center">${orgTick(false)}</td><td class="p-2 text-center">${orgTick(true)} (${hl("green parts", "c")})</td></tr>
    </tbody></table>`)
      ),
      { previewImg: "image10.png" }
    )
  );

  s.push(
    slide(
      "Draw together · Animal & plant cells 動植物細胞",
      layoutDrawTogether(
        fig("image6.png", "Animal cell · S1 Ch 4", "Reference 參考圖", "fig-side-ref"),
        fig("image7.png", "Plant cell · S1 Ch 4", "Reference 參考圖", "fig-side-ref"),
        `${hl("Draw together", "u")} — label cell membrane, nucleus, cytoplasm · plant: cell wall, vacuole, chloroplast`
      ),
      { previewImg: "image6.png" }
    )
  );

  s.push(
    slide(
      "Chloroplast · microscopy 葉綠體",
      hero(
        "image23.jpeg",
        "Chloroplast microscopy",
        "Light microscopy vs electron microscopy — grana labelled.",
        `<p class="deck-text-sm step step-text">Under ${hl("electron microscopy", "u")}, internal grana structure is visible.</p>`
      ),
      { previewImg: "image23.jpeg" }
    )
  );

  s.push(
    slide(
      "Viruses are NOT cells 病毒不是細胞",
      hero(
        "image16.jpeg",
        "Virus structure",
        "Influenza virus & bacteriophage — not cells.",
        `<p class="deck-text step step-text"><strong class="text-tertiary">${hl("Viruses are not cells! 病毒不是細胞!", "r")}</strong></p>
    <p class="deck-text-sm step step-text">Cannot carry out life processes independently.</p>`
      ),
      { previewImg: "image16.jpeg" }
    )
  );

  s.push(
    slide(
      "Concept check · Identify cells",
      hero(
        "image17.png",
        "Cells A–D",
        "A Paramecium · B blood cells · C plant mitosis · D bacteria (cocci).",
        `<p class="deck-text-sm step step-text"><strong>Identify the above cells:</strong></p>
    <p class="deck-text-sm step step-text"><strong>Prokaryotes:</strong> _________________</p>
    <p class="deck-text-sm step step-text"><strong>Eukaryotes:</strong> _________________</p>
    <p class="deck-meta step step-text">Expected: D (bacteria) · A, B, C (eukaryotes)</p>`
      ),
      { previewImg: "image17.png" }
    )
  );

  return s;
}
