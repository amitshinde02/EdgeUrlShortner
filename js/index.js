
function ShowShortUrl(url) {
    var request = new XMLHttpRequest();
    var params = JSON.stringify({ "longUrl": url });
    request.open('POST', 'https://www.googleapis.com/urlshortener/v1/url?key=[YOUR API KEY]', false);
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.setRequestHeader("Content-length", params.length + 100);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            jQuery('#txturl').html(data.id);
            document.getElementById("btnCopy").addEventListener("click", function () {
                copyToClipboard(document.getElementById("txturl"));
            });
        } else {
            jQuery('#txturl').html("Error while retrieving Short URL. Please try again later.");
        }
    };

    request.onerror = function () {
                  
        jQuery('#txturl').html("Error connecting short URL Server.");
    };

    request.send(params);
   // jQuery('#btnCopy').addEventListener("click", OnCopyClick("sample text"));
  
    
};

function OnShowShortUrl() {
    // Get active tab and retrive url and title.
    browser.tabs.query({ currentWindow: true, active: true }, function(tabs){
        var url = tabs[0].url;
        var title = tabs[0].title;
        ShowShortUrl(url);
           
    });
};

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

// Event binding.
document.addEventListener("pageshow", OnShowShortUrl());