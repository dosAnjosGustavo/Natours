var $dpfY3$axios = require("axios");
var $dpfY3$mapboxgl = require("mapbox-gl");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

const $680664d3c6db11d4$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $680664d3c6db11d4$export$de026b00723010c1 = (type, msg)=>{
    $680664d3c6db11d4$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($680664d3c6db11d4$export$516836c6a9dfc573, 5000);
};


const $08e3dfec8432db11$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, ($parcel$interopDefault($dpfY3$axios)))({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") {
            (0, $680664d3c6db11d4$export$de026b00723010c1)("success", "Logged in successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, $680664d3c6db11d4$export$de026b00723010c1)("error", err.response.data.message);
    }
};
const $08e3dfec8432db11$export$a0973bcfe11b05c9 = async ()=>{
    try {
        const res = await (0, ($parcel$interopDefault($dpfY3$axios)))({
            method: "GET",
            url: "/api/v1/users/logout"
        });
        if (res.data.status === "success") location.assign("/");
    } catch (err) {
        console.log(err.response);
        (0, $680664d3c6db11d4$export$de026b00723010c1)("error", "Error logging out! Try again.");
    }
};



const $eef0a7e4e52122b7$export$4c5dd147b21b9176 = (locations)=>{
    (0, ($parcel$interopDefault($dpfY3$mapboxgl))).accessToken = "pk.eyJ1IjoiZG9zYW5qb3NndXN0YXZvIiwiYSI6ImNsbHBmbm15NTA1NWIza2xpMWo4bDlwcTIifQ.vPBJ5o4Txtu9VMAUIjggcQ";
    var map = new (0, ($parcel$interopDefault($dpfY3$mapboxgl))).Map({
        container: "map",
        style: "mapbox://styles/dosanjosgustavo/cllv02m31012101qx0uq49ct5",
        scrollZoom: false
    });
    const bounds = new (0, ($parcel$interopDefault($dpfY3$mapboxgl))).LngLatBounds();
    locations.forEach((loc)=>{
        const element = document.createElement("div");
        element.className = "marker";
        new (0, ($parcel$interopDefault($dpfY3$mapboxgl))).Marker({
            element: element,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        new (0, ($parcel$interopDefault($dpfY3$mapboxgl))).Popup({
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




const $b2e160cc0fd93e28$export$f558026a994b6051 = async (data, type)=>{
    try {
        const url = type === "password" ? "/api/v1/users/updateMyPassword" : "/api/v1/users/updateMe";
        const res = await (0, ($parcel$interopDefault($dpfY3$axios)))({
            method: "PATCH",
            url: url,
            data: data
        });
        const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
        if (res.data.status === "success") {
            (0, $680664d3c6db11d4$export$de026b00723010c1)("success", `${typeCapitalized} updated successfully!`);
            window.setTimeout(()=>{
                location.reload();
            }, 1500);
        }
    } catch (err) {
        (0, $680664d3c6db11d4$export$de026b00723010c1)("error", err.response.data.message);
    }
};




const $0465c41c1b2e8dae$export$8d5bdbf26681c0c2 = async (tourId)=>{
    try {
        // 1) Get checkout session from API + create checkout form
        const session = await (0, ($parcel$interopDefault($dpfY3$axios)))(`/api/v1/bookings/checkout-session/${tourId}`);
        // 2) Redirect to checkout form
        window.location.href = session.data.session.url;
    } catch (err) {
        console.log(err);
        (0, $680664d3c6db11d4$export$de026b00723010c1)("error", err);
    }
};




const $5f2b8bc6a6e9c823$export$7200a869094fec36 = async (name, email, password, passwordConfirm)=>{
    try {
        const res = await (0, ($parcel$interopDefault($dpfY3$axios)))({
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
            (0, $680664d3c6db11d4$export$de026b00723010c1)("success", "Signed up successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, $680664d3c6db11d4$export$de026b00723010c1)("error", err.response.data.message);
    }
};


// DOM ELEMENTS
const $1c08dee3b8dfe7bf$var$mapBox = document.getElementById("map");
const $1c08dee3b8dfe7bf$var$loginForm = document.querySelector(".form--login");
const $1c08dee3b8dfe7bf$var$logOutBtn = document.querySelector(".nav__el--logout");
const $1c08dee3b8dfe7bf$var$userDataForm = document.querySelector(".form-user-data");
const $1c08dee3b8dfe7bf$var$userPasswordForm = document.querySelector(".form-user-password");
const $1c08dee3b8dfe7bf$var$bookBtn = document.getElementById("book-tour");
const $1c08dee3b8dfe7bf$var$signupForm = document.querySelector(".form--signup");
if ($1c08dee3b8dfe7bf$var$mapBox) {
    const locations = JSON.parse($1c08dee3b8dfe7bf$var$mapBox.dataset.locations);
    (0, $eef0a7e4e52122b7$export$4c5dd147b21b9176)(locations);
}
if ($1c08dee3b8dfe7bf$var$loginForm) $1c08dee3b8dfe7bf$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $08e3dfec8432db11$export$596d806903d1f59e)(email, password);
});
if ($1c08dee3b8dfe7bf$var$logOutBtn) $1c08dee3b8dfe7bf$var$logOutBtn.addEventListener("click", (0, $08e3dfec8432db11$export$a0973bcfe11b05c9));
if ($1c08dee3b8dfe7bf$var$userDataForm) $1c08dee3b8dfe7bf$var$userDataForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", // @ts-ignore
    document.getElementById("photo").files[0]);
    (0, $b2e160cc0fd93e28$export$f558026a994b6051)(form, "data");
});
if ($1c08dee3b8dfe7bf$var$userPasswordForm) $1c08dee3b8dfe7bf$var$userPasswordForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const btn = document.querySelector(".btn--save-password");
    const fieldCurrentPassword = document.getElementById("password-current");
    const fieldPassword = document.getElementById("password");
    const fieldPasswordConfirm = document.getElementById("password-confirm");
    btn.textContent = "Updating...";
    const passwordCurrent = fieldCurrentPassword.value;
    const password = fieldPassword.value;
    const passwordConfirm = fieldPasswordConfirm.value;
    await (0, $b2e160cc0fd93e28$export$f558026a994b6051)({
        passwordCurrent: passwordCurrent,
        password: password,
        passwordConfirm: passwordConfirm
    }, "password");
    btn.textContent = "Save password";
    fieldCurrentPassword.value = "";
    fieldPassword.value = "";
    fieldPasswordConfirm.value = "";
});
if ($1c08dee3b8dfe7bf$var$bookBtn) $1c08dee3b8dfe7bf$var$bookBtn.addEventListener("click", (e)=>{
    // @ts-ignore
    e.target.textContent = "Processing...";
    // @ts-ignore
    e.target.disabled = true;
    // @ts-ignore
    const { tourId: tourId } = e.target.dataset;
    (0, $0465c41c1b2e8dae$export$8d5bdbf26681c0c2)(tourId);
});
if ($1c08dee3b8dfe7bf$var$signupForm) $1c08dee3b8dfe7bf$var$signupForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfi.").value;
    const btn = document.querySelector(".btn");
    btn.textContent = "Signing up...";
    // @ts-ignore
    btn.disabled = true;
    await (0, $5f2b8bc6a6e9c823$export$7200a869094fec36)(name, email, password, passwordConfirm);
});


//# sourceMappingURL=index.js.map
