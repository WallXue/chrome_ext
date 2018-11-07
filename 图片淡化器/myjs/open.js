if($){
	console.info('------')
	console.info($)
	console.info('------')
	console.info(chrome)
	console.info('------')

	if(!window.dhq_open) {

		chrome.storage.sync.get('opacityValue', function(data) {
			window.dhq_open = true;
			let ov = (data.opacityValue || 8) / 100;
			if(!$("dhq_style")) {
				var dhq_style=document.createElement('style');
				dhq_style.id='dhq_style';
				dhq_style.type='text/css';
				if(dhq_style.styleSheet){
				    dhq_style.styleSheet.cssText='img{opacity:0.08}';
				}else{
				    dhq_style.appendChild(document.createTextNode('img{opacity:0.08}'));
				}
				document.getElementsByTagName('head')[0].appendChild(dhq_style);

				$(document).on('mouseover', '.dosomething', function(){
					var ele = e.fromElement;
					if(dhq_open && ele && ele.nodeName && ele.nodeName === 'IMG') {
						console.info(ele.nodeName+"-show")
						ele.style.opacity = '1';
					}
				});

				$(document).on('mouseover', '.dosomething', function(){
					var ele = e.fromElement;
					if(dhq_open && ele && ele.nodeName && ele.nodeName === 'IMG') {
						console.info(ele.nodeName+"-hide")
						ele.style.opacity = '0.08';
					}
				});
			}
		});
	}
	
}

