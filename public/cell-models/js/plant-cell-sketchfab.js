(function () {
    "use strict";

    const MODEL_UID = "f258c65762e5435c9d58c1aa136b557a";

    const ANNOTATION_MAP = [
        "cellWall", "vacuole", "nucleus", "ribosome", "roughER",
        "golgi", "mitochondria", "chloroplast", "cytoplasm", "membrane", "smoothER"
    ];

    function initPage() {
        window.SketchfabCommon.initPage(
            "plant",
            MODEL_UID,
            "Eukaryotic Plant Cell 3D model by jlf_illustration on Sketchfab",
            null,
            {
                openCell: {
                    maxDelayMs: 2000,
                    annotationIndex: 9
                },
                clickOptions: {
                    resolveAnnotation(_annotation, index) {
                        return ANNOTATION_MAP[index] || null;
                    }
                }
            }
        );
    }

    window.PlantCellSketchfab = { initPage };
})();
