// ==UserScript==
// @name         Show Ranking Table
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add a floating button to show ranking table ordered by number
// @author       You
// @match        https://lego.mgtv.com/act/3_8_3/*
// @grant        none
// ==/UserScript==

(function() {
  // Add button
  var button = document.createElement("button");
  button.textContent = "Show Ranking";
  button.style.cssText = "position: fixed; right: 20px; bottom: 20px; z-index: 999;";
  document.body.append(button);

  // On click, show ranking table
  button.addEventListener("click", function() {
      var names = document.evaluate('//*[@id="ship_1"]/div/div/div/div/div/div/div[1]/span',
              document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var numbers = document.evaluate('//*[@id="ship_1"]/div/div/div/div/div/div/div[2]',
              document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var nodes = []
      for (let i = 0; i < numbers.snapshotLength; i++) {
          nodes.push(numbers.snapshotItem(i));
      }
      var maxNum = Math.max.apply(null, Array.from(nodes).map(function(e) {
          var num = e.textContent;
          num = num.replace(/[^0-9\.]/g, "");
          return parseInt(num);
      }));
      // Create table rows
      var rows = [];
      const header = document.createElement("tr");
      const header1 = document.createElement("th");
      header1.textContent = "名字";
      const header2 = document.createElement("th");
      header2.textContent = "票数";
      const header3 = document.createElement("th");
      header3.textContent = "比例";
      header.append(header1);
      header.append(header2);
      header.append(header3);
      
      rows.push(header);
      for (let i = 0; i < names.snapshotLength; i++) {
          var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          td1.textContent = names.snapshotItem(i).textContent;
          var td2 = document.createElement("td");
          var td3 = document.createElement("td");

          // Remove non-ascii chars
          var num = numbers.snapshotItem(i).textContent;
          num = num.replace(/[^0-9\.]/g, "");
          td2.textContent = num;

          // Calculate ratio
          var ratio = parseFloat(num) / maxNum;
          td3.textContent = ratio.toFixed(2);

          tr.append(td1);
          tr.append(td2);
          tr.append(td3);
          rows.push(tr);
      }

      // Sort rows by descending number
      rows.sort(function(a, b) {
          var aNum = parseInt(a.children[1].textContent);
          var bNum = parseInt(b.children[1].textContent);
          return bNum - aNum;
      });

      var table = document.createElement("table");
      for (let row of rows) {
          table.append(row);
      }

      var div = document.createElement("div");
      div.style.cssText = `position: fixed; top: 0; left: 0; background: #fff; z-index: 999;
      `;
      div.append(table);
      document.body.append(div);
  });
})();