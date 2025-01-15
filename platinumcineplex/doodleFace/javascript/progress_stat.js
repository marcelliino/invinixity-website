class ProgressStat {
    #progress;
    #pulse;

    constructor(totalFiles) {
        this.total = totalFiles;
        this.current = 0;
        this.smoothed = 0;
        this.#progress = 0;

        this.display = {
            bar: this.#displayBar.bind(this),
            circular: this.#displayCircular.bind(this),
            percentage: this.#displayPercentage.bind(this),
            counter: this.#displayCounter.bind(this),
        };
    }

    update(loaded, smoothFactor = 0.125) {
        loaded = max(0, loaded);
        smoothFactor = min(1, max(0, smoothFactor));

        this.current = Math.min(loaded, this.total);
        this.smoothed = lerp(this.smoothed, this.current, smoothFactor);
        this.#progress = this.smoothed / this.total;
        this.#pulse = cos(millis() / 500 * PI);
    }

    #displayBar(x, y, length, thickness = length / 16) {

        push();
        translate(x - length / 2, y - thickness / 2);

        noStroke();
        fill(255, 125);
        rect(-thickness / 8, -thickness / 8,
            length + thickness / 4, thickness / 0.8,
            thickness / 1.25);

        fill(255, 155 + 50 * this.#pulse);
        rect(0, 0, length * this.#progress, thickness, thickness / 2);
        pop();
    }

    #displayCircular(x, y, radius, thickness = radius / 4) {
        const
            angle = this.#progress * TWO_PI,
            diameter = radius * 2;

        push();
        noFill();

        strokeWeight(thickness / 0.8);
        stroke(255, 125);
        ellipse(x, y, diameter);

        strokeWeight(thickness);
        stroke(255, 155 + 50 * this.#pulse);
        arc(x, y, diameter, diameter, -HALF_PI, -HALF_PI + angle);
        pop();
    }

    #displayPercentage(x, y) {
        const percentage = floor(this.#progress * 100);

        push();
        fill(255, 155 + 50 * this.#pulse);
        noStroke();
        text(`${percentage}%`, x, y);
        pop();
    }

    #displayCounter(x, y) {
        push();
        fill(255, 155 + 50 * this.#pulse);
        noStroke();
        text(`${floor(this.current)}/${this.total}`, x, y);
        pop();
    }
}