class Loader {
    constructor(catalog) {
        this.catalog = catalog;
        this.overall = this.catalog.length;
        this.loading = true;
        this.counter = 0;
        this.content = this.#scanner(this.catalog, this.#extract.bind(this));
    }

    #scanner(paths, loadFile) {
        let structure = {};

        paths.forEach((path) => {
            const parts = path.split('/');

            if (parts[0] === 'resource') parts.shift();
            let current = structure;

            for (let i = 0; i < parts.length - 1; i++) {
                current[parts[i]] = current[parts[i]] || {};
                current = current[parts[i]];
            }

            const fileName = parts[parts.length - 1].split('.')[0];

            const match = fileName.match(/_(\d+)$/);
            if (match) {
                const index = parseInt(match[1], 10),
                    baseName = fileName.split('_')[0];

                if (!Array.isArray(current[baseName])) current[baseName] = [];
                current[baseName][index] = loadFile(path);
            } else {
                current[fileName] = loadFile(path);
            }
        });

        console.log('struct:', structure);

        return structure;
    }

    #extract(path) {
        const loaders = {
            '.png': loadImage,
            '.ttf': loadFont,
        };

        const ext = path.slice(path.lastIndexOf('.')).toLowerCase();
        if (loaders[ext]) {
            return loaders[ext](path, () => {
                console.log(`Loading resource: ${path}`);
                this.#fetched();
            });
        }

        console.warn(`Unexpected file type: ${path}`);
        return null;
    }

    #fetched() {
        this.counter++;
        console.log(`Loaded: ${this.counter}/${this.overall}`);
        this.loading = this.counter < this.overall;
    }
}