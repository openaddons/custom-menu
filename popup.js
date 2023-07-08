document.addEventListener("DOMContentLoaded", function() {

  const tabs = Array.from(document.querySelectorAll(".tab"));
  const tabContents = Array.from(document.querySelectorAll(".tab-content"));

  tabs.forEach(function(tab) {
    tab.addEventListener("click", function(event) {
      event.preventDefault();
      loadMenuState();
      const targetTab = event.target.getAttribute("data-tab");

      tabs.forEach(function(tab) {
        tab.classList.remove("active");
      });

      tab.classList.add("active");

      tabContents.forEach(function(content) {
        content.classList.remove("active");
      });

      document.getElementById(targetTab).classList.add("active");
    });
  });

  const defaultTab = document.querySelector(".tab:first-child");
  defaultTab.classList.add("active");

  const menuTable = document.getElementById("menu-table");
  const menu = document.getElementById("menu");
  const addBtn = document.getElementById("add-btn");
  const helpBtn = document.getElementById("help-btn");
  const resetBtn = document.getElementById("reset-btn");

  loadMenuState();

  menuTable.addEventListener("input", function() {
    saveMenuState();
  });

  function addMenuItem() {
    const newRow = document.createElement("tr");
    newRow.classList.add("menu-item");
    newRow.innerHTML = `
      <td contenteditable="true">New Menu Item</td>
      <td contenteditable="true">http://example.com</td>
      <td>
        <span class="delete-btn">Delete</span>
        <span class="icon"> &#8645;</span>
      </td>
    `;
    menuTable.querySelector("tbody").appendChild(newRow);
    saveMenuState();
  }

  function loadMenuItem(title,url) {
    const newRow = document.createElement("tr");
    newRow.classList.add("menu-item");
    newRow.innerHTML = `
      <td contenteditable="true">`+title+`</td>
      <td contenteditable="true">`+url+`</td>
      <td>
        <span class="delete-btn">Delete</span>
        <span class="icon"> &#8645;</span>
      </td>
    `;
    menuTable.querySelector("tbody").appendChild(newRow);

    const newMenuRow = document.createElement("tr");
    newMenuRow.innerHTML = `
      <td contenteditable="false">
        <a class="mnu" href="#" url="`+url+`" >`+title+`</a>
      </td>`; //&#x2197;
    menu.querySelector("tbody").appendChild(newMenuRow);
  }

  function deleteMenuItem(row) {
    if (row.parentNode) {
      row.parentNode.removeChild(row);
    }
    saveMenuState();
  }

  function updateDeleteButtons() {
    const deleteButtons = Array.from(document.querySelectorAll(".delete-btn"));
    deleteButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        const row = button.parentNode.parentNode;
        deleteMenuItem(row);
        saveMenuState();
      });
    });
  }

  new Sortable(menuTable.querySelector("tbody"), {
    handle: ".menu-item",
    animation: 150,
    onEnd: function() {
      saveMenuState();
    },
    onUnchoose: function() {
      saveMenuState();
    },
    onEnd: function() {
      saveMenuState();
    },
    onUpdate: function() {
      saveMenuState();
    },
    onSort: function() {
      saveMenuState();
    },
    onRemove: function() {
      saveMenuState();
    },
    onChange: function() {
      saveMenuState();
    }

  });

  addBtn.addEventListener("click", function() {
    addMenuItem();
    updateDeleteButtons();
  });
  helpBtn.addEventListener("click", function() {
    //open help page (read from manifest)
    var url = chrome.runtime.getManifest().homepage_url;
    if (url){
      chrome.tabs.create( { url } );
    }
  });
  resetBtn.addEventListener("click", function() {
    menu.querySelector("tbody").innerHTML='';
    menuTable.querySelector("tbody").innerHTML='';
      setDefaults();
  });
  function setDefaults(){
        //now populate the menu with defaults
        loadMenuItem('New Tab','chrome://newtab');
        loadMenuItem('Chrome Settings','chrome://settings');
        loadMenuItem('Downloads','chrome://downloads');
        loadMenuItem('Extensions','chrome://extensions');
        loadMenuItem('google.com/ncr','https://google.com/ncr');
        loadMenuItem('Help',chrome.runtime.getManifest().homepage_url);
        saveMenuState() ;
        updateDeleteButtons();
        attachLinks();
  }

  function saveMenuState() {
    const menuItems = Array.from(menuTable.querySelectorAll(".menu-item"));
    const menuState = menuItems.map(function(item) {
      const title = item.querySelector("td:nth-child(1)").innerText;
      const url = item.querySelector("td:nth-child(2)").innerText;
      return { title, url };
    });
    localStorage.setItem("menuState", JSON.stringify(menuState));
   }
  
  function loadMenuState() {
    const savedMenuState = localStorage.getItem("menuState");
       //on change, fix menu itself
       menu.querySelector("tbody").innerHTML='';
       menuTable.querySelector("tbody").innerHTML='';

    if (savedMenuState) {
      const menuState = JSON.parse(savedMenuState);
      menuState.forEach(function(item) {
        loadMenuItem(item.title, item.url);
      });
    } else {
      //only on first start, create default menu and set installed flag
      //check if flag exists
      const installed = localStorage.getItem("installed");
      if(installed){
        //do nothing
      } else {
        localStorage.setItem("installed", JSON.stringify("yes"));
        setDefaults();
      }
    }
    updateDeleteButtons();
    attachLinks();
  }

  updateDeleteButtons();
  
 function attachLinks() {
    const links = Array.from(document.querySelectorAll("a.mnu"));

    links.forEach(function(link) {
      link.addEventListener("click", function(event) {
        event.preventDefault();
        const url = link.getAttribute("url");
        if (url) {
          chrome.tabs.create({ url });
        }
      });
    });
  }
  // attachLinks();
});


