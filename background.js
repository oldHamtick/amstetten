document.addEventListener ("copy", function(clipboard) {
	var selection = window.getSelection();
	if (isDialogSelected(selection.extentNode,
		                 selection.baseNode)) {
		clipboard.preventDefault();
		console.log (selection);
		var text = getFormattedDialog(selection);
		clipboard.clipboardData.setData('text', text);
	}
}, true);

function isDialogSelected (nodeBase, nodeExtent) {
	var base = toDialogNode(nodeBase);
	var extent = toDialogNode(nodeExtent);
	return base && extent && 
		   base.node.attr('id') != extent.node.attr('id');
}

function toDialogNode (node, offset) {
	var trParent = $(node).closest('.im_out,.im_in');
	if (trParent.length) {
		return {
			'node' : trParent, 
			'offset' : offset};
	}
	var divParent = $(node).closest('.im_typing_wrap');
	if (divParent.length || $(node).attr('class') == 'im_rows im_peer_rows') {
		return {
			'node' : $('.im_out,.im_in').last(), 
			'offset' : -1};
	}
	return false;
}

function getFormattedDialog (selection) {
	var base = {
		'node' : $(selection.baseNode.parentNode).closest('.im_out,.im_in,.im_typing_wrap'),
		'offset' : getEntry (selection.baseNode, selection.baseOffset)
	}
	var extent = {
		'node' : $(selection.extentNode.parentNode).closest('.im_out,.im_in,.im_typing_wrap'),
		'offset' : getEntry (selection.extentNode, selection.extentOffset)
	}
	var orderedNodes = orderNodes(base, extent);
	var first = orderedNodes[0];
	var last = orderedNodes[1];
	var dialog = formatFirstMessage(first.node, first.offset);
	var node = first.node.next();
	while (node.attr('id') != last.node.attr('id')) {
		dialog += formatMessage(node);
		node = node.next();
	}
	return dialog + formatLastMessage(last.node, last.offset);
}

function getEntry (node, offset) {
	if ($(node.parentNode).attr('class') == "im_msg_text") {
		return offset;
	}
	if (["im_log_date", "im_log_rspacer"].indexOf($(node).closest('td').attr('class')) != -1 ||
		["im_out", "im_in"].indexOf($(node).attr('class')) != -1) {
		return -1
	}
	return 0;
}

function orderNodes (base, extent) {
	base = toDialogNode (base.node, base.offset);
	extent = toDialogNode (extent.node, extent.offset);
	baseNumber = parseInt(base.node.attr('id').replace('mess', ''))
	extentNumber = parseInt(extent.node.attr('id').replace('mess', ''))
	if (extentNumber > baseNumber) {
		return [base, extent];
	}
	if (baseNumber > extentNumber) {
		return [extent, base];
	}
}

function formatFirstMessage (row, offset) {
	if (offset == -1 || offset == row.find('.im_msg_text').text().length) {
		return ''
	}
	return format(row.find('.im_date_link').text(),
				   row.find('.mem_link').text(),
				   row.find('.im_msg_text').text().substr(offset),
				   row.attr('class').split(' ').indexOf('im_out') == -1)
}

function formatMessage (row) {
	return format(row.find('.im_date_link').text(),
				   row.find('.mem_link').text(),
				   row.find('.im_msg_text').text(),
				   row.attr('class').split(' ').indexOf('im_out') == -1)
}

function formatLastMessage (row, offset) {
	if (offset == 0) {
		return ''
	}
	if (offset == -1) {
		text = row.find('.im_msg_text').text()
	} else {
		text = row.find('.im_msg_text').text().substr(0, offset)
	}
	return format(row.find('.im_date_link').text(),
				   row.find('.mem_link').text(),
				   text,
				   row.attr('class').split(' ').indexOf('im_out') == -1)
}

function format (date, author, text, direction) {
	var separator = direction ? ' > ' : ' < ';
	return author + separator + date + " : " + text + "\r\n";
}