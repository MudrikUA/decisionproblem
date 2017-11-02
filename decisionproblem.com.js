var div = document.createElement('script');
div.src = 'https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js';
var head = document.getElementsByTagName('head')[0];
head.prepend(div);

var percentDif = 15;
var maxWirePrice = 20; //
var perfectWirePrice = 17; //
var maxWireLength = 10000; //
var minWireLength = 500;
var creationSpeed = 200; //Paperclips per sec


setInterval(function() { //paperclips price balanced

    var avgClipsSoldPS = parseInt($('#avgSales').text().replace(/\s+/g, ""));
    var avgClipsCreatePS = parseInt($('#clipmakerRate').text().replace(/\s+/g, ""));

    if (avgClipsSoldPS < (avgClipsCreatePS + (avgClipsCreatePS / 100 * percentDif))) {
        $('#btnLowerPrice').click();
    } else if (avgClipsSoldPS > (avgClipsCreatePS - (avgClipsCreatePS / 100 * percentDif))) {
        $('#btnRaisePrice').click();
    }

}, 1000);

setInterval(function() { //some action perform
    var currentMoney = parseInt($('#funds').text().split(',')[0].replace(/\s+/g, '')) + 1;
    var marketingPrice = parseInt($('#adCost').text().split(',')[0].replace(/\s+/g, '')) + 1;
    var wirePrice = parseInt($('#wireCost').text().split(',')[0].replace(/\s+/g, ''));
    var autoClippersPrice = parseInt($('#clipperCost').text().split(',')[0].replace(/\s+/g, '')) + 1;
    var wireLength = parseInt($('#wire').text().replace(/\s+/g, ""));
    var avgClipsCreatePS = parseInt($('#clipmakerRate').text().replace(/\s+/g, ""));
    if (wireLength <= minWireLength) {
        buyWire();
    } else {
        buyAllOthers();
        manualClipsCreate();
    }
    selectAnyProjects
}, 1000 / creationSpeed);

function updateAllStatusInformation() {
    currentMoney = parseInt($('#funds').text().split(',')[0].replace(/\s+/g, '')) + 1;
    marketingPrice = parseInt($('#adCost').text().split(',')[0].replace(/\s+/g, '')) + 1;
    wirePrice = parseInt($('#wireCost').text().split(',')[0].replace(/\s+/g, ''));
    autoClippersPrice = parseInt($('#clipperCost').text().split(',')[0].replace(/\s+/g, '')) + 1;
    wireLength = parseInt($('#wire').text().replace(/\s+/g, ""));
    avgClipsCreatePS = parseInt($('#clipmakerRate').text().replace(/\s+/g, ""));
}

function buyWire() {
    if (wireLength <= 1) {
        $('#btnBuyWire').click();
    }
    if (wirePrice <= maxWirePrice) {
        $('#btnBuyWire').click();
    }
}

function buyAllOthers() {
    if (currentMoney >= marketingPrice) { //buy marketings
        $('#btnExpandMarketing').click();
    } else if (currentMoney >= autoClippersPrice) { // buy autoClippers
        $('#btnMakeClipper').click();
    }
    if (wireLength <= maxWireLength && wirePrice <= perfectWirePrice) { //buy wire
        $('#btnBuyWire').click();
    }
}

function manualClipsCreate() {
    if (avgClipsCreatePS < creationSpeed + 100) {
        $('#btnMakePaperclip').click(); //create clips
    }
}

function selectAnyProjects() {
    var operations = parseInt($('#operations').text().replace(/\s+/g, ""));
    //$('#projectListTop').children().length
    var projList = $('#projectListTop').children();
}

function checkIfExistFreeTrustPoint(){
	if($('#btnAddProc').attr( "disabled" ) === 'disabled'){
		return false;
	}
	return true;
}