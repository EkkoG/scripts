// ==UserScript== 
// @name         Show Ranking Table
// @namespace    http://tampermonkey.net/   
// @version      1.0
// @description  Add a floating button to show ranking table ordered by number  
// @author       You  
// @match        https://lego.mgtv.com/act/3_8_3/20230414cf2023.html?act_name=20230414cf2023&share_id=0HPTWD9XKBM&source=share_20230414cf2023  
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
                    
        // Get numbers and remove non-ascii chars 
        var finalData = [];
        for (let i = 0; i < numbers.snapshotLength; i++) {
            var num = numbers.snapshotItem(i).textContent;
            num = num.replace(/[^0-9\.]/g, "");
            finalData.push({
                name: names.snapshotItem(i).textContent,
                num: parseInt(num),
            });
        }

        
        // Sort numbers in descending order
        finalData.sort((a, b) => b.num - a.num);
        const max = Math.max(...finalData.map(item => item.num));
        
        // Create header row
        var header = document.createElement("tr");
        var header_1 = document.createElement("th");
        header_1.textContent = "排名";
        var header_2 = document.createElement("th");
        header_2.textContent = "名字";
        var header_3 = document.createElement("th");
        header_3.textContent = "票数";
        var header_4 = document.createElement("th");
        header_4.textContent = "和第一名相比";        
        header.append(header_1);
        header.append(header_2);
        header.append(header_3);
        header.append(header_4);        
        
        // Create table rows 
        var rows = [];
        rows.push(header);
        for (let i = 0; i < finalData.length; i++) {
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.textContent = i + 1;  
            var td2 = document.createElement("td");
            td2.textContent = finalData[i].name;
            var td3 = document.createElement("td");  
            td3.textContent = finalData[i].num;

            var td4 = document.createElement("td");
            td4.textContent = Math.round(finalData[i].num / max * 100) + "%";
            
            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tr.append(td4);
        
            rows.push(tr);
        }        
        
        // Sort rows by descending number
        rows.sort(function(a, b) {
            var aNum = parseInt(a.children[2].textContent);
            var bNum = parseInt(b.children[2].textContent);
            return bNum - aNum; 
        });  
        
        var table = document.createElement("table");
        for (let row of rows) {
            table.append(row);
        }  
        
        var div = document.createElement("div");
        div.style.cssText = "position: fixed; top: 0; left: 0; background: #fff; z-index: 999;";
        div.append(table);
        document.body.append(div);
    });  
})();