/**
 * @module App
 * @submodule views/ContextMenu
 */
define([
	'backbone', 'jquery', 'collections/MenuCollection', 'views/MenuItemView', 'controllers/comm'
],
function(BB, $, MenuCollection, MenuItemView, comm) {

	/**
	 * Context menu view
	 * @class ContextMenu
	 * @constructor
	 * @extends Backbone.View
	 */
	var ContextMenu = BB.View.extend({

		/**
		 * Tag name of content view element
		 * @property tagName
		 * @default 'div'
		 * @type String
		 */
		tagName: 'div',

		/**
		 * Class name of content view element
		 * @property className
		 * @default 'context-menu'
		 * @type String
		 */
		className: 'context-menu',

		/**
		 * Backbone collection of all context menu items
		 * @property menuCollection
		 * @default 'context-menu'
		 * @type collections/MenuCollection
		 */
		menuCollection: null,

		/**
		 * Adds one context menu item
		 * @method addItem
		 * @param item {models/MenuItem} New menu item
		 */
		addItem: function(item) {
			var v = new MenuItemView({
				model: item
			});
			v.contextMenu = this;
			this.$el.append(v.render().$el);
		},

		/**
		 * Adds multiple context menu items
		 * @method addItems
		 * @param items {Array|MenuCollection} List of models to add
		 */
		addItems: function(items) {
			items.forEach(function(item) {
				this.addItem(item);
			}, this);
		},

		/**
		 * Renders the context menu (nothing is happening in the render method right now)
		 * @method render
		 * @chainable
		 */
		render: function() {
			return this;
		},

		/**
		 * Hides the context menu
		 * @method hide
		 * @triggered when 'hide-overlays' comm message is sent
		 */
		hide: function() {
			if (this.$el.css('display') == 'block') {
				this.$el.css('display', 'none');
			}
		},

		/**
		 * Called when new instance is created
		 * @method initialize
		 * @param mc {collections/MenuCollection} Menu collection for this context menu
		 */
		initialize: function(mc) {
			this.el.view = this;
			this.menuCollection = new MenuCollection(mc);
			this.addItems(this.menuCollection);
			$('body').append(this.render().$el);

			this.listenTo(comm, 'hide-overlays', this.hide);
		},

		/**
		 * Displays the context menu and moves it to given position
		 * @method show
		 * @param x {Number} x-coordinate
		 * @param y {Number} y-coordinate
		 */
		show: function(x, y) {
			if (x + this.$el.width() + 4 > document.body.offsetWidth) {
				x = document.body.offsetWidth - this.$el.width() - 8;
			}
			if (y + this.$el.height() + 4 > document.body.offsetHeight) {
				y = document.body.offsetHeight - this.$el.height() - 8;
			}
			this.$el.css('top', y + 'px');
			this.$el.css('left', x + 'px');
			this.$el.css('display', 'block');
		}
	});

	return ContextMenu;
});