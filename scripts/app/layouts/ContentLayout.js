/**
 * @module App
 * @submodule layouts/ContentLayout
 */
define([
	'jquery', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/contentView', 'views/SandboxView',
	'views/OverlayView', 'views/LogView', 'controllers/comm', 'domReady!'
],
function ($, Layout, ToolbarView, Toolbar, contentView, SandboxView, OverlayView, LogView, comm) {

	var toolbar = new Toolbar({ id: 'article' });

	/**
	 * Content layout view
	 * @class ContentLayout
	 * @constructor
	 * @extends Layout
	 */
	var ContentLayout = Layout.extend({

		/**
		 * View element
		 * @property el
		 * @default #region-content
		 * @type HTMLElement
		 */
		el: '#region-content',

		/**
		 * @method initialize
		 */
		initialize: function() {
			this.on('attached', function() {

				this.attach('toolbar', new ToolbarView({ model: toolbar }) );
				this.attach('content', contentView );
				this.attach('sandbox', new SandboxView() );
				this.attach('log', new LogView() );
				this.attach('overlay', new OverlayView() );

				this.listenTo(comm, 'hide-overlays', this.hideOverlay);
			});

			this.$el.on('focus', function() {
				$(this).addClass('focused');
			});

			this.$el.on('blur', function() {
				$(this).removeClass('focused');
			});
			
		},

		/**
		 * Hides config overlay
		 * @method hideOverlay
		 */
		hideOverlay: function() {
			if (this.overlay.isVisible()) {
				this.overlay.hide();
			}
		}
		
	});

	return ContentLayout;
});