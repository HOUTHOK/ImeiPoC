sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/Dialog",	
	"sap/m/Button",
	"sap/m/ButtonType",
    "sap/m/MessageToast",
    "sap/m/Text",    
	"be/joriside/ImeiPoC/controller/BaseController",
], (MessageBox, Dialog, Button, ButtonType, MessageToast, Text, BaseController) => {
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
			try {
				window.plugins.sim.hasReadPermission((oResult) => that._fnSuccessCallbackHasReadPermission(oResult));
			} 
			catch (oError) {
				MessageBox.error(oError.message);
			}
		},

		_fnSuccessCallbackHasReadPermission: function(oResult) {
			console.log("HasReadPermission SuccessCallback " + oResult);
			let that = this;
			try {
				if (oResult === true) {
					window.plugins.sim.getSimInfo((oSimInfo) => that._fnSuccessCallback(oSimInfo));
				}
				else {
					that._fnRequestReadPermission();
				}
			}
			catch (oError) {
				MessageBox.error(oError.message);
			}

		},
		
		_fnErrorCallbackHasReadPermission: function(oError) {
			console.log("HasReadPermission ErrorCallback " + oError);
		},
		
		_fnRequestReadPermission: function() {
			let that = this;
			try {
				window.plugins.sim.requestReadPermission((oResult) => that._fnSuccessCallbackRequestReadPermission(oResult), (oError) => that._fnErrorCallbackRequestReadPermission(oError));
			}
			catch (oError) {
				MessageBox.error(oError.message);
			}
		},
		
		_fnSuccessCallbackRequestReadPermission: function(oResult) {
			console.log("RequestReadPermission SuccessCallback " + oResult);
			//oResult === "OK"
			let that = this;
			try {
				window.plugins.sim.getSimInfo((oSimInfo) => that._fnSuccessCallback(oSimInfo));
			}
			catch (oError) {
				MessageBox.error(oError.message);
			}
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