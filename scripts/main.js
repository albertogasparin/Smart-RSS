require.config({

	baseUrl: 'scripts/app',

	paths: {
		jquery: '../libs/jquery.min',
		underscore: '../libs/underscore.min',
		backbone: '../libs/backbone.min',
		marionette: '../libs/backbone.marionette.min',
		text: '../text',
		i18n: '../i18n',
		domReady: '../domReady'
	},

	shim: {
		jquery: {
			exports: '$'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		underscore: {
			exports: '_'
		},
		marionette: {
			deps: ['jquery', 'underscore', 'backbone'],
			exports: 'Marionette'
		}
	}
});

var tabID = -1;

chrome.runtime.getBackgroundPage(function(bg) {
	window.bg = bg;

	chrome.extension.sendMessage({ action: 'get-tab-id'}, function(response) {
		if (response.action == 'response-tab-id') {
			tabID = response.value;	
		}
	});
	chrome.runtime.connect();
	
	requirejs(['app'], function(app) {		
		app.start();
	});
});