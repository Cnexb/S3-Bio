(function () {
    "use strict";

    const MODEL_UID = "0b15c013059844d7a26c1f16752f8b61";

    const BAKED_LABEL = /^(NUCLEUS|CHROMOSOME|RIBOSOMES|ROUGH ENDOPLASMIC RETICULUM|SMOOTH ENDOPLASMIC RETICULUM|MEMBRANE|CENTROSOMES|MITOCHONDRION|CYTOPLASM|INTERMEDIATE FILAMENT|VACUOLE|GOLGI APPARATUS|GOLGI VESICLE|GOLGI RATUS)/;

    function isBlackLabelMesh(name) {
        const trimmed = (name || "").trim();
        if (!trimmed) return false;
        if (window.ComponentResolver.isLabelNode(trimmed)) return true;
        if (BAKED_LABEL.test(trimmed)) return true;
        return false;
    }

    function hideAllBlackLabels(api) {
        api.getNodeMap((err, nodeMap) => {
            if (err || !nodeMap) return;
            Object.entries(nodeMap).forEach(([name, instanceId]) => {
                if (isBlackLabelMesh(name)) api.hide(instanceId);
            });
        });

        window.SketchfabCommon.hideSceneNodes(api, (name) => {
            const trimmed = (name || "").trim();
            const lower = trimmed.toLowerCase();
            if (/labels|annotations|callouts|texts|name_tags|name tag/.test(lower)) return true;
            return isBlackLabelMesh(trimmed);
        });

        [200, 800, 2000].forEach((ms) => setTimeout(() => {
            api.getNodeMap((nodeErr, nodeMap) => {
                if (nodeErr || !nodeMap) return;
                Object.entries(nodeMap).forEach(([name, instanceId]) => {
                    if (isBlackLabelMesh(name)) api.hide(instanceId);
                });
            });
            window.SketchfabCommon.hideSceneNodes(api, isBlackLabelMesh);
        }, ms));
    }

    function setupAnimalCell(api) {
        hideAllBlackLabels(api);
        window.SketchfabCommon.bindComponentClick(api, "animal", {
            shouldSkipNode: isBlackLabelMesh
        });
    }

    function initPage() {
        window.SketchfabCommon.initPage(
            "animal",
            MODEL_UID,
            "Animal Cell 3D model by aremay on Sketchfab",
            null,
            {
                openCell: {
                    maxDelayMs: 2000
                },
                onReady: setupAnimalCell
            }
        );
    }

    window.AnimalCellSketchfab = { initPage };
})();
