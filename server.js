require("@babel/polyfill");
var $knI9B$axios = require("axios");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}


const $3adf927435cf4518$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $3adf927435cf4518$export$de026b00723010c1 = (type, msg)=>{
    $3adf927435cf4518$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($3adf927435cf4518$export$516836c6a9dfc573, 5000);
};


const $70af9284e599e604$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") {
            (0, $3adf927435cf4518$export$de026b00723010c1)("success", "Logged in successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, $3adf927435cf4518$export$de026b00723010c1)("error", err.response.data.message);
    }
};
const $70af9284e599e604$export$a0973bcfe11b05c9 = async ()=>{
    try {
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
            method: "GET",
            url: "/api/v1/users/logout"
        });
        if (res.data.status === "success") location.assign("/");
    } catch (err) {
        console.log(err.response);
        (0, $3adf927435cf4518$export$de026b00723010c1)("error", "Error logging out! Try again.");
    }
};


const $f60945d37f8e594c$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoiZG9zYW5qb3NndXN0YXZvIiwiYSI6ImNsbHBmbm15NTA1NWIza2xpMWo4bDlwcTIifQ.vPBJ5o4Txtu9VMAUIjggcQ";
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/dosanjosgustavo/cllv02m31012101qx0uq49ct5",
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        const element = document.createElement("div");
        element.className = "marker";
        new mapboxgl.Marker({
            element: element,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        new mapboxgl.Popup({
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




const $936fcc27ffb6bbb1$export$f558026a994b6051 = async (data, type)=>{
    try {
        const url = type === "password" ? "/api/v1/users/updateMyPassword" : "/api/v1/users/updateMe";
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
            method: "PATCH",
            url: url,
            data: data
        });
        const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
        if (res.data.status === "success") {
            (0, $3adf927435cf4518$export$de026b00723010c1)("success", `${typeCapitalized} updated successfully!`);
            window.setTimeout(()=>{
                location.reload(true);
            }, 1500);
        }
    } catch (err) {
        (0, $3adf927435cf4518$export$de026b00723010c1)("error", err.response.data.message);
    }
};




const $6710bca62beba915$export$8d5bdbf26681c0c2 = async (tourId)=>{
    try {
        // 1) Get checkout session from API + create checkout form
        const session = await (0, ($parcel$interopDefault($knI9B$axios)))(`/api/v1/bookings/checkout-session/${tourId}`);
        // 2) Redirect to checkout form
        window.location.href = session.data.session.url;
    } catch (err) {
        console.log(err);
        (0, $3adf927435cf4518$export$de026b00723010c1)("error", err);
    }
};




const $2db3670f13ba185b$export$7200a869094fec36 = async (name, email, password, passwordConfirm)=>{
    try {
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
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
            (0, $3adf927435cf4518$export$de026b00723010c1)("success", "Signed up successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, $3adf927435cf4518$export$de026b00723010c1)("error", err.response.data.message);
    }
};


// DOM ELEMENTS
const $d0f7ce18c37ad6f6$var$mapBox = document.getElementById("map");
const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector(".form--login");
const $d0f7ce18c37ad6f6$var$logOutBtn = document.querySelector(".nav__el--logout");
const $d0f7ce18c37ad6f6$var$userDataForm = document.querySelector(".form-user-data");
const $d0f7ce18c37ad6f6$var$userPasswordForm = document.querySelector(".form-user-password");
const $d0f7ce18c37ad6f6$var$bookBtn = document.getElementById("book-tour");
const $d0f7ce18c37ad6f6$var$signupForm = document.querySelector(".form--signup");
if ($d0f7ce18c37ad6f6$var$mapBox) {
    const locations = JSON.parse($d0f7ce18c37ad6f6$var$mapBox.dataset.locations);
    (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(locations);
}
if ($d0f7ce18c37ad6f6$var$loginForm) $d0f7ce18c37ad6f6$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $70af9284e599e604$export$596d806903d1f59e)(email, password);
});
if ($d0f7ce18c37ad6f6$var$logOutBtn) $d0f7ce18c37ad6f6$var$logOutBtn.addEventListener("click", (0, $70af9284e599e604$export$a0973bcfe11b05c9));
if ($d0f7ce18c37ad6f6$var$userDataForm) $d0f7ce18c37ad6f6$var$userDataForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    (0, $936fcc27ffb6bbb1$export$f558026a994b6051)(form, "data");
});
if ($d0f7ce18c37ad6f6$var$userPasswordForm) $d0f7ce18c37ad6f6$var$userPasswordForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const btn = document.querySelector(".btn--save-password");
    const fieldCurrentPassword = document.getElementById("password-current");
    const fieldPassword = document.getElementById("password");
    const fieldPasswordConfirm = document.getElementById("password-confirm");
    btn.textContent = "Updating...";
    const passwordCurrent = fieldCurrentPassword.value;
    const password = fieldPassword.value;
    const passwordConfirm = fieldPasswordConfirm.value;
    await (0, $936fcc27ffb6bbb1$export$f558026a994b6051)({
        passwordCurrent: passwordCurrent,
        password: password,
        passwordConfirm: passwordConfirm
    }, "password");
    btn.textContent = "Save password";
    fieldCurrentPassword.value = "";
    fieldPassword.value = "";
    fieldPasswordConfirm.value = "";
});
if ($d0f7ce18c37ad6f6$var$bookBtn) $d0f7ce18c37ad6f6$var$bookBtn.addEventListener("click", (e)=>{
    e.target.textContent = "Processing...";
    e.target.disabled = true;
    const { tourId: tourId } = e.target.dataset;
    (0, $6710bca62beba915$export$8d5bdbf26681c0c2)(tourId);
});
if ($d0f7ce18c37ad6f6$var$signupForm) $d0f7ce18c37ad6f6$var$signupForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const btn = document.querySelector(".btn");
    btn.textContent = "Signing up...";
    btn.disabled = true;
    await (0, $2db3670f13ba185b$export$7200a869094fec36)(name, email, password, passwordConfirm);
});


//# sourceMappingURL=server.js.map
