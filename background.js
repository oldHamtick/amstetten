document.addEventListener ("copy", function(clipboard) {
	var selection = window.getSelection();
	if (isDialogSelected(selection.extentNode.parentNode,
		                 selection.baseNode.parentNode)) {
		clipboard.preventDefault();
		var text = getFormattedDialog(selection);
		clipboard.clipboardData.setData('text', text);
	}
}, true);

function isDialogSelected (nodeBase, nodeExtent) {
	return toDialogNode(nodeBase) &&
		   toDialogNode(nodeExtent);
}

function getSelectDirection (nodeBase, nodeExtent) {
	base = toDialogNode(nodeBase);
	extent = toDialogNode(nodeExtent);
}

function toDialogNode (node) {
	var trParent = $(node).closest('.im_out,.im_in');
	if (trParent.length) {
		return parseInt(trParent.attr('id').replace('mess', ''));
	}
	var divParent = $(node).closest('.im_typing_wrap');
	if (divParent.length) {
		return parseInt($('.im_out,.im_in').last().attr('id').replace('mess', ''));
	}
	return false;
}

function getFormattedDialog (selection) {
	orderedNodes = getOrderedNodes(selection)
	if ($(tree.extentNode.parentNode).closest('.im_out,.im_in')) {

	}

	getSingleMessage (tree)
	var orderedNodes = orderNodes(tree);
	if (orderedNodes) {
		var dialog = '';
		var node = $(orderedNodes[0]);
		var lastNode = $(orderedNodes[1])
		while (node.attr('id') != lastNode.attr('id')) {
			if (isDialogNode(tree.baseNode.parentNode) != -1) {
				dialog += formatMessage(node) + '\r\n';
			}
			node = node.next();
		}
		return dialog + formatMessage(lastNode);
	}
}

function formatMessage (row) {
	return row.find('.im_date_link').text() + " | " +
		   row.find('.mem_link').text() + " : " +
		   row.find('.im_msg_text').text()
}

function orderedNodes (tree) {
	baseNumber = isDialogNode (tree.baseNode.parentNode);
	extentNumber = isDialogNode (tree.extentNode.parentNode);
	if (extentNumber > baseNumber) {
		return [$('#mess' + baseNumber), $('#mess' + extentNumber)];
	}
	if (baseNumber > extentNumber) {
		return [$('#mess' + extentNumber), $('#mess' + baseNumber)];
	}
}