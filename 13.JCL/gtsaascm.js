
function initGlobalParam() {
    window.GTSaasCM = {
        Build: {},
        Models: {},
        Collections: {},
        Views: {},
        UserInfos: {},
        Apps: {},
        Utils: {},
        Constant: {},
        License: {},
        Popup: {},
        //makeClass: fnMakeClass
    };
};

function initBuildInfo() {
    var el = $(".gtone-cm-build-type-is-saas");

    GTSaasCM.Build.isSaaS = (el.val().toLowerCase() == "true");
    el.remove();
};

function initConstant() {
    GTSaasCM.Constant = {};
    GTSaasCM.Constant.YES = "Y";
    GTSaasCM.Constant.NO = "N";
}

$(document).ready(function() {
    //$.ajaxSetup({ cache: false });
    initGlobalParam();
    //initBuildInfo();
    //initSessionInfo();
    //initLicenseInfo();
    initConstant();
});