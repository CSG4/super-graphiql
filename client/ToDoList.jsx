import React, {Component} from 'react';
import Item from './Item.jsx';

class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: []
        }; 
        this.getTasks = this.getTasks.bind(this);
        this.addRand = this.addRand.bind(this);
        this.rmTask = this.rmTask.bind(this);
    }

    componentDidMount() {
        this.getTasks();
    }

    getTasks() {
        fetch('/getTasks').then((res) => {
            if(res.status < 200 || res.status > 300) console.log(res.status);
            return res.json();
        }).then((data) => {
            this.setState({ tasks: data });
        });
    }

    addRand() {
        let randTask = {
            item: "Task #" + Math.floor(Math.random()*10920)
        };

        async function postTask(payload) {
               let data = (await fetch('/postTask', {
                    method: 'post',
                    body: JSON.stringify(payload),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })).json();

                return await data;
        }

       postTask(randTask).then((data) => {
           let newTaskList = [...this.state.tasks];
           newTaskList.push(data);
           this.setState({ tasks: newTaskList });
       });
    }

    rmTask(index) {
        let newTaskList = [...this.state.tasks];
        let { _id } = newTaskList.splice(index, 1)[0];
        
        fetch('/deleteTask', {
            method: 'post',
            body: JSON.stringify({ id: _id }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(() => {
            this.setState({ tasks: newTaskList });
        });
    }

    render() {
        let items = this.state.tasks.map((task, i) => 
            <Item key={i} id={i} item={task.item} rmTask={this.rmTask} />
        );

        return (
            <div>
                <button className="btn btn-primary" onClick={this.addRand}>New Random Task</ button>
                <ul>
                    {items}
                </ ul>
            </ div>
        )
    }
    

}


export default ToDoList;