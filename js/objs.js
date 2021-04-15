class RotateCube {
    constructor(x, y, dtheta) {
        this.x = x;
        this.y = y;
        this.theta = 0;
        this.dtheta = dtheta;
    }
    
    update(dt) {
        this.theta += this.dtheta * dt/300;
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
        } else if (this.x <= -100) {
            this.x += 100;
            for (var y = 0; y < this.grid[0].length; y++) {
                for (var x = 0; x < this.grid.length; x++) {
                    if (x == this.grid.length - 1) {
                        this.grid[x][y] = randColor();
                    } else {
                        this.grid[x][y] = this.grid[x+1][y];
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

class RotatingColorGrid extends ColorGrid {
    constructor(dx, dy) {
        super(dx, dy);
        this.grid = [];
        for (var x = 0; x < 30; x++) {
            this.grid.push([]);
            for (var y = 0; y < 30; y++) {
                this.grid[x].push(randColor());
            }
        }
        this.theta = 0;
    }
    
    update(dt) {
        super.update(dt);
        this.theta += dt / 30000;
    }
    
    render(ctx) {
        ctx.rotate(this.theta);
        ctx.translate(-1500, -1500);
        ctx.translate(canvas.width/2 * Math.cos(this.theta), -canvas.width/2 * Math.sin(this.theta));
        ctx.translate(canvas.height/2 * Math.sin(this.theta), canvas.height/2 * Math.cos(this.theta));
        super.render(ctx);
        ctx.translate(-canvas.height/2 * Math.sin(this.theta), -canvas.height/2 * Math.cos(this.theta));
        ctx.translate(-canvas.width/2 * Math.cos(this.theta), canvas.width/2 * Math.sin(this.theta));
        ctx.translate(1500, 1500);
        ctx.rotate(-this.theta);
    }
}

class SinusoidColorGrid extends ColorGrid {
    constructor(dx, dy) {
        super(dx, dy);
        this.grid = [];
        for (var x = 0; x < 17; x++) {
            this.grid.push([]);
            for (var y = 0; y < 15; y++) {
                this.grid[x].push(randColor());
            }
        }
        this.theta = 0;
    }
    
    update(dt) {
        super.update(dt);
        this.theta += dt / 1000;
    }
    
    render(ctx) {
        ctx.translate(0, -100 + 100 * Math.sin(this.theta));
        super.render(ctx);
        ctx.translate(0, 100 - 100 * Math.sin(this.theta));
    }
}

class BackgroundCircle {
    constructor() {
        this.pickRandomTrajectory();
    }
    
    pickRandomTrajectory() {
        var theta = randFloat(0, 2 * Math.PI);
        this.dx = Math.cos(theta);
        this.dy = Math.sin(theta);
        this.x = canvas.width/2 - this.dx * canvas.width;
        this.y = canvas.height/2 - this.dy * canvas.height;
        this.x += randFloat(-400, 400);
        this.y += randFloat(-400, 400);
        var speed = randFloat(1, 3);
        this.dx *= speed;
        this.dy *= speed;
        this.r = randFloat(20, 200);
        this.color = randColor();
    }
    
    update(dt) {
        this.x += this.dx * dt / 10;
        this.y += this.dy * dt / 10;
        if (Math.pow(this.x - canvas.width/2, 2) + Math.pow(this.y - canvas.height/2, 2) >= Math.pow(canvas.width + canvas.height, 2)) {
            this.pickRandomTrajectory();
        }
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}