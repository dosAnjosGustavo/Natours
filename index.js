require("core-js/stable");
var $1nzvR$axios = require("axios");
var $1nzvR$mapboxgl = require("mapbox-gl");

"use strict";
var $6b3070ec1fc833f1$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $1dea3750e0a90b09$exports = {};
"use strict";
var $1dea3750e0a90b09$var$__awaiter = $1dea3750e0a90b09$exports && $1dea3750e0a90b09$exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $1dea3750e0a90b09$var$__importDefault = $1dea3750e0a90b09$exports && $1dea3750e0a90b09$exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty($1dea3750e0a90b09$exports, "__esModule", {
    value: true
});
$1dea3750e0a90b09$exports.logout = $1dea3750e0a90b09$exports.login = void 0;

const $1dea3750e0a90b09$var$axios_1 = $1dea3750e0a90b09$var$__importDefault($1nzvR$axios);
var $05e3dff58e97748e$exports = {};
"use strict";
Object.defineProperty($05e3dff58e97748e$exports, "__esModule", {
    value: true
});
$05e3dff58e97748e$exports.showAlert = $05e3dff58e97748e$exports.hideAlert = void 0;
const $05e3dff58e97748e$var$hideAlert = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
$05e3dff58e97748e$exports.hideAlert = $05e3dff58e97748e$var$hideAlert;
const $05e3dff58e97748e$var$showAlert = (type, msg)=>{
    (0, $05e3dff58e97748e$exports.hideAlert)();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($05e3dff58e97748e$exports.hideAlert, 5000);
};
$05e3dff58e97748e$exports.showAlert = $05e3dff58e97748e$var$showAlert;


const $1dea3750e0a90b09$var$login = (email, password)=>$1dea3750e0a90b09$var$__awaiter(void 0, void 0, void 0, function*() {
        try {
            const res = yield (0, $1dea3750e0a90b09$var$axios_1.default)({
                method: "POST",
                url: "/api/v1/users/login",
                data: {
                    email: email,
                    password: password
                }
            });
            if (res.data.status === "success") {
                (0, $05e3dff58e97748e$exports.showAlert)("success", "Logged in successfully!");
                window.setTimeout(()=>{
                    location.assign("/");
                }, 1500);
            }
        } catch (err) {
            (0, $05e3dff58e97748e$exports.showAlert)("error", err.response.data.message);
        }
    });
$1dea3750e0a90b09$exports.login = $1dea3750e0a90b09$var$login;
const $1dea3750e0a90b09$var$logout = ()=>$1dea3750e0a90b09$var$__awaiter(void 0, void 0, void 0, function*() {
        try {
            const res = yield (0, $1dea3750e0a90b09$var$axios_1.default)({
                method: "GET",
                url: "/api/v1/users/logout"
            });
            if (res.data.status === "success") location.assign("/");
        } catch (err) {
            console.log(err.response);
            (0, $05e3dff58e97748e$exports.showAlert)("error", "Error logging out! Try again.");
        }
    });
$1dea3750e0a90b09$exports.logout = $1dea3750e0a90b09$var$logout;


var $c9deb5c9463ba818$exports = {};
"use strict";
var $c9deb5c9463ba818$var$__importDefault = $c9deb5c9463ba818$exports && $c9deb5c9463ba818$exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty($c9deb5c9463ba818$exports, "__esModule", {
    value: true
});
$c9deb5c9463ba818$exports.displayMap = void 0;

const $c9deb5c9463ba818$var$mapbox_gl_1 = $c9deb5c9463ba818$var$__importDefault($1nzvR$mapboxgl);
const $c9deb5c9463ba818$var$displayMap = (locations)=>{
    $c9deb5c9463ba818$var$mapbox_gl_1.default.accessToken = "pk.eyJ1IjoiZG9zYW5qb3NndXN0YXZvIiwiYSI6ImNsbHBmbm15NTA1NWIza2xpMWo4bDlwcTIifQ.vPBJ5o4Txtu9VMAUIjggcQ";
    var map = new $c9deb5c9463ba818$var$mapbox_gl_1.default.Map({
        container: "map",
        style: "mapbox://styles/dosanjosgustavo/cllv02m31012101qx0uq49ct5",
        scrollZoom: false
    });
    const bounds = new $c9deb5c9463ba818$var$mapbox_gl_1.default.LngLatBounds();
    locations.forEach((loc)=>{
        const element = document.createElement("div");
        element.className = "marker";
        new $c9deb5c9463ba818$var$mapbox_gl_1.default.Marker({
            element: element,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        new $c9deb5c9463ba818$var$mapbox_gl_1.default.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};
$c9deb5c9463ba818$exports.displayMap = $c9deb5c9463ba818$var$displayMap;


var $587174753a72ef88$exports = {};
"use strict";
var $587174753a72ef88$var$__awaiter = $587174753a72ef88$exports && $587174753a72ef88$exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $587174753a72ef88$var$__importDefault = $587174753a72ef88$exports && $587174753a72ef88$exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty($587174753a72ef88$exports, "__esModule", {
    value: true
});
$587174753a72ef88$exports.updateSettings = void 0;

const $587174753a72ef88$var$axios_1 = $587174753a72ef88$var$__importDefault($1nzvR$axios);

// type is either 'password' or 'data'
const $587174753a72ef88$var$updateSettings = (data, type)=>$587174753a72ef88$var$__awaiter(void 0, void 0, void 0, function*() {
        try {
            const url = type === "password" ? "/api/v1/users/updateMyPassword" : "/api/v1/users/updateMe";
            const res = yield (0, $587174753a72ef88$var$axios_1.default)({
                method: "PATCH",
                url: url,
                data: data
            });
            const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
            if (res.data.status === "success") {
                (0, $05e3dff58e97748e$exports.showAlert)("success", `${typeCapitalized} updated successfully!`);
                window.setTimeout(()=>{
                    location.reload();
                }, 1500);
            }
        } catch (err) {
            (0, $05e3dff58e97748e$exports.showAlert)("error", err.response.data.message);
        }
    });
$587174753a72ef88$exports.updateSettings = $587174753a72ef88$var$updateSettings;


var $f9180b956f041155$exports = {};
"use strict";
var $f9180b956f041155$var$__awaiter = $f9180b956f041155$exports && $f9180b956f041155$exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $f9180b956f041155$var$__importDefault = $f9180b956f041155$exports && $f9180b956f041155$exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty($f9180b956f041155$exports, "__esModule", {
    value: true
});
$f9180b956f041155$exports.bookTour = void 0;


const $f9180b956f041155$var$axios_1 = $f9180b956f041155$var$__importDefault($1nzvR$axios);
const $f9180b956f041155$var$bookTour = (tourId)=>$f9180b956f041155$var$__awaiter(void 0, void 0, void 0, function*() {
        try {
            // 1) Get checkout session from API + create checkout form
            const session = yield (0, $f9180b956f041155$var$axios_1.default)(`/api/v1/bookings/checkout-session/${tourId}`);
            // 2) Redirect to checkout form
            window.location.href = session.data.session.url;
        } catch (err) {
            console.log(err);
            (0, $05e3dff58e97748e$exports.showAlert)("error", err);
        }
    });
$f9180b956f041155$exports.bookTour = $f9180b956f041155$var$bookTour;


var $bf27f9c67c96e065$exports = {};
"use strict";
var $bf27f9c67c96e065$var$__awaiter = $bf27f9c67c96e065$exports && $bf27f9c67c96e065$exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $bf27f9c67c96e065$var$__importDefault = $bf27f9c67c96e065$exports && $bf27f9c67c96e065$exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty($bf27f9c67c96e065$exports, "__esModule", {
    value: true
});
$bf27f9c67c96e065$exports.signup = void 0;

const $bf27f9c67c96e065$var$axios_1 = $bf27f9c67c96e065$var$__importDefault($1nzvR$axios);

const $bf27f9c67c96e065$var$signup = (name, email, password, passwordConfirm)=>$bf27f9c67c96e065$var$__awaiter(void 0, void 0, void 0, function*() {
        try {
            const res = yield (0, $bf27f9c67c96e065$var$axios_1.default)({
                method: "POST",
                url: "/api/v1/users/signup",
                data: {
                    name: name,
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm
                }
            });
            if (res.data.status === "success") {
                (0, $05e3dff58e97748e$exports.showAlert)("success", "Signed up successfully!");
                window.setTimeout(()=>{
                    location.assign("/");
                }, 1500);
            }
        } catch (err) {
            (0, $05e3dff58e97748e$exports.showAlert)("error", err.response.data.message);
        }
    });
$bf27f9c67c96e065$exports.signup = $bf27f9c67c96e065$var$signup;


// DOM ELEMENTS
const $6b3070ec1fc833f1$var$mapBox = document.getElementById("map");
const $6b3070ec1fc833f1$var$loginForm = document.querySelector(".form--login");
const $6b3070ec1fc833f1$var$logOutBtn = document.querySelector(".nav__el--logout");
const $6b3070ec1fc833f1$var$userDataForm = document.querySelector(".form-user-data");
const $6b3070ec1fc833f1$var$userPasswordForm = document.querySelector(".form-user-password");
const $6b3070ec1fc833f1$var$bookBtn = document.getElementById("book-tour");
const $6b3070ec1fc833f1$var$signupForm = document.querySelector(".form--signup");
if ($6b3070ec1fc833f1$var$mapBox) {
    const locations = JSON.parse($6b3070ec1fc833f1$var$mapBox.dataset.locations);
    (0, $c9deb5c9463ba818$exports.displayMap)(locations);
}
if ($6b3070ec1fc833f1$var$loginForm) $6b3070ec1fc833f1$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $1dea3750e0a90b09$exports.login)(email, password);
});
if ($6b3070ec1fc833f1$var$logOutBtn) $6b3070ec1fc833f1$var$logOutBtn.addEventListener("click", $1dea3750e0a90b09$exports.logout);
if ($6b3070ec1fc833f1$var$userDataForm) $6b3070ec1fc833f1$var$userDataForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", // @ts-ignore
    document.getElementById("photo").files[0]);
    (0, $587174753a72ef88$exports.updateSettings)(form, "data");
});
if ($6b3070ec1fc833f1$var$userPasswordForm) $6b3070ec1fc833f1$var$userPasswordForm.addEventListener("submit", (e)=>$6b3070ec1fc833f1$var$__awaiter(void 0, void 0, void 0, function*() {
        e.preventDefault();
        const btn = document.querySelector(".btn--save-password");
        const fieldCurrentPassword = document.getElementById("password-current");
        const fieldPassword = document.getElementById("password");
        const fieldPasswordConfirm = document.getElementById("password-confirm");
        btn.textContent = "Updating...";
        const passwordCurrent = fieldCurrentPassword.value;
        const password = fieldPassword.value;
        const passwordConfirm = fieldPasswordConfirm.value;
        yield (0, $587174753a72ef88$exports.updateSettings)({
            passwordCurrent: passwordCurrent,
            password: password,
            passwordConfirm: passwordConfirm
        }, "password");
        btn.textContent = "Save password";
        fieldCurrentPassword.value = "";
        fieldPassword.value = "";
        fieldPasswordConfirm.value = "";
    }));
if ($6b3070ec1fc833f1$var$bookBtn) $6b3070ec1fc833f1$var$bookBtn.addEventListener("click", (e)=>{
    // @ts-ignore
    e.target.textContent = "Processing...";
    // @ts-ignore
    e.target.disabled = true;
    // @ts-ignore
    const { tourId: tourId } = e.target.dataset;
    (0, $f9180b956f041155$exports.bookTour)(tourId);
});
if ($6b3070ec1fc833f1$var$signupForm) $6b3070ec1fc833f1$var$signupForm.addEventListener("submit", (e)=>$6b3070ec1fc833f1$var$__awaiter(void 0, void 0, void 0, function*() {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("passwordConfirm").value;
        const btn = document.querySelector(".btn");
        btn.textContent = "Signing up...";
        // @ts-ignore
        btn.disabled = true;
        yield (0, $bf27f9c67c96e065$exports.signup)(name, email, password, passwordConfirm);
    }));


//# sourceMappingURL=index.js.map
