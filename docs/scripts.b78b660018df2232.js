(()=>{"use strict";const c=localStorage.getItem("theme"),a=()=>c||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),r=function(e){"auto"===e&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.setAttribute("data-bs-theme","dark"):document.documentElement.setAttribute("data-bs-theme",e)};r(a());const o=e=>{const t=document.querySelector(".theme-icon-active use"),s=document.querySelector(`[data-bs-theme-value="${e}"]`),d=s.querySelector("svg use").getAttribute("href");document.querySelectorAll("[data-bs-theme-value]").forEach(n=>{n.classList.remove("active")}),s.classList.add("active"),t.setAttribute("href",d)};window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{("light"!==c||"dark"!==c)&&r(a())}),window.addEventListener("load",()=>{o(a()),document.querySelectorAll("[data-bs-theme-value]").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-bs-theme-value");localStorage.setItem("theme",t),r(t),o(t)})})})})();