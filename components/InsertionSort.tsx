import { FC, useState, SetStateAction, Dispatch, memo } from 'react';
import { range, shuffle } from 'lodash';
import Bar from './Bar';
import { getX } from '../util/util';

type TSetArr = Dispatch<SetStateAction<number[]>>;
type TSetIndex = Dispatch<SetStateAction<number>>;
type TSet = Dispatch<SetStateAction<any>>;

const DURATION = 40;
const SIZE = 30;

const getArr = () => shuffle(range(1, SIZE + 1));

const swap = (arr: number[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

const delaySet = (value: any, set: TSet) =>
  new Promise((resolve) => {
    set(value);
    setTimeout(resolve, DURATION);
  });

const sort = async (
  arr: number[],
  setArr: TSetArr,
  setIndexI: TSetIndex,
  setIndexJ: TSetIndex
) => {
  // https://en.wikipedia.org/wiki/Insertion_sort
  let i = 1;
  while (i < arr.length) {
    let j = i;
    await delaySet(j, setIndexJ);
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      await delaySet([...arr], setArr);
      j = j - 1;
      await delaySet(j, setIndexJ);
    }
    i = i + 1;
    await delaySet(i, setIndexI);
  }
};

interface IPropsBoard {
  arr: number[];
}

const areArrEqual = (oldProps: IPropsBoard, props: IPropsBoard) => {
  return oldProps.arr === props.arr;
};

const Board: FC<IPropsBoard> = (props) => {
  const { arr } = props;
  return (
    <div className="board">
      {arr.map((value, i) => {
        console.log('render Bar');
        return <Bar key={i} value={value} index={i} />;
      })}
      <style jsx>{`
        .board {
          width: 100%;
          height: 200px;
          color: white;
          background-color: green;
          font-size: 40px;
          position: relative;
        }
      `}</style>
    </div>
  );
};

const MemorizedBoard = memo(Board, areArrEqual);

export default () => {
  const [onOff, setOnOff] = useState('on');
  const [arr, setArr] = useState(getArr());
  const [indexI, setIndexI] = useState(1);
  const [indexJ, setIndexJ] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const handleShuffle = () => {
    setArr(getArr());
    setIndexI(1);
    setIndexJ(1);
  };

  const handleSort = async () => {
    setIsRunning(true);
    await sort(arr, setArr, setIndexI, setIndexJ);
    setIsRunning(false);
  };

  const handleOnOff = () => setOnOff(onOff === 'on' ? 'off' : 'on');

  return (
    <div>
      <MemorizedBoard arr={arr} />
      <div
        className="index i"
        style={{ transform: `translateX(${getX(indexI)}px)` }}
      >
        i
      </div>
      <div
        className="index j"
        style={{ transform: `translateX(${getX(indexJ)}px)` }}
      >
        j
      </div>
      <div className="buttonBox">
        {<button onClick={handleOnOff}>{onOff}</button>}
        {!isRunning && <button onClick={handleShuffle}>shuffle</button>}
        {!isRunning && <button onClick={handleSort}>sort</button>}
        {isRunning && <div className="running">Running....</div>}
      </div>
      <style jsx>
        {`
          .buttonBox {
            width: 100%;
            hegiht: 60px;
            background-color: gray;
            text-align: right;
          }
          button {
            font-size: 40px;
          }
          .running {
            font-size: 40px;
          }
          .index {
            position: absolute;
            width: 20px;
            opacity: 0.8;
          }
          .index.i {
            background-color: yellow;
            color: black;
          }
          .index.j {
            background-color: blue;
            color: white;
          }
        `}
      </style>
    </div>
  );
};
