(function() {
  'use strict';

  document.addEventListener("DOMContentLoaded", function(event) {

    var btnLogout = document.getElementById('btn-logout');
    btnLogout.onclick = logout;

    function logout(evt){
      evt.preventDefault();
      localStorage.removeItem('authorization');
      localStorage.removeItem('email');
    }
  });
})();
