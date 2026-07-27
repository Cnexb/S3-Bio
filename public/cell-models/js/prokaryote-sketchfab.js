(function () {
    "use strict";

    const MODEL_UID = "9db95b53121e40ada34b360fd4a1f841";

    const ANNOTATION_MAP = [
        "flagellum", "pili", "capsule", "cellWall", "membrane",
        "nucleoid", "ribosome", "cytoplasm"
    ];

    const VISIBLE_LABEL_INDICES = [5, 6, 7];

    function setupProkaryote(api) {
        window.SketchfabCommon.bindComponentClick(api, "prokaryote", {
            stripAnnotations: false,
            blockInheritedIds: ["capsule"],
            resolveAnnotation(_annotation, index) {
                return ANNOTATION_MAP[index] || null;
            }
        });
    }

    function initPage() {
        window.SketchfabCommon.initPage(
            "prokaryote",
            MODEL_UID,
            "Prokaryotic Cell 3D model by Andy Todd on Sketchfab",
            null,
            {
                viewerOptions: {
                    init: {
                        ui_annotations: 1,
                        annotations_visible: 1,
                        annotation_tooltip_visible: 1
                    },
                    annotations: {
                        keepIndices: VISIBLE_LABEL_INDICES
                    }
                },
                openCell: {
                    maxDelayMs: 2000,
                    hideMaterialNames: ["Capsule"],
                    annotationIndex: 3
                },
                onReady: setupProkaryote
            }
        );
    }

    window.ProkaryoteCellSketchfab = { initPage };
})();
