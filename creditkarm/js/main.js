$(document).ready(function(){
	// // Высота главного хедера - высота банковского подхедера.
	
	
	// мобильная навигация
	$('body').on('click', '#mobMenu', function(){
		$('#navigation').slideToggle(300);
	});

	// авто подсчёт количества офферов
	var offers = $('.feeds_item').length;
	$('[data-offers-count]').text(offers);

	$('.feeds_item').on('click', function(){
		$(this).find('.feeds_item_collapse').slideToggle(300)
	});

	

	$('.bank_id').on('click', function(e) {
		e.preventDefault();
		$('.bank_header').toggleClass('is_active');
	})
});