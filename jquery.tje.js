(function( $ ){

	$.fn.TJE = function( options, replace ) {

		var template = "<div class='tinyjseditor'><div class='toolbar'><button class='tje_button tje_b'>B</button><button class='tje_button tje_i'>I</button><input type='range' min='0' max='1'><br></div><textarea>{textarea_value}</textarea><div id='wysiwyg' contenteditable>{textarea_value_compiled}</div></div>";

		var default_settings = {
			big: true,
			italic: true,
			strike: true,
			overline: true,
			underline: false,
			switcher: true
		};

		var default_replace = {
			'[b]': '<strong>',
			'[i]': '<i>', // yes, <i> is allowed in HTML5, and <b> too!
			'[s]': '<del>', // instead of <s>, cause this isnt allowed in html5 xD
			'[o]': '<span style="text-decoration: overline;">', // there is no element for this
			'[u]': '<span style="text-decoration: underline;">'
		}

		var html = "<div class='tinyjseditor' id='"+this.attr('id')+"'><div class='toolbar'>";
		this.attr('id', ''); // delete id from textfield

		if ( options ) {
			$.extend( default_settings, options );
		}

		if (replacement){
			$.extend(default_replace, replace);
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

		return html;

	};
})( jQuery );