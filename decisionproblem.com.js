var div = document.createElement('script');
div.src = 'https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js';
var head = document.getElementsByTagName('head')[0];
head.prepend(div);

var normalSellPercent = 200;
var percentDif = 5;
var maxWirePrice = 20; //
var perfectWirePrice = 17; //
var maxWireLength = 10000; //
var minWireLength = 100;
var creationSpeed = 20; //Paperclips per sec
var depositPercent = 2;

var currentMoney;
var marketingPrice;
var wirePrice;
var autoClippersPrice;
var megaClipperCost;
var wireLength;
var avgClipsCreatePS;
var lastAnythingBuyTime = new Date();
var lastProjectCreateTime = new Date();
var InvestmentIsDeposit = false;
var depositCount = 0;
var withdrawTime = new Date();

//autobuy params
var autoBuyAutoClippers = false;
var autoBuyMarketing = false;
var autoBuyMegaClippers = false;

var unsoldClips;


setInterval(function() { //paperclips price balanced

    var avgClipsSoldPS = parseInt($('#avgSales').text().replace(/\s+/g, ""));
    var avgClipsCreatePS = parseInt($('#clipmakerRate').text().replace(/\s+/g, ""));
    var tempUnsoldClips = parseInt($('#unsoldClips').text().replace(/\s+/g, ""));
    var publicDemand = parseInt($('#demand').text().replace(/\s+/g, ""));

    checkIfDemandIsNaN(publicDemand);

    if (avgClipsCreatePS > 999) { //infinity num
        if (avgClipsSoldPS < (avgClipsCreatePS + (avgClipsCreatePS / 100 * percentDif))) {
            //if (tempUnsoldClips < unsoldClips - avgClipsCreatePS/15) {
            if ($('#btnLowerPrice').attr("disabled") !== 'disabled') {
                $('#btnLowerPrice').click();
            }
        } else if (avgClipsSoldPS > (avgClipsCreatePS - (avgClipsCreatePS / 100 * percentDif))) {
            //} else if (tempUnsoldClips > unsoldClips - avgClipsCreatePS/15) {
            if ($('#btnRaisePrice').attr("disabled") !== 'disabled') {
                $('#btnRaisePrice').click();
            }
        }
    } else {
        if (publicDemand < (normalSellPercent - percentDif)) {
            $('#btnLowerPrice').click();
        } else if (publicDemand > (normalSellPercent + percentDif)) {
            $('#btnRaisePrice').click();
        }
    }
    unsoldClips = parseInt($('#unsoldClips').text().replace(/\s+/g, ""));
}, 1000);

function checkIfDemandIsNaN(publicDemand) {
    if (publicDemand === 'NaN') {
        $('#btnRaisePrice').click();
        checkIfDemandIsNaN(publicDemand);
    }
}

setInterval(function() { //some action perform
    updateAllStatusInformation();
    manualClipsCreate();

}, 1000);

setInterval(function() { //any buy
    updateAllStatusInformation();
    if (wireLength <= minWireLength &&
        wirePrice <= currentMoney) {
        buyWire();
    } else {
        buyAllOthers();
    }
    if ($('#projectsDiv').css('display') !== 'none') {
        selectAnyProjects();
    }
}, 500);

setInterval(function() { //projects perform , earn yomi and lvl Up Investments Engine
    selectAnyProjects();
    yomiEarn();
    lvlUpInvestmentsEngine();
}, 3000);

setInterval(function() { //Investments
    investmentPerform();
}, 200);

function updateAllStatusInformation() {
    currentMoney = parseInt($('#funds').text().split(',')[0].replace(/\s+/g, '')) + 1;
    marketingPrice = parseInt($('#adCost').text().split(',')[0].replace(/\s+/g, '')) + 1;
    wirePrice = parseInt($('#wireCost').text().split(',')[0].replace(/\s+/g, ''));
    autoClippersPrice = parseInt($('#clipperCost').text().split(',')[0].replace(/\s+/g, '')) + 1;
    megaClipperCost = parseInt($('#megaClipperCost').text().split(',')[0].replace(/\s+/g, '')) + 1;
    wireLength = parseInt($('#wire').text().replace(/\s+/g, ""));
    avgClipsCreatePS = parseInt($('#clipmakerRate').text().replace(/\s+/g, ""));
}


var autoBuyAutoClippers = false;
var autoBuyMarketing = false;
var autoBuyMegaClippers = false;

function buyAllOthers() {
    if (currentMoney >= marketingPrice && autoBuyMarketing) { //buy marketings
        if ($('#btnExpandMarketing').attr("disabled") !== 'disabled') {
            $('#btnExpandMarketing').click();
        }
    } else if (currentMoney >= autoClippersPrice && autoBuyAutoClippers) { // buy autoClippers
        if ($('#btnMakeClipper').attr("disabled") !== 'disabled') {
            $('#btnMakeClipper').click();
        }
    } else if (currentMoney >= megaClipperCost && autoBuyMegaClippers) {
        if ($('#btnMakeMegaClipper').attr("disabled") !== 'disabled') {
            $('#btnMakeMegaClipper').click();
        }
    }
    if (wireLength <= maxWireLength && wirePrice <= perfectWirePrice) { //buy wire
        buyWire();
    }
}

function manualClipsCreate() {
    if ((avgClipsCreatePS < creationSpeed + 1000) && wireLength > 0) {
        if ($('#btnMakePaperclip').attr("disabled") !== 'disabled') {
            //$('#btnMakePaperclip').click(); //create clips
            clipClick(wireLength);
        }
    }
}

function selectAnyProjects() {
    var operations = parseInt($('#operations').text().replace(/\s+/g, ""));
    //$('#projectListTop').children().length
    var projList = $('#projectListTop').children();
    var trustCount = parseInt($('#trust').text().replace(/\s+/g, ""));
    var processorsValue = parseInt($('#processors').text().replace(/\s+/g, ""))
    var memoryValue = parseInt($('#memory').text().replace(/\s+/g, ""))
    if (trustCount > 0) {
        if (processorsValue > memoryValue || processorsValue == memoryValue) {
            if ($('#btnAddMem').attr("disabled") !== 'disabled') {
                $('#btnAddMem').click(); //create clips
            }
            //addMem();
        } else {
            if ($(btnAddProc).attr("disabled") !== 'disabled') {
                $('#btnAddProc').click(); //create clips
            }
            //addProc();
        }
    }
    projList.each(function() {
        if ($(this).attr("disabled") !== 'disabled' && $(this).attr('id') !== 'projectButton219') { //projectButton219 - reset point (mem/proc)
            $(this).click();
            return false;
        }
    });
}

function investmentPerform() {
    console.log('investmentPerform');
    if (new Date() - withdrawTime < 5000) {

    } else {
        if (!InvestmentIsDeposit) {
            investDeposit();
            depositCount = parseInt($('#investmentBankroll').text().split(',')[0].replace(/\s+/g, '')) + 1;
            InvestmentIsDeposit = true;
            console.log('%c  Deposit  ' + depositCount + '  <' + new Date().toLocaleString() + '> ', consoleLogStyleRed);
        } else {
            var tempDepositCount = parseInt($('#investmentBankroll').text().split(',')[0].replace(/\s+/g, '')) + 1;
            if (tempDepositCount - depositCount > (bigNumberFormatingForPrint(depositCount.toString()) / 100 * depositPercent)) {
                investWithdraw();
                InvestmentIsDeposit = false;
                console.log('%c  Withdraw ' + bigNumberFormatingForPrint(depositCount.toString()) + '--' 
                    + bigNumberFormatingForPrint(tempDepositCount.toString()) 
                    + '   <' + new Date().toLocaleString() + '> ', consoleLogStyleGreen);
                withdrawTime = new Date();
            }
        }
    }
}

function yomiEarn() {
    if ($('#btnNewTournament').attr("disabled") !== 'disabled') {
        $('#btnNewTournament').click(); //statrt turn
    }
    if ($('#btnRunTournament').attr("disabled") !== 'disabled') {
        $('#btnRunTournament').click(); //run
    }
}

function lvlUpInvestmentsEngine() {
    if ($('#btnImproveInvestments').attr("disabled") !== 'disabled') {
        $('#btnImproveInvestments').click(); //run
    }
}

var consoleLogStyleGreen = [
    'background: linear-gradient(#05d21d, #008710)',
    'color: #ffffff',
    'border: 1px solid #3E0E02',
    'line-height: 20px'
].join(';');
var consoleLogStyleRed = [
    'background: linear-gradient(#D33106, #571402)',
    'color: #ffffff',
    'border: 1px solid #3E0E02',
    'line-height: 20px'
].join(';');

function bigNumberFormatingForPrint(number) {
    var cArr = number.split('')
    var result = '';
    var pos = 0;
    for (i = 0; i < cArr.length; i++) {
        pos++;
        if ((pos) % 3 == 0) {
            result += ' ';
        }
        result += cArr[i]
    }
    return result;
}