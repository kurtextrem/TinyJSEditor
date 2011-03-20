(function( $ ){

	$.fn.TJE = function( options, replace ) {

		var $this = this;
		$this.id = $this.attr('id');

		var template = {
			parent_tpl: "<div class='tinyjseditor' id='{textarea_id}'><div class='toolbar'>{button_tpl}<br></div><textarea>{textarea_value}</textarea><div class='wysiwyg' contenteditable>{textarea_value_compiled}</div></div>",
			button_tpl: "<button class='tje_button tje_{value}'>{value_first}</button>",
			slider_tpl: "<input type='range' min='0' max='1' value='0' title='Left: Editor, Right: Quellcode(editor)'>",
			compiled: {
				button_tpl: '',
				full_compiled: ''
			}
		}

		var settings = {
			bold: true,
			italic: true,
			strike: true,
			overline: true,
			underline: false,
			quellcode: true,
			editor: true
		};

		var default_replace = {
			'[b]': '<strong>',
			'[i]': '<i>', // yes, <i> is allowed in HTML5, and <b> too!
			'[s]': '<del>', // cause <s> is obsolet
			'[o]': '<span style="text-decoration: overline;">', // there is no element for this
			'[u]': '<span style="text-decoration: underline;">', // <u> is obsolet
			// begin of tpl replace
			tpl_replace: {
				textarea_id: $this.id,
				textarea_value: $this.text(),
				textarea_value_compiled: $this.html(),
				button_tpl: ''
			}
		}


		// For example to enable underline, call $('#example').TJE({underline: true});
		if (options)
			$.extend( settings, options );

		// If somebody uses XHTML, call $('#example').TJE(0, {'[i]': '<span ...'});
		if (replace)
			$.extend(default_replace, replace);

		// to create the toolbar
		$.each(settings, function(key, value) {
			// if its false, dont create the toolbar
			if(value && key != 'quellcode' && key != 'editor'){
				var to_add = template.button_tpl.replace('{value}', key).replace('{value_first}', key.substr(0, 1).toUpperCase()); // so create the tpl...
				template.compiled.button_tpl += to_add; // ...and add it
			}else if(value){
				template.compiled.button_tpl += template.slider_tpl;
				return false;
			}
		});

		// add it to replace
		default_replace.tpl_replace.button_tpl = template.compiled.button_tpl;
		template.compiled.full_compiled = template.parent_tpl;

		// replace
		$.each(default_replace.tpl_replace, function(replace_val, with_val){
			template.compiled.full_compiled = template.compiled.full_compiled.replace('{'+replace_val+'}', with_val);
		});

		// append it to body
		this.after(template.compiled.full_compiled);
		// and remove old textarea :)
		this.remove();

		// register button clicks
		$('#'+$this.id+' .tje_button').click(function(){
			var textarea = $('#'+$this.id).find('textarea');
			var text = $(this).text();
			text = text.toLowerCase();
			textarea.text(textarea.text()+'['+text+'][/'+text+']');
		});

		$('#'+$this.id+' input[type=range]').change(function(){ // a bit buggy
			$('#'+$this.id).find('textarea').toggle();
			$('#'+$this.id).find('.wysiwyg').toggle();
		});

		$('#'+$this.id).find('textarea').hide();

		return $(template.compiled.full_compiled);

	};
})( jQuery );