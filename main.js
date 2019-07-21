(function(){
  var field, result, tokenize, toLow, uniq, /*sha3_256,*/
    processRequest, intersect, getResponce,
    pattern = /[^ /\\[\-,:+()\][.']{2,}/g;

  toLow = function(e) {
    return (''+e).toLowerCase();
  };

  uniq = function (arr) {
    var i = 0, result = {};
    for (; i < arr.length; i++) {
      result[arr[i]] = true;
    }
    return Object.keys(result);
  };

  tokenize = function(str) {
    var result = str.match(pattern);
    if (result == null) result = [];
    return uniq(result.map(toLow))
  };

  hash = function(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
      if (typeof arr[i] === "string") {
        res.push(sha3_256(arr[i]));
      }
    }
    return res;
  };

  getResponce = 

  intersect = function(arr1, arr2) {
    var max, min, tmp = {}, i = 0, res = [];
    if (arr1.length > arr2.length) {
      max = arr1;
      min = arr2;
    } else {
      max = arr2;
      min = arr1;
    }

    for (; i < max.length; i++) {
      tmp[max[i]] = true;
    }

    for (i = 0; i < min.length; i++) {
      if (min[i] in tmp) res.push(min[i]);
    }

    return res;
  };

  processRequest = function(words) {
    // not tested!! and will not work
    // to do - < 7 req, errors handling 
    /*if (words.length > 0) {
      var p = fetch('/w/'+words[0]);
      */
    Promise.all(words.map(fetch)).then(function(res) {
      return Promise.all(res.map(function(e){e.text()}));
    }).then(function(data){
      var res = [], i;
      data = data.map(function(e){
        return e.split('\n');
      });

      if (data.length === 1) {
        res = data[0];
      } else {
        res = intersect(data[0], data[1]);
        for (i = 2; i < data.length; i++) {
          if (res.length !== 0) {
            res = intersect(res, data[i]);
          }
        }
      }

      getResponce(res);
    });
  };

  window.addEventListener("load", function(){
    field = document.getElementById("field");
    result = document.getElementById("result");

    field.addEventListener("input", function(e) {
      var requestList = hash(tokenize(e.srcElement.value));
      processRequest(requestList);
    });
  });
})();