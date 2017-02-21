+function() {
  setTimeout(function() {
    $.ajax = function(options) {
      var dfd = $.Deferred()
        , data = {}
        , url = options.url
        , params = options.data
        , code = 0
        , message;
      
      if(url.indexOf('/getInfo') > -1) {
        message = 'success';
        code = 0;
        data = {
        };
      }

      console.log('$.ajax', url, options, {code: code, message: message, data:data});
      setTimeout(function() {
        dfd.resolve({code: code, message: message, data:data});
      }, 0);
      return dfd;
    };
  });
}();


