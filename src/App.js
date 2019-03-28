import React, { useState, useRef, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import uuid4 from 'uuid4';
import StartBlock from './components/StartBlock';
import StageBlock from './components/StageBlock';
import AddStage from './components/AddStage';
import './App.scss';

const App = () => {
  const [state, setState] = useState([]);
  const stageFrom = useRef();
  const stageTo = useRef();

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("Stages"));
    if (Array.isArray(savedState) && savedState.length) {
      setState(savedState);
    }
  }, [])

  const updateState = (data) => {
    localStorage.setItem("Stages", JSON.stringify(data));
    setState(data);
  }

  const onDragStart = (e, index) => {
    stageFrom.current = index;
  }

  const onDragOver = (index) => {
    stageTo.current = index;
    if (stageFrom.current === index) {
      return;
    }
  }

  const onDragEnd = () => {
    const clone = cloneDeep(state);
    const fromIndex = stageFrom.current;
    const toIndex = stageTo.current;
    [clone[fromIndex], clone[toIndex]] = [clone[toIndex], clone[fromIndex]];
    updateState(clone);
  }

  const addStep = (id) => {
    const newState = cloneDeep(state);
    let stage = newState.find(stage => stage.id === id);
    const stageIndex = newState.indexOf(stage);
    const newStep = {
                  id: uuid4(),
                  name: 'Шаг №',
                  resp: '_',
                  time: '0:0',
                  items: [{name: '_', id:uuid4()}]
                };
    stage = {...stage, steps:stage.steps.concat(newStep)}
    newState[stageIndex] = stage;
    updateState(newState);
  }

  const addStage = () => {
    const newStage = {
      name:'_',
      id: uuid4(),
      resp: '_',
      items: [{name:'_', id:uuid4()}],
      steps: []
    }
    const newState = state.concat(newStage);
    updateState(newState)
  }

  const addItem = (stageId, stepId, type) => {
    const newState = cloneDeep(state);
    let stage = newState.find(item => item.id === stageId);
    const stageIndex = newState.indexOf(stage);
    const newItem = { id: uuid4(), name: '№_' };
    if (stepId) {
      const step = stage.steps.find(item => item.id === stepId);
      const stepIndex = stage.steps.indexOf(step);
      stage.steps[stepIndex].items = stage.steps[stepIndex].items.concat(newItem);
      updateState(newState);
    } else {
      stage = {...stage, items:stage.items.concat(newItem)};
      newState[stageIndex] = stage;
      updateState(newState);
    }
  }

  const saveChange = (data, type, stageId) => {
    const newState = cloneDeep(state);
    let stage = newState.find(item => item.id === stageId);
    const stageIndex = newState.indexOf(stage);
    if (type === 'stage') {
      stage = data;
      newState[stageIndex] = stage;
      updateState(newState)
    } else if (type === 'step') {
        const step = stage.steps.find(item => item.id === data.id)
        const stepIndex = stage.steps.indexOf(step);
        stage.steps[stepIndex] = data;
        updateState(newState)
    }
  }

  const deleteStage = (id) => {
    const newState = cloneDeep(state);
    updateState(newState.filter(stage => stage.id !== id));
  }

  const deleteStep = (stageId, stepId) => {
    const newState = cloneDeep(state);
    const stage = newState.find(item => item.id === stageId);
    const stageIndex = newState.indexOf(stage);
    const stageSteps = stage.steps.filter(step => step.id !== stepId);
    newState[stageIndex].steps = stageSteps;
    updateState(newState);
  }

  return (
    <div className="app_conteiner">
      <StartBlock/>
      {
        state.map((stage, index) => (
          <div
            key={stage.id}
            draggable
            onDragStart={e => onDragStart(e, index)}
            onDragOver={() => onDragOver(index)}
            onDragEnd={() => onDragEnd()}
          >
            <StageBlock
              stage={stage}
              addStep={addStep}
              addItem={addItem}
              saveChange={saveChange}
              deleteStage={deleteStage}
              deleteStep={deleteStep}
              />
          </div>
        ))
      }
      <AddStage addStage={addStage}/>
    </div>
  )
}

export default App;
