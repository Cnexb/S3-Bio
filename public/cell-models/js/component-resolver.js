(function () {
    "use strict";

    // Order matters: more specific patterns first.
    const COMPONENT_PATTERNS = [
        { id: "roughER", patterns: [/rough\s*endoplasmic/, /\brer\b/, /rough\s*er\b/, /rough_er/, /rougher/] },
        { id: "smoothER", patterns: [/smooth\s*endoplasmic/, /\bser\b/, /smooth\s*er\b/, /smooth_er/, /smoother/] },
        { id: "plasmaMembrane", alias: "membrane", patterns: [/plasma\s*membrane/, /plasmamembrane/] },
        { id: "cellWall", patterns: [/cell\s*wall/, /cellwall/, /\bwall\b/] },
        { id: "cellMembrane", alias: "membrane", patterns: [/cell\s*membrane/] },
        { id: "chloroplast", patterns: [/chloroplast/] },
        { id: "mitochondria", patterns: [/mitochondr/] },
        { id: "nucleoid", patterns: [/\bnucleoid\b/, /\bdna\b/, /genetic\s*material/, /chromosome\s*dna/, /\bstrings\b/] },
        { id: "chromosome", patterns: [/chromosome/, /chromatin/] },
        { id: "nucleus", patterns: [/\bnucleus\b/, /nucleolus/, /nuclear\s*envelope/] },
        { id: "ribosome", patterns: [/ribosome/, /ribosomes/, /\bribs\b/] },
        { id: "vacuole", patterns: [/vacuole/, /central\s*vacuole/] },
        { id: "flagellum", patterns: [/flagell/, /flagella/, /\btail\b/] },
        { id: "pili", patterns: [/\bpili\b/, /\bpilus\b/, /pili/] },
        { id: "capsule", patterns: [/\bcapsule\b/] },
        { id: "cytoplasm", patterns: [/cytoplasm/, /\bcyto\b/, /\bcytoplasm1\b/] },
        { id: "plasmid", patterns: [/plasmid/] },
        { id: "membrane", patterns: [/\bmembrane\b/, /\bplasma\b/] }
    ];

    function resolveComponentName(name, cellType) {
        const data = window.CELL_DATA && window.CELL_DATA[cellType];
        if (!data || !name) return null;

        const lower = String(name).toLowerCase();

        for (const entry of COMPONENT_PATTERNS) {
            const targetId = entry.alias || entry.id;
            if (!data.components[targetId]) continue;
            for (const pattern of entry.patterns) {
                if (pattern.test(lower)) return targetId;
            }
        }
        return null;
    }

    function isLabelNode(name) {
        const lower = String(name || "").toLowerCase();
        return /label|callout|annotation|nameplate|textbox|leader|pointer|_tag|\btag\b|3dtext|\btext\b|\bline\b|\barrow\b|connector|bezier|\bcurve\b/.test(lower);
    }

    window.ComponentResolver = {
        COMPONENT_PATTERNS,
        resolveComponentName,
        isLabelNode
    };
})();
