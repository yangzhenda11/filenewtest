var config = top.globalConfig;
var serverPath = config.serverPath;

function importContractUpload(){
    $("#importForm").attr("action",serverPath+'contractScanQuery/importContract');
    $("#importForm").submit();
    $("#importForm").attr("action",'');
}