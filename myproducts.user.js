// ==UserScript==
// @name         My Products Interface Improver
// @namespace    http://github.com/sleemanj/myproducts
// @updateURL    https://github.com/sleemanj/myproducts/raw/master/myproducts.user.js
// @downloadURL  https://github.com/sleemanj/myproducts/raw/master/myproducts.user.js
// @version      0.5
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
    
    var AddFPOLinks				  = true;  // Try to include "View FPO" links in the status cols
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
    
    
    // Eavesdrop on the XMLHTTPRequests to try and find the FPO information and other stuff to include in
    // the list.  I think this only works in Chrome.    
    if(AddFPOLinks)
    {
        var LastSeenListingData = false;
        (function(open) {
        
            XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        
                this.addEventListener("readystatechange", function() {
                    
                    if(this.readyState == 4 && this.status == 200 && url.match(/GetListData/))
                    {
                      try
                      {
                        LastSeenListingData = JSON.parse(this.responseText);  
                      }
                      catch(err)
                      {
                       // console.log("Failed Parse");
                       // console.log(this.responseText);  
                      }                 
                    }
                }, false);
        
                open.call(this, method, url, async, user, pass);
            };
        
        })(XMLHttpRequest.prototype.open);
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
        
        if(AddFPOLinks)
        {
            var rows = $('.myproducts .widgets-grid table tbody tr');
            if(LastSeenListingData)
            {            
                if($('.gogo-fpo-starter').length) $('.gogo-fpo-starter')[0].style.display='none'; 
                for(var x = 0; x < LastSeenListingData.Data.ListItems.length; x++)
                {
                  if(LastSeenListingData.Data.ListItems[x].HasOpenFPOs)
                  {
                      var stat = $(rows[x]).find('.content.status')[0];
                      if(!$(stat).find('.gogo-fpo').length)
                      {
                         $(stat).append('<div class="gogo-fpo"><a title="This option has been added by the Grease/Tampermonkey Script, if MP starts displaying it natively as well then let bitsy_boffin know at the trademe message board Top Sellers area." target="_blank" href="http://www.trademe.co.nz/Browse/Listing.aspx?id='+(LastSeenListingData.Data.ListItems[x].OpenFPOTradeMeListingExternalID)+'">View FPO*</a></div>');
                      }
                  }
                }
            }
            else if(rows.length && LastSeenListingData !== null)
            {                 
                $('.filter-panel-header').prepend('<p class="gogo-fpo-starter">Grease/Tampermonkey Script: We might be able to show FPO in the status column if you <a href="#" onclick="$(\'.keyword-go button.btn-trademe.expand\').trigger(\'click\');$(\'.gogo-fpo-starter\')[0].style.display=\'none\'; return false;">Click Here</a></p>');                                                                      	
                LastSeenListingData = null;                     
            }
        }
        
    	window.setTimeout(periodic, 1000*RefreshPeriod);    
    }
    
    periodic();
    
    
})();
