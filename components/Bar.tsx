import React, { FC } from "react";

interface IPropsBar {
  value: number;
  index: number;
}

const Bar: FC<IPropsBar> = (props) => {
  const { value, index } = props;
  const style = {
    height: value * 10,
    transform: `translateX(${index * 21}px)`,
  };

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default Bar;
