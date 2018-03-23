$(function() {
	debugger;
	$('#orgModalDetail').load("../org/orgDetail.html", function() {
		var curTabOrgKind = $('#curTaborgKind').val();
		$("#orgDetailinfo").attr("id","orgDetailinfo"+curTabOrgKind);
		var orgId = $("#orgDetailModal_orgId"+curTabOrgKind).val();
		doDetail(orgId);
	});
	$('#orgDetailInfoModal').modal({ show: true, backdrop: 'static' });
	$('#orgDetailInfoModal').on('hide.bs.modal', function() {

	})

})