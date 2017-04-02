const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

const renderNode = function(node) {
	var html = "";
  if(node.type === "#text") {
    // Text
  	html += node.val;
  } else if(node.meta.component) {
    // Component
    const componentInstance = new node.meta.component.CTor();
    html += renderNode(componentInstance.render());
  } else {
    // Normal HTML
  	html += `<${node.type} `;
    for(var prop in node.props.attrs) {
    	html += `${prop}=${JSON.stringify(node.props.attrs[prop])} `
    }
    html = html.slice(0, -1);
    html += ">";
  	for(var i = 0; i < node.children.length; i++) {
  		html += renderNode(node.children[i]);
  	}
    if(VOID_ELEMENTS.indexOf(node.type) === -1) {
      html += `</${node.type}>`;
    } else {
      html = html.slice(0, -1) + "/>";
    }
  }
  return html;
}

const renderToString = function(instance) {
	var html = "";
  if(instance.$opts.template) {
    instance.$render = Moon.compile(instance.$opts.template)
  }
  html += renderNode(instance.render());
  return html;
}

module.exports = {
  renderToString: renderToString
}
