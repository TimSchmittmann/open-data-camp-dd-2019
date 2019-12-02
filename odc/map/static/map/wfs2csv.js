$('#wfs2csv-form').submit(function(e) {
	e.preventDefault();
	window.location.href = window.location.href + $(this).find('#node-id').val() + '/';
});