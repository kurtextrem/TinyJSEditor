(function( $ ){

	$.fn.TJE = function( options ) {

		var default_settings = {
			big: true,
			italic: true
		};

		var html = "<div class='tinyjseditor'><div class='toolbar'>";

		if ( options ) {
			$.extend( default_settings, options );
		}

		if(default_settings.big){
			html += "<button class='tje_button tje_b'>B</button>";
		}

		if(default_settings.italic){
			html += "<button class='tje_button tje_i'>I</button>";
		}
		html += this;
		html += "</div></div>";

		// append to DOM
		this.prepend(html);
		// remove the old textarea
		this.remove();

		// register button clicks
		$('.tje_button').click(function(){
			$(html).find('textarea').val(this.val()+'iksde');
		});

		return html;

	};
})( jQuery );