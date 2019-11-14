sap.ui.define([
	'sap/m/MessageBox',
	'sap/m/Dialog',	
	'sap/m/Button',
	'sap/m/ButtonType',
    'sap/m/MessageToast',
    'sap/m/Text',    
	"be/joriside/ImeiPoC/controller/BaseController"	
], function(MessageBox, Dialog, Button, ButtonType, MessageToast, Text, BaseController) {
	"use strict";

	return BaseController.extend("be.joriside.ImeiPoC.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.joris.ide.ImeiTest.view.Master
		 */
		onInit: function() {

		},
		
		onAfterRendering: function() {
			this.fnBaseInit();
		},
		
		fnGetSimInfo: function() {
			let that = this;
			that._fnHasReadPermission();
		},
		
		_fnHasReadPermission: function() {
			let that = this;
			window.plugins.sim.hasReadPermission((oResult) => that._fnSuccessCallbackHasReadPermission(oResult), (oError) => that._fnErrorCallbackHasReadPermission(oError));
		},

		_fnSuccessCallbackHasReadPermission: function(oResult) {
			console.log("HasReadPermission SuccessCallback " + oResult);
			let that = this;
			if (oResult === true) {
				window.plugins.sim.getSimInfo((oResult1) => that._fnSuccessCallback(oResult1), (oError1) => that._fnErrorCallback(oError1));
			}
			else {
				that._fnRequestReadPermission();
			}

		},
		
		_fnErrorCallbackHasReadPermission: function(oError) {
			console.log("HasReadPermission ErrorCallback " + oError);
		},
		
		_fnRequestReadPermission: function() {
			let that = this;
			window.plugins.sim.requestReadPermission((oResult) => that._fnSuccessCallbackRequestReadPermission(oResult), (oError) => that._fnErrorCallbackRequestReadPermission(oError));
		},
		
		_fnSuccessCallbackRequestReadPermission: function(oResult) {
			console.log("RequestReadPermission SuccessCallback " + oResult);
			//oResult === "OK"
			let that = this;
			window.plugins.sim.getSimInfo((oResult1) => that._fnSuccessCallback(oResult1), (oError1) => that._fnErrorCallback(oError1));
		},
		
		_fnErrorCallbackRequestReadPermission: function(oError) {
			console.log("RequestReadPermission ErrorCallback " + oError);
			//oError === "Permission denied"
			let that = this;

            var dialog = new Dialog({
                    title: "Warning",
                    type: "Message",
                    content: new Text({ text: "The app needs read-permissions in order to work correctly" }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Request permission again",
                        press: function () {
                            dialog.close();
                            that.fnGetSimInfo();
                        }
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            dialog.close();
                        }
                    }),
                    afterClose: function() {
                        dialog.destroy();
                    }
                });
    
            dialog.open();

		},

		_fnSuccessCallback: function(oResult) {
			console.log(oResult);
			console.log("deviceId: " + oResult.deviceId);
			MessageBox.information("Information", {
				title: "Information",
				details: oResult,
				contentWidth: "100px"
			});			

		},
		
		_fnErrorCallback: function(oError) {
			console.log(oError);
		}

	});

});