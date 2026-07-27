(function () {
    "use strict";

    window.LayeredCell = {
        createOvalShape(rw, rh) {
            const shape = new THREE.Shape();
            shape.absellipse(0, 0, rw, rh, 0, Math.PI * 2, false, 0);
            return shape;
        },

        createRoundedRectShape(halfW, halfH, corner) {
            const shape = new THREE.Shape();
            const w = halfW;
            const h = halfH;
            const c = corner;
            shape.moveTo(-w + c, -h);
            shape.lineTo(w - c, -h);
            shape.quadraticCurveTo(w, -h, w, -h + c);
            shape.lineTo(w, h - c);
            shape.quadraticCurveTo(w, h, w - c, h);
            shape.lineTo(-w + c, h);
            shape.quadraticCurveTo(-w, h, -w, h - c);
            shape.lineTo(-w, -h + c);
            shape.quadraticCurveTo(-w, -h, -w + c, -h);
            return shape;
        },

        createLayer(shape, thickness, yCenter, material) {
            const geo = new THREE.ExtrudeGeometry(shape, {
                depth: thickness,
                bevelEnabled: false,
                steps: 1
            });
            geo.rotateX(-Math.PI / 2);
            geo.center();
            geo.translate(0, yCenter, 0);
            return new THREE.Mesh(geo, material);
        },

        registerAllMeshes(ctx, object, id) {
            object.traverse((child) => {
                if (child.isMesh) ctx.registerInteractive(child, id);
            });
            if (object.isMesh) ctx.registerInteractive(object, id);
            object.userData.id = id;
            return object;
        },

        flatY(surfaceY) {
            return surfaceY;
        },

        wavyTubeFlat(ctx, points2d, radius, material, id, ribosomes, surfaceY) {
            const pts = points2d.map(([x, z]) => new THREE.Vector3(x, surfaceY, z));
            const curve = new THREE.CatmullRomCurve3(pts);
            const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, radius, 8, false), material);
            LayeredCell.registerAllMeshes(ctx, tube, id);
            return tube;
        },

        setupLayeredView(ctx) {
            ctx.camera.position.set(0, 22, 5);
            ctx.camera.lookAt(0, 0, 0);
        }
    };
})();
