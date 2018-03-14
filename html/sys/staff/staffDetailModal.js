$(function() {
	debugger;
	$('#staffDetail').load("../staff/staffDetail.html", function() {

	});
	$('#infoModal').modal({ show: true, backdrop: 'static' });
	$('#infoModal').on('hide.bs.modal', function() {
		debugger;
		if ($('#curTabstaffKind').val() && !$('#mark').val()) {
			$("#staffDetail" + $('#curTabstaffKind').val()).empty();
			$('#staffDetailId' + $('#curTabstaffKind').val()).val("");
		} else if ($('#mark').val()) {
			$("#staffDetail" + $("#mark").val()).empty();
			$('#staffDetailId' + $("#mark").val()).val("");
		}
		$("#staffDetail").empty();
		$('#mark').val("");
	})

})