TinyJSEditor
============

Whats TinyJSEditor?
-------------------
TinyJSEditor is a modern Editor. It's a jQuery Plugin.

The WYSIWYG Editor doesn't work!
--------------------------------
Aw, crap. Maybe your Browser doesn't support the HTML5 Attribute "contenteditable".

Diffrents between Quellcode Editor and WYSIWYG Editor?
------------------------------------------------------
In Quellcode Editor you can see all Code you've written. In "normal" Editor see the result from the code (HTML / BB Code).

Requirements
------------
* [jQuery](http://jquery.com) (> 1.4 should work fine)
* jquery.tje.js / jquery.tje.min.js (download from github) (~5.83 KB / ~2.51 KB)
* tje.css (download from github) (~4.05 KB)

Settings
--------
* Call it similar to that: `$('#example').TJE();`
* For example to enable underline, call `$('#example').TJE({underline: true});`
* If you use XHTML(5), call `$('#example').TJE(0, {'[i]': '<span ...'});`
* For XHTML change the templates: `$('#example').TJE(0, 0, {your new templates});`

Version History
---------------

#### 0.1
* initial release
