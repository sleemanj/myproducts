// ==UserScript==
// @name         My Products Interface Improver
// @namespace    http://github.com/sleemanj/myproducts
// @updateURL    https://github.com/sleemanj/myproducts/raw/master/myproducts.user.js
// @downloadURL  https://github.com/sleemanj/myproducts/raw/master/myproducts.user.js
// @version      0.4
// @description  Some enhancements for the new My Products interface
// @author       James Sleeman
// @match        https://sell.trademe.co.nz/*/Product/List/TradeMe
// @grant        none
// ==/UserScript==

(function(){
    
    
  // ========= CONFIGURATION ===================================================================
    
    var SwapHighestItemsPerPageTo = 100;   // This changes the highest "Items per page:" setting 
    									   // from 50 to whatever you set here.  Warning, may 
    									   // cause slow response
    
    var RefreshPeriod		      = 1.5;   // We need to periodically check and resize some stuff
    									   // how often in seconds to do this.
    
  // ========= END CONFIGURATION ===============================================================
    
    
    
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    
    css 	= " #content, #content .inner { padding:10px; } "
    	    + " .inner { width:100%; } "
    		+ " .myproducts .widgets-grid table { width:100%; } "
    		+ " .myproducts .widgets-grid table .body .cell-content .product-info { width:auto; max-width:340px; }"
            + " .myproducts .widgets-grid table .body .cell-content .product-alternate-code { width:auto; max-width:340px; }"
    		+ " .myproducts .widgets-grid.grid-ProductTradeMeLite .body .cell-content { position:relative; }"	
   			+ " .myproducts .widgets-grid table .body .cell-content .product-info { position: static; }"
    		+ " .myproducts .widgets-grid table .body .cell-content .duplicate { right: 7px; }"
    		+ " .myproducts .widgets-grid .header .current-sorting { display:block !important; }";
    
    addGlobalStyle(css);
    
    if(!$($('.myproducts .widgets-grid .header .current-sorting')[0]).text().length)
    {
      $($('.myproducts .widgets-grid .header .current-sorting')[0]).text('SKU');
    }
    
    function periodic()
    {
        
    	$('.last.itemsPerPage')[0].setAttribute('data-page-size', SwapHighestItemsPerPageTo);
    	$($('.last.itemsPerPage')[0]).text( SwapHighestItemsPerPageTo );
        
        var rows = $('.myproducts .widgets-grid table .name-product');
        for(var x = 0; x < rows.length; x++)
        {
            var availWidth = $(rows[x]).width();
            $(rows[x]).find('.product-info')[0].style.maxWidth = (availWidth - 100) + 'px';
            $(rows[x]).find('.product-alternate-code')[0].style.maxWidth = (availWidth - 100) + 'px';            
        }
    	window.setTimeout(periodic, 1000*RefreshPeriod);    
    }
    
    periodic();
    
    
})();
