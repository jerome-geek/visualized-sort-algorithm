import { FC, useState, memo, MutableRefObject, useEffect, useRef } from 'react';
import { tween } from 'tweening-js';
import Bar from './Bar';
import constants from '../../util/constants';
import { getX, getArr, initArr } from '../../util/util';
import { TSetIndex, TSetX } from '../../util/type';

const swap = (arr: IExtendedBar[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

interface IExtendedBar {
  value: number;
  refSetX: MutableRefObject<TSetX>;
}

const sort = async (
  extendedBarArr: IExtendedBar[],
  setIndexI: TSetIndex,
  setIndexJ: TSetIndex
) => {
  // https://en.wikipedia.org/wiki/Insertion_sort
  let i = 1,
    j = 1;
  while (i < extendedBarArr.length) {
    await tween(j, i, setIndexJ, constants.DURATION).promise();
    j = i;
    while (j > 0 && extendedBarArr[j - 1].value > extendedBarArr[j].value) {
      await Promise.all([
        tween(
          j,
          getX(j - 1),
          extendedBarArr[j].refSetX.current,
          constants.DURATION
        ).promise(),
        tween(
          j - 1,
          getX(j),
          extendedBarArr[j - 1].refSetX.current,
          constants.DURATION
        ).promise(),
      ]);
      swap(extendedBarArr, j, j - 1);

      await tween(j, j - 1, setIndexJ, constants.DURATION).promise();
      j = j - 1;
    }
    await tween(i, i + 1, setIndexI, constants.DURATION).promise();
    i = i + 1;
  }
};

interface IPropsBoard {
  arr: number[];
  refExtendedBarArr: MutableRefObject<IExtendedBar[]>;
}

const areArrEqual = (oldProps: IPropsBoard, props: IPropsBoard) => {
  return oldProps.arr === props.arr;
};

const Board: FC<IPropsBoard> = ({ arr, refExtendedBarArr }) => {
  const extendedBarArr = arr.map((value) => ({
    value,
    refSetX: useRef<TSetX>(null),
  }));
  useEffect(() => {
    refExtendedBarArr.current = extendedBarArr;
  }, [arr]);
  return (
    <div className="board">
      {extendedBarArr.map((item, i) => {
        console.log('render Bar');
        return (
          <Bar key={i} value={item.value} index={i} refSetX={item.refSetX} />
        );
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
  const [arr, setArr] = useState(initArr);
  const [indexI, setIndexI] = useState(1);
  const [indexJ, setIndexJ] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const refExtendedBarArr = useRef<IExtendedBar[]>([]);
  useEffect(() => setArr(getArr()), []);

  const handleShuffle = () => {
    setArr(getArr());
    setIndexI(1);
    setIndexJ(1);
  };

  const handleSort = async () => {
    setIsRunning(true);
    await sort(refExtendedBarArr.current, setIndexI, setIndexJ);
    setIsRunning(false);
  };

  const handleOnOff = () => setOnOff(onOff === 'on' ? 'off' : 'on');

  return (
    <div>
      <MemorizedBoard arr={arr} refExtendedBarArr={refExtendedBarArr} />
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
