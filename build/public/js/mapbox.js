"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayMap = void 0;
const mapbox_gl_1 = __importDefault(require("mapbox-gl"));
const displayMap = (locations) => {
    mapbox_gl_1.default.accessToken =
        'pk.eyJ1IjoiZG9zYW5qb3NndXN0YXZvIiwiYSI6ImNsbHBmbm15NTA1NWIza2xpMWo4bDlwcTIifQ.vPBJ5o4Txtu9VMAUIjggcQ';
    var map = new mapbox_gl_1.default.Map({
        container: 'map',
        style: 'mapbox://styles/dosanjosgustavo/cllv02m31012101qx0uq49ct5',
        scrollZoom: false,
    });
    const bounds = new mapbox_gl_1.default.LngLatBounds();
    locations.forEach((loc) => {
        const element = document.createElement('div');
        element.className = 'marker';
        new mapbox_gl_1.default.Marker({
            element,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);
        new mapbox_gl_1.default.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
};
exports.displayMap = displayMap;
//# sourceMappingURL=mapbox.js.map