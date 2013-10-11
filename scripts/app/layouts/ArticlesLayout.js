/**
 * @module App
 * @submodule layouts/ArticlesLayout
 */
define([
	'jquery', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/articleList',
	'mixins/resizable', 'controllers/comm', 'domReady!'
],
function ($, Layout, ToolbarView, Toolbar, articleList, resizable, comm) {

	var toolbar = new Toolbar({ id: 'articles' });

	/**
	 * Articles layout view
	 * @class ArticlesLayout
	 * @constructor
	 * @extends Layout
	 */
	var ArticlesLayout = Layout.extend({
		el: '#region-articles',
		events: {
			'keydown': 'handleKeyDown',
			'mousedown': 'handleMouseDown'
		},
		initialize: function() {
			this.el.view = this;

			this.on('attach', function() {
				this.attach('toolbar', new ToolbarView({ model: toolbar }) );
				this.attach('articleList', articleList );
			});

			this.$el.on('focus', function() {
				$(this).addClass('focused');
				clearTimeout(blurTimeout);
			});

			var focus = true;
			var blurTimeout;

			comm.on('stop-blur', function() {
				focus = false;
			});

			this.$el.on('blur', function(e) {
				blurTimeout = setTimeout(function() {
					if (focus && !e.relatedTarget) {
						this.focus();
						return;
					}
					$(this).removeClass('focused');
					focus = true;
				}.bind(this), 0);
			});


			this.on('resize:after', this.handleResizeAfter);
			this.on('resize', this.handleResize);
			this.on('resize:enabled', this.handleResize);

		},
		/**
		 * Saves the new layout size
		 * @triggered after resize
		 * @method handleResizeAfter
		 */
		handleResizeAfter: function() {
			if (bg.settings.get('layout') == 'horizontal') {
				var wid = this.el.offsetWidth;
				bg.settings.save({ posB: wid });
			} else {
				var hei = this.el.offsetHeight;
				bg.settings.save({ posC:hei });
			}
		},
		/**
		 * Changes layout to one/two line according to width
		 * @triggered while resizing
		 * @method handleResize
		 */
		handleResize: function() {
			if (bg.settings.get('lines') == 'auto') {
				var oneRem = parseFloat(getComputedStyle(document.documentElement).fontSize);
				if (this.el.offsetWidth > 37 * oneRem) {
					this.articleList.$el.addClass('lines-one-line');
				} else {
					this.articleList.$el.removeClass('lines-one-line');
				}
			}
		}
		
	});

	ArticlesLayout = ArticlesLayout.extend(resizable);

	return ArticlesLayout;
});