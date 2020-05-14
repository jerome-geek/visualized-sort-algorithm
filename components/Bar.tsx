import { FC, Fragment } from 'react';
import { getX } from '../util/util';

interface IPropsBar {
  value: number;
  index: number;
}

const Bar: FC<IPropsBar> = (props) => {
  const { value, index } = props;
  const style = {
    height: value * 10,
    transform: `translateX(${getX(index)}px)`,
  };

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
