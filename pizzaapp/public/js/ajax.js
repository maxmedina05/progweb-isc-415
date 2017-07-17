Ajax = {
    buildHttpParams: function(params) {
        str = "";
        var keys = Object.keys(params);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            if (i == 0) {
                str += key + '=' + params[key];
            } else {
                str += '&' + key + '=' + params[key];
            }
        }
        return str;
    },
    get: function(url, params, callback) {
        var xhr = new XMLHttpRequest();
        var method = 'GET';

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.open(method, url, true);
        var authorization = Ajax.getAuthorization();
        if(authorization) {
          xhr.setRequestHeader("Authorization", authorization);
        }
        xhr.send();
    },
    post: function(url, params, callback) {
        var xhr = new XMLHttpRequest();
        var method = 'POST';

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var authorization = Ajax.getAuthorization();
        if(authorization) {
          xhr.setRequestHeader("Authorization", authorization);
        }
        xhr.send(Ajax.buildHttpParams(params));
    },
    setAuthorization: function(authorization) {
      localStorage.setItem('authorization', authorization);
    },
    getAuthorization: function(){
      return localStorage.getItem('authorization');
    }
};