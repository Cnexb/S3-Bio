/**
 * Fig 4.3 — one shared lock-and-key model for enzyme, substrate, and both products.
 * Products = same full substrate path, clipped at splitX (preserves identical y-axis).
 */
(function (global) {
  "use strict";

  var V0 = 24;
  var V1 = 36;
  var VPeak = 30;
  var splitX = 56;
  var U0 = 56;
  var U1 = 76;
  var bumpR = 10;
  var seatY = 54;
  var enzY = 82;
  var enzymeTopY = 24;

  var substrateLeft =
    "M 12 " + seatY + " L " + V0 + " " + seatY + " L " + VPeak + " 66 L " + V1 + " " + seatY +
    " L " + splitX + " " + seatY + " A 42 42 0 0 0 12 " + seatY + " Z";

  var substrateRight =
    "M " + splitX + " " + seatY + " L " + U0 + " 66 A " + bumpR + " " + bumpR +
    " 0 0 1 " + U1 + " 66 L " + U1 + " " + seatY + " A 42 42 0 0 0 " + splitX + " " + seatY + " Z";

  global.ENZYME_SHAPES = {
    modelScale: 1.25,
    scene: { w: 520, h: 300 },
    /** Horizontal center of enzyme bbox at anchorX (path x 8–144 → mid 76) */
    pivot: { x: 128 + 76, y: 128 },

    colors: {
      enzyme: "#89C2EB",
      enzymeEdge: "#6AABD8",
      substrate: "#F88A8A",
      substrateEdge: "#E07070",
      productA: "#9B8EC4",
      productAEdge: "#7568A8",
      productB: "#E8B84A",
      productBEdge: "#D99A20",
      wrongSubstrate: "#52B961",
    },

    enzyme:
      "M 8 72 L 132 72" +
      " C 150 72 156 44 144 24" +
      " L 108 24 L 76 24" +
      " L 76 36 A " + bumpR + " " + bumpR + " 0 0 0 " + U0 + " 36 L " + U0 + " 24" +
      " L " + V1 + " 24 L " + VPeak + " 36 L " + V0 + " 24" +
      " L 12 24 C 0 44 -2 72 8 72 Z",

    substrate:
      "M 12 " + seatY + " L " + V0 + " " + seatY + " L " + VPeak + " 66 L " + V1 + " " + seatY +
      " L " + splitX + " " + seatY +
      " L " + U0 + " 66 A " + bumpR + " " + bumpR + " 0 0 1 " + U1 + " 66 L " + U1 + " " + seatY +
      " A 42 42 0 0 0 12 " + seatY + " Z",

    /** Wrong substrate — dome + two legs with centre gap (does not fit active site) */
    wrongSubstrate:
      "M 12 66 L 12 54 A 32 32 0 0 0 76 54 L 76 66 L 60 66 L 60 54 L 28 54 L 28 66 Z",

    substrateLeft: substrateLeft,
    substrateRight: substrateRight,
    splitX: splitX,
    productClip: { y: 0, height: 100 },

    /** Aliases — legacy half paths; animation uses full substrate + clip */
    productPurple: substrateLeft,
    productYellow: substrateRight,

    labels: {
      enzyme: { x: 70, y: 58 },
      substrate: { x: 44, y: 30 },
      complex: { x: 70, y: 62, fontSize: 5.5 },
      productLeft: { x: 32, y: 30 },
      productRight: { x: 66, y: 30 },
    },

    layout: {
      anchorX: 128,
      enz: { y: enzY },
      sub: {
        introY: -26,
        bindY: 42,
        complexY: enzY + enzymeTopY - seatY,
      },
      prod: { spread: 30 },
      badges: { spacing: 40 },
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
