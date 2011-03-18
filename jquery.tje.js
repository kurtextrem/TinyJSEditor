(function( $ ){

	$.fn.TJE = function( options ) {

		var default_settings = {
			big: true,
			italic: true
		};

		var html = "<div class='tinyjseditor' id='"+this.attr('id')+"'><div class='toolbar'>";
		this.attr('id', ''); // delete id from textfield

		if ( options ) {
			$.extend( default_settings, options );
		}

		if(default_settings.big){
			html += "<button class='tje_button tje_b'>B</button>";
		}

		if(default_settings.italic){
			html += "<button class='tje_button tje_i'>I</button>";
		}

		html += '</div></div>'; // close toolbar div
		html = $(html); // make it jQuery object

		// append to DOM
		this.before(html);
		this.appendTo(html.attr('id'));

		// register button clicks
		$('.tje_button').click(function(){
			$(html.attr('id')).find('textarea').val(this.val()+'iksde');
		});

		return $(html);

	};
})( jQuery );