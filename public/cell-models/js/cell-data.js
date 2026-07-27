window.CELL_DATA = {
    animal: {
        title: "Animal Cell",
        titleZh: "動物細胞",
        tip: "Drag to rotate the model. Click any exposed organelle for its description. / 拖曳旋轉模型。點擊任何細胞器查看說明。",
        components: {
            membrane: {
                title: "Cell Membrane / 細胞膜",
                properties: "Phospholipid bilayer with embedded proteins; selectively permeable; fluid mosaic model.",
                function: "Controls entry and exit of substances; maintains cell shape; enables cell recognition and signalling.",
                propertiesZh: "磷脂雙層含嵌入蛋白；具選擇性滲透性；流動鑲嵌模型。",
                functionZh: "控制物質進出；維持細胞形狀；參與細胞識別與信號傳遞。"
            },
            nucleus: {
                title: "Nucleus / 細胞核",
                properties: "Double membrane (nuclear envelope); contains chromatin and nucleolus; largest organelle.",
                function: "Stores genetic material (DNA); controls protein synthesis and cell activities.",
                propertiesZh: "雙層核膜；含染色質與核仁；通常為最大細胞器。",
                functionZh: "儲存遺傳物質（DNA）；控制蛋白質合成與細胞活動。"
            },
            chromosome: {
                title: "Chromosome / 染色體",
                properties: "Thread-like structures of DNA and proteins (chromatin); visible during cell division.",
                function: "Carries genes; ensures accurate duplication and distribution of genetic material.",
                propertiesZh: "由 DNA 及蛋白質（染色質）組成的絲狀結構；細胞分裂時可見。",
                functionZh: "攜帶基因；確保遺傳物質準確複製及分配。"
            },
            mitochondria: {
                title: "Mitochondrion / 線粒體",
                properties: "Double membrane; inner folds (cristae); contains own DNA; kidney-bean shape.",
                function: "Site of aerobic respiration; produces ATP (energy currency) for the cell.",
                propertiesZh: "雙層膜；內膜形成嵴；含自身 DNA；腎形外觀。",
                functionZh: "進行有氧呼吸；產生 ATP 供細胞使用。"
            },
            roughER: {
                title: "Rough Endoplasmic Reticulum / 粗糙內質網",
                properties: "Network of flattened sacs studded with ribosomes on the outer surface; surrounds the nucleus.",
                function: "Synthesises proteins for secretion, membranes and lysosomes; folds and transports polypeptides.",
                propertiesZh: "外表面附核糖體的扁平囊狀網絡；環繞細胞核。",
                functionZh: "合成分泌蛋白、膜蛋白及溶酶體蛋白；摺疊並運輸多肽鏈。"
            },
            smoothER: {
                title: "Smooth Endoplasmic Reticulum / 平滑內質網",
                properties: "Tubular membrane network without ribosomes; located away from the nucleus.",
                function: "Synthesises lipids and steroids; detoxifies harmful substances; stores calcium ions.",
                propertiesZh: "無核糖體的管狀膜網絡；分布於遠離細胞核的區域。",
                functionZh: "合成脂質及固醇；解毒；儲存鈣離子。"
            },
            vacuole: {
                title: "Vacuole / 液泡",
                properties: "Small membrane-bound sacs in animal cells; much smaller than the plant central vacuole.",
                function: "Stores water, ions and waste; maintains osmotic balance; involved in exocytosis.",
                propertiesZh: "動物細胞中較小的膜包圍囊泡；遠小於植物中央液泡。",
                functionZh: "儲存水分、離子及廢物；維持滲透平衡；參與外排作用。"
            },
            ribosome: {
                title: "Ribosome / 核糖體",
                properties: "Small granules (no membrane); composed of rRNA and proteins; free or bound to ER.",
                function: "Site of protein synthesis (translation of mRNA into polypeptides).",
                propertiesZh: "微小顆粒（無膜）；由 rRNA 與蛋白質組成；游離或附於內質網。",
                functionZh: "蛋白質合成場所（將 mRNA 轉譯為多肽鏈）。"
            },
            golgi: {
                title: "Golgi Apparatus / 高爾基體",
                properties: "Stack of flattened, curved membrane sacs (cisternae); pinkish in appearance; located near the ER.",
                function: "Modifies, sorts and packages proteins and lipids from the ER for secretion or delivery to organelles.",
                propertiesZh: "一疊扁平彎曲的膜囊（池）；呈粉紅色；位於內質網附近。",
                functionZh: "修飾、分類並包裝來自內質網的蛋白質與脂質，以便分泌或運送至其他細胞器。"
            },
            cytoplasm: {
                title: "Cytoplasm / 細胞質",
                properties: "Gel-like cytosol containing dissolved ions, nutrients and enzymes; suspends organelles.",
                function: "Medium for metabolic reactions; supports organelle movement and material exchange.",
                propertiesZh: "膠狀胞質溶膠，含離子、營養物及酶；懸浮各細胞器。",
                functionZh: "代謝反應的介質；支持細胞器移動與物質交換。"
            }
        }
    },
    plant: {
        title: "Plant Cell",
        titleZh: "植物細胞",
        tip: "Drag to rotate the model. Click any exposed part for its description. / 拖曳旋轉模型。點擊任何部分查看說明。",
        components: {
            cellWall: {
                title: "Cell Wall / 細胞壁",
                properties: "Rigid outer layer of cellulose and other polysaccharides; permeable to water and ions.",
                function: "Provides structural support and protection; prevents bursting in hypotonic solutions.",
                propertiesZh: "由纤维素等構成的堅硬外層；對水及離子具滲透性。",
                functionZh: "提供結構支持與保護；防止在低滲環境中脹破。"
            },
            membrane: {
                title: "Cell Membrane / 細胞膜",
                properties: "Phospholipid bilayer inside the cell wall; selectively permeable.",
                function: "Regulates transport of substances; maintains internal environment.",
                propertiesZh: "位於細胞壁內的磷脂雙層；具選擇性滲透性。",
                functionZh: "調節物質運輸；維持細胞內環境。"
            },
            nucleus: {
                title: "Nucleus / 細胞核",
                properties: "Double membrane; contains chromatin controlling plant growth and development.",
                function: "Stores DNA; directs synthesis of enzymes for photosynthesis and metabolism.",
                propertiesZh: "雙層膜；含控制生長發育的染色質。",
                functionZh: "儲存 DNA；指導光合作用及代謝所需酶的合成。"
            },
            chloroplast: {
                title: "Chloroplast / 葉綠體",
                properties: "Double membrane; contains chlorophyll; internal thylakoid stacks (grana).",
                function: "Site of photosynthesis; converts light energy into chemical energy (glucose).",
                propertiesZh: "雙層膜；含叶绿素；內有类囊體堆疊（基粒）。",
                functionZh: "光合作用場所；將光能轉化為化學能（葡萄糖）。"
            },
            vacuole: {
                title: "Central Vacuole / 中央液泡",
                properties: "Large single membrane-bound sac; contains cell sap (water, ions, pigments).",
                function: "Maintains turgor pressure; stores nutrients and waste; supports cell shape.",
                propertiesZh: "大型單層膜囊；含細胞液（水、離子、色素）。",
                functionZh: "維持膨壓；儲存養分與廢物；支持細胞形狀。"
            },
            mitochondria: {
                title: "Mitochondrion / 線粒體",
                properties: "Double membrane with cristae; present in all plant cells requiring energy.",
                function: "Aerobic respiration; releases energy from glucose for cellular work.",
                propertiesZh: "雙層膜具嵴；存在於需能量的植物細胞。",
                functionZh: "有氧呼吸；從葡萄糖釋放能量供細胞使用。"
            },
            roughER: {
                title: "Rough Endoplasmic Reticulum / 粗糙內質網",
                properties: "Flattened sacs studded with ribosomes; surrounds the nucleus in plant cells.",
                function: "Synthesises proteins for secretion, membranes and cell wall components.",
                propertiesZh: "外表面附核糖體的扁平囊；環繞植物細胞核。",
                functionZh: "合成分泌蛋白、膜蛋白及細胞壁相關蛋白。"
            },
            smoothER: {
                title: "Smooth Endoplasmic Reticulum / 平滑內質網",
                properties: "Tubular network without ribosomes; extends into peripheral cytoplasm.",
                function: "Synthesises lipids and phospholipids for membranes; detoxification.",
                propertiesZh: "無核糖體的管狀網絡；延伸至周邊細胞質。",
                functionZh: "合成脂質及磷脂供膜使用；解毒。"
            },
            ribosome: {
                title: "Ribosome / 核糖體",
                properties: "Small non-membranous particles; abundant in actively growing cells.",
                function: "Translates mRNA to build proteins for structure and enzymes.",
                propertiesZh: "無膜小顆粒；在活躍生長細胞中數量眾多。",
                functionZh: "轉譯 mRNA 以合成結構蛋白及酶。"
            },
            golgi: {
                title: "Golgi Apparatus / 高爾基體",
                properties: "Stack of flattened, curved membrane sacs (cisternae); light blue in appearance; located near the ER.",
                function: "Modifies, sorts and packages proteins and lipids from the ER for secretion or delivery to organelles.",
                propertiesZh: "一疊扁平彎曲的膜囊（池）；呈淡藍色；位於內質網附近。",
                functionZh: "修飾、分類並包裝來自內質網的蛋白質與脂質，以便分泌或運送至其他細胞器。"
            },
            cytoplasm: {
                title: "Cytoplasm / 細胞質",
                properties: "Aqueous gel filling space between organelles; contains cytoskeleton.",
                function: "Site of many metabolic pathways; enables organelle positioning.",
                propertiesZh: "充滿細胞器間空間的含水凝膠；含細胞骨架。",
                functionZh: "許多代謝途徑的場所；使細胞器定位。"
            }
        }
    },
    prokaryote: {
        title: "Prokaryotic Cell",
        titleZh: "原核細胞",
        tip: "Drag to rotate the model. Click any exposed part for its description. / 拖曳旋轉模型。點擊任何部分查看說明。",
        components: {
            cellWall: {
                title: "Cell Wall / 細胞壁",
                properties: "Rigid layer of peptidoglycan (bacteria); external to the cell membrane.",
                function: "Maintains cell shape; protects against osmotic stress; target of some antibiotics.",
                propertiesZh: "由肽聚糖構成的堅硬外層（細菌）；位於細胞膜外。",
                functionZh: "維持形狀；抵抗滲透壓；為部分抗生素的作用靶點。"
            },
            membrane: {
                title: "Cell Membrane / 細胞膜",
                properties: "Phospholipid bilayer; may fold inward for photosynthesis (in some bacteria).",
                function: "Controls substance exchange; site of electron transport in respiration.",
                propertiesZh: "磷脂雙層；部分細菌可內折進行光合作用。",
                functionZh: "控制物質交換；為呼吸作用電子傳遞鏈的所在。"
            },
            nucleoid: {
                title: "Genetic Material (DNA) / 遺傳物質（DNA）",
                properties: "Region containing a single circular DNA molecule; not enclosed by a membrane.",
                function: "Stores genetic information; directs protein synthesis and cell reproduction.",
                propertiesZh: "含單一環狀 DNA 的區域；無膜包圍。",
                functionZh: "儲存遺傳信息；指導蛋白質合成及細胞繁殖。"
            },
            ribosome: {
                title: "Ribosome / 核糖體",
                properties: "Smaller (70S) than eukaryotic ribosomes; abundant throughout cytoplasm.",
                function: "Protein synthesis; essential for bacterial growth and enzyme production.",
                propertiesZh: "較真核核糖體（80S）小（70S）；遍佈胞質。",
                functionZh: "蛋白質合成；對細菌生長及酶產生至關重要。"
            },
            plasmid: {
                title: "Plasmid / 質粒",
                properties: "Small circular extra-chromosomal DNA; self-replicating; optional in bacteria.",
                function: "Carries genes for antibiotic resistance, toxin production or metabolic traits.",
                propertiesZh: "小型環狀額外染色體 DNA；可自我複製；細菌中可選存在。",
                functionZh: "攜帶抗藥性、毒素產生或代謝相關基因。"
            },
            flagellum: {
                title: "Flagellum / 鞭毛",
                properties: "Long protein filament rotated by a basal motor; not all prokaryotes have one.",
                function: "Propels cell through liquid environments for motility and chemotaxis.",
                propertiesZh: "由基體馬達旋轉的長蛋白絲；並非所有原核生物都有。",
                functionZh: "推動細胞在液體中移動，實現運動與趨化性。"
            },
            pili: {
                title: "Pili / 纖毛（菌毛）",
                properties: "Short hair-like protein extensions on the bacterial surface; thinner and more numerous than flagella.",
                function: "Aid attachment to surfaces and other cells; some pili transfer DNA during conjugation.",
                propertiesZh: "細菌表面短而細的蛋白絲；比鞭毛更短且數量更多。",
                functionZh: "協助附著於表面及其他細胞；部分菌毛可於接合作用中轉移 DNA。"
            },
            capsule: {
                title: "Capsule / 莢膜",
                properties: "Slime layer outside cell wall; composed of polysaccharides; optional.",
                function: "Protects against phagocytosis and desiccation; aids attachment to surfaces.",
                propertiesZh: "細胞壁外的黏液層；由多糖組成；可選存在。",
                functionZh: "防止吞噬及脫水；協助附著於表面。"
            },
            cytoplasm: {
                title: "Cytoplasm / 細胞質",
                properties: "No membrane-bound compartments; all metabolic processes occur here.",
                function: "Medium for glycolysis, transcription and translation; supports cell metabolism.",
                propertiesZh: "無膜分隔區室；所有代謝過程在此進行。",
                functionZh: "糖解、轉錄及轉譯的介質；支持細胞代謝。"
            }
        }
    },
    eukaryote: {
        title: "Eukaryotic Cell",
        titleZh: "真核細胞",
        tip: "Drag to rotate the model. Click any exposed organelle for its description. / 拖曳旋轉模型。點擊任何細胞器查看說明。",
        components: {
            membrane: {
                title: "Plasma Membrane / 細胞膜",
                properties: "Phospholipid bilayer with embedded proteins; selectively permeable; fluid mosaic model.",
                function: "Selective barrier; endocytosis and exocytosis; maintains cell shape and communication.",
                propertiesZh: "磷脂雙層含嵌入蛋白；具選擇性滲透性；流動鑲嵌模型。",
                functionZh: "選擇性屏障；內吞與外排；維持細胞形狀及通訊。"
            },
            cytoplasm: {
                title: "Cytoplasm / 細胞質",
                properties: "Compartmentalised by membrane-bound organelles; highly organised gel-like cytosol.",
                function: "Integrates metabolic pathways across specialised organelles.",
                propertiesZh: "由膜包圍的細胞器分隔；高度有序的膠狀胞質溶膠。",
                functionZh: "整合各專化細胞器間的代謝途徑。"
            },
            nucleus: {
                title: "Nucleus / 細胞核",
                properties: "Membrane-bound organelle with nuclear envelope; linear DNA organised into chromosomes.",
                function: "Separates genetic material from cytoplasm; regulates gene expression.",
                propertiesZh: "具核膜的膜包圍細胞器；線性 DNA 組成染色體。",
                functionZh: "將遺傳物質與胞質分離；調控基因表達。"
            },
            chromosome: {
                title: "Chromosome / 染色體",
                properties: "Thread-like structures of DNA and proteins (chromatin); visible during cell division.",
                function: "Carries genes; ensures accurate duplication and distribution of genetic material.",
                propertiesZh: "由 DNA 及蛋白質（染色質）組成的絲狀結構；細胞分裂時可見。",
                functionZh: "攜帶基因；確保遺傳物質準確複製及分配。"
            },
            roughER: {
                title: "Rough Endoplasmic Reticulum / 粗糙內質網",
                properties: "Flattened sacs studded with ribosomes; continuous with the nuclear envelope.",
                function: "Synthesises proteins for secretion, membranes and organelles; folds and transports polypeptides.",
                propertiesZh: "外表面附核糖體的扁平囊；與核膜相連。",
                functionZh: "合成分泌蛋白、膜蛋白及細胞器蛋白；摺疊並運輸多肽鏈。"
            },
            smoothER: {
                title: "Smooth Endoplasmic Reticulum / 平滑內質網",
                properties: "Tubular membrane network without ribosomes; synthesises lipids and steroids.",
                function: "Lipid and steroid synthesis; detoxification; calcium ion storage.",
                propertiesZh: "無核糖體的管狀膜網絡；合成脂質及固醇。",
                functionZh: "脂質及固醇合成；解毒；儲存鈣離子。"
            },
            golgi: {
                title: "Golgi Apparatus / 高爾基體",
                properties: "Stack of flattened membrane sacs (cisternae); receives products from the ER.",
                function: "Modifies, sorts and packages proteins and lipids for secretion or delivery.",
                propertiesZh: "一疊扁平膜囊（池）；接收內質網產物。",
                functionZh: "修飾、分類並包裝蛋白質與脂質以便分泌或運送。"
            },
            mitochondria: {
                title: "Mitochondrion / 線粒體",
                properties: "Endosymbiotic origin; double membrane with cristae; own circular DNA.",
                function: "ATP production via aerobic respiration; powers eukaryotic activities.",
                propertiesZh: "內共生起源；雙層膜具嵴；含自身環狀 DNA。",
                functionZh: "有氧呼吸產生 ATP；驅動真核生物活動。"
            },
            centriole: {
                title: "Centriole / 中心粒",
                properties: "Pair of cylindrical structures made of microtubules; part of the centrosome.",
                function: "Organises spindle fibres during cell division; forms basal body of flagella.",
                propertiesZh: "由微管組成的成對圓柱結構；為中心體的一部分。",
                functionZh: "在細胞分裂時組織紡錘絲；形成鞭毛的基體。"
            },
            flagellum: {
                title: "Flagellum / 鞭毛",
                properties: "Long whip-like extension from the plasma membrane; 9+2 microtubule arrangement.",
                function: "Propels the cell through fluid environments via beating motion.",
                propertiesZh: "由細胞膜延伸的長鞭狀結構；9+2 微管排列。",
                functionZh: "透過擺動推動細胞在液體環境中移動。"
            },
            cytoskeleton: {
                title: "Microtubules / 微管",
                properties: "Hollow tubes of tubulin protein; part of the cytoskeleton network.",
                function: "Maintains cell shape; enables intracellular transport and organelle positioning.",
                propertiesZh: "由微管蛋白組成的中空管狀結構；為細胞骨架的一部分。",
                functionZh: "維持細胞形狀；實現胞內運輸及細胞器定位。"
            },
            vesicle: {
                title: "Vesicle / 囊泡",
                properties: "Small membrane-bound sacs transporting materials within the cell.",
                function: "Carries proteins and lipids between organelles; involved in secretion and endocytosis.",
                propertiesZh: "運輸物質的小型膜包圍囊泡。",
                functionZh: "在細胞器間運輸蛋白質與脂質；參與分泌及內吞作用。"
            },
            microvilli: {
                title: "Microvilli / 微絨毛",
                properties: "Tiny finger-like projections of the plasma membrane; increase surface area.",
                function: "Enhance absorption and secretion at the cell surface.",
                propertiesZh: "細胞膜上的微小指狀突起；增加表面積。",
                functionZh: "增強細胞表面的吸收與分泌。"
            }
        }
    }
};

window.CELL_PAGES = [
    { id: "animal", file: "animal-cell.html", label: "Animal Cell / 動物細胞" },
    { id: "plant", file: "plant-cell.html", label: "Plant Cell / 植物細胞" },
    { id: "prokaryote", file: "prokaryote.html", label: "Prokaryote / 原核細胞" },
    { id: "eukaryote", file: "eukaryote.html", label: "Eukaryote / 真核細胞" }
];
