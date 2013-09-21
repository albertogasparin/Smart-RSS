define(['jquery'], function($) {

	var els = [];

	var resizeWidth = bg.settings.get('thickFrameBorders') ? 10 : 6;

	function handleMouseDown(e) {
		this.resizing = true;
		e.preventDefault();
		$('iframe').css('pointer-events', 'none');
		this.trigger('resize:before');
	}

	function handleMouseMove(e) {
		if (this.resizing) {
			var toLeft = bg.settings.get('thickFrameBorders') ? 5 : 1;
			e.preventDefault();
			if (this.layout == 'vertical') {
				setPosition.call(this, e.clientY);
				this.$el.css('flex-basis', Math.abs(e.clientY - this.el.offsetTop + toLeft) );
			} else {
				setPosition.call(this, e.clientX);
				this.$el.css('flex-basis', Math.abs(e.clientX - this.el.offsetLeft + toLeft) );
			}
			
			this.trigger('resize');
		}
	}

	function handleMouseUp() {
		if (!this.resizing) return;
		$('iframe').css('pointer-events', 'auto');
		this.resizing = false;
		for (var i=0; i<els.length; i++) {
			loadPosition.call(els[i]);
		}
		this.trigger('resize');
		this.trigger('resize:after');
	}

	function setPosition(pos) {
		var toLeft = bg.settings.get('thickFrameBorders') ? 5 : 1;
		if (this.layout == 'vertical') {
			this.resizer.style.left = this.el.offsetLeft  + 'px';
			this.resizer.style.top = pos - Math.round(resizeWidth / 2) - toLeft + 'px';
		} else {
			this.resizer.style.top = this.el.offsetTop + 'px';
			this.resizer.style.left = pos - Math.round(resizeWidth / 2) - toLeft + 'px';
		}
	}

	function loadPosition() {
		if (!this.resizer) return;

		if (this.layout == 'vertical') {
			setPosition.call(this, this.el.offsetTop + this.el.offsetHeight);
		} else {
			setPosition.call(this, this.el.offsetLeft + this.el.offsetWidth);
		}

		resetPositions.call(this);
	}

	function resetPositions() {
		requestAnimationFrame(function() {
			for (var i=0; i<els.length; i++) {
				if (els[i] == this) return;
				loadPosition.call(els[i]);
			}
		}.bind(this));
	}

	return {
		resizing: false,
		resizer: null,
		layout: 'horizontal',
		enableResizing: function(layout, size) {

			layout = this.layout = layout || 'horizontal';

			if (size) {
				this.$el.css('flex-basis', size + 'px');
			}
			

			els.push(this);

			var that = this;
			if (!this.resizer) {
				this.resizer = document.createElement('div');
				this.resizer.className = 'resizer';
			}

			if (layout == 'vertical') {
				this.resizer.style.width = '100%';
				this.resizer.style.cursor = 'n-resize';
				this.resizer.style.height = resizeWidth + 'px';
			} else {
				this.resizer.style.height = '100%';
				this.resizer.style.cursor = 'w-resize';
				this.resizer.style.width = resizeWidth + 'px';
			}

			
			loadPosition.call(this);
			requestAnimationFrame(function() {
				this.trigger('resize:enabled');
			}.bind(this));

			this.resizer.addEventListener('mousedown', function(e) {
				handleMouseDown.call(that, e);
			});
			document.addEventListener('mousemove', function(e) {
				handleMouseMove.call(that, e);
			});
			document.addEventListener('mouseup', function(e) {
				handleMouseUp.call(that, e);
			});

			document.body.appendChild(this.resizer);
		},
		disableResizing: function() {
			if (this.resizer) {
				els.splice(els.indexOf(this), 1);
				document.body.removeChild(this.resizer);
				this.resizer = null;
				resetPositions.call(this);
			}
		}
	};
});