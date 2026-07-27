(function () {
    "use strict";

    const BG = 0x888888;

    function createEngine(options) {
        const { cellType, buildModel } = options;
        const data = window.CELL_DATA[cellType];
        if (!data) throw new Error("Unknown cell type: " + cellType);

        const container = document.getElementById("canvas-container");
        const uiPanel = document.getElementById("ui-panel");
        const panelToggleBtn = document.getElementById("panel-toggle-btn");
        const panelToggleIcon = document.getElementById("panel-toggle-icon");
        const panelToggleLabel = document.getElementById("panel-toggle-label");
        const infoCard = document.getElementById("info-card");
        let panelOpen = true;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(BG);
        scene.fog = new THREE.FogExp2(BG, 0.004);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 8, 28);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 8;
        controls.maxDistance = 55;
        if (cellType === "plant" || cellType === "prokaryote" || cellType === "eukaryote" || cellType === "animal") {
            controls.maxPolarAngle = Math.PI;
        }

        const softLighting = cellType === "animal";
        scene.add(new THREE.AmbientLight(0xffffff, softLighting ? 0.78 : 0.85));
        const topLight = new THREE.DirectionalLight(0xffffff, softLighting ? 0.95 : 1.1);
        topLight.position.set(8, 18, 12);
        scene.add(topLight);
        const fillLight = new THREE.DirectionalLight(0xfff5f0, softLighting ? 0.35 : 0);
        fillLight.position.set(-6, 4, 8);
        scene.add(fillLight);
        const rimLight = new THREE.DirectionalLight(0x3a86ff, softLighting ? 0.22 : 0.45);
        rimLight.position.set(-20, 5, -20);
        scene.add(rimLight);

        const interactiveTargets = [];
        const animatedParts = [];

        const modelCtx = {
            scene,
            renderer,
            camera,
            interactiveTargets,
            animatedParts,
            registerInteractive(mesh, id) {
                mesh.userData.id = id;
                interactiveTargets.push(mesh);
                return mesh;
            },
            registerAllMeshes(object, id) {
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.userData.id = id;
                        interactiveTargets.push(child);
                    }
                });
                if (object.isMesh) {
                    object.userData.id = id;
                    interactiveTargets.push(object);
                }
                object.userData.id = id;
                return object;
            },
            registerAnimated(obj, seed, motion, extra) {
                const part = { obj, seed: seed || 0, motion: motion || "bob" };
                if (extra) Object.assign(part, extra);
                animatedParts.push(part);
                return obj;
            }
        };

        buildModel(modelCtx);

        function resizeRenderer() {
            const w = container.clientWidth || window.innerWidth;
            const h = container.clientHeight || window.innerHeight;
            if (!w || !h) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }

        function showStructureInfo(id) {
            const comp = data.components[id];
            if (!comp) return;
            document.getElementById("card-title").textContent = comp.title;
            document.getElementById("card-props-en").textContent = comp.properties;
            document.getElementById("card-func-en").textContent = comp.function;
            document.getElementById("card-props-zh").textContent = comp.propertiesZh;
            document.getElementById("card-func-zh").textContent = comp.functionZh;
            infoCard.style.display = "block";
        }

        function resolveStructureId(object) {
            let current = object;
            while (current) {
                if (current.userData && current.userData.id) return current.userData.id;
                current = current.parent;
            }
            return null;
        }

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const pointerDown = { x: 0, y: 0, time: 0 };

        function isUiHit(event) {
            const target = event.target;
            if (!target) return false;
            return !!target.closest("#ui-panel, #panel-toggle-btn, #info-card, .cell-nav");
        }

        function pickStructureAtClient(clientX, clientY) {
            const rect = renderer.domElement.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(interactiveTargets, true);
            for (let i = 0; i < hits.length; i++) {
                const id = resolveStructureId(hits[i].object);
                if (id) {
                    showStructureInfo(id);
                    return;
                }
            }
        }

        panelToggleBtn.addEventListener("click", () => {
            panelOpen = !panelOpen;
            uiPanel.classList.toggle("collapsed", !panelOpen);
            panelToggleBtn.setAttribute("aria-expanded", String(panelOpen));
            panelToggleIcon.textContent = panelOpen ? "◀" : "▶";
            panelToggleLabel.textContent = panelOpen
                ? "Hide controls / 收起控制面板"
                : "Show controls / 打開控制面板";
            requestAnimationFrame(resizeRenderer);
        });

        document.querySelector(".close-btn").addEventListener("click", () => {
            infoCard.style.display = "none";
        });

        renderer.domElement.addEventListener("pointerdown", (e) => {
            pointerDown.x = e.clientX;
            pointerDown.y = e.clientY;
            pointerDown.time = performance.now();
        });

        renderer.domElement.addEventListener("pointerup", (e) => {
            if (isUiHit(e)) return;
            const dx = e.clientX - pointerDown.x;
            const dy = e.clientY - pointerDown.y;
            if (Math.hypot(dx, dy) > 8) return;
            if (performance.now() - pointerDown.time > 600) return;
            pickStructureAtClient(e.clientX, e.clientY);
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            animatedParts.forEach((part) => {
                const s = part.seed;
                if (part.motion === "spin") {
                    part.obj.rotation.y += 0.008;
                    part.obj.rotation.z = Math.sin(time * 0.6 + s) * 0.08;
                } else if (part.motion === "pulse") {
                    const scale = 1 + Math.sin(time * 1.4 + s) * 0.04;
                    part.obj.scale.set(scale, scale, scale);
                } else if (part.motion === "orbit") {
                    part.obj.rotation.y = time * 0.35 + s;
                } else if (part.motion === "wave") {
                    part.obj.children.forEach((child, idx) => {
                        child.rotation.z = -idx * 0.35 - Math.sin(time * 3 + idx * 0.5 + s) * 0.25;
                    });
                } else if (part.motion === "bobFlat") {
                    const base = part.base || { x: 0, z: 0 };
                    part.obj.position.x = base.x + Math.sin(time * 1.1 + s) * 0.06;
                    part.obj.position.z = base.z + Math.cos(time * 0.9 + s) * 0.06;
                    if (part.lockY !== undefined) part.obj.position.y = part.lockY;
                } else if (part.motion === "pulseY") {
                    const scale = 1 + Math.sin(time * 1.4 + s) * 0.03;
                    part.obj.scale.y = scale;
                } else {
                    if (part.lockY !== undefined) {
                        part.obj.position.y = part.lockY + Math.sin(time * 1.1 + s) * 0.002;
                    } else {
                        part.obj.position.y += Math.sin(time * 1.1 + s) * 0.002;
                    }
                    part.obj.rotation.y += 0.003;
                }
            });

            controls.update();
            renderer.render(scene, camera);
        }

        window.addEventListener("resize", resizeRenderer);
        if (typeof ResizeObserver !== "undefined") {
            new ResizeObserver(() => requestAnimationFrame(resizeRenderer)).observe(container);
        }

        resizeRenderer();
        animate();
    }

    function buildNav(activeId) {
        const nav = document.getElementById("cell-nav");
        if (!nav) return;
        nav.innerHTML = window.CELL_PAGES.map((page) => {
            const active = page.id === activeId ? " active" : "";
            return `<a href="${page.file}" class="cell-link${active}">${page.icon} ${page.label}</a>`;
        }).join("");
    }

    function initPage(cellType, buildModel) {
        const data = window.CELL_DATA[cellType];
        document.getElementById("page-title").textContent = data.title;
        document.getElementById("page-title-zh").textContent = data.titleZh;
        document.getElementById("cell-tip").textContent = data.tip;
        buildNav(cellType);
        createEngine({ cellType, buildModel });
    }

    window.CellEngine = { initPage, createEngine };
})();
