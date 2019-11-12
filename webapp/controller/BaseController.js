sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("be.joriside.ImeiPoC.controller.BaseController", {
		/*onInit: function () {

		},*/
		
		fnBaseInit: function() {
			this.oImeiModel = this.fnGetModel("imeiModel");
		},
		
		fnGetModel: function(sName) {
			return this.getView().getModel(sName);
		}
		
	});
});