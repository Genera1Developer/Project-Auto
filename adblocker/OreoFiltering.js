(async()=>{let t=await fetch("/adblocker/filters/easylist.txt").then(t=>t.text()),e=t.split("\n").filter(t=>t.trim()&&"!"!==t.trim()[0]),r=e.map(t=>t.replace(/([.?+^$[\]\\(){}|-])/g,"\\$1").replace(/\*/g,".*?").replace(/^@@\|\|/,".*://").replace(/^\|\|/,"^https?://").replace(/^@@/,"^https?://(?!").replace(/^\|/,"^").replace(/\|$/,"$")),n=new RegExp(r.join("|"),"i"),o=new Set(["img","script","iframe","object","embed","video","audio","source","link","style"]);function a(t){return n.test(t)}function c(t){let e=new URL(t.src||"",location.href).href;a(e)&&(t.remove(),t.src="",t.srcset="",t.href="data:,")}function l(t){let e=new URL(t.detail.url||"",location.href).href;a(e)&&t.preventDefault()}function i(){for(let t of document.querySelectorAll(o.size?Array.from(o).join(","):"*"))c(t)}function s(t){if("object"==typeof t&&"src"in t){let e=new URL(t.src||"",location.href).href;a(e)&&(t.src="",t.srcset="",t.href="data:,")}}function u(t){if("string"==typeof t){let e=new URL(t,location.href).href;a(e)&&(t="data:,")}}function f(t){return a(t.url)?Promise.reject({type:"filtering",url:t.url}):fetch(t.url,t)}function p(){MutationObserver&&(new MutationObserver(t=>{for(let e of t)for(let t of e.addedNodes)1===t.nodeType&&s(t)})).observe(document,{childList:!0,subtree:!0}),window.XMLHttpRequest&&(XMLHttpRequest.prototype.open=new Proxy(XMLHttpRequest.prototype.open,{apply:(t,e,r)=>{if(a(r[1]))return;return t.apply(e,r)}})),window.fetch&&(window.fetch=new Proxy(fetch,{apply:(t,e,r)=>f(r[0])})),EventTarget.prototype.addEventListener&&(EventTarget.prototype.addEventListener=new Proxy(EventTarget.prototype.addEventListener,{apply:(t,e,r)=>{if("beforescriptexecute"===r[0]||"beforeload"===r[0]){if(a(r[1]))return}return t.apply(e,r)}})),document.addEventListener("DOMContentLoaded",i),document.addEventListener("beforeload",l,!0),document.addEventListener("beforescriptexecute",l,!0),window.open=new Proxy(window.open,{apply:(t,e,r)=>a(r[0])?null:t.apply(e,r)})}p()})();
// haha get obsfucated monkey <3
// if you see this, im gonna ping you blanky, <3