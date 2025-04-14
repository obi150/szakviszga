const slider1 = document.getElementById("speed");
const slider2 = document.getElementById("sens");
const slider1Value = document.getElementById("speedValue");
const slider2Value = document.getElementById("sensValue");

slider1.addEventListener("input", function () {
    slider1Value.textContent = slider1.value;
});

slider2.addEventListener("input", function () {
    slider2Value.textContent = slider2.value;
});

function sendValues() {
    speed = slider1.value;
    sensitivity = slider2.value;
}