class RotateCube {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.theta = 0;
    }
    
    update(dt) {
        this.theta += dt/300;
    }
    
    render(ctx) {
        if (image.cube) {
            ctx.translate(this.x, this.y)
            ctx.rotate(this.theta);
            ctx.drawImage(image.cube, -150, -150, 300, 300);
            ctx.rotate(-this.theta);
            ctx.translate(-this.x, -this.y);
        }
    }
}

class ColorGrid {
    constructor(dx, dy) {
        this.grid = [];
        for (var x = 0; x < 17; x++) {
            this.grid.push([]);
            for (var y = 0; y < 10; y++) {
                this.grid[x].push(randColor());
            }
        }
        this.x = 0;
        this.y = 0;
        this.dx = dx;
        this.dy = dy;
    }
    
    update(dt) {
        this.x += this.dx * dt / 1000;
        this.y += this.dy * dt / 1000;
        if (this.x >= 0) {
            this.x -= 100;
            for (var y = 0; y < this.grid[0].length; y++) {
                for (var x = this.grid.length-1; x >= 0; x--) {
                    if (x == 0) {
                        this.grid[x][y] = randColor();
                    } else {
                        this.grid[x][y] = this.grid[x-1][y];
                    }
                }
            }
        }
        if (this.y >= 0) {
            this.y -= 100;
            for (var x = 0; x < this.grid.length; x++) {
                for (var y = this.grid[x].length - 1; y >= 0; y--) {
                    if (y == 0) {
                        this.grid[x][y] = randColor();
                    } else {
                        this.grid[x][y] = this.grid[x][y-1];
                    }
                }
            }
        } else if (this.y <= -100) {
            this.y += 100;
            for (var x = 0; x < this.grid.length; x++) {
                for (var y = 0; y < this.grid[x].length; y++) {
                    if (y == this.grid[x].length - 1) {
                        this.grid[x][y] = randColor();
                    } else {
                        this.grid[x][y] = this.grid[x][y+1];
                    }
                }
            }
        }
    }
    
    render(ctx) {
        for (var x = 0; x < this.grid.length; x++) {
            for (var y = 0; y < this.grid[x].length; y++) {
                ctx.fillStyle = this.grid[x][y];
                ctx.fillRect(this.x + x * 100, this.y + y * 100, 100, 100);
            }
        }
    }
}