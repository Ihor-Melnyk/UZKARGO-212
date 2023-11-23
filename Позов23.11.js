//UZKARGO Позов

//function onCreate() {
 //  EdocsApi.setAttributeValue({code: 'DocExecutionTerm', value: EdocsApi.getVacationPeriodEnd(new Date(), 30), text: null});
 //   }
 function onCardInitialize() {
    //ShtrafInProcess();
    onChangeClaimKind();
    calculateTotalSum2();
   // AssignRespProcess();
    setContractorHome();
    setUnitForMask(); 
     //ShtrafProcess();
     DocCheckInProcess();
    setRozriz();
}


function onChangeSumaSud2_rah(){
    calculateSumaSud12_rah();
}
function onChangeSumaSud1_rah(){
    calculateSumaSud12_rah();
}

function onTaskExecuteShtraf(routeStage){
    if(routeStage.executionResult == 'executed'){
        if(!EdocsApi.getAttributeValue('SumaSud12_rah').value)
            throw 'Помилка! Неможливо виконати завдання не заповнивши  поля таблиць "Сума за рішенням суду" та "Судові витрати"';
    }
}


function setRozriz(){

    if(!EdocsApi.getAttributeValue('Rozriz').value){

        EdocsApi.setAttributeValue({code: 'Rozriz', value: EdocsApi.findEmployeeSubdivisionByLevelAndEmployeeID(CurrentDocument.initiatorId, 1)?.unitName.replaceAll('"', ''), text: null});

    }

}
function onChangeCounterparty(){
    const Counterparty = EdocsApi.getAttributeValue('Counterparty').value;
    if(Counterparty){
        const obj = EdocsApi.getDictionaryItemData('Contragents', EdocsApi.getAttributeValue('Counterparty').value);
        if(obj && obj.attributes && obj.attributes.length>0){
            //try{
                EdocsApi.setAttributeValue({ code: "ContractorEDRPOU", value: obj.attributes.find(x => x.code == "edrpou")?.value, text: null });
                EdocsApi.setAttributeValue({ code: "CtrptShortName", value: obj.attributes.find(x => x.code == "short_name")?.value, text: null });
            //}catch{}
        }
    }
    else{
        EdocsApi.setAttributeValue({code: 'CtrptShortName', value: null, text: null});
        EdocsApi.setAttributeValue({code: 'ContractorEDRPOU', value: null, text: null});
    }
}
//Доступні таблиці на етапі маршруту
function ShtrafInProcess(){
    if(EdocsApi.getCaseTaskDataByCode('Shtraf')?.state == 'inProgress'){
        controlNotDisabled('ClaimTable');
        controlNotDisabled('ClaimTableCarrier');

        controlNotDisabled('SumaSud2');
        controlNotDisabled('SudVutrat2');
        controlNotDisabled('SumaSud1');
        controlNotDisabled('SudVutrat1');

        //controlRequired('ClaimTableCarrier');
        controlRequired('SumaSud2');
        controlRequired('SudVutrat2');
        //controlRequired('ClaimTable');
        controlRequired('SumaSud1');
        controlRequired('SudVutrat1');
    }
}


function calculateSumaAll(){
    var totalSum = EdocsApi.getAttributeValue('totalSum')?.value ?? 0;
    var PaidAmount2 = EdocsApi.getAttributeValue('PaidAmount2')?.value ?? 0;
    EdocsApi.setAttributeValue({code: 'SumaAll', value: (parseFloat(totalSum)+parseFloat(PaidAmount2)), text: null});
}
function onChangetotalSum(){
    calculateSumaAll();
}
function onChangePaidAmount2(){
    calculateSumaAll();
}

function onChangeClaimKind(){
    claimKind = EdocsApi.getAttributeValue('ClaimKind');
    if(claimKind && claimKind.value == '2'){                   
        EdocsApi.setControlProperties({code: 'SaveCargoFailureType', hidden: false, disabled: false, required: true});
    }
	else{
	   EdocsApi.setControlProperties({code: 'SaveCargoFailureType', hidden: true, disabled: false, required: false});
	}
    setTopicDocument();
}

function calculateTotalSum() {
    
    var tableAttr = EdocsApi.getAttributeValue('ClaimTable');
    var length = tableAttr.value ? tableAttr.value.length : 0;

    var contractAmountSum = 0;
    for (var i = 0; i < length; i++) {
        var row = tableAttr.value[i];
        var contactAmount = row.find(x => x.code == 'ContractAmount');
        contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
    }
    EdocsApi.setAttributeValue({ code: 'totalSum', value: contractAmountSum > 0 ? contractAmountSum : 0});
}
function calculateTotalSum3() {
    
    var tableAttr = EdocsApi.getAttributeValue('ClaimTableCarrier');
    var length = tableAttr.value ? tableAttr.value.length : 0;

    var contractAmountSum = 0;
    for (var i = 0; i < length; i++) {
        var row = tableAttr.value[i];
        var contactAmount = row.find(x => x.code == 'InvoiceClaimAmount3');
        contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
    }
    EdocsApi.setAttributeValue({ code: 'totalSum3', value: contractAmountSum > 0 ? contractAmountSum : 0 });
}
function calculateAmountCarrier() {
    
    var tableAttr = EdocsApi.getAttributeValue('ClaimTableCarrier');
    var length = tableAttr.value ? tableAttr.value.length : 0;

    var contractAmountSum = 0;
    for (var i = 0; i < length; i++) {
        var row = tableAttr.value[i];
        var contactAmount = row.find(x => x.code == 'AmountCarrier');
        contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
    }
    EdocsApi.setAttributeValue({ code: 'PaidAmount2', value: contractAmountSum > 0 ? contractAmountSum : 0 });
}

function calculateTotalSum2() {
    
    var totalSum2 = EdocsApi.getAttributeValue('totalSum2')?.value;
   // if(!totalSum2){
        var tableAttr = EdocsApi.getAttributeValue('Invoice_Claim_table2');
        var length = tableAttr.value ? tableAttr.value.length : 0;

        var contractAmountSum = 0;
        for (var i = 0; i < length; i++) {
            var row = tableAttr.value[i];
            var contactAmount = row.find(x => x.code == 'Invoice_Claim_Amaunt2');
            contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
        }
        EdocsApi.setAttributeValue({ code: 'totalSum2', value: contractAmountSum > 0 ? contractAmountSum : 0 });
 //   }
}
function calculateTotalSum1() {
    
    var tableAttr = EdocsApi.getAttributeValue('ClaimTable');
    var length = tableAttr.value ? tableAttr.value.length : 0;

    var contractAmountSum = 0;
    for (var i = 0; i < length; i++) {
        var row = tableAttr.value[i];
        var contactAmount = row.find(x => x.code == 'ContractAmount1');
        contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
    }
    EdocsApi.setAttributeValue({ code: 'totalSum1', value: contractAmountSum > 0 ? contractAmountSum : 0 });
}

/*
function AssignRespProcess(){
    var AssignResp = EdocsApi.getCaseTaskDataByCode('AssignResp');
    if(AssignResp && AssignResp.executionState == 'inProgress'){
        controlRequired('Responsible2');
        controlNotDisabled('Responsible2');
    }
    else{
        controlNotRequired('Responsible2');
        controlDisabled('Responsible2');
    }
}
*/
function onBeforeCardSave(){    
    setRegProp();
    if(!EdocsApi.getAttributeValue('SumaAll')?.value){
        if(EdocsApi.getCaseTaskDataByCode('Shtraf')?.state == 'inProgress' || EdocsApi.getCaseTaskDataByCode('Shtraf1')?.state == 'inProgress' || EdocsApi.getCaseTaskDataByCode('Shtraf2')?.state == 'inProgress')
            throw 'Не вірно введенні дані. Перевірте введену Задоволену суму по Таблицям';
    }
    if(EdocsApi.getAttributeValue('ContractorEDRPOU').value != EdocsApi.getAttributeValue('ContractorEDRPOUText').value){
        EdocsApi.setAttributeValue({code: 'ContractorEDRPOUText', value: EdocsApi.getAttributeValue('ContractorEDRPOU').value, text: null});
        EdocsApi.setAttributeValue({code: 'CounterpartyText', value: EdocsApi.getAttributeValue('CtrptShortName').value, text: null});
    }
    if(!EdocsApi.getAttributeValue('DocExecutionTerm').value)
        EdocsApi.setAttributeValue({code: 'DocExecutionTerm', value: EdocsApi.getVacationPeriodEnd(new Date(), 30), text: null});
	   var ClaimKind = EdocsApi.getAttributeValue ('ClaimKind').value;
    var ForMask = null;
    if(ClaimKind){
        switch(ClaimKind){
            case '1':
                ForMask = 'П';
                break;
            case '2':
                ForMask = 'Н';
                break;
            case '3':
                ForMask = 'Р';
                break;
            case '4':
                ForMask = 'І';
                break;
        }
    }
    EdocsApi.setAttributeValue({code: 'ForMask', value: ForMask, text: null});	
}

function setRegProp(){
    var RegNumber = EdocsApi.getAttributeValue('RegNumber').value;
    var RegDate = EdocsApi.getAttributeValue('RegDate').value;
    if(RegNumber && RegDate){
        if(EdocsApi.getAttributeValue('ClaimNumber').value != RegNumber)
            EdocsApi.setAttributeValue({code: 'ClaimNumber', value: RegNumber, text: null});
        if(EdocsApi.getAttributeValue('ClaimDate').value != moment(RegDate).format('DD.MM.YYYY'))
            EdocsApi.setAttributeValue({code: 'ClaimDate', value: moment(RegDate).format('DD.MM.YYYY'), text: null});
    }
    else{
        EdocsApi.setAttributeValue({code: 'ClaimNumber', value: null, text: null});
        EdocsApi.setAttributeValue({code: 'ClaimDate', value: null, text: null});
    }
}

function onChangeClaimTableCarrier(){
   // if(EdocsApi.getCaseTaskDataByCode('Shtraf').state == 'inProgress'){
        calculateSumaSud2();
   // }
   // else{
        calculateAllSums("Розподіл по причетним перевізникам");
//   }
	
}

function calculateSumaSud2(){
    var ClaimTableCarrier = EdocsApi.getAttributeValue('ClaimTableCarrier').value;
    if(ClaimTableCarrier && ClaimTableCarrier.length > 0){
        EdocsApi.setAttributeValue({code: 'SumaSud2_rah', value: ClaimTableCarrier.map(x=>Number(x.find(y=>y.code == 'SumaSud2').value)).reduce((a, b) => a + b, 0), text: null});
        EdocsApi.setAttributeValue({code: 'SudVutrat2_rah', value: ClaimTableCarrier.map(x=>Number(x.find(y=>y.code == 'SudVutrat2').value)).reduce((a, b) => a + b, 0), text: null});
        
    }
    else{
        EdocsApi.setAttributeValue({code: 'SumaSud2_rah', value: 0, text: null});
        EdocsApi.setAttributeValue({code: 'SudVutrat2_rah', value: 0, text: null});
    }
    calculateSumaSud12_rah();
    calculateSudVutrat();
}

function onChangeClaimTable(){
    //if(EdocsApi.getCaseTaskDataByCode('Shtraf').state == 'inProgress'){
      calculateSumaSud1();
  //  }
  //  else{
        calculateAllSums("Розподіл по причетним підрозділам");
  //  }
}

function calculateSumaSud1(){
    var ClaimTable = EdocsApi.getAttributeValue('ClaimTable').value;
    if(ClaimTable && ClaimTable.length > 0){
        EdocsApi.setAttributeValue({code: 'SumaSud1_rah', value: ClaimTable.map(x=>Number(x.find(y=>y.code == 'SumaSud1').value)).reduce((a, b) => a + b, 0), text: null});
        EdocsApi.setAttributeValue({code: 'SudVutrat1_rah', value: ClaimTable.map(x=>Number(x.find(y=>y.code == 'SudVutrat1').value)).reduce((a, b) => a + b, 0), text: null});        
    }
    else{
        EdocsApi.setAttributeValue({code: 'SumaSud1_rah', value: 0, text: null});
        EdocsApi.setAttributeValue({code: 'SudVutrat1_rah', value: 0, text: null});
    }
    calculateSumaSud12_rah();
    calculateSudVutrat();
}

function calculateSumaSud12_rah(){
    var DocCheck1 = EdocsApi.getCaseTaskDataByCode('DocCheck1');
    if(DocCheck1 && DocCheck1.executionState != 'complete'){
        var SumaSud12_rah = (Number(EdocsApi.getAttributeValue('SumaSud1_rah').value)+Number(EdocsApi.getAttributeValue('SumaSud2_rah').value));
        EdocsApi.setAttributeValue({code: 'SumaSud12_rah', value: SumaSud12_rah, text: null});

        setProcessing_result(SumaSud12_rah);
    }
}

function calculateSudVutrat(){
    EdocsApi.setAttributeValue({code: 'SudVutrat', value: (Number(EdocsApi.getAttributeValue('SudVutrat1_rah').value)+Number(EdocsApi.getAttributeValue('SudVutrat2_rah').value)), text: null});
}

function onChangeSudVutrat1_rah(){
    calculateSudVutrat();
}
function onChangeSudVutrat2_rah(){
    calculateSudVutrat();
}

function setProcessing_result(SumaSud12_rah){
    var totalSum2 = Number(EdocsApi.getAttributeValue('totalSum2').value);
    if(totalSum2 == 0) {
        calculateTotalSum2();
        totalSum2 = Number(EdocsApi.getAttributeValue('totalSum2').value);
    }

    if(SumaSud12_rah > totalSum2){
		EdocsApi.setAttributeValue({code: 'SumaSud12_rah', value: null, text: null});
        throw 'Не вірно введенні дані.';
    }
    else{
        if(SumaSud12_rah == 0){
            EdocsApi.setAttributeValue({code: 'Processing_result', value: 'Відхилено', text: null});
        }
        else{
            if(SumaSud12_rah == totalSum2){
                EdocsApi.setAttributeValue({code: 'Processing_result', value: 'Задоволено', text: null});
            }
            else{
                EdocsApi.setAttributeValue({code: 'Processing_result', value: 'Частково задоволено', text: null});
            }
        }
    }
}

function calculateAllSums(tablname){
    calculateTotalSum();
    calculateTotalSum1();
    calculateTotalSum3();

    calculateRozrahSum();

    calculateAmountCarrier();
    calculateSumaAll();

}

function calculateRozrahSum(){
    EdocsApi.setAttributeValue({code: 'RozrahSum', value: (Number(EdocsApi.getAttributeValue('totalSum1').value)+Number(EdocsApi.getAttributeValue('totalSum3').value)), text: null});
}

function onChangeContractAmount1(){
    var ContractAmount1 = EdocsApi.getAttributeValue('ContractAmount1');   
    EdocsApi.setAttributeValue({code: 'ContractAmount', value: ContractAmount1.value, text: ContractAmount1.text}); 
}
function onChangeInvoiceClaimAmount3(){
    var InvoiceClaimAmount3 = EdocsApi.getAttributeValue('InvoiceClaimAmount3');   
    EdocsApi.setAttributeValue({code: 'AmountCarrier', value: InvoiceClaimAmount3.value, text: InvoiceClaimAmount3.text}); 
}

function controlHide(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.hidden = true;
        EdocsApi.setControlProperties(control);
    }
}
function controlShow(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.hidden = false;
        EdocsApi.setControlProperties(control);
    }
}

function controlRequired(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.required = true;
        EdocsApi.setControlProperties(control);
    }
}
function controlNotRequired(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.required = false;
        EdocsApi.setControlProperties(control);
    }
}

function controlDisabled(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.disabled = true;
        EdocsApi.setControlProperties(control);
    }
}
function controlNotDisabled(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.disabled = false;
        EdocsApi.setControlProperties(control);
    }
}
function setContractorHome() {
    var ContractorCode = EdocsApi.getAttributeValue("OrgCode");
    if (!CurrentDocument.isDraft || ContractorCode.value || ContractorCode.value == "40075815") {
        return;
    }
    var OrganizationID = EdocsApi.getAttributeValue("OrganizationID");
    var OrgShortName = EdocsApi.getAttributeValue("OrgShortName");
  
    OrgShortName.value = 'АТ "Укрзалізниця"';
    ContractorCode.value = "40075815";
    OrganizationID.value = '1';
   
    EdocsApi.setAttributeValue(OrgShortName);
    EdocsApi.setAttributeValue(ContractorCode);
    EdocsApi.setAttributeValue(OrganizationID);
}
//ВІдправка коментаря про створення Справи
function onTaskExecuteAccepted(routeStage){
    if(routeStage.executionResult != 'rejected'){
        if(CurrentDocument.inExtId){
            var methodData = {
                extSysDocId: CurrentDocument.id,
                extSysDocVersion:  CurrentDocument.version,
                eventType: "CommentAdded",
                comment: 'Документ "Претензійна справа" створена і зареєстрована №'+EdocsApi.getAttributeValue('RegNumber')?.value+' від '+moment(EdocsApi.getAttributeValue('RegDate')?.value).format('DD.MM.YYYY'),
                partyCode: EdocsApi.getAttributeValue('OrgCode').value,
                userTitle: CurrentUser.name,
                occuredAt: new Date()
            };
           routeStage.externalAPIExecutingParams = {externalSystemCode: 'ESIGN1', externalSystemMethod: 'integration/processEvent', data: methodData, executeAsync: false}
        }
    }
}

function onSearchClaimTableInvoice(searchRequest){
    searchChildTable(searchRequest);
}
function onSearchInvoiceCarrier(searchRequest){
    searchChildTable(searchRequest);
}
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
}

function searchChildTable(searchRequest){
    var parentTable = EdocsApi.getAttributeValue('Invoice_Claim_table2')?.value;
    if(parentTable && parentTable.length > 0){
        /*
        var firstChildTable = EdocsApi.getAttributeValue('ClaimTable')?.value;
        var secondChildTable = EdocsApi.getAttributeValue('ClaimTableCarrier')?.value;
        childArr = [];
        if((firstChildTable && firstChildTable.length > 0) || (secondChildTable && secondChildTable.length > 0)){
            childArr = [...firstChildTable.map(x=>x.find(y=>y.code == 'ClaimTableInvoice').value), ...secondChildTable.map(x=>x.find(y=>y.code == 'InvoiceCarrier').value)];
        }
        var parentArr = parentTable.map(x=>x.find(y=>y.code == 'Invoice_Claim_number2').value)
        
        searchRequest.response = (parentArr.diff(childArr)).map(n=> ({name: n, id: n}));
        */
        var parentArr = parentTable.map(x=>x.find(y=>y.code == 'Invoice_Claim_number2').value)        
        searchRequest.response = parentArr.map(n=> ({name: n, id: n}));
    }
    else{
        searchRequest.response = null;
    }
}


function onChangeClaimTableInvoice(){

    setClaimTable('ClaimTableInvoice','ContractAmount1','ContractAmount');

    setSecondTableCall('ClaimTableInvoice','typeInvoice','TypeInvoiceClaimTable');

    setSecondTableCall('ClaimTableInvoice','dataInvoice','DataClaimTable');

}

function onChangeInvoiceCarrier(){

    setClaimTable('InvoiceCarrier','InvoiceClaimAmount3','AmountCarrier');

    setSecondTableCall('InvoiceCarrier','typeInvoice','TypeInvoiceClaimTableCarrier');

    setSecondTableCall('InvoiceCarrier','dataInvoice','DataClaimTableCarrier');

}

function setClaimTable(elName, setInvoice, setAmount){
    var el = EdocsApi.getAttributeValue(elName)?.value;
    if(el){
        var parentTable = EdocsApi.getAttributeValue('Invoice_Claim_table2')?.value;
        var buf = parentTable.filter(x => { return x.find(y=>y.value == el)})?.map(s=>s.find(n=>n.code=='Invoice_Claim_Amaunt2')?.value)[0];
        if(buf){
            EdocsApi.setAttributeValue({code: setInvoice, value: buf, text: null});
            EdocsApi.setAttributeValue({code: setAmount, value: buf, text: null});
        }
    }
}

function setSecondTableCall(elName, fromCall, toCall){
    var el = EdocsApi.getAttributeValue(elName)?.value;
    if(el){
        var parentTable = EdocsApi.getAttributeValue('Invoice_Claim_table2')?.value;
        var buf = parentTable.filter(x => { return x.find(y=>y.value == el)})?.map(s=>s.find(n=>n.code==fromCall)?.value)[0];
        if(fromCall == 'typeInvoice')  buf = parentTable.filter(x => { return x.find(y=>y.value == el)})?.map(s=>s.find(n=>n.code==fromCall)?.text)[0];
        if(buf){
            EdocsApi.setAttributeValue({code: toCall, value: buf, text: null});
        }
    }
}
function onChangeInvoice_Claim_table2(){   
 calculateTotalSum2();
}
//підрозділ Ініціатора  для маски 
function setUnitForMask(){
debugger;
    var UnitForMask = EdocsApi.getAttributeValue('UnitForMask')?.value;
    if(!UnitForMask){
        var Responsible = EdocsApi.getAttributeValue('Responsible')?.value;
        if(Responsible)
            EdocsApi.setAttributeValue({code: 'UnitForMask', value: EdocsApi.getEmployeeDataByEmployeeID(Responsible).unitCode, text: null});
    }
}

//Позов  перевірка на етапі Shtraf
function onTaskExecuteShtraf(routeStage){
    if(routeStage.executionResult != 'Shtraf'){
        var buf = false;
        var str = 'Заповніть поле(я) ';

        var Invoice_Claim_table2 = EdocsApi.getAttributeValue('Invoice_Claim_table2').value;
        if(Invoice_Claim_table2 && Invoice_Claim_table2.length > 0){
            Invoice_Claim_table2.map(x=>(x.find(y=>y.code == "Invoice_Claim_number2").value)).every(s=> {if(s== null) {buf = true; str += '"№  накладної" таблиці "Документи, що додані до позову", '}});
            Invoice_Claim_table2.map(x=>(x.find(y=>y.code == "Invoice_Claim_Amaunt2").value)).every(s=> {if(s== null) {buf = true; str += '"Сума" таблиці "Документи, що додані до позову", '}});
            Invoice_Claim_table2.map(x=>(x.find(y=>y.code == "SpravaBula_Ni").value)).every(s=> {if(s== null) {buf = true; str += '"Була претензійна справа" таблиці "Документи, що додані до позову", '}});
        }
        else{
            buf = true;
            str += 'таблиці "Документи, що додані до позову", '
        }
/*
        var ClaimTable = EdocsApi.getAttributeValue('ClaimTable').value;
        if(ClaimTable && ClaimTable.length > 0){
            ClaimTable.map(x=>(x.find(y=>y.code == "InvolvedUnit").value)).every(s=> {if(s== null) {buf = true; str += '"Підрозділ" таблиці "Розподіл по причетним підрозділам", '}});
            ClaimTable.map(x=>(x.find(y=>y.code == "ClaimTableInvoice").value)).every(s=> {if(s== null) {buf = true; str += '"Накладна" таблиці "Розподіл по причетним підрозділам", '}});
            ClaimTable.map(x=>(x.find(y=>y.code == "ContractAmount1").value)).every(s=> {if(s== null) {buf = true; str += '"Розрахована сума" таблиці "Розподіл по причетним підрозділам", '}});
            ClaimTable.map(x=>(x.find(y=>y.code == "SumaSud1").value)).every(s=> {if(s== null) {buf = true; str += '"Сума за рішенням суду" таблиці "Розподіл по причетним підрозділам", '}});
            ClaimTable.map(x=>(x.find(y=>y.code == "SudVutrat1").value)).every(s=> {if(s== null) {buf = true; str += '"Судові витрати" таблиці "Розподіл по причетним підрозділам", '}});
        }
        else{
            buf = true;
            str += 'таблиці "Розподіл по причетним підрозділам", '
        }

        var ClaimTableCarrier = EdocsApi.getAttributeValue('ClaimTableCarrier').value;
        if(ClaimTableCarrier && ClaimTableCarrier.length > 0){
            ClaimTableCarrier.map(x=>(x.find(y=>y.code == "InvolvedCarrier").value)).every(s=> {if(s== null) {buf = true; str += '"Перевізник" таблиці "Розподіл по причетним перевізникам", '}});
            ClaimTableCarrier.map(x=>(x.find(y=>y.code == "InvoiceCarrier").value)).every(s=> {if(s== null) {buf = true; str += '"Накладна" таблиці "Розподіл по причетним перевізникам", '}});
            ClaimTableCarrier.map(x=>(x.find(y=>y.code == "InvoiceClaimAmount3").value)).every(s=> {if(s== null) {buf = true; str += '"Розрахована сума" таблиці "Розподіл по причетним перевізникам", '}});
            ClaimTableCarrier.map(x=>(x.find(y=>y.code == "SumaSud2").value)).every(s=> {if(s== null) {buf = true; str += '"Сума за рішенням суду" таблиці "Розподіл по причетним перевізникам", '}});
            ClaimTableCarrier.map(x=>(x.find(y=>y.code == "SudVutrat2").value)).every(s=> {if(s== null) {buf = true; str += '"Судові витрати" таблиці "Розподіл по причетним перевізникам", '}});
        }
        else{
            buf = true;
            str += 'таблиці "Розподіл по причетним перевізникам", '
        }
*/
        if(!EdocsApi.getAttributeValue('ClaimKind').value){
            buf = true;
            str += '"Вид позову", ';
        }        
        if(!EdocsApi.getAttributeValue('Counterparty').value && !EdocsApi.getAttributeValue('Counterparty').text){
            buf = true;
            str += '"Позивач", ';
        }
        if(!EdocsApi.getAttributeValue('RailwayConnectionType').value){
            buf = true;
            str += '"Тип залізничного сполучення", ';
        }
        if(!EdocsApi.getAttributeValue('Bill').value){
            buf = true;
            str += '"Рахунок", ';
        }        
 //  if(!EdocsApi.getAttributeValue('Lawyer').value){
   //         buf = true;
   //         str += '"Юрист", ';
   //     }      
        if(buf){
            throw str.slice(0, -2);
        }
    }
}
//Позов  перевірка на етапі AssignResp


function DocCheckInProcess(){
    if(EdocsApi.getCaseTaskDataByCode('DocCheck')?.executionState == 'inProgress'){
        controlShow('Processing_result');
    }
    else{
        controlHide('Processing_result');
    }
}

function onTaskExecuteRezVisible(routeStage){
    if (routeStage.executionResult == 'executed'){
        DocCheckInProcess();
    }
}
function onSearchInvolvedUnit(request){
    request.filterCollection.push({attributeCode:'SubdivisionLevelDirect', value:'1'});
}


//UZKARGO-140
function onChangeCostDocumentTable(){
    var CostDocumentTable = EdocsApi.getAttributeValue('CostDocumentTable').value;
    if(CostDocumentTable && CostDocumentTable.length>0){
        try{
            EdocsApi.setAttributeValue({code: 'CostSumTotal', value: CostDocumentTable.flat().filter(x=>x.code=='CostSum').map(x => Number(x.value)).reduce((sum, x) => sum + x, 0), text: null});
        }
        catch(err){
            EdocsApi.message(err.message);
        }
    }
    else{
        EdocsApi.setAttributeValue({code: 'CostSumTotal', value: null, text: null});
    }
}



function onTaskExecuteAssignResp(routeStage){
    if(routeStage.executionResult != 'rejected'){      
        if(!EdocsApi.getAttributeValue('Counterparty').value){
           // throw'Заповніть поле "Позивач"';
        }

        const answer = send('1');
        if(!answer.status){
            throw answer.error;
        }
    }
}

function onTaskExecutePayment(routeStage){
    if(routeStage.executionResult != 'rejected'){ 
        var answer = send('2');
        if(!answer.status){
            throw answer.error;
        }
    }
}

function onTaskExecuteSentResult(routeStage) {
    if(routeStage.executionResult != 'rejected'){ 
        const answer = send('3');
        if(!answer.status){
            throw answer.error;
        }
    }
}

function onTaskExecuteDocCheck1(routeStage) {
    if(routeStage.executionResult != 'rejected'){ 
        var answer = send('4');
        if(!answer.status){
            throw answer.error;
        }

        const Payment = EdocsApi.getCaseTaskDataByCode('Payment');
        if(Payment && Payment.notIncludeInRoute){
            answer = send('2');
            if(!answer.status){
                throw answer.error;
            }
        }
    }
}

function send(eventType){
    var response = EdocsApi.runExternalFunction('PKTB', 'ClaimWriteDocument', createmethodData(eventType, '12'));

    if(response && response.data == null) {   
       return {status: true, error: ''};   
    }
    else if (response.data.error) {
        if (response.data.error.validationErrors && response.data.error.validationErrors.length > 0) {
            var errorMessage = '';
            for (var i = 0; i < response.data.error.validationErrors.length; i++) {
                errorMessage += response.data.error.validationErrors[i].message + '; ';
            }
            return  {status: true, error:(response.data.error.details + "  -  " + errorMessage)};
        }
    } 
    else {
        return {status: true, error:'Не отримано відповіді від зовнішньої системи'};
    }
    
}


function createmethodData(eventType, typeDoc){
    var methodData = { 
        ExtSysId: "eDocs",
        ExtDocId: CurrentDocument.id,
        EventType: eventType,
        TypeDoc: typeDoc,
        Attributes:[]
    };

switch (eventType) {
    case '1':
        methodData.Attributes = RegistrationAtributs();
        break;
    case '3':
    case '4':
        methodData.Attributes = FixationAtributs();
        break;
    case '5':
        methodData.Attributes = [];
        break;
    case '2':
        methodData.Attributes = (RegistrationAtributs().concat({code: "DateSplat", value: (EdocsApi.getAttributeValue('PaymentDate').value ? moment(EdocsApi.getAttributeValue('PaymentDate').value).format('YYYY-MM-DD') : null)})).concat(FixationAtributs());
        break;
    default:
        break;
}
    return methodData;
}

function RegistrationAtributs(){
    return [
        {code: "NumDoc", value: EdocsApi.getAttributeValue('RegNumber').value},
        {code: "Applicant", value: EdocsApi.getAttributeValue('ContractorEDRPOU').value},
        {code: "Rasch", value: EdocsApi.getAttributeValue('Bill').value},
        {code: "TypeClaim", value: EdocsApi.getAttributeValue('ClaimKind').value},
        {code: "TypeConn", value: (EdocsApi.getAttributeValue('RailwayConnectionType').value == 'Внутрішнє' ? '1' : '2')},
        {code: "DatePrt", value: moment(EdocsApi.getAttributeValue('RegDate').value).format('YYYY-MM-DD')},
        {code: "DatePost", value: (EdocsApi.getAttributeValue('DataDoc').value ? moment(EdocsApi.getAttributeValue('DataDoc').value).format('YYYY-MM-DD') : null)}, 
        {code: "Srcway", value: EdocsApi.findEmployeeSubdivisionByLevelAndEmployeeID(EdocsApi.getAttributeValue('Responsible').value, '1')?.unitCode},
        {code: "Koment", value: EdocsApi.getAttributeValue('DocDescription').value},
        {code: "NomSprav", value: EdocsApi.getAttributeValue('caseNumber').value},
        {code: "FioP", value: EdocsApi.getAttributeValue('Responsible').text},
        {code: "ClaimDocs", type: "table", value: getClaimDocs()}
    ]
}

function FixationAtributs(){
    return [
        {code: "GuiltySubjects", type: "table", value: getClaimTable_Carrier()}
    ]
}

function getClaimTable_Carrier(){
    var ClaimDocs = [];

    var table = EdocsApi.getAttributeValue('ClaimTable').value;
    if(table && table.length > 0){        
        for(var i=0; i<table.length; i++){
            const el = table[i];
            var newEl = [
                {code: 'SubjType', value: 1},
                {code: 'SubjName', value: el.find(x => x.code == 'InvolvedUnit').text},
                {code: 'SubjID', value: el.find(x => x.code == 'InvolvedUnit').value},
                {code: 'TypeDoc', value: el.find(x => x.code == 'TypeInvoiceClaimTable').value},
                {code: 'NumDoc', value: el.find(x => x.code == 'ClaimTableInvoice').value},
                {code: 'DateDoc', value: moment(el.find(x => x.code == 'DataClaimTable').value).format('YYYY-MM-DD')},                
                {code: 'CalcSum', value: el.find(x => x.code == 'ContractAmount1').value},
                {code: 'SatisfiedSum', value: el.find(x => x.code == 'ContractAmount').value},
                {code: 'JudgmentSum', value: el.find(x => x.code == 'SumaSud1').value},
                {code: 'CourtSum', value: el.find(x => x.code == 'SudVutrat1').value}
            ]
            ClaimDocs.push(newEl);
        }
    }

    table = EdocsApi.getAttributeValue('ClaimTableCarrier').value;
    if(table && table.length > 0){
        for(var i=0; i<table.length; i++){
            const el = table[i];
            var newEl = [
                {code: 'SubjType', value: 2},
                {code: 'SubjName', value: el.find(x => x.code == 'InvolvedCarrier').text},
                {code: 'SubjID', value: el.find(x => x.code == 'InvolvedCarrier').value},
                {code: 'TypeDoc', value: el.find(x => x.code == 'TypeInvoiceClaimTableCarrier').value},
                {code: 'NumDoc', value: el.find(x => x.code == 'InvoiceCarrier').value},
                {code: 'DateDoc', value: moment(el.find(x => x.code == 'DataClaimTableCarrier').value).format('YYYY-MM-DD')},                
                {code: 'CalcSum', value: el.find(x => x.code == 'InvoiceClaimAmount3').value},
                {code: 'SatisfiedSum', value: el.find(x => x.code == 'AmountCarrier').value},
                {code: 'JudgmentSum', value: el.find(x => x.code == 'SumaSud2').value},
                {code: 'CourtSum', value: el.find(x => x.code == 'SudVutrat2').value}
            ]
            ClaimDocs.push(newEl);
        }        
    }

    if(ClaimDocs.length>0){
        return ClaimDocs;
    }
    else{
        return null;
    }
}

function getTypeApplicant(key){
    switch (key) {
        case 'Відправник':
            return '1';
        case 'Одержувач':
            return '2';
        case 'Третя особа':
            return '3';
    
        default:
            return null;
    }
}

function getClaimDocs(){
    var table = EdocsApi.getAttributeValue('Invoice_Claim_table2').value;   
    var ClaimDocs = [];
    if(table && table.length > 0){
        
        for(var i=0; i<table.length; i++){
            const el = table[i];
            var newEl = [
                {code: 'TypeDoc', value: el.find(x => x.code == 'typeInvoice').value},
                {code: 'NumDoc', value: el.find(x => x.code == 'Invoice_Claim_number2').value},
                {code: 'DateDoc', value: moment(el.find(x => x.code == 'dataInvoice').value).format('YYYY-MM-DD')},                
                {code: 'DeclaredSum', value: el.find(x => x.code == 'Invoice_Claim_Amaunt2').value},
                {code: 'Primit', value: el.find(x => x.code == 'note').value}
            ]
            ClaimDocs.push(newEl);
        }
    }
    return ClaimDocs;
}

function onButtonPushButton(){
    //EdocsApi.message('Таблиця буде актуалізована, внесені зміни будуть втрачені');
    const response = EdocsApi.runExternalFunction('PKTB', ('ClaimGetCalculationResult?idDoc='+CurrentDocument.id), null, 'get');//312345678901

    if(response && response.data && response.data.length>0){            
        var ClaimTableVal = [], ClaimTableCarrierVal = [];
        for(var i=0; i<response.data.length; i++){
            const el = response.data[i];                
            if(el.find(x=>x.code=="SubjType").value == '1'){
                const TypeInvoiceClaimTable = EdocsApi.getDictionaryItemData('ClaimDocTypes2', el.find(x => x.code == 'TypeDoc').value);
                const InvolvedUnit = EdocsApi.getOrgUnitDataByUnitID(EdocsApi.getDictionaryItemData('Units', EdocsApi.getDictionaryData('Units', '', [{attributeCode: 'UnitCode', value: el.find(x => x.code == 'SubjId').value}])[0]?.id)?.attributes.find(x=>x.code=="UnitID").value);
                    ClaimTableVal.push([
                        {code: 'InvolvedUnit', value: InvolvedUnit?InvolvedUnit.unitId:null, text: InvolvedUnit?InvolvedUnit.unitName:null},
                        {code: 'TypeInvoiceClaimTable', value: el.find(x => x.code == 'TypeDoc').value, text: TypeInvoiceClaimTable?.attributes.find(x=>x.code == 'name').value, itemCode: null, itemDictionary: 'ClaimDocTypes2'},
                        {code: 'ClaimTableInvoice', value: el.find(x => x.code == 'NumDoc').value, text: el.find(x => x.code == 'NumDoc').value},
                        {code: 'DataClaimTable', value: new Date(el.find(x => x.code == 'DateDoc').value).toISOString()},                
                        {code: 'ContractAmount1', value: el.find(x => x.code == 'CalcSum').value}
                ]);
            }
            else if(el.find(x=>x.code=="SubjType").value == '2'){

            }
        }
        var ClaimTable = EdocsApi.getAttributeValue('ClaimTable');
        var ClaimTableCarrier = EdocsApi.getAttributeValue('ClaimTableCarrier');
        ClaimTable.value = ClaimTableVal;
        ClaimTableCarrier.value = ClaimTableCarrierVal;
        EdocsApi.setAttributeValue(ClaimTable);
      //  EdocsApi.setAttributeValue(ClaimTableCarrier);
    }
    else{
        EdocsApi.message('Документ не існує або обрахунок ще не був проведений');
    }
}
// 17.11 Автоматичне заповненя поля Тема документу
function setTopicDocument() {
    debugger;
  var ClaimKind = EdocsApi.getAttributeValue("ClaimKind").text;
  var SaveCargoFailureType = EdocsApi.getAttributeValue(
    "SaveCargoFailureType"
  ).text;
  var RailwayConnectionType = EdocsApi.getAttributeValue(
    "RailwayConnectionType"
  ).value;
  var TopicDocument = EdocsApi.getAttributeValue("TopicDocument");

  switch (ClaimKind) {
    case "Недотримання терміну доставки вантажу":
      switch (RailwayConnectionType) {
        case "Внутрішнє":
          TopicDocument.value = 1;
          break;
        case "Міжнародне":
          TopicDocument.value = 2;
          break;
      }
      break;

    case "Незбережене перевезення вантажу":
      switch (SaveCargoFailureType) {
        case "Втрата вантажу":
          switch (RailwayConnectionType) {
            case "Внутрішнє":
              TopicDocument.value = 3;
              break;
            case "Міжнародне":
              TopicDocument.value = 4;
              break;
          }
          break;

        case "Недостача вантажу":
          switch (RailwayConnectionType) {
            case "Внутрішнє":
              TopicDocument.value = 5;
              break;
            case "Міжнародне":
              TopicDocument.value = 6;
              break;
          }
          break;

        case "Псування вантажу":
          switch (RailwayConnectionType) {
            case "Внутрішнє":
              TopicDocument.value = 7;
              break;
            case "Міжнародне":
              TopicDocument.value = 8;
              break;
          }
          break;

        case "Пошкодження вантажу":
          switch (RailwayConnectionType) {
            case "Внутрішнє":
              TopicDocument.value = 9;
              break;
            case "Міжнародне":
              TopicDocument.value = 10;
              break;
          }
          break;

        default:
            TopicDocument.value = null;
            TopicDocument.text = null;
        break;
      }
      
      break;

    case "Некоректне нарахування за перевезення вантажу та надані послуги":
      switch (RailwayConnectionType) {
        case "Внутрішнє":
          TopicDocument.value = 11;
          break;
        case "Міжнародне":
          TopicDocument.value = 12;
          break;
      }
      break;

    case "Інше":
      switch (RailwayConnectionType) {
        case "Внутрішнє":
          TopicDocument.value = 13;
          break;
        case "Міжнародне":
          TopicDocument.value = 14;
          break;
      }

      break;

    default:
      TopicDocument.value = null;
      TopicDocument.text = null;
      break;
  }
  EdocsApi.setAttributeValue({code:"TopicDocument", value: TopicDocument.value});
}

function onChangeSaveCargoFailureType() {
  setTopicDocument();
}
function onChangeRailwayConnectionType() {
  setTopicDocument();
}