const Moon = require("moonjs");
const m = Moon.util.m;
const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

const renderNode = function(node) {
	let html = "";
  if(node.type === "#text") {
    // Text
  	html += node.val;
  } else if(node.meta.component !== undefined) {
    // Component
    const componentInstance = new node.meta.component.CTor();
		const props = componentInstance.props;
		const attrs = node.props.attrs;
		let data = componentInstance.data;

		for(let i = 0; i < props.length; i++) {
			const prop = props[i];
			data[prop] = attrs[prop];
		}

    html += componentInstance.compiledRender(function() {
			return renderNode(m.apply(null, arguments));
		});
  } else {
    // Normal HTML
  	html += `<${node.type} `;
    const attrs = node.props.attrs;

    for(let prop in attrs) {
    	html += `${prop}=${JSON.stringify(attrs[prop])} `;
    }

    html = html.slice(0, -1);
    html += ">";

  	for(let i = 0; i < node.children.length; i++) {
  		html += node.children[i];
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
	const options = instance.options;
  const render = options.render;

  if(render === undefined) {
    instance.compiledRender = Moon.compile(options.template);
  }

  return instance.compiledRender(function() {
		return renderNode(m.apply(null, arguments));
	});
}

module.exports = {
  renderToString: renderToString
}
