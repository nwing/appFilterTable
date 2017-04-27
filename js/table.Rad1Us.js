'use strict';

/***************************/
/* Antony tasayco cappillo */
/* Antony.exe@gmail.com */
/***************************/
;tableRad1Us = {
	fixedVar: {
		filterIdTable: '#filterList'
	},
	configParameters: {
		tableId : '#listAgenda',
		perPage : 2,
		filterId : '#inputFilter'
	},
	init: function(parameters){
		var self = this;
		/************************************************/
		// -- Pagination
		self.configPagination(false);
		// -- Filter
		self.filter(tableRad1Us.configParameters.tableId);


		/************************************************/
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
		$(tableRad1Us.configParameters.filterId).change(function () {
			if (this.value.length) {
				if($(tableRad1Us.fixedVar.filterIdTable).length ) {
					$(tableRad1Us.fixedVar.filterIdTable).remove();
				}
				var cloneTable = $(table).clone().show();
				cloneTable[0].setAttribute('id', 'filterList');
				cloneTable.find("td.colName:contains('" + $(this).val() + "')").parent().attr('data-show', 'TRUE').css('display', '');
				cloneTable.find("td.colName:not(:contains('" + $(this).val() + "'))").parent().remove();
				$(table).hide();
				$('#showTable').append(cloneTable);
				self.configPagination(true);
			} else {
				if($(tableRad1Us.fixedVar.filterIdTable).length ) {
					$(tableRad1Us.fixedVar.filterIdTable).remove();
					$(table).show();
					self.configPagination(false);
				}
			}
		})
	}

};

tableRad1Us.init();