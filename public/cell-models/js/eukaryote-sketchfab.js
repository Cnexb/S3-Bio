(function () {
    "use strict";

    const MODEL_UID = "b7d84e5f2d5e411fbb195ab2742f2256";

    function initPage() {
        window.SketchfabCommon.initPage(
            "eukaryote",
            MODEL_UID,
            "Eukaryotic Cell 3D model by The Center for BioMedical Visualization at SGU on Sketchfab",
            null,
            {
                openCell: {
                    maxDelayMs: 2000,
                    annotationIndex: 3,
                    shouldHideNode(name) {
                        return /plasma_membrane_out|outlide_layer|outside_layer/i.test(name || "");
                    }
                }
            }
        );
    }

    window.EukaryoteSketchfab = { initPage };
})();
