class ProgressStat {
    constructor(totalFiles) {
        this.total = totalFiles;
        this.current = 0;
        this.smoothed = 0;

        this.display = {
            bar: this.#displayBar.bind(this),
            circular: this.#displayCircular.bind(this),
            percentage: this.#displayPercentage.bind(this),
            counter: this.#displayCounter.bind(this),
        };
    }

    update(loaded, smoothFactor = 0.125) {
        this.current = Math.min(loaded, this.total);
        this.smoothed = lerp(this.smoothed, this.current, smoothFactor);
    }

    #displayBar(x, y, length, thickness = length / 16) {
        const progress = this.smoothed / this.total;

        push();
        translate(x - length / 2, y - thickness / 2);

        noStroke();
        fill(255, 125);
        rect(-thickness / 8, -thickness / 8,
            length + thickness / 8, thickness / 0.8,
            thickness / 1.25);

        fill(255);
        rect(0, 0, length * progress, thickness, thickness / 2);
        pop();
    }

    #displayCircular(x, y, radius, thickness = radius / 4) {
        const
            progress = this.smoothed / this.total,
            angle = progress * TWO_PI,
            diameter = radius * 2;

        push();
        noFill();

        strokeWeight(thickness / 0.8);
        stroke(255, 125);
        ellipse(x, y, diameter);

        strokeWeight(thickness);
        stroke(255);
        arc(x, y, diameter, diameter, -HALF_PI, -HALF_PI + angle);
        pop();
    }

    #displayPercentage(x, y) {
        const percentage = floor((this.smoothed / this.total) * 100);

        push();
        fill(255);
        noStroke();
        text(`${percentage}%`, x, y);
        pop();
    }

    #displayCounter(x, y) {
        push();
        fill(255);
        noStroke();
        text(`${floor(this.current)}/${this.total}`, x, y);
        pop();
    }
}