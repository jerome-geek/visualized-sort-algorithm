import { FC, Fragment, useState, MutableRefObject } from 'react';
import { getX } from '../../util/util';
import { TSetX } from '../../util/type';

interface IPropsBar {
  value: number;
  index: number;
  refSetX: MutableRefObject<TSetX>;
}

const Bar: FC<IPropsBar> = ({ value, index, refSetX }) => {
  const [x, setX] = useState(getX(index));
  const style = {
    height: value * 10,
    transform: `translateX(${x}px)`,
  };
  refSetX.current = setX;

  return (
    <Fragment>
      <div style={style} className="bar" />
      <style jsx>{`
        .bar {
          position: absolute;
          width: 20px;
          background-color: #000;
          bottom: 0;
          display: flex;
          align-items: end;
          justify-content: center;
          font-size: 15px;
        }
      `}</style>
    </Fragment>
  );
};

export default Bar;
