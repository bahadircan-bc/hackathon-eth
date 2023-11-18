import { useEffect, useState, useId } from "react";


const generateMaskUrl = (
  width,
  height,
  stroke,
  rounded,
  opacity,
) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' %3E%3Crect x='${0}' y='${0}' rx='${rounded}' ry='${rounded}' width='${width}' height='${height}' style='fill:transparent;stroke:black;stroke-width:${stroke};opacity:${opacity};' /%3E%3C/svg%3E`;
};

export default function GradientButton(props) {
  const id = useId();
  // let width = 0;
  const [width, setWidth] = useState(0);
  // let height = 0;
  const [height, setHeight] = useState(0);
  // let stroke = 0;
  const [stroke, setStroke] = useState(0);
  const [rounded, setRounded] = useState(0);
  const onMouseEnter = () => {
    setStroke(props.stroke * 2);
  };
  const onMouseLeave = () =>{
    setStroke(props.stroke);
  }
  useEffect(() => {
    // width = document.getElementById("masked-div").offsetWidth;
    setWidth(document.getElementById(`masked-div-${id}`).offsetWidth);
    // height = document.getElementById("masked-div").offsetHeight;
    setHeight(document.getElementById(`masked-div-${id}`).offsetHeight);
    // stroke = 2;
    setStroke(props.stroke);
    console.log(document.getElementById(`gradient-button-${id}`).style.borderRadius)
    setRounded(document.getElementById(`gradient-button-${id}`).style.borderRadius);
    // console.log(width, height, stroke)
  }, [id, props.stroke]);
  return (
    <div id={`gradient-button-${id}`} className={` relative cursor-pointer ${props.className}`}
    onClick={() => {
      props.onClick?.();
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      borderRadius: props.rounded,
    }}>
      <div
        id={`masked-div-${id}`}
        className='flex items-center justify-center z-10 h-full w-full relative overflow-clip'
        style={{
          borderRadius: rounded,
          WebkitMaskImage: `url("${generateMaskUrl(
            width,
            height,
            stroke,
            rounded,
            1.0
          )}")`,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskClip: "fill-box",
          maskImage: `url("${generateMaskUrl(
            width,
            props.height,
            stroke,
            rounded,
            1.0
          )}")`,
          maskRepeat: "no-repeat",
          maskClip: "fill-box",
        }}
      >
          <div
            id={`gradient-div-${id}`}
            className={`rounded-lg absolute w-[150%] aspect-square bg-gradient-custom-l transition-all duration-1000 hover:rotate-180 hover:bg-opacity-100 rotate-0 bg-opacity-100`}
          ></div>
      </div>
      <div id={`button-content-${id}`} className={`absolute inset-0 ${props.className}`}>
        {props.children}
      </div>
    </div>
  );
}