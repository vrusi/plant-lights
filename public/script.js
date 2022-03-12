let sliderRed = document.getElementById("slider-red");
let sliderGreen = document.getElementById("slider-green");
let sliderBlue = document.getElementById("slider-blue");

let inputRed = document.getElementById("input-red");
let inputGreen = document.getElementById("input-green");
let inputBlue = document.getElementById("input-blue");

inputRed.value = sliderRed.value;
inputGreen.value = sliderGreen.value;
inputBlue.value = sliderBlue.value;


sliderRed.oninput = function() {
    inputRed.value = this.value;
}

sliderGreen.oninput = function() {
    inputGreen.value = this.value;
}

sliderBlue.oninput = function() {
    inputBlue.value = this.value;
}

inputRed.onchange = function() {
    sliderRed.value = this.value;
}

inputGreen.onchange = function() {
    sliderGreen.value = this.value;
}

inputBlue.onchange = function() {
    sliderBlue.value = this.value;
}

console.log(test);