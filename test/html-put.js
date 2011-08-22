var assert = require("assert"),
	put = require("../html-put");
exports.testSimple = function() {
	console.log(put('div span.test<').toString());
};
exports.testHTML = function() {
	var page = put('html');
	put(page, 'head script[src=test.js]');
	var content = put(page, 'body div.header $+div.content', 'Hello World');
	put(content, 'div.left', 'Left');
	put(content, 'div.right', {innerHTML: ['Right']});
	console.log(page.toString());
};
if (require.main === module)
    require("patr/runner").run(exports);
