"use strict";
var put;
function Element(tag){
	this.tag = tag;
}
var emptyElements = {};
["base", "link", "meta", "hr", "br", "wbr", "img", "embed", "param", "source", "track", "area", "col", "input", "keygen", "command"].forEach(function(tag){
	emptyElements[tag] = true;
});
var prototype = Element.prototype = [];
var currentIndentation = '';
prototype.nodeType = 1;
prototype.toString = function(){
	var tag = this.tag;
	var emptyElement = emptyElements[tag];
	if(put.indentation){
		// using pretty printing with indentation
		var lastIndentation = currentIndentation;
		currentIndentation += put.indentation;
		var html = (tag == 'html' ? '<!DOCTYPE html>\n<html' : '\n' + lastIndentation + '<' + tag) +
			(this.attributes ? this.attributes.join('') : '') + 
			(this.className ? ' class="' + this.className + '"' : '') + '>' +  
			(this.children ? this.children.join('') : '') +  
			(!this.mixed && !emptyElement  && this.children ? '\n' +lastIndentation : '') + 
			(emptyElement ? '' : ('</' + tag + '>')); 
		
		currentIndentation = lastIndentation;
		return html;
	}
	return (this.tag == 'html' ? '<!DOCTYPE html>\n<html' : '<' + this.tag) +
		(this.attributes ? this.attributes.join('') : '') + 
		(this.className ? ' class="' + this.className + '"' : '') + '>' +  
		(this.children ? this.children.join('') : '') +  
		(emptyElement ? '' : ('</' + tag + '>')); 
};

prototype.children = false;
prototype.attributes = false;
prototype.insertBefore = function(child, reference){
	child.parentNode = this;
	var children = this.children;
	if(!children){
		children = this.children = [];
	}
	if(reference){
		for(var i = 0, l = children.length; i < l; i++){
			if(reference == children[i]){
				child.nextSibling = reference;
				if(i > 0){
					children[i-1].nextSibling = child;
				}
				return children.splice(i, 0, child);
			}
		}
	}
	if(children.length > 0){
		children[children.length-1].nextSibling = child;
	}
	children.push(child);
};
prototype.appendChild = function(child, reference){
	var children = this.children; 
	if(!children){
		children = this.children = [];
	}
	if(typeof child == "string"){
		this.mixed = true;
	}
	children.push(child);
};
prototype.setAttribute = function(name, value, escape){
	var attributes = this.attributes; 
	if(!attributes){
		attributes = this.attributes = [];
	}
	attributes.push(' ' + name + '="' + value + '"');
};
prototype.removeAttribute = function(name, value){
	var attributes = this.attributes; 
	if(!attributes){
		return;
	}
	var match = ' ' + name + '=', matchLength = match.length;
	for(var i = 0, l = attributes.length; i < l; i++){
		if(attributes[i].slice(0, matchLength) == match){
			return attributes.splice(i, 1);
		}
	}
};
Object.defineProperties(prototype, {
	innerHTML: {
		get: function(){
			return this.children.join('');
		},
		set: function(value){
			this.mixed = true;
			this.children = [value];
		}
	}
});
var lessThanRegex = /</g, ampersandRegex = /&/g;
module.exports = function(putModule, putFactory){
	put = putModule.exports = putFactory();
	put.indentation = '  ';
	// setup a document for string-based HTML creation, using our classes 
	put.setDocument({
		createElement: function(tag){
			return new Element(tag);
		},
		createTextNode: function(value){
			return (typeof value == 'string' ? value : ('' + value)).replace(lessThanRegex, "&lt;").replace(ampersandRegex, "&amp;");
		}
	}, { // fragment heuristic, don't use this fragments here, it only slows things down
		test: function(){
			return false;
		}
	});	
};