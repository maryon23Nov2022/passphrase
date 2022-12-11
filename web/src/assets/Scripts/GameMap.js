import { gameobject } from "./GameObjects";
import { snake } from "./Snake";
import { wall } from "./Wall";

export class gamemap extends gameobject{
    constructor(ctx, parent, store){
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        this.l = 0;
        this.rows = 13;
        this.cols = 14;

        this.walls = [];
        this.walls_cnt = 10;

        this.snakes = [
            new snake({id: 0, color: "#D07FC4", r: this.rows - 2, c: 1}, this),
            new snake({id: 1, color: "#8FC5D7", r: 1, c: this.cols - 2}, this),
        ];
    }

    creat_walls(){
        const g = this.store.state.home.gamemap;

        for(let r = 0; r < this.rows; ++ r){
            for(let c = 0; c < this.cols; ++ c){
                if(g[r][c]) this.walls.push(new wall(r, c, this));
            }
        }
    }

    start(){
        this.creat_walls();
        this.add_listening_events();
    }

    update_size(){
        this.l = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        //"div's" size can get from clientWidth and clientHeight
        this.ctx.canvas.width = this.l * this.cols;
        this.ctx.canvas.height = this.l * this.rows;
    }

    next_step(){    //two snakes be ready for the next round
        for(const snake of this.snakes){
            snake.next_step();
        }
    }

    referee(cell){
        for(const wall of this.walls){
            if(wall.r === cell.r && wall.c === cell.c) return false;
        }
        for(const snake of this.snakes){
            let k = snake.cells.length;
            if(!snake.check_tail_increasing()) -- k;
            for(let i = 0; i < k; ++ i){
                if(snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) return false;
            }
        }
        return true;
    }

    update(){
        this.update_size();
        if(this.check_ready()){
            this.next_step();
        }
        this.render();
    }

    render(){
        const color_even = "#818181", color_odd = "#919191";
        for(let i = 0; i < this.rows; ++ i){
            for(let j = 0; j < this.cols; ++ j){
                if(i + j & 1) this.ctx.fillStyle = color_odd;
                else this.ctx.fillStyle = color_even;
                this.ctx.fillRect(j * this.l, i * this.l, this.l, this.l);
            }
        }
    }

    check_ready(){
        for(const snake of this.snakes){
            if(snake.status !== "idle") return false;
            if(snake.direct === -1) return false;
        }
        return true;
    }

    add_listening_events(){
        this.ctx.canvas.focus();

        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if(e.key === 'w') snake0.set_direct(0);
            else if(e.key === 'd') snake0.set_direct(1);
            else if(e.key === 's') snake0.set_direct(2);
            else if(e.key === 'a') snake0.set_direct(3);
            else if(e.key === 'ArrowUp') snake1.set_direct(0);
            else if(e.key === 'ArrowRight') snake1.set_direct(1);
            else if(e.key === 'ArrowDown') snake1.set_direct(2);
            else if(e.key === 'ArrowLeft') snake1.set_direct(3);
        })
    }
}