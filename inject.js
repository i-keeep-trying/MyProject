(function() {
    //Save original methods
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    //Hook into the `open` method
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    //Hook into the send method
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("load", function () {
            //Only interceept if the request succeeds
            const data = {
                url: this._url,
                status: this.status,
                response: this.responseText,
            };

            //Dispatch a custom event with the data
            window.dispatchEvent(new CustomEvent("xhrDataFetched", {detail: data }));
        });

        return originalSend.apply(this, arguments);
    };
})();