/**
 * Provides the TinyJSEditor function.
 *
 * @author Kurtextrem
 * @contact kurtextrem@gmail.com
 * @licens CC BY-SA http://creativecommons.org/licenses/by-sa/3.0/
 * @copyright 2011-XXXX
 * @version 0.1
 */
(function( $ ){

	function parseBBCodes(text, bbcodes){
		if(typeof(bbcodes) == 'undefined'){
			var bbcodes = {
				'[b]': '<b>',
				'[i]': '<i>',
				'[s]': '<s>', // <s> isn't obsolet in html5.
				'[o]': '<span style="text-decoration: overline;">', // there is no element for this
				'[u]': '<span style="text-decoration: underline;">', // <u> is obsolet
				// negatives
				'[/b]': '</b>',
				'[/i]': '</i>',
				'[/s]': '</s>', // <s> isn't obsolet in html5.
				'[/o]': '</span>', // there is no element for this
				'[/u]': '</span>' // <u> is obsolet
			}
		}

		// create text
		$.each(bbcodes, function(key, value){
			text = text.replace(key, value);
		});

		return text;
	}

	$.fn.TJE = function( options, replace, templates ) {

		/****************/
		/* INIT SECTION */
		/****************/

		var $this = this;
		$this.id = ($this.attr('id') == '') ? $.now() : $this.attr('id'); // if textarea id is empty, use a time id.

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
			editor: true,
			render_html: true
		};

		var tpl_replace = {
			textarea_id: $this.id,
			textarea_value: $this.val(),
			textarea_value_compiled: (settings.render_html) ?  parseBBCodes($this.html()) : parseBBCodes($this.text()),
			button_tpl: ''
		}

		/*******************/
		/* OPTIONS SECTION */
		/*******************/

		// For example to enable underline, call $('#example').TJE({underline: true});
		if (options)
			$.extend( settings, options );

		// If somebody uses XHTML, call $('#example').TJE(0, {'[i]': '<span ...'});
		if (replace)
			$.extend(tpl_replace, replace);

		// use xhtml? Change the Templates: $('#example').TJE(0, 0, {your new templates});
		if (template)
			$.extend(template, templates);

		/****************/
		/* MAIN SECTION */
		/****************/

		// create the toolbar
		$.each(settings, function(key, value) {
			// if its false, dont create the toolbar
			if(value && key != 'quellcode' && key != 'editor' && key != 'render_html'){
				var to_add = template.button_tpl.replace('{value}', key).replace('{value_first}', key.substr(0, 1).toUpperCase()); // so create the tpl...
				template.compiled.button_tpl += to_add; // ...and add it
			}else if(value && key != 'render_html'){
				template.compiled.button_tpl += template.slider_tpl;
				return false;
			}
		});

		/***************/
		/* END SECTION */
		/***************/

		// add it to replace
		tpl_replace.button_tpl = template.compiled.button_tpl;
		template.compiled.full_compiled = template.parent_tpl;

		// replace
		$.each(tpl_replace, function(replace_val, with_val){
			template.compiled.full_compiled = template.compiled.full_compiled.replace('{'+replace_val+'}', with_val);
		});

		// append it to body
		this.after(template.compiled.full_compiled);
		// and remove old textarea :)
		this.remove();


		/******************/
		/* EVENTS SECTION */
		/******************/

		// register button clicks
		$('#'+$this.id+' .tje_button').click(function(){
			var textarea = $('#'+$this.id).find('textarea');
			var editor = $('#'+$this.id).find('.wysiwyg');
			var text = $(this).text();
			text = text.toLowerCase();
			textarea.text(textarea.val()+'['+text+'][/'+text+']'); // insert into quellcode editor
			editor.html(parseBBCodes(textarea.val())); // insert into editor

		});

		$('#'+$this.id+' input[type=range]').change(function(){ // a bit buggy
			$('#'+$this.id).find('textarea').toggle();
			$('#'+$this.id).find('.wysiwyg').toggle();
		});

		$('#'+$this.id+' textarea').keyup(function(){
			var editor = $('#'+$this.id).find('.wysiwyg');
			editor.html(parseBBCodes($(this).val())); // insert into editor
		});

		$('#'+$this.id+' .wysiwyg').keyup(function(){
			var textarea = $('#'+$this.id).find('textarea');
			var text = $(this).text();
			textarea.val(text); // insert into quellcode editor
			$(this).html(parseBBCodes(text)); // insert into editor
		});

		$('#'+$this.id).find('textarea').hide();

		// so now all is working
		return $(template.compiled.full_compiled);

	};
})( jQuery );