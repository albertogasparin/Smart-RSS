/**
 * @module App
 * @submodule models/ToolbarButton
 */
define(['backbone'], function (BB) {

	/**
	 * Button model for toolbars
	 * @class ToolbarButton
	 * @constructor
	 * @extends Backbone.Model
	 */
	var ToolbarButton = BB.Model.extend({
		defaults: {

			/**
			 * @attribute actionName
			 * @type String
			 * @default global:default
			 */
			actionName: 'global:default',

			/**
			 * Is button aligned to left or right?
			 * @attribute position
			 * @type String
			 * @default left
			 */
			position: 'left'
		}
	});

	return ToolbarButton;
});