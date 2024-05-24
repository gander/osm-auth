var osmAuth=(function(){var m=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var M=Object.getOwnPropertyNames;var P=Object.prototype.hasOwnProperty;var T=function(t,e){for(var c in e)m(t,c,{get:e[c],enumerable:!0})},U=function(t,e,c,d){if(e&&typeof e=="object"||typeof e=="function")for(var a=M(e),h=0,p=a.length,f;h<p;h++)f=a[h],!P.call(t,f)&&f!==c&&m(t,f,{get:function(n){return e[n]}.bind(null,f),enumerable:!(d=k(e,f))||d.enumerable});return t};var R=function(t){return U(m({},"__esModule",{value:!0}),t)};var E={};T(E,{osmAuth:function(){return x}});function x(t){var e={},c=null;try{c=window.localStorage}catch(n){var d=new Map;c={isMocked:!0,hasItem:function(r){return d.has(r)},getItem:function(r){return d.get(r)},setItem:function(r,o){return d.set(r,o)},removeItem:function(r){return d.delete(r)},clear:function(){return d.clear()}}}function a(n,r){var o=t.url+n;if(arguments.length===1){var u=c.getItem(o)||"";return u.replace(/"/g,"")}else if(arguments.length===2)return r?c.setItem(o,r):c.removeItem(o)}e.authenticated=function(){return!!a("oauth2_access_token")},e.logout=function(){return a("oauth2_access_token",""),a("oauth_token",""),a("oauth_token_secret",""),a("oauth_request_token_secret",""),e},e.authenticate=function(n){if(e.authenticated()){n(null,e);return}e.logout(),h(function(r,o){r?n(r):C(function(u){p(u,o,n)})})},e.authenticateAsync=function(){return e.authenticated()?Promise.resolve(e):(e.logout(),new Promise(function(n,r){var o=function(u,i){u?r(u):n(i)};h(function(u,i){u?o(u):C(function(l){return p(l,i,o)})})}))};function h(n){if(t.singlepage){n(null,void 0);return}var r=550,o=610,u=[["width",r],["height",o],["left",window.screen.width/2-r/2],["top",window.screen.height/2-o/2]].map(function(s){return s.join("=")}).join(","),i=window.open("about:blank","oauth_window",u);if(i)n(null,i);else{var l=new Error("Popup was blocked");l.status="popup-blocked",n(l)}}function p(n,r,o){var u=W(),i=t.url+"/oauth2/authorize?"+I({client_id:t.client_id,redirect_uri:t.redirect_uri,response_type:"code",scope:t.scope,state:u,code_challenge:n.code_challenge,code_challenge_method:n.code_challenge_method,locale:t.locale||""});if(t.singlepage){if(c.isMocked){var l=new Error("localStorage unavailable, but required in singlepage mode");l.status="pkce-localstorage-unavailable",o(l);return}var s=y(window.location.search.slice(1));s.code?e.bootstrapToken(s.code,o):(a("oauth2_state",u),a("oauth2_pkce_code_verifier",n.code_verifier),window.location=i)}else e.popupWindow=r,r.location=i;window.authComplete=function(_){var g=y(_.split("?")[1]);if(g.state!==u){var v=new Error("Invalid state");v.status="invalid-state",o(v);return}f(g.code,n.code_verifier,w),delete window.authComplete};function w(_,g){if(t.done(),_){o(_);return}var v=JSON.parse(g.response);a("oauth2_access_token",v.access_token),o(null,e)}}function f(n,r,o){var u=t.url+"/oauth2/token?"+I({client_id:t.client_id,redirect_uri:t.redirect_uri,grant_type:"authorization_code",code:n,code_verifier:r});e.rawxhr("POST",u,null,null,null,o),t.loading()}return e.bringPopupWindowToFront=function(){var n=!1;try{e.popupWindow&&!e.popupWindow.closed&&(e.popupWindow.focus(),n=!0)}catch(r){}return n},e.bootstrapToken=function(n,r){var o=a("oauth2_state");a("oauth2_state","");var u=y(window.location.search.slice(1));if(u.state!==o){var i=new Error("Invalid state");i.status="invalid-state",r(i);return}var l=a("oauth2_pkce_code_verifier");a("oauth2_pkce_code_verifier",""),f(n,l,s);function s(w,_){if(t.done(),w){r(w);return}var g=JSON.parse(_.response);a("oauth2_access_token",g.access_token),r(null,e)}},e.fetch=function(n,r){if(e.authenticated())return o();return t.auto?e.authenticateAsync().then(o):Promise.reject(new Error("not authenticated"));function o(){return r=r||{},r.headers||(r.headers={"Content-Type":"application/x-www-form-urlencoded"}),r.headers.Authorization="Bearer "+a("oauth2_access_token"),fetch(n,r)}},e.xhr=function(n,r){if(e.authenticated())return o();if(t.auto){e.authenticate(o);return}else{r("not authenticated",null);return}function o(){var i=n.prefix!==!1?t.apiUrl+n.path:n.path;return e.rawxhr(n.method,i,a("oauth2_access_token"),n.content,n.headers,u)}function u(i,l){i?r(i):l.responseXML?r(i,l.responseXML):r(i,l.response)}},e.rawxhr=function(n,r,o,u,i,l){i=i||{"Content-Type":"application/x-www-form-urlencoded"},o&&(i.Authorization="Bearer "+o);var s=new XMLHttpRequest;s.onreadystatechange=function(){s.readyState===4&&s.status!==0&&(/^20\d$/.test(s.status)?l(null,s):l(s,null))},s.onerror=function(_){l(_,null)},s.open(n,r,!0);for(var w in i)s.setRequestHeader(w,i[w]);return s.send(u),s},e.preauth=function(n){return n&&n.access_token&&a("oauth2_access_token",n.access_token),e},e.options=function(n){return arguments.length?(t=n,t.apiUrl=t.apiUrl||"https://api.openstreetmap.org",t.url=t.url||"https://www.openstreetmap.org",t.auto=t.auto||!1,t.singlepage=t.singlepage||!1,t.loading=t.loading||function(){},t.done=t.done||function(){},e.preauth(t)):t},e.options(t),e}function I(t){return Object.keys(t).filter(function(e){return t[e]!==void 0}).sort().map(function(e){return encodeURIComponent(e)+"="+encodeURIComponent(t[e])}).join("&")}function y(t){for(var e=0;e<t.length&&(t[e]==="?"||t[e]==="#");)e++;return t=t.slice(e),t.split("&").reduce(function(c,d){var a=d.split("=");return a.length===2&&(c[a[0]]=decodeURIComponent(a[1])),c},{})}function S(){return window&&window.crypto&&window.crypto.getRandomValues&&window.crypto.subtle&&window.crypto.subtle.digest}function C(t){var e;if(S()){var c=window.crypto.getRandomValues(new Uint8Array(32));e=A(c.buffer);var d=Uint8Array.from(Array.from(e).map(function(p){return p.charCodeAt(0)}));window.crypto.subtle.digest("SHA-256",d).then(function(p){var f=A(p);t({code_challenge:f,code_verifier:e,code_challenge_method:"S256"})})}else{var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";e="";for(var h=0;h<64;h++)e+=a[Math.floor(Math.random()*a.length)];t({code_verifier:e,code_challenge:e,code_challenge_method:"plain"})}}function W(){var t;if(S()){var e=window.crypto.getRandomValues(new Uint8Array(32));t=A(e.buffer)}else{var c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";t="";for(var d=0;d<64;d++)t+=c[Math.floor(Math.random()*c.length)]}return t}function A(t){return btoa(String.fromCharCode.apply(null,new Uint8Array(t))).replace(/\//g,"_").replace(/\+/g,"-").replace(/[=]/g,"")}return R(E);})();
//# sourceMappingURL=osm-auth.iife.js.map
