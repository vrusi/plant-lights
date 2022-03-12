let sliderRed = document.getElementById('slider-red');
let sliderGreen = document.getElementById('slider-green');
let sliderBlue = document.getElementById('slider-blue');

let inputRed = document.getElementById('input-red');
let inputGreen = document.getElementById('input-green');
let inputBlue = document.getElementById('input-blue');

let preview = document.getElementById('preview');


sliderRed.oninput = function() {
    inputRed.value = this.value;
    preview.style.backgroundColor = 'rgb(' + this.value + ',' + sliderGreen.value + ',' + sliderBlue.value + ')';
}

sliderGreen.oninput = function() {
    inputGreen.value = this.value;
    preview.style.backgroundColor = 'rgb(' + sliderRed.value + ',' + this.value + ',' + sliderBlue.value + ')';

}

sliderBlue.oninput = function() {
    inputBlue.value = this.value;
    preview.style.backgroundColor = 'rgb(' + sliderRed.value + ',' + sliderGreen.value + ',' + this.value + ')';
}

inputRed.onchange = function() {
    sliderRed.value = this.value;
    preview.style.backgroundColor = 'rgb(' + this.value + ',' + inputGreen.value + ',' + inputBlue.value + ')';
}

inputGreen.onchange = function() {
    sliderGreen.value = this.value;
    preview.style.backgroundColor = 'rgb(' + inputRed.value + ',' + this.value + ',' + inputBlue.value + ')';
}

inputBlue.onchange = function() {
    sliderBlue.value = this.value;
    preview.style.backgroundColor = 'rgb(' + inputRed.value + ',' + inputGreen.value + ',' + this.value + ')';
}