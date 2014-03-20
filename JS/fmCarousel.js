/*
 * Copyright 2010, Francisco Memoli
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * Date: 15 / 12 / 2013
 * Depends on library: jQuery
 *
 */

;(function ($) 
{ 
    $.fmc = $.fmc || { };
    
    $.fmc.carousel = {
        options: {  
            size_window:1,
            countE : 5,
            moveToN:4.5,
            callbackBefore:null, // function that executes before every move.
            callbackAfter:null,// function that executes after every move.
            callbackOnClick:null
        }
    };

      function Carousel(root, options)
    {
        var disableClickSmall = false;
        
        var oSelf     = this,
            countE = options.countE,
            oViewport = $('.viewport:first', root),
            oContent  = $('.overview:first', root),
            oPages    = oContent.children(),
            oButtons = $('.buttons', root),
            oBtnNextClass  = 'next',
            oBtnPrevClass  = 'prev';

        this.arrows = function () {
        	updateSmallArrows();
        };
        this.setCallBackAfterMove = function (callback) {
            options.callbackAfter = callback;
        }
        function updateSmallArrows(){
            limitLeft = -(countE - options.size_window ) * oPages.outerWidth();
            leftvaule = oContent.position().left;
            $('.'+oBtnNextClass,root).children().show();
            $('.'+oBtnPrevClass,root).children().show();
            if(leftvaule <= limitLeft){
                leftvaule = limitLeft;
                $('.'+oBtnNextClass,root).children().hide();
            }
            if(leftvaule >= 0){
                $('.'+oBtnPrevClass,root).children().hide();
            }
            if(typeof options.callbackAfter === 'function') {
                options.callbackAfter.call(this);
            }
        }
        function hideButtons(){
            $('.'+oBtnNextClass,root).children().hide();
            $('.'+oBtnPrevClass,root).children().hide();
        }
        function setEvents() {
            oPages.mousedown(function(){            	
                disableClickSmall = false;
            });
            oPages.mouseup(function(){
                if(!disableClickSmall){
                    if(typeof options.callbackOnClick === 'function') {
                        options.callbackOnClick.call(this,$(this).attr("rel"));
                    }
                }
                disableClickSmall = false;
            });
            oButtons.click(function(){
                if(typeof options.callbackBefore === 'function') {
                    options.callbackBefore.call(this);
                }
                if($(this).hasClass(oBtnNextClass)){
                    leftvaule = oContent.position().left - ((oPages.outerWidth()) * options.moveToN);
                }else{
                    leftvaule = oContent.position().left + ((oPages.outerWidth()) * options.moveToN);
                }
                oSelf.moveToPosition(leftvaule);
                
            })
        }
    this.moveToPosition  = function (leftvaule){
        limitLeft = -(countE - options.size_window ) * oPages.outerWidth();
        if(leftvaule <= limitLeft){
            leftvaule = limitLeft;
        }
        if(leftvaule >= 0){
            leftvaule = 0;
        }
        oContent.animate({left: leftvaule+"px"}, 500, "easeInOutQuad", updateSmallArrows)
    }
    this.MoveToLeft = function (numberOfSlides){
        leftvaule = oContent.position().left - ((oPages.outerWidth()) * numberOfSlides);
        oSelf.moveToPosition(leftvaule);
    }
    this.refreshDesign  =  function () {
        width = getWithContainer();
        left = getLeftContainer();
        right = getRightContainer();
        oContent.width(width+'px')
        if(getCountElements() > options.size_window){
            oContent.draggable( "option", "containment",  [left, 0, right, 0] );
        }
    }
    callbackAjaxlightboxComplete = this.refreshDesign
    function getLeftContainer(){
        return oViewport.offset().left - width + (options.size_window * oPages.outerWidth());
    }

    function getRightContainer(){
        return oViewport.offset().left;
    }

    function getWithContainer(){
        countE = oContent.children().length;
        return countE * oPages.outerWidth();
    }

    function getCountElements(){
        return oContent.children().length;
    }

    function initialize () {
        
        width = getWithContainer();
        left = getLeftContainer();
        right = getRightContainer();
        oContent.width(width+'px');
        if(getCountElements() > options.size_window){
            oContent.draggable({ axis: "x",
                start: function( event, ui ) {
                    disableClickSmall = true;                    
                    if(typeof options.callbackBefore === 'function') {
                        options.callbackBefore.call(this);
                    }
                },
                stop: function( event, ui ) {updateSmallArrows();},
                distance: 5,
                containment: [left, 0, right, 0]
            });
        }else{
            hideButtons();
        }
            setEvents();
            return oSelf;
        }
        return initialize();
    }
     $.fn.fmCarrucel = function(params) {
            var options = $.extend({}, $.fmc.carousel.options, params);
            this.each(function (){$(this).data('fmc', new Carousel($(this), options)); });
            return this;
        };
        
    $.fn.fmCRefresh = function () { 
        $(this).data('fmc').refreshDesign(); 
    };
    /*

    */
    $.fn.fmCMoveToLeft = function (numberOfSlides) { 
        $(this).data('fmc').MoveToLeft(numberOfSlides);
    }; 

    $.fn.fmCsetCallBackAfterMove = function (callback) { 
        $(this).data('fmc').setCallBackAfterMove(callback); 
    };
    
    $.fn.fmCUpdate = function () { 
        $(this).data('fmc').arrows(); 
    };


}(jQuery));
