const OPEN_HTML_ELEMENTS = ["address","article","aside","base","blockquote","body","caption","col","colgroup","dd","details","dialog","div","dl","dt","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","legend","li","menuitem","meta","optgroup","option","param","rp","rt","source","style","summary","tbody","td","tfoot","th","thead","title","tr","track"];

const renderNode = function(node) {
	var html = "";
  if(node.type === "#text") {
  	html += node.val;
  } else {
  	html += `<${node.type} `;
    for(var prop in node.props.attrs) {
    	html += `${prop}=${JSON.stringify(node.props.attrs[prop])} `
    }
    html += 'data-server-rendered'
    html += ">";
  	for(var i = 0; i < node.children.length; i++) {
  		html += renderNode(node.children[i]);
  	}
    if(OPEN_HTML_ELEMENTS.indexOf(node.type) > -1) {
      html += `</${node.type}>`;
    }
  }
  return html;
}

const renderToString = function(instance) {
	var html = "";
  html += renderNode(instance.render());
  return html;
}

module.exports = {
  renderToString = renderToString
}
