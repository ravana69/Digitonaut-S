

var Preloader;
(function() {
   "use strict";

   Preloader = function()
   {
      this.images = [];
      return this;
   };
   
   Preloader.prototype =
   {
      images: null,
      callback: null,
      counter: 0,
      
      addImage: function addImage(img, url)
      {
         var me = this;
         img.url = url;
         img.onload = function()
         {
            me.counter++;
            if (me.counter === me.images.length)
            {
               me.callback.call(me);
            }
         };
         this.images.push(img);
      },
      
      onLoadCallback: function onLoadCallback(fn)
      {
         this.counter = 0;
         this.callback = fn;
         for (var i=0, j=this.images.length; i<j; i++)
         {
            this.images[i].src = this.images[i].url;
         }
      }
   };
})();