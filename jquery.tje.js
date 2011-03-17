(function( $ ){

	$.fn.tooltip = function( options ) {

		var default_settings = {
			'big': true,
			'italic': true
		};

		return this.each(function() {
			if ( options ) {
				$.extend( default_settings, options );
			}

		});

	};
})( jQuery );