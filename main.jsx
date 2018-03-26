class Game extends React.Component {
  constructor(props) {
    super(props);
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;
  this.state = {
    generations: 0,
    gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    
  }
    
  }
  
  sizeChange = (val) => {
    switch(val) {
      case '20x10':
        this.cols = 20;
        this.rows = 10;
      break;
      case '50x30':
        this.cols = 50;
        this.rows = 30;
      break;
      default:
          this.cols = 70;
          this.rows = 50;
    }
    this.clear();
  }
  
  selectBox = (row, col) => {
    let gridCopy = arrClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    console.log('click')
    this.setState({gridFull: gridCopy});
  }
  
  seed = () => {
    let gridCopy = arrClone(this.state.gridFull);
    for (let i= 0; i< this.rows; i++) {
      for (let j = 0; j<this.cols; j++) {
        if(Math.floor(Math.random()*4) === 1) {
          gridCopy[i][j] = true;
        } 
      }
    }
    this.setState({gridFull: gridCopy});
  }
  

  
  playButton = () => {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.play, this.speed);
  }
  
  pauseButton = () => {
    clearInterval(this.intervalId);  
  } 
  
  slow = () => {
    this.speed = 1000;
    this.playButton();
  }
  
  fast = () => {
    this.speed = 50;
    this.playButton();
  }
  
  clear = () => {
    clearInterval(this.IntervalId);
    let grid = Array(this.rows).fill().map((item) => Array(this.cols).fill(false));
    this.setState({gridFull: grid, generations: 0});
  }
  
  play = () => {
    let g = this.state.gridFull;
    let g2 = arrClone(this.state.gridFull);
    
    for(let i = 0; i< this.rows; i++) {
      for(let j = 0; j< this.cols; j++) {
        let count = 0;
        if(i>0 && j>0) if (g[i-1][j-1]) count ++;
        if(i>0) if (g[i-1][j]) count++;
        if(i>0 & j< this.cols -1) if (g[i-1][j+1]) count++;
        if(j>0) if (g[i][j-1]) count++;
        if(j<this.cols-1) if (g[i][j+1]) count ++;
        if(i<this.rows-1 && j>0) if (g[i+1][j-1]) count++;
        if(i<this.rows-1) if (g[i+1][j]) count ++;
        if(i<this.rows-1 && j<this.cols-1) if (g[i+1][j+1]) count ++;
        if ((g[i][j]) && (count<2 || count >3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }
    this.setState({gridFull: g2, generations: this.state.generations + 1});
  }
  
componentDidMount(){
  this.seed();
  this.playButton();
}

  render() {
    return (
      <div>
        <h1> Conway's Game of Life</h1>
        <Buttons playButton = {this.playButton} pauseButton = {this.pauseButton} slow = {this.slow} fast={this.fast} clear= {this.clear} seed= {this.seed} sizeChange = {this.sizeChange} />
        <Grid gridFull={this.state.gridFull} rows={this.rows} cols={this.cols} selectBox = {this.selectBox} />
        <h2>Generations: {this.state.generations}</h2>
      </div>
    );
  }
}

class Grid extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    const width = this.props.cols * 16;
    let rowsArr = [];
    let boxClass = "";
    
    for( let i = 0; i< this.props.rows; i ++) {
      for (let j = 0; j< this.props.cols; j ++) {
        let boxId = i + '_' +j;
        boxClass = this.props.gridFull[i][j] ? 'box on' : 'box off';
        rowsArr.push(<Box boxClass = {boxClass} boxId = {boxId} key = {boxId} row = {i} col = {j} selectBox = {this.props.selectBox} />);
      }
    }
    console.log(rowsArr);
    
    return (
      <div className = 'grid' style = {{width: width}}>
       {rowsArr}
      </div>
    
    )
  }
}

class Box extends React.Component {
  
selectBox = () => {
  this.props.selectBox(this.props.row, this.props.col);
}
  
  render() {
    return (
      <div className ={this.props.boxClass} id = {this.props.boxId} onClick = {this.selectBox}>
      </div>
    )
  }
}

class Buttons extends React.Component {
  
  handleSelect = (event) => {
      this.props.sizeChange(event.target.value);
  }
  render() {
     return(
      <div className = 'center'>
        <button onClick = {this.props.playButton}>Play</button>
        <button onClick = {this.props.pauseButton}>Pause</button>
        <button onClick = {this.props.clear}>Clear</button>
        <button onClick = {this.props.slow}>Slow</button>
        <button onClick = {this.props.fast}>Fast</button>
        <button onClick = {this.props.seed}>Seed</button>
        <select title= 'grid_size' id = 'size-menu' onChange={this.handleSelect} value={this.props.gridSize}>
          <option value = '20x10'>20x10</option>
          <option value = '50x30'>50x30</option>
          <option value = '70x50'>70x50</option>
        </select>
      </div>
    )
    }
}

function arrClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}
  
function GOL (){
  return (
  <Game />
)
}

ReactDOM.render(<GOL/>, document.getElementById('App'));
