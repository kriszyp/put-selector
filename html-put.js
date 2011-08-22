var put = require('./put');
put.indentation= '  ';
function Element(tag){
	this.tag = tag;/*
	if(tag){
		this.push((tag == 'html' ? '<!DOCTYPE html>\n<' 
			: '<') + tag, new NamedNodeMap(), '>', new NodeList(), ('</' + tag + '>'));
	}else{
		// a fragment, just get the indexes right
		this.push('', '', '', new NodeList());
	}	*/
}
var prototype = Element.prototype = [];
prototype.nodeType = 1;
var currentIndentation = '';
prototype.toString = function(){
	if(put.indentation){
		// using pretty printing with indentation
		var lastIndentation = currentIndentation;
		currentIndentation += put.indentation;
		var html = (this.tag == 'html' ? '<!DOCTYPE html>\n<html' : '\n' + lastIndentation + '<' + this.tag) +
			(this.attributes ? this.attributes.join('') : '') + 
			(this.className ? ' class="' + this.className + '"' : '') +  
			(this.innerHTML ? '>' + this.innerHTML.join('') +  
				(!this.mixed ? '\n' +lastIndentation : '') + '</' + this.tag + '>' : ' />'); 
		
		currentIndentation = lastIndentation;
		return html;
	}
/*	if(this.toStringed){
		// undo last toString modificatiosn
	}
	var className = this.className; 
	if(className){
		this.setAttribute("class", className);
	}
	var html = this.join('');
	this.toStringed = true;*/
	return (this.tag == 'html' ? '<!DOCTYPE html>\n<html' : '<' + this.tag) +
		(this.attributes ? this.attributes.join('') : '') + 
		(this.className ? ' class="' + this.className + '"' : '') +  
		(this.innerHTML ? '>' + this.innerHTML.join('') + '</' + this.tag + '>' : ' />'); 
};
prototype.children = false;
prototype.attributes = false;
prototype.setAttribute = function(name, value, escape){
	var attributes = this.attributes; 
	if(!attributes){
		attributes = this.attributes = [];
	}
	attributes.push(' ' + name + '="' + value + '"');
};
prototype.insertBefore = function(child, reference){
	child.parentNode = this;
	var children = this.innerHTML;
	if(!children){
		children = this.innerHTML = [];
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
	var children = this.innerHTML; 
	if(!children){
		children = this.innerHTML = [];
	}
	if(typeof child == "string"){
		this.mixed = true;
	}
	children.push(child);
};
function NamedNodeMap(){
}
NamedNodeMap.prototype = [];
NamedNodeMap.prototype.toString = function(){
	return this.join('');
};	
function NodeList(){
}
NodeList.prototype = [];
NodeList.prototype.toString = function(){
	return this.join('');
};	

var lessThanRegex = /</g, ampersandRegex = /&/g;
put.setDocument({
	createElement: function(tag){
		return new Element(tag);
	},
	createTextNode: function(value){
		return (typeof value == 'string' ? value : ('' + value)).replace(lessThanRegex, "&lt;").replace(ampersandRegex, "&amp;");
	},
	createDocumentFragment: function(){
		return new Element();
	}
}, { // fragment heuristic
	test: function(){
		return false;
	}
});
module.exports = put;