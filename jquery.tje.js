/**
 * TinyJSEditor is a tiny and small HTML5 + Javascript Editor.
 *
 * @author kurtextrem <kurtextrem@gmail.com>
 * @license CC BY-SA http://creativecommons.org/licenses/by-sa/3.0/
 * @copyright 2011-XXXX
 * @version 0.1
 *
 * @package jquery.tje.js
 *
 */
(function( $ ){

	function parseBBCodes(text, bbcodes){
		if(typeof(bbcodes) == 'undefined'){
			bbcodes = {
				'[b]': '<b>',
				'[i]': '<i>',
				'[s]': '<s>', // <s> isn't obsolet in html5.
				'[o]': '<span style="text-decoration: overline;">', // there is no element for this
				'[u]': '<span style="text-decoration: underline;">', // <u> is obsolet
				// following effects from http://line25.com/articles/using-css-text-shadow-to-create-cool-text-effects
				'[n]': '<span style="text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00de, 0 0 70px #ff00de, 0 0 80px #ff00de, 0 0 100px #ff00de, 0 0 150px #ff00de;">',
				'[d]': '<span style="text-shadow: 0px 2px 3px #666;">',
				// negatives
				'[/b]': '</b>',
				'[/i]': '</i>',
				'[/s]': '</s>', // <s> isn't obsolet in html5.
				'[/o]': '</span>', // there is no element for this
				'[/u]': '</span>', // <u> is obsolet
				'[/n]': '</span>',
				'[/d]': '</d>',
			}
		}

		// create text
		$.each(bbcodes, function(key, value){
			text = text.replace(key, value);
		});

		return text;
	}

	function substr_replace (str, replace, start, length) {
		// http://kevin.vanzonneveld.net
		// +   original by: Brett Zamir (http://brett-zamir.me)
		if (start < 0) { // start position in str
			start = start + str.length;
		}
		length = length !== undefined ? length : str.length;
		if (length < 0) {
			length = length + str.length - start;
		}
		return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
	}



	$.fn.TJE = function( options, replace, templates ) {

		/****************/
		/* INIT SECTION */
		/****************/

		var $this = this;
		$this.id = ($this.prop('id') == '') ? $.now() : $this.prop('id'); // if textarea id is empty, use a time id.

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
			if(window.getSelection() == ''){
				textarea.text(textarea.val()+'['+text+'][/'+text+']'); // insert into quellcode editor
			}else{
				var selection = window.getSelection(); // get selection
				textarea.text(substr_replace(textarea.val(), '['+text+']'+selection+'[/'+text+']', selection.extentOffset, (selection.anchorOffset-selection.extentOffset))); // replace string
			}
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

		/*$('#'+$this.id+' .wysiwyg').resize(function(){
			$('#'+$this.id+' textarea').css({width: this.width(), height: this.height()});
		});

		$('#'+$this.id+' textarea').resize(function(){
			$('#'+$this.id+' .wysiwyg').css({width: this.width(), height: this.height()});
		});*/

		$('#'+$this.id).find('textarea').hide();


		// so now all is working
		return $(template.compiled.full_compiled);

	};
})( jQuery );