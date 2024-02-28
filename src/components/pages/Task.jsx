
const Task = (props) => {
  return(
    <li>
      <input type="checkbox" checked={props.is_done} onChange={() => {
        props.toggleIsDone(props.index)
      }} />
      {props.name}
      <span onClick={() => {props.destroyTask(props.id)}} style={{'paddingLeft': 2}}>&times;</span>
    </li>
  );
};
export default Task;