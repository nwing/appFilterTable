/***************************/
/* Antony tasayco cappillo */
/* Antony.exe@gmail.com */
/***************************/

// -- Contains Case-Insensitive
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
	return function( elem ) {
		return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	};
});

;tableRad1Us = {
	fixedVar: {
		filterIdTable: '#filterList'
	},
	configParameters: {
		tableId : '#listAgenda',
		perPage : 10,
		filterId : '#inputFilter',
		tableList: '#tableList'
	},
	init: function(parameters){
		var self = this;
		/************************************************/
		// -- Pagination
		self.configPagination(false);
		// -- Filter
		self.filter(tableRad1Us.configParameters.tableId);
		/************************************************/
		// -- Sorted
		self.sorted(tableRad1Us.configParameters.tableId, false);
	},
	configPagination: function(filter){
		var self = this;
		var childrenCount = filter == false ? $(tableRad1Us.configParameters.tableId).children("tbody").children().size() : $(tableRad1Us.fixedVar.filterIdTable).find("tr[data-show*='TRUE']").length,
				showTableId = filter == false ? tableRad1Us.configParameters.tableId : tableRad1Us.fixedVar.filterIdTable;
		if(childrenCount > tableRad1Us.configParameters.perPage){
			self.pagination(showTableId, tableRad1Us.configParameters.perPage, childrenCount);
		} else {
			if($('.pagination').length ) {
				$('.pagination').remove();
			}
		}
	},
	pagination: function(table, perPage, childrenCount){
		$(table).each(function() {
			$(this).children("tbody").children().hide();
			var pageCount = Math.ceil(childrenCount / perPage);
			var htmlPagination = '<div class="pagination pagination-small"><ul>';
					htmlPagination += '<li><a href="#first" rel="first">«</a></li>';
			for(var i = 0; i < pageCount; i++) {
				htmlPagination += '<li><a href="#" class="graybutton pagelink" rel="' + (i + 1) + '">' + (i + 1) + '</a></li>';
			}
			htmlPagination += '<li><a href="#last" rel="last">»</a></li></ul></div>';
			$(".paginate").html(htmlPagination);
			for(var i = 0; i < perPage; i++) {
				$(this).children("tbody").children("tr:nth-child(" + (i + 1) + ")").css('display', '');
				$(".paginate .pagination li:nth-child(2)").addClass("active");
			}
			$('.paginate .pagination a[rel="first"]').click(function(e) {
				$(this).parent().siblings().removeClass("active");
				$(this).parent().siblings('li:nth-child(2)').addClass("active");
				$(table).children("tbody").children().hide();
				for(var i = 0; i < perPage; i++) {
					$(table).children("tbody").children("tr:nth-child(" + (i + 1) + ")").css('display', '');
				}
				e.preventDefault();
			});
			$('.paginate .pagination a[rel="last"]').click(function(e) {
				$(this).parent().siblings().removeClass("active");
				$(this).parent().siblings('li:nth-child(' + (pageCount + 1) + ')').addClass("active");
				$(table).children("tbody").children().hide();
				for(var i = 0; i < perPage; i++) {
					$(table).children("tbody").children("tr:nth-child(" + (i + (pageCount - 1) * perPage + 1) + ")").css('display', '');
				}
				e.preventDefault();
			});
			$('.paginate .pagination a.pagelink').click(function(e) {
				$(this).parent().siblings().removeClass("active");
				$(this).parent().addClass("active");
				var offset = perPage * ($(this).attr("rel") - 1);
				$(table).children("tbody").children().hide();
				for(var i = 0; i < perPage; i++) {
					$(table).children("tbody").children("tr:nth-child(" + (i + 1 + offset) + ")").css('display', '');
				}
				e.preventDefault();
			});
		});
	},
	filter: function(table){
		var self = this;
		$(tableRad1Us.configParameters.filterId).keyup(function () {
			if (this.value.length) {
				if($(tableRad1Us.fixedVar.filterIdTable).length ) {
					$(tableRad1Us.fixedVar.filterIdTable).remove();
				}
				var cloneTable = $(table).clone().show();
				cloneTable[0].setAttribute('id', 'filterList');
				cloneTable.find("td.colName:contains('" + $(this).val() + "')").parent().attr('data-show', 'TRUE').css('display', '');
				cloneTable.find("td.colName:not(:contains('" + $(this).val() + "'))").parent().remove();
				$(table).hide();
				$(tableRad1Us.configParameters.tableList).append(cloneTable);
				self.configPagination(true);
				self.sorted(tableRad1Us.fixedVar.filterIdTable, true);
			} else {
				if($(tableRad1Us.fixedVar.filterIdTable).length ) {
					$(tableRad1Us.fixedVar.filterIdTable).remove();
					$(table).show();
					self.configPagination(false);
					self.sorted(table, false);
				}
			}
		})
	},
	sorted: function(table, filter){
		var self = this;
		var sortDescending = false;
		$(document).on("click", table+' thead tr th', function(){
			var thIndex = $(this).index();
			sorting = [];
			tbodyHtml = null;
			$(table+' tbody tr').each(function(){
				sorting.push($(this).show().children('td').eq(thIndex).html() + ', ' + $(this).index());
			});
			sorting = sorting.sort();
			if(sortDescending)
				sorting.reverse();
			for(var sortingIndex = 0; sortingIndex < sorting.length; sortingIndex++){
				rowId = parseInt(sorting[sortingIndex].split(', ')[1]);
				tbodyHtml = tbodyHtml + $(table+' tbody tr').eq(rowId)[0].outerHTML;
			}
			sortDescending = sortDescending == false ? true : false;
			$(table+' tbody').html(tbodyHtml);
			self.configPagination(filter);
		});
	}
};

$(function(){
	// Init: Table
	tableRad1Us.init();
	// Sticky: Generate Sticky list
	var listRow = '';
	$('#listAgenda thead tr th').each(function(i, r) {
		listRow += '<li>'+ $(r).text() +'</li>';
	});
	$('#listRow').append(listRow);
	// Modal
	$(document).on("click", 'table tbody img', function(e){
		var contenHtml = '',
				getImageSrc = $(this).attr('src');
		contenHtml += ' <a href="#" id="modal-close">x</a>';
		contenHtml += '<img id="showImageModal" src="'+ getImageSrc +'" alt="" />';
		$("#modal-content").html(contenHtml);
		$("#modal-content,#modal-background").toggleClass("active");
		e.preventDefault();
	});

	$(document).on("click", '#modal-close', function(e){
		$("#modal-content,#modal-background").toggleClass("active");
		e.preventDefault();
	});


});

// Sticky
$(window).scroll(function(){
	var sticky = $('.sticky'),
			scroll = $(window).scrollTop();
	if (scroll >= 100) sticky.addClass('fixed');
	else sticky.removeClass('fixed');
});