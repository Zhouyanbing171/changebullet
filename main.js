require('runtime-adapter/ral.js');
require('runtime-adapter/web-adapter.js');


// Polyfills bundle.
require("src/polyfills.bundle.js");


// SystemJS support.
window.self = window;
require("src/system.bundle.js");

const importMapJson = ral.getFileSystemManager().readFileSync("src/import-map.json", 'utf8');
const importMap = JSON.parse(importMapJson);
System.warmup({
    importMap,
    importMapUrl: 'src/import-map.json',
    defaultHandler: (urlNoSchema) => {
        require('.' + urlNoSchema);
    },
});

System.import('./application.js').then(({ Application }) => {
    return new Application();
}).then((application) => {
    return onApplicationCreated(application);
}).catch((err) => {
    console.error(err);
});

function onApplicationCreated(application) {
    return System.import('cc').then((cc) => {
        require('runtime-adapter/engine-adapter.js');
        var orientation = '{"orientation": 1}';
        loadRuntime().callCustomCommand({
            success(msg) {
                if(1 === 0) {
                    window.orientation = 90;
                }
            },
            fail(msg) {}
        }, 'setOrientation', orientation);
        return application.init(cc);
    }).then(() => application.start());
}
