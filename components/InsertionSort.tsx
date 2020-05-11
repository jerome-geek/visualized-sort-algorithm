import { useState, SetStateAction } from "react";
import { range, shuffle } from "lodash";
import Bar from "./Bar";

const SIZE = 30;
const getArr = () => shuffle(range(1, SIZE + 1));

const swap = (arr: number[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

const delaySetArr = (
  arr: number[],
  setArr: (value: SetStateAction<number[]>) => void
) => {
  return new Promise((resolve) => {
    setArr([...arr]);
    setTimeout(() => {
      resolve();
    }, 10);
  });
};

const sort = async (
  arr: number[],
  setArr: (value: SetStateAction<number[]>) => void
) => {
  // https://en.wikipedia.org/wiki/Insertion_sort
  let i = 1;
  while (i < arr.length) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      await delaySetArr(arr, setArr);
      j = j - 1;
    }
    i = i + 1;
  }
};

export default () => {
  const [arr, setArr] = useState(getArr());

  const handleShuffle = () => setArr(getArr());

  const handleSort = () => {
    const sortedArr = [...arr];
    sort(sortedArr, setArr);
    setArr(sortedArr);
  };

  return (
    <div>
      <div className="board">
        {arr.map((value, i) => (
          <Bar key={i} value={value} index={i} />
        ))}
      </div>

      <div className="buttonBox">
        <button onClick={handleShuffle}>shuffle</button>
        <button onClick={handleSort}>sort</button>
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
        `}
      </style>
    </div>
  );
};
