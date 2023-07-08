// Open the help link on extension install
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        //open help page
        var url = chrome.runtime.getManifest().homepage_url;
        if (url){
        chrome.tabs.create( { url } );
        }
    }
  });
  
  // Open a link on extension uninstall
  chrome.runtime.setUninstallURL('https://openaddons.com/extension-removed/');
  