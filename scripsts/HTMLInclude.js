/*
 HTMLInclude.js
 A tiny JavaScript include system
 https://github.com/Paul-Browne/HTMLInclude
*/

document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll("[data-include]");

  includes.forEach(function (element) {
    const file = element.getAttribute("data-include");

    if (file) {
      fetch(file)
        .then(response => {
          if (!response.ok) {
            throw new Error("File not found: " + file);
          }
          return response.text();
        })
        .then(data => {
          // Variable replacement (for {{title}} etc)
          let output = data;
          for (let attr of element.attributes) {
            if (attr.name.startsWith("data-") && attr.name !== "data-include") {
              const key = attr.name.replace("data-", "");
              const value = attr.value;
              const regex = new RegExp("{{" + key + "}}", "g");
              output = output.replace(regex, value);
            }
          }

          element.innerHTML = output;
        })
        .catch(error => {
          element.innerHTML = "<strong style='color:red'>Include failed:</strong> " + error.message;
        });
    }
  });
});