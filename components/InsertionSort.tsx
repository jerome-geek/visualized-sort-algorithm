import { useState, SetStateAction, Dispatch } from "react";
import { range, shuffle } from "lodash";
import Bar from "./Bar";

const SIZE = 30;
const getArr = () => shuffle(range(1, SIZE + 1));

const swap = (arr: number[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

type TSetArr = Dispatch<SetStateAction<number[]>>;
type TSetIndex = Dispatch<SetStateAction<number>>;
const delaySetArr = (arr: number[], setArr: TSetArr) => {
  return new Promise((resolve) => {
    setArr([...arr]);
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

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
    setIndexJ(i);
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      await delaySetArr(arr, setArr);
      j = j - 1;
      setIndexJ(j - 1);
    }
    i = i + 1;
    setIndexI(i);
  }
};

export default () => {
  const [arr, setArr] = useState(getArr());
  const [indexI, setIndexI] = useState(1);
  const [indexJ, setIndexJ] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const handleShuffle = () => setArr(getArr());

  const handleSort = () => {
    const sortedArr = [...arr];
    sort(sortedArr, setArr, setIndexI, setIndexJ);
    setArr(sortedArr);
    setIsRunning(true);
  };

  return (
    <div>
      <div className="board">
        {arr.map((value, i) => (
          <Bar key={i} value={value} index={i} />
        ))}
      </div>
      <div
        className="index i"
        style={{ transform: `translateX(${indexI * 22}px)` }}
      >
        i
      </div>
      <div
        className="index j"
        style={{ transform: `translateX(${indexJ * 22}px)` }}
      >
        j
      </div>

      <div className="buttonBox">
        {!isRunning && <button onClick={handleShuffle}>shuffle</button>}
        {!isRunning && <button onClick={handleSort}>sort</button>}
        {isRunning && <div className="running">Running....</div>}
      </div>

      <style jsx>
        {`
          .board {
            width: 100%;
            height: 200px;
            color: white;
            background-color: green;
            font-size: 40px;
            position: relative;
          }
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
