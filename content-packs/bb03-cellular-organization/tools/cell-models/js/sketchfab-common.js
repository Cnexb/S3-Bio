(function () {
    "use strict";

    const MID_GREY = [136 / 255, 136 / 255, 136 / 255];
    const PICK_THRESHOLD = 5;

    function buildNav(activeId) {
        const nav = document.getElementById("cell-nav");
        if (!nav) return;
        nav.innerHTML = window.CELL_PAGES.map((page) => {
            const active = page.id === activeId ? " active" : "";
            return `<a href="${page.file}" class="cell-link${active}">${page.label}</a>`;
        }).join("");
    }

    function showStructureInfo(cellType, id) {
        const data = window.CELL_DATA[cellType];
        const comp = data && data.components[id];
        if (!comp) return;

        document.getElementById("card-title").textContent = comp.title;
        document.getElementById("card-props-en").textContent = comp.properties;
        document.getElementById("card-func-en").textContent = comp.function;
        document.getElementById("card-props-zh").textContent = comp.propertiesZh;
        document.getElementById("card-func-zh").textContent = comp.functionZh;
        document.getElementById("info-card").style.display = "block";
    }

    function distance3(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    function annotationPosition(annotation) {
        if (annotation.target && annotation.target.length === 3) return annotation.target;
        if (annotation.position && annotation.position.length === 3) return annotation.position;
        if (annotation.eye && annotation.eye.length === 3) return annotation.eye;
        return null;
    }

    function hideModelLabelNodes(api) {
        api.getNodeMap((err, nodeMap) => {
            if (err || !nodeMap) return;
            Object.entries(nodeMap).forEach(([name, instanceId]) => {
                const lower = name.toLowerCase();
                if (/label|nameplate|name_plate|annotation|_text|text_|_tag|tag_|number|digit/.test(lower)) {
                    api.hide(instanceId);
                }
            });
        });
    }

    function stripAllAnnotations(api, onCached) {
        function remove() {
            if (typeof api.hideAnnotationTooltips === "function") {
                api.hideAnnotationTooltips();
            }
            if (typeof api.removeAllAnnotations === "function") {
                api.removeAllAnnotations();
            }
            for (let i = 0; i < 50; i++) {
                api.hideAnnotation(i);
                if (typeof api.hideAnnotationTooltip === "function") {
                    api.hideAnnotationTooltip(i);
                }
            }
        }

        remove();

        api.getAnnotationList((err, list) => {
            const cached = !err && list ? list.slice() : [];
            remove();
            if (onCached) onCached(cached);
        });

        [150, 500, 1200].forEach((ms) => setTimeout(remove, ms));
    }

    function manageAnnotations(api, options) {
        const opts = options || {};
        const keepIndices = new Set(opts.keepIndices || []);
        const hideIndices = new Set(opts.hideIndices || []);

        function apply() {
            api.getAnnotationList((err, list) => {
                if (err || !list) return;

                if (opts.removeAll) {
                    stripAllAnnotations(api);
                    return;
                }

                list.forEach((_annotation, index) => {
                    const shouldKeep = keepIndices.size
                        ? keepIndices.has(index)
                        : !hideIndices.has(index);

                    if (shouldKeep) {
                        if (typeof api.showAnnotation === "function") {
                            api.showAnnotation(index);
                        }
                        if (typeof api.showAnnotationTooltip === "function") {
                            api.showAnnotationTooltip(index);
                        }
                    } else {
                        api.hideAnnotation(index);
                        if (typeof api.hideAnnotationTooltip === "function") {
                            api.hideAnnotationTooltip(index);
                        }
                    }
                });

                if (typeof api.hideAnnotationTooltips === "function" && keepIndices.size) {
                    keepIndices.forEach((index) => {
                        if (typeof api.showAnnotationTooltip === "function") {
                            api.showAnnotationTooltip(index);
                        }
                    });
                }
            });
        }

        apply();
        [150, 500, 1200].forEach((ms) => setTimeout(apply, ms));
    }

    function hideNodesByMaterialNames(api, materialNames) {
        const targets = new Set((materialNames || []).map((name) => String(name).toLowerCase()));
        if (!targets.size) return;

        api.getMaterialList((matErr, materials) => {
            if (matErr || !materials) return;
            const hideMaterialUids = new Set();
            materials.forEach((material) => {
                if (material.name && targets.has(material.name.toLowerCase())) {
                    hideMaterialUids.add(material.uid);
                }
            });

            api.getNodeMap((nodeErr, nodeMap) => {
                if (nodeErr || !nodeMap) return;
                Object.entries(nodeMap).forEach(([name, instanceId]) => {
                    if (targets.has(String(name).toLowerCase())) {
                        api.hide(instanceId);
                    }
                });
            });

            api.getSceneGraph((graphErr, graph) => {
                if (graphErr || !graph) return;

                function walk(node) {
                    if (!node) return;
                    const materials = node.materials || (node.material ? [node.material] : []);
                    if (node.instanceID && materials.some((uid) => hideMaterialUids.has(uid))) {
                        api.hide(node.instanceID);
                    }
                    (node.children || []).forEach(walk);
                }

                walk(graph);
            });
        });
    }

    function openCellView(api, options) {
        const opts = options || {};
        const maxDelay = opts.maxDelayMs != null ? opts.maxDelayMs : 2000;

        function openNow() {
            if (opts.hideMaterialNames && opts.hideMaterialNames.length) {
                hideNodesByMaterialNames(api, opts.hideMaterialNames);
            }

            if (typeof opts.shouldHideNode === "function") {
                hideSceneNodes(api, opts.shouldHideNode);
            }

            if (opts.annotationIndex != null && typeof api.gotoAnnotation === "function") {
                api.gotoAnnotation(opts.annotationIndex, {
                    preventCameraAnimation: opts.animateCamera !== true,
                    preventCameraMove: false
                });
            }

            if (typeof api.getAnimations === "function") {
                api.getAnimations((err, animations) => {
                    if (err || !animations || !animations.length) return;
                    api.setCurrentAnimationByUID(animations[0][0], () => {
                        if (typeof api.play === "function") api.play();
                    });
                });
            }
        }

        openNow();
        [300, 800, 1500, Math.min(maxDelay, 2000)].forEach((ms) => setTimeout(openNow, ms));
    }

    function hideAllAnnotationLabels(api) {
        stripAllAnnotations(api);
    }

    function hideSceneNodes(api, shouldHide) {
        api.getSceneGraph((err, graph) => {
            if (err || !graph) return;
            function walk(node) {
                if (!node) return;
                const name = node.name || "";
                if (node.instanceID && shouldHide(name)) {
                    api.hide(node.instanceID);
                }
                (node.children || []).forEach(walk);
            }
            walk(graph);
        });
    }

    function prepareViewer(api, options) {
        const opts = options || {};
        api.setBackground({ color: MID_GREY });
        if (opts.annotations) {
            manageAnnotations(api, opts.annotations);
        } else if (opts.keepAnnotations !== false) {
            hideAllAnnotationLabels(api);
        }
    }

    function registerSceneNodes(api, cellType, instanceToComponent, materialToComponent, inheritedId, shouldSkip, registerOptions) {
        const resolver = window.ComponentResolver;
        const regOpts = registerOptions || {};

        api.getNodeMap((err, nodeMap) => {
            if (err || !nodeMap) return;
            Object.entries(nodeMap).forEach(([name, instanceId]) => {
                if (shouldSkip && shouldSkip(name)) return;
                if (resolver.isLabelNode(name)) return;

                const componentId = resolver.resolveComponentName(name, cellType);
                if (componentId) {
                    instanceToComponent[instanceId] = componentId;
                }
            });
        });

        api.getSceneGraph((err, graph) => {
            if (err || !graph) return;

            function walk(node, parentId) {
                if (!node) return;
                const name = node.name || "";
                if (shouldSkip && shouldSkip(name)) {
                    (node.children || []).forEach((child) => walk(child, parentId));
                    return;
                }

                const ownId = resolver.isLabelNode(name)
                    ? null
                    : resolver.resolveComponentName(name, cellType);
                let effectiveId = ownId || parentId;
                if (!ownId && parentId && regOpts.blockInheritedIds && regOpts.blockInheritedIds.includes(parentId)) {
                    effectiveId = null;
                }

                if (node.instanceID && effectiveId) {
                    instanceToComponent[node.instanceID] = effectiveId;
                }

                const childParent = ownId || (
                    regOpts.blockInheritedIds && parentId && regOpts.blockInheritedIds.includes(parentId)
                        ? null
                        : parentId
                );
                (node.children || []).forEach((child) => walk(child, childParent));
            }

            walk(graph, inheritedId || null);
        });

        api.getMaterialList((matErr, materials) => {
            if (matErr || !materials) return;
            materials.forEach((material) => {
                const componentId = resolver.resolveComponentName(material.name, cellType);
                if (componentId && material.uid) {
                    materialToComponent[material.uid] = componentId;
                }
                if (componentId && material.name) {
                    materialToComponent[material.name] = componentId;
                }
            });
        });
    }

    function bindComponentClick(api, cellType, options) {
        const opts = options || {};
        const resolver = window.ComponentResolver;
        const instanceToComponent = Object.create(null);
        const materialToComponent = Object.create(null);
        const clickTargets = [];

        registerSceneNodes(api, cellType, instanceToComponent, materialToComponent, null, opts.shouldSkipNode, {
            blockInheritedIds: opts.blockInheritedIds
        });

        const cacheAnnotations = opts.cacheAnnotations !== false;
        const onCached = cacheAnnotations
            ? (list) => {
                list.forEach((annotation, index) => {
                    const position = annotationPosition(annotation);
                    let componentId = resolver.resolveComponentName(annotation.title || annotation.name || "", cellType);
                    if (!componentId && typeof opts.resolveAnnotation === "function") {
                        componentId = opts.resolveAnnotation(annotation, index);
                    }
                    if (position && componentId) {
                        clickTargets.push({ position, componentId });
                    }
                });
            }
            : null;

        if (opts.stripAnnotations === false) {
            api.getAnnotationList((err, list) => {
                if (!err && list && onCached) onCached(list);
            });
        } else {
            stripAllAnnotations(api, onCached);
        }

        api.addEventListener("click", (info) => {
            if (!info || !info.position3D) return;

            if (info.instanceID && instanceToComponent[info.instanceID]) {
                showStructureInfo(cellType, instanceToComponent[info.instanceID]);
                return;
            }

            if (info.material) {
                const matKey = info.material.uid || info.material.name;
                if (matKey && materialToComponent[matKey]) {
                    showStructureInfo(cellType, materialToComponent[matKey]);
                    return;
                }
                const fromName = resolver.resolveComponentName(info.material.name, cellType);
                if (fromName) {
                    showStructureInfo(cellType, fromName);
                    return;
                }
            }

            let best = null;
            let bestDist = Infinity;
            clickTargets.forEach((target) => {
                const dist = distance3(info.position3D, target.position);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = target;
                }
            });

            if (best && bestDist <= PICK_THRESHOLD) {
                showStructureInfo(cellType, best.componentId);
            }
        }, { pick: "slow" });

        [300, 1000].forEach((ms) => {
            setTimeout(() => {
                registerSceneNodes(api, cellType, instanceToComponent, materialToComponent, null, opts.shouldSkipNode, {
                    blockInheritedIds: opts.blockInheritedIds
                });
            }, ms);
        });
    }

    function bindModelClick(api, cellType, resolveComponentId) {
        bindComponentClick(api, cellType, {
            resolveAnnotation(annotation, index) {
                return resolveComponentId(annotation, index);
            }
        });
    }

    function initSketchfabViewer(modelUid, iframeTitle, onReady, viewerOptions) {
        const container = document.getElementById("canvas-container");
        const iframe = document.createElement("iframe");
        iframe.id = "sketchfab-frame";
        iframe.title = iframeTitle;
        iframe.setAttribute("allow", "autoplay; fullscreen; xr-spatial-tracking");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("mozallowfullscreen", "true");
        iframe.setAttribute("webkitallowfullscreen", "true");
        iframe.setAttribute("xr-spatial-tracking", "");
        iframe.setAttribute("execution-while-out-of-viewport", "");
        iframe.setAttribute("execution-while-not-rendered", "");
        iframe.setAttribute("web-share", "");
        container.appendChild(iframe);

        const client = new Sketchfab("1.12.1", iframe);
        const initOptions = Object.assign({
            autostart: 1,
            preload: 1,
            asyncShader: 1,
            drs: 1,
            maxDevicePixelRatio: 1,
            ui_controls: 0,
            ui_general_controls: 0,
            ui_infos: 0,
            ui_inspector: 0,
            ui_watermark: 0,
            ui_watermark_link: 0,
            ui_help: 0,
            ui_settings: 0,
            ui_vr: 0,
            ui_ar: 0,
            ui_fullscreen: 0,
            ui_loading: 0,
            ui_annotations: 0,
            annotations_visible: 0,
            annotation_tooltip_visible: 0,
            ui_stop: 0,
            transparent: 0,
            quality: "sd",
            success(api) {
                api.start();
                api.addEventListener("viewerstart", () => {
                    iframe.classList.add("ready");
                });
                api.addEventListener("viewerready", () => {
                    iframe.classList.add("ready");
                    requestAnimationFrame(() => {
                        prepareViewer(api, viewerOptions);
                        if (onReady) onReady(api);
                    });
                });
            },
            error() {
                container.innerHTML =
                    "<p style=\"padding:2rem;color:#fff;\">Could not load 3D model. Check your connection. / 無法載入 3D 模型。</p>";
            }
        }, viewerOptions && viewerOptions.init ? viewerOptions.init : {});

        client.init(modelUid, initOptions);
    }

    function initPage(cellType, modelUid, iframeTitle, resolveComponentId, options) {
        const opts = options || {};
        buildNav(cellType);

        const uiPanel = document.getElementById("ui-panel");
        const panelToggleBtn = document.getElementById("panel-toggle-btn");
        const panelToggleIcon = document.getElementById("panel-toggle-icon");
        const panelToggleLabel = document.getElementById("panel-toggle-label");
        const infoCard = document.getElementById("info-card");
        let panelOpen = true;

        panelToggleBtn.addEventListener("click", () => {
            panelOpen = !panelOpen;
            uiPanel.classList.toggle("collapsed", !panelOpen);
            panelToggleBtn.setAttribute("aria-expanded", String(panelOpen));
            panelToggleIcon.textContent = panelOpen ? "◀" : "▶";
            panelToggleLabel.textContent = panelOpen
                ? "Hide controls / 收起控制面板"
                : "Show controls / 打開控制面板";
        });

        document.querySelector(".close-btn").addEventListener("click", () => {
            infoCard.style.display = "none";
        });

        initSketchfabViewer(modelUid, iframeTitle, (api) => {
            if (opts.disableAutoOpen !== true) {
                openCellView(api, opts.openCell || { maxDelayMs: 2000 });
            }
            if (typeof opts.onReady === "function") {
                opts.onReady(api);
                return;
            }
            if (opts.hideModelLabels) hideModelLabelNodes(api);
            bindComponentClick(api, cellType, opts.clickOptions || {});
        }, opts.viewerOptions);
    }

    window.SketchfabCommon = {
        buildNav,
        showStructureInfo,
        stripAllAnnotations,
        manageAnnotations,
        hideAllAnnotationLabels,
        hideModelLabelNodes,
        hideSceneNodes,
        hideNodesByMaterialNames,
        openCellView,
        prepareViewer,
        bindComponentClick,
        bindModelClick,
        initSketchfabViewer,
        initPage,
        annotationPosition,
        distance3
    };
})();
