define(['backbone', 'underscore', 'jquery'], function(BB, _, $) {
	var OverlayView = BB.View.extend({
		tagName: 'div',
		className: 'overlay',
		events: {
			'click #config-layout input[type=image]': 'handleLayoutChange',
			'change select': 'handleSelectChange',
		},
		initialize: function() {
			this.template = _.template($('#template-overlay').html());
			
			window.addEventListener('blur', this.hide.bind(this));
			window.addEventListener('resize', this.hide.bind(this));
		},
		render: function() {
			this.$el.html(this.template({}));
			var layout = bg.settings.get('layout');
			if (layout == 'vertical') {
				$('#config-layout input[value=horizontal]').attr('src', '/images/layout_horizontal.png');
				$('#config-layout input[value=vertical]').attr('src', '/images/layout_vertical_selected.png');
			} else {
				$('#config-layout input[value=horizontal]').attr('src', '/images/layout_horizontal_selected.png');
				$('#config-layout input[value=vertical]').attr('src', '/images/layout_vertical.png');
			}
			this.$el.find('#config-lines').val(bg.settings.get('lines'));
			this.$el.find('#config-sort-order').val(bg.settings.get('sortOrder'));
			return this;
		},
		handleSelectChange: function(e) {
			bg.settings.save(e.currentTarget.dataset.name, e.currentTarget.value);
		},
		handleLayoutChange: function(e) {
			var layout = e.currentTarget.value;
			bg.settings.save('layout', layout);
			this.hide();
		},
		hide: function() {
			this.$el.css('display', 'none');
		},
		show: function() {
			var config = $('[data-action="content:showConfig"]');
			if (config.length) {
				this.el.style.top = config.offset().top + config.height() + 5 + 'px';
			}
			this.render().$el.css('display', 'block');
		},
		isVisible: function() {
			return this.$el.css('display') == 'block';
		}
	});

return OverlayView;
});