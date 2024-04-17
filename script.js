function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function toggleOptionalSettings() {
    var dropdown = document.querySelector('.optional-settings-dropdown');
    dropdown.classList.toggle('show');
}

function toggleMainScriptDiv() {
    var packType = document.getElementById('packType').value;
    var mainScriptDiv = document.getElementById('mainScriptDiv');

    if (packType === "behavior-with-script") {
        mainScriptDiv.style.display = "block";
    } else {
        mainScriptDiv.style.display = "none";
    }
}

function generateManifest() {
    var nameAddon = document.getElementById('nameAddon').value;
    var author = document.getElementById('author').value;
    var metadataAuthors = document.getElementById('metadataAuthors').value;
    var metadataURL = document.getElementById('metadataURL').value;
    var mainScript = document.getElementById('mainScript').value;
    var packType = document.getElementById('packType').value;

    if (!nameAddon || !author || (packType === "behavior-with-script" && !mainScript)) {
        alert("All fields must be filled in before generating manifest!");
        return;
    }

    var generateButton = document.querySelector('input[type="button"]');
    generateButton.style.animation = 'buttonClick 0.3s ease';
    setTimeout(function() {
        generateButton.style.animation = '';
    }, 300);

    var manifest = {
        "format_version": 2,
        "header": {
            "name": nameAddon,
            "description": author,
            "uuid": generateUUID(),
            "version": [1, 0, 0],
            "min_engine_version": [1, 20, 70],
            "metadata": {}
        },
        "modules": []
    };

    if (metadataAuthors) {
        manifest.header.metadata.authors = metadataAuthors;
    }

    if (metadataURL) {
        manifest.header.metadata.url = metadataURL;
    }

    if (packType === "behavior-without-script") {
        manifest.modules.push({
            "type": "data",
            "description": "",
            "uuid": generateUUID(),
            "version": [1, 0, 0]
        });
    }

    if (packType === "behavior-with-script") {
        manifest.modules.push({
            "description": "",
            "uuid": generateUUID(),
            "version": "1.1.0-beta",
            "type": "script",
            "language": "javascript",
            "entry": mainScript
        });
        manifest.dependencies = [
            {
                "module_name": "@minecraft/server",
                "version": "1.10.0-beta"
            },
            {
                "module_name": "@minecraft/server-ui",
                "version": "1.2.0-beta"
            }
        ];
    }

    if (packType === "resource") {
        manifest.modules.push({
            "type": "resources",
            "uuid": generateUUID(),
            "version": [1, 0, 0]
        });
    }
    
    if (packType === "skin") {
        manifest.modules.push({
            "type": "skin_pack",
            "uuid": generateUUID(),
            "version": [1, 0, 0]
        });
    }

    var result = JSON.stringify(manifest, null, 4);
    document.getElementById('result').innerText = result;

    var copyButton = document.getElementById('copyButton');
    copyButton.style.display = 'inline';

    var downloadLink = document.getElementById('downloadLink');
    downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(result);
    downloadLink.style.display = 'inline';
}

function copyManifest() {
    var copyText = document.getElementById('result').innerText;
    var textarea = document.createElement("textarea");
    textarea.value = copyText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Manifest copied to clipboard!');
}
